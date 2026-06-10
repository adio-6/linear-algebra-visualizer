import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header.jsx';
import ConceptSelector from '../components/ConceptSelector.jsx';
import MatrixInput from '../components/MatrixInput.jsx';
import VectorInput from '../components/VectorInput.jsx';
import AnimationControls from '../components/AnimationControls.jsx';
import Visualization from '../components/Visualization.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import QuizCard from '../components/QuizCard.jsx';
import Roadmap from '../components/Roadmap.jsx';
import Footer from '../components/Footer.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import { checkRoom, createRoom } from '../api/roomsApi.js';
import { joinRoom, socket } from '../api/socketClient.js';

const SYNC_DEBOUNCE_MS = 120;

function defaultPresence() {
  return { studentsConnected: 0, nicknames: [] };
}

export default function LecturerPage() {
  const dim = useVisualizerStore((s) => s.dim);
  const [joinCode, setJoinCode] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isRecoveringRoom, setIsRecoveringRoom] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [roomWarning, setRoomWarning] = useState('');
  const [roomExpired, setRoomExpired] = useState(false);
  const [presence, setPresence] = useState(defaultPresence());
  const [socketStatus, setSocketStatus] = useState('Not connected');
  const joinCodeRef = useRef('');
  const roomExpiredRef = useRef(false);
  const recoveringRef = useRef(false);
  const syncTimerRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dim-3', dim === 3);
  }, [dim]);

  useEffect(() => {
    joinCodeRef.current = joinCode;
  }, [joinCode]);

  useEffect(() => {
    roomExpiredRef.current = roomExpired;
  }, [roomExpired]);

  async function syncCurrentState(code) {
    const patch = useVisualizerStore.getState().getSyncSnapshot();
    return new Promise((resolve) => {
      socket.emit('lecturer:state-update', { joinCode: code, patch }, () => resolve());
    });
  }

  async function rejoinExistingLecturerRoom(code) {
    const response = await joinRoom({
      joinCode: code,
      role: 'lecturer',
      nickname: 'Lecturer',
    });

    await syncCurrentState(code);
    setPresence(response.presence || defaultPresence());
    setSocketStatus('Connected as lecturer · syncing visualization state');
    setRoomExpired(false);
    setRoomWarning('');
    setRoomError('');
  }

  async function recoverAfterReconnect() {
    const activeJoinCode = joinCodeRef.current;
    if (!activeJoinCode || recoveringRef.current) return;

    recoveringRef.current = true;
    setIsRecoveringRoom(true);
    setSocketStatus('Reconnecting · checking room...');

    try {
      const exists = await checkRoom(activeJoinCode);

      if (!exists) {
        setRoomExpired(true);
        setPresence(defaultPresence());
        setSocketStatus('Room expired');
        setRoomWarning('The backend restarted and the current room no longer exists. Create a new room and share the new code with students.');
        return;
      }

      await rejoinExistingLecturerRoom(activeJoinCode);
    } catch (error) {
      setSocketStatus('Reconnecting · backend check failed');
      setRoomWarning(error.message?.includes('Failed to fetch')
        ? 'The backend is still unreachable. The app will try again when the connection returns.'
        : (error.message || 'Could not verify whether the current room still exists.'));
    } finally {
      recoveringRef.current = false;
      setIsRecoveringRoom(false);
    }
  }

  useEffect(() => {
    function handlePresence(nextPresence) {
      setPresence(nextPresence || defaultPresence());
    }

    function handleSocketConnect() {
      if (joinCodeRef.current) {
        recoverAfterReconnect();
      } else {
        setSocketStatus('Connected');
      }
    }

    function handleSocketDisconnect() {
      if (joinCodeRef.current) {
        setSocketStatus('Disconnected · backend may be offline');
      } else {
        setSocketStatus('Not connected');
      }
    }

    function handleSocketConnectError() {
      setSocketStatus('Connection error · check backend');
    }

    socket.on('connect', handleSocketConnect);
    socket.on('disconnect', handleSocketDisconnect);
    socket.on('connect_error', handleSocketConnectError);
    socket.on('room:presence', handlePresence);

    return () => {
      socket.off('connect', handleSocketConnect);
      socket.off('disconnect', handleSocketDisconnect);
      socket.off('connect_error', handleSocketConnectError);
      socket.off('room:presence', handlePresence);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = useVisualizerStore.subscribe((state) => {
      const activeJoinCode = joinCodeRef.current;
      if (!activeJoinCode || !socket.connected || roomExpiredRef.current) return;

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);

      syncTimerRef.current = setTimeout(() => {
        if (roomExpiredRef.current) return;
        const patch = state.getSyncSnapshot();
        socket.emit('lecturer:state-update', { joinCode: activeJoinCode, patch }, (response) => {
          if (!response?.success) {
            console.warn('State sync failed:', response?.error || 'Unknown error');
            if (response?.error?.includes('Room not found')) {
              setRoomExpired(true);
              setSocketStatus('Room expired');
              setRoomWarning('The current room no longer exists. Create a new room to continue the live session.');
            }
          }
        });
      }, SYNC_DEBOUNCE_MS);
    });

    return () => unsubscribe();
  }, []);

  function handleLecturerAnimate(payload) {
    const activeJoinCode = joinCodeRef.current;
    if (!activeJoinCode || !socket.connected || roomExpiredRef.current) return;

    socket.emit('lecturer:animation-trigger', {
      joinCode: activeJoinCode,
      durationMs: payload.durationMs,
      startedAt: payload.startedAt,
    }, (response) => {
      if (!response?.success) {
        console.warn('Animation sync failed:', response?.error || 'Unknown error');
      }
    });
  }

  function handleCameraChange(camera) {
    const activeJoinCode = joinCodeRef.current;
    if (!activeJoinCode || !socket.connected || roomExpiredRef.current) return;

    socket.emit('lecturer:camera-update', { joinCode: activeJoinCode, camera }, (response) => {
      if (!response?.success) {
        console.warn('Camera sync failed:', response?.error || 'Unknown error');
      }
    });
  }

  async function handleStartLiveSession() {
    setIsCreatingRoom(true);
    setRoomError('');
    setRoomWarning('');
    setRoomExpired(false);
    roomExpiredRef.current = false;
    setSocketStatus('Creating room...');
    setPresence(defaultPresence());

    try {
      const code = await createRoom();
      setJoinCode(code);
      joinCodeRef.current = code;
      setSocketStatus('Connecting lecturer...');

      const response = await joinRoom({
        joinCode: code,
        role: 'lecturer',
        nickname: 'Lecturer',
      });

      await syncCurrentState(code);

      setPresence(response.presence || defaultPresence());
      setSocketStatus('Connected as lecturer · syncing visualization state');
    } catch (error) {
      setRoomError(error.message?.includes('Failed to fetch') ? 'Could not reach the backend server. Make sure the backend is running and your frontend env points to it.' : (error.message || 'Could not create or join a room. Make sure the backend is running.'));
      setSocketStatus('Connection failed');
    } finally {
      setIsCreatingRoom(false);
    }
  }

  const socketBadgeClass = socketStatus.startsWith('Connected')
    ? 'connected'
    : socketStatus.includes('expired') || socketStatus.includes('failed') || socketStatus.includes('error') || socketStatus.includes('Disconnected')
      ? 'error'
      : 'warning';

  return (
    <div className="app">
      <Header />

      <section className="card live-session-card">
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Live Session</div>
          <h1>Lecturer workspace</h1>
          <p>
            Start a live session to generate a join code. Students can open the Student page and enter this code.
            This step syncs the lecturer visualization state to students in Follow Lecturer mode.
          </p>
          {joinCode && (
            <div className={`join-code-display ${roomExpired ? 'expired-room-code' : ''}`} aria-live="polite">
              Room code: <strong>{joinCode}</strong>
              {roomExpired && <span className="room-expired-label">Expired after backend restart</span>}
            </div>
          )}
          <div className="session-dashboard" aria-live="polite">
            <div className="dashboard-stat">
              <span className="dashboard-label">Socket</span>
              <span className={`connection-status-badge ${socketBadgeClass}`}>{isRecoveringRoom ? 'Reconnecting...' : socketStatus}</span>
            </div>
            <div className="dashboard-stat">
              <span className="dashboard-label">Students connected</span>
              <strong>{presence.studentsConnected}</strong>
            </div>
            <div className="dashboard-students">
              <span className="dashboard-label">Connected students</span>
              {presence.nicknames?.length > 0 ? (
                <div className="presence-names">
                  {presence.nicknames.map((name, index) => (
                    <span className="presence-pill" key={`${name}-${index}`}>{name}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-table-note">No students connected yet.</div>
              )}
            </div>
          </div>
          {roomWarning && <div className="message-box warning-message">{roomWarning}</div>}
          {roomError && <div className="message-box error-message">{roomError}</div>}
        </div>

        <button className="btn primary live-session-btn" type="button" onClick={handleStartLiveSession} disabled={isCreatingRoom || isRecoveringRoom}>
          {isCreatingRoom ? 'Creating...' : roomExpired ? 'Create New Room' : joinCode ? 'Create New Session' : 'Start Live Session'}
        </button>
      </section>

      <main className="workspace-grid lecturer-workspace">
        <aside className="left-panel control-panel">
          <div className="card">
            <ConceptSelector />
            <MatrixInput />
            <VectorInput />
            <AnimationControls onAnimate={handleLecturerAnimate} />
          </div>
        </aside>

        <Visualization role="lecturer" onCameraChange={handleCameraChange} />
        <InsightPanel />
      </main>

      <div className="page-section-wrap">
        <QuizCard joinCode={roomExpired ? '' : joinCode} />
      </div>
      <Roadmap />
      <Footer />
    </div>
  );
}
