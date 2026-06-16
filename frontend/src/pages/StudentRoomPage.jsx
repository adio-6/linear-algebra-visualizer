import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ConceptSelector from '../components/ConceptSelector.jsx';
import MatrixInput from '../components/MatrixInput.jsx';
import VectorInput from '../components/VectorInput.jsx';
import AnimationControls from '../components/AnimationControls.jsx';
import AbstractSpaceControls from '../components/AbstractSpaceControls.jsx';
import Visualization from '../components/Visualization.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import Footer from '../components/Footer.jsx';
import StudentLiveQuiz from '../components/StudentLiveQuiz.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import { socket } from '../api/socketClient.js';
import { useVisualizerAnimation } from '../hooks/useVisualizerAnimation.js';

const JOIN_ACK_TIMEOUT_MS = 8000;

function defaultPresence() {
  return { studentsConnected: 0, nicknames: [] };
}

function normalizeJoinCode(code) {
  return String(code || '').trim().toUpperCase();
}

function getStoredNickname() {
  const value = sessionStorage.getItem('student:nickname');
  return value && value.trim() ? value.trim() : 'Student';
}

export default function StudentRoomPage() {
  const { code } = useParams();
  const joinCode = normalizeJoinCode(code);
  const dim = useVisualizerStore((s) => s.dim);
  const concept = useVisualizerStore((s) => s.concept);
  const applyRemotePatch = useVisualizerStore((s) => s.applyRemotePatch);
  const setCamera3D = useVisualizerStore((s) => s.setCamera3D);
  const [nickname] = useState(getStoredNickname);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [connectionError, setConnectionError] = useState('');
  const [roomExpired, setRoomExpired] = useState(false);
  const [presence, setPresence] = useState(defaultPresence());
  const [mode, setMode] = useState('follow');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [answerReveal, setAnswerReveal] = useState(null);
  const modeRef = useRef('follow');
  const joinAttemptRef = useRef(0);
  const joinInFlightRef = useRef(false);
  const { runAnimation } = useVisualizerAnimation();

  useEffect(() => {
    document.body.classList.toggle('dim-3', dim === 3);
  }, [dim]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!joinCode) {
      setConnectionStatus('Invalid room code');
      setConnectionError('Missing room code. Please go back and enter a valid room code.');
      setRoomExpired(true);
      return undefined;
    }

    const attemptId = joinAttemptRef.current + 1;
    joinAttemptRef.current = attemptId;
    let disposed = false;

    setConnectionStatus('Connecting...');
    setConnectionError('');
    setRoomExpired(false);
    setPresence(defaultPresence());

    function isCurrentAttempt() {
      return !disposed && joinAttemptRef.current === attemptId;
    }

    function handlePresence(nextPresence) {
      if (!isCurrentAttempt()) return;
      setPresence(nextPresence || defaultPresence());
    }

    function applyJoinResponse(response) {
      if (response.state && modeRef.current === 'follow') {
        applyRemotePatch(response.state);
      }

      if (response.activeQuiz) {
        setActiveQuiz(response.activeQuiz);
        setAnswerReveal(response.activeQuiz.answerRevealed ? {
          questionId: response.activeQuiz.questionId,
          correctIndex: response.activeQuiz.correctIndex,
          answerRevealed: true,
        } : null);
      } else {
        setActiveQuiz(null);
        setQuizResults(null);
        setAnswerReveal(null);
      }

      if (response.quizResults) {
        setQuizResults(response.quizResults);
      }

      setPresence(response.presence || defaultPresence());
      setRoomExpired(false);
      setConnectionError('');
      setConnectionStatus(`Connected to room ${joinCode}`);
    }

    function handleJoinFailure(message) {
      const errorMessage = message || 'Could not join room.';
      const looksExpired = errorMessage.includes('Room not found') || errorMessage.includes('server may have restarted');

      setRoomExpired(looksExpired);
      setPresence(defaultPresence());
      setConnectionStatus(looksExpired ? 'Room no longer available' : 'Could not connect to room');
      setConnectionError(looksExpired
        ? 'This room is no longer available. The lecturer may need to create a new room.'
        : errorMessage);
    }

    function emitJoin() {
      if (!isCurrentAttempt()) return;
      if (joinInFlightRef.current) return;

      joinInFlightRef.current = true;
      setConnectionStatus('Joining live room...');
      setConnectionError('');


      socket.timeout(JOIN_ACK_TIMEOUT_MS).emit(
        'room:join',
        { joinCode, nickname, role: 'student' },
        (error, response) => {
          joinInFlightRef.current = false;
          if (!isCurrentAttempt()) return;

          if (error) {
            console.warn('[student] room:join timeout', error);
            setRoomExpired(false);
            setConnectionStatus('Disconnected');
            setConnectionError('Could not connect to the live room. Make sure the backend is running and try again.');
            return;
          }


          if (response?.success === true) {
            applyJoinResponse(response);
            return;
          }

          handleJoinFailure(response?.error || 'Could not join room.');
        },
      );
    }

    function joinWhenConnected() {
      if (!isCurrentAttempt()) return;

      if (socket.connected) {
        emitJoin();
        return;
      }

      setConnectionStatus('Connecting to backend...');
      socket.connect();
    }

    function handleSocketConnect() {
      if (!isCurrentAttempt()) return;
      emitJoin();
    }

    function handleSocketDisconnect() {
      if (!isCurrentAttempt()) return;
      joinInFlightRef.current = false;
      setConnectionStatus('Disconnected from the live session. Check that the backend is still running.');
    }

    function handleSocketConnectError(error) {
      if (!isCurrentAttempt()) return;
      joinInFlightRef.current = false;
      setConnectionStatus('Could not connect to the backend server.');
      setConnectionError(error?.message || 'Could not connect to the backend server.');
    }

    function handleStatePatch(patch) {
      if (modeRef.current === 'follow') {
        applyRemotePatch(patch);
      }
    }

    function handleAnimationTrigger(payload = {}) {
      if (modeRef.current === 'follow') {
        runAnimation({
          durationMs: payload.durationMs,
          startedAt: payload.startedAt,
        });
      }
    }

    function handleCameraUpdate(payload = {}) {
      if (modeRef.current === 'follow' && payload.camera) {
        setCamera3D(payload.camera);
      }
    }

    function handleQuizOpen(quiz) {
      setActiveQuiz(quiz);
      setQuizResults(null);
      setAnswerReveal(quiz?.answerRevealed ? {
        questionId: quiz.questionId,
        correctIndex: quiz.correctIndex,
        answerRevealed: true,
      } : null);
    }

    function handleQuizResults(results) {
      setQuizResults(results);
    }

    function handleQuizAnswerRevealed(payload = {}) {
      setAnswerReveal({
        questionId: payload.questionId,
        correctIndex: payload.correctIndex,
        answerRevealed: true,
      });
      setActiveQuiz((currentQuiz) => currentQuiz && currentQuiz.questionId === payload.questionId ? {
        ...currentQuiz,
        correctIndex: payload.correctIndex,
        answerRevealed: true,
      } : currentQuiz);
    }

    function handleQuizClosed() {
      setActiveQuiz(null);
      setQuizResults(null);
      setAnswerReveal(null);
    }

    socket.on('connect', handleSocketConnect);
    socket.on('connect_error', handleSocketConnectError);
    socket.on('disconnect', handleSocketDisconnect);
    socket.on('room:presence', handlePresence);
    socket.on('room:state-patch', handleStatePatch);
    socket.on('room:animation-trigger', handleAnimationTrigger);
    socket.on('room:camera-update', handleCameraUpdate);
    socket.on('quiz:open', handleQuizOpen);
    socket.on('quiz:results', handleQuizResults);
    socket.on('quiz:answer-revealed', handleQuizAnswerRevealed);
    socket.on('quiz:closed', handleQuizClosed);

    joinWhenConnected();

    return () => {
      disposed = true;
      joinInFlightRef.current = false;
      socket.off('connect', handleSocketConnect);
      socket.off('connect_error', handleSocketConnectError);
      socket.off('disconnect', handleSocketDisconnect);
      socket.off('room:presence', handlePresence);
      socket.off('room:state-patch', handleStatePatch);
      socket.off('room:animation-trigger', handleAnimationTrigger);
      socket.off('room:camera-update', handleCameraUpdate);
      socket.off('quiz:open', handleQuizOpen);
      socket.off('quiz:results', handleQuizResults);
      socket.off('quiz:answer-revealed', handleQuizAnswerRevealed);
      socket.off('quiz:closed', handleQuizClosed);
    };
  }, [joinCode, nickname, applyRemotePatch, runAnimation, setCamera3D]);

  const isFollowMode = mode === 'follow';
  const isConnected = connectionStatus.startsWith('Connected') && !roomExpired;

  return (
    <div className="app student-practice-app">
      <Header />

      <section className="card student-practice-banner">
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Student View</div>
          <h1>{isFollowMode ? 'Follow Lecturer' : 'Practice workspace'}</h1>
          <p>
            Room code: <strong>{joinCode || '—'}</strong> · {nickname}. In Follow Lecturer mode, your visualization updates from the lecturer in real time.
            In Practice Mode, your changes stay local to your browser.
          </p>
          <div className={`presence-panel ${isConnected ? 'success-message' : roomExpired ? 'error-message' : 'warning-message'}`} aria-live="polite">
            <span className={`connection-status-badge ${isConnected ? 'connected' : roomExpired ? 'error' : 'warning'}`}>{isConnected ? 'Connected' : roomExpired ? 'Room unavailable' : 'Attention'}</span>
            <strong>{connectionStatus}</strong><br />
            Students connected in this room: {presence.studentsConnected}
            {connectionError && <div style={{ marginTop: 8 }}>{connectionError}</div>}
            {!isConnected && (
              <div className="status-actions">
                <Link className="btn secondary student-nav-button" to="/student">Back to join page</Link>
              </div>
            )}
          </div>
        </div>
        <div className="student-mode-panel">
          <div className="mode-toggle" aria-label="Student mode">
            <button className={isFollowMode ? 'active' : ''} type="button" onClick={() => setMode('follow')}>
              Follow Lecturer
            </button>
            <button className={!isFollowMode ? 'active' : ''} type="button" onClick={() => setMode('practice')}>
              Practice Mode
            </button>
          </div>
          <div className="student-nav-actions" style={{ marginTop: 10 }}>
            <Link className="btn secondary student-nav-button" to="/student">Change room</Link>
            <Link className="btn secondary student-nav-button" to="/">Home</Link>
          </div>
        </div>
      </section>

      <main className="workspace-grid student-workspace">
        {!isFollowMode && (
          <aside className="left-panel control-panel">
            <div className="card">
              <ConceptSelector />
              {concept === 'abstract' ? (
                <AbstractSpaceControls />
              ) : (
                <>
                  <MatrixInput />
                  <VectorInput />
                  <AnimationControls />
                </>
              )}
            </div>
          </aside>
        )}

        {isFollowMode && (
          <aside className="left-panel control-panel">
            <div className="card">
              <div className="card-section">
                <div className="section-title">Follow Lecturer</div>
                <div className="explanation">
                  Controls are disabled in this mode. Switch to <strong>Practice Mode</strong> to explore your own matrices and vectors.
                </div>
              </div>
            </div>
          </aside>
        )}

        <Visualization role="student" followLecturer={isFollowMode} />
        <InsightPanel />
      </main>

      <div className="page-section-wrap">
        <StudentLiveQuiz joinCode={joinCode} quiz={activeQuiz} results={quizResults} answerReveal={answerReveal} />
      </div>

      <Footer />
    </div>
  );
}
