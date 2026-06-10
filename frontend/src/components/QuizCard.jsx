import { useEffect, useMemo, useState } from 'react';
import { socket } from '../api/socketClient.js';
import { quizWithoutExplanations } from '../data/quizzes.js';
import {
  addQuestionToTopic,
  createTopic,
  loadQuizTopics,
  resetQuizTopics,
  saveQuizTopics,
} from '../utils/quizStorage.js';

function inferConceptFromTopic(topic) {
  const text = `${topic?.id || ''} ${topic?.title || ''}`.toLowerCase();

  if (text.includes('eigen')) return 'eigen';
  if (text.includes('determinant')) return 'determinant';
  if (text.includes('combination')) return 'combination';
  if (text.includes('basis')) return 'basis';
  if (text.includes('span')) return 'span';
  if (text.includes('transform')) return 'transformation';

  return 'transformation';
}

function makeLiveQuiz(baseQuiz) {
  return {
    ...quizWithoutExplanations(baseQuiz),
    questionId: `${baseQuiz.questionId}-live-${Date.now()}`,
    libraryQuestionId: baseQuiz.questionId,
    openedAt: new Date().toISOString(),
    answerRevealed: false,
  };
}

function getLibraryQuestionId(quiz) {
  if (!quiz) return '';
  return quiz.libraryQuestionId || quiz.sourceQuestionId || quiz.originalQuestionId || quiz.questionId || '';
}

function emptyResultsFor(quiz) {
  return {
    questionId: quiz?.questionId || '',
    totalResponses: 0,
    distribution: Array.from({ length: quiz?.options?.length || 4 }, () => 0),
    correctPct: 0,
    answerRevealed: quiz?.answerRevealed === true,
    studentStatuses: [],
  };
}

function answerLetter(choiceIndex) {
  return Number.isInteger(choiceIndex) ? String.fromCharCode(65 + choiceIndex) : '—';
}

function makeEmptyQuestionForm() {
  return {
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
  };
}

function StudentAnswersPanel({ results, quiz, answerRevealed }) {
  const studentStatuses = results?.studentStatuses || [];

  return (
    <div className="student-answers-panel">
      <div className="student-answers-header">
        <div>
          <div className="section-title">Student Answers</div>
          <p>Shows who answered the active quiz in real time.</p>
        </div>
        <span className="dashboard-badge">{studentStatuses.length} students</span>
      </div>

      {studentStatuses.length === 0 ? (
        <div className="empty-table-note">No connected students in this quiz yet.</div>
      ) : (
        <div className="student-answer-table-wrap">
          <table className="student-answer-table">
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Status</th>
                <th>Answer</th>
                {answerRevealed && <th>Result</th>}
              </tr>
            </thead>
            <tbody>
              {studentStatuses.map((student) => {
                const hasAnswered = student.hasAnswered === true;
                const choiceIndex = Number.isInteger(student.choiceIndex) ? student.choiceIndex : null;
                const isCorrect = answerRevealed && hasAnswered && choiceIndex === quiz.correctIndex;
                const isIncorrect = answerRevealed && hasAnswered && choiceIndex !== quiz.correctIndex;

                return (
                  <tr key={student.socketId || student.nickname}>
                    <td data-label="Nickname">{student.nickname || 'Student'}</td>
                    <td data-label="Status">
                      <span className={`status-badge ${hasAnswered ? 'answered' : 'waiting'}`}>
                        {hasAnswered ? 'Answered' : 'Waiting'}
                      </span>
                    </td>
                    <td data-label="Answer">
                      {!hasAnswered && '—'}
                      {hasAnswered && !answerRevealed && 'Hidden'}
                      {hasAnswered && answerRevealed && answerLetter(choiceIndex)}
                    </td>
                    {answerRevealed && (
                      <td data-label="Result">
                        {!hasAnswered && <span className="status-badge no-answer">No answer</span>}
                        {isCorrect && <span className="status-badge correct">Correct</span>}
                        {isIncorrect && <span className="status-badge incorrect">Incorrect</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function QuizCard({ joinCode }) {
  const [topics, setTopics] = useState(() => loadQuizTopics());
  const [selectedTopicId, setSelectedTopicId] = useState(() => loadQuizTopics()[0]?.id || '');
  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) || null,
    [topics, selectedTopicId],
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => loadQuizTopics()[0]?.questions?.[0]?.questionId || '');
  const selectedQuestion = useMemo(
    () => selectedTopic?.questions?.find((question) => question.questionId === selectedQuestionId) || null,
    [selectedTopic, selectedQuestionId],
  );

  const [liveQuiz, setLiveQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [libraryMessage, setLibraryMessage] = useState('');
  const [libraryError, setLibraryError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [topicForm, setTopicForm] = useState({ title: '' });
  const [questionForm, setQuestionForm] = useState(makeEmptyQuestionForm);
  const [questionTopicId, setQuestionTopicId] = useState(selectedTopicId);

  useEffect(() => {
    if (!selectedTopicId && topics[0]) {
      setSelectedTopicId(topics[0].id);
      setSelectedQuestionId(topics[0].questions?.[0]?.questionId || '');
      return;
    }

    if (selectedTopic && !selectedTopic.questions.some((question) => question.questionId === selectedQuestionId)) {
      setSelectedQuestionId(selectedTopic.questions?.[0]?.questionId || '');
    }
  }, [topics, selectedTopicId, selectedTopic, selectedQuestionId]);


  useEffect(() => {
    if (!questionTopicId && selectedTopicId) {
      setQuestionTopicId(selectedTopicId);
    }
  }, [questionTopicId, selectedTopicId]);

  useEffect(() => {
    setLiveQuiz(null);
    setQuizResults(null);
    setAnswerRevealed(false);
    setStatus(joinCode ? 'Live quiz is not open yet.' : 'Start a live session to use live quiz.');
    setError('');
  }, [joinCode]);

  useEffect(() => {
    function handleResults(results) {
      setQuizResults(results);
      if (results?.answerRevealed === true) {
        setAnswerRevealed(true);
        setLiveQuiz((currentQuiz) => currentQuiz ? { ...currentQuiz, answerRevealed: true } : currentQuiz);
      }
    }

    function handleAnswerRevealed(payload = {}) {
      setAnswerRevealed(true);
      setLiveQuiz((currentQuiz) => {
        if (!currentQuiz) return currentQuiz;
        if (payload.questionId && payload.questionId !== currentQuiz.questionId) return currentQuiz;
        return {
          ...currentQuiz,
          answerRevealed: true,
          correctIndex: Number.isInteger(payload.correctIndex) ? payload.correctIndex : currentQuiz.correctIndex,
        };
      });
      if (payload.results) setQuizResults(payload.results);
      setStatus('Answer revealed to the class.');
    }

    function handleClosed() {
      setLiveQuiz(null);
      setQuizResults(null);
      setAnswerRevealed(false);
      setStatus('Live quiz closed.');
    }

    socket.on('quiz:results', handleResults);
    socket.on('quiz:answer-revealed', handleAnswerRevealed);
    socket.on('quiz:closed', handleClosed);

    return () => {
      socket.off('quiz:results', handleResults);
      socket.off('quiz:answer-revealed', handleAnswerRevealed);
      socket.off('quiz:closed', handleClosed);
    };
  }, []);

  function handleSelectTopic(topicId) {
    const nextTopic = topics.find((topic) => topic.id === topicId) || null;
    setSelectedTopicId(topicId);
    setQuestionTopicId(topicId);
    setSelectedQuestionId(nextTopic?.questions?.[0]?.questionId || '');
    setError('');
  }

  function handleAddTopic(event) {
    event.preventDefault();
    setLibraryError('');
    setLibraryMessage('');

    const title = topicForm.title.trim();
    if (!title) {
      setLibraryError('Topic title is required.');
      return;
    }

    const topic = createTopic(title);
    const nextTopics = saveQuizTopics([...topics, topic]);
    setTopics(nextTopics);
    setSelectedTopicId(topic.id);
    setQuestionTopicId(topic.id);
    setSelectedQuestionId('');
    setTopicForm({ title: '' });
    setLibraryMessage('Topic added. You can now add questions to it.');
  }

  function handleQuestionOptionChange(index, value) {
    setQuestionForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => optionIndex === index ? value : option),
    }));
  }

  function handleAddQuestion(event) {
    event.preventDefault();
    setLibraryError('');
    setLibraryMessage('');

    const targetTopic = topics.find((topic) => topic.id === questionTopicId) || null;

    if (!targetTopic) {
      setLibraryError('Choose or create a topic before adding a question.');
      return;
    }

    const questionText = questionForm.question.trim();
    const options = questionForm.options.map((option) => option.trim());
    const correctIndex = Number(questionForm.correctIndex);

    if (!questionText) {
      setLibraryError('Question text is required.');
      return;
    }

    if (options.some((option) => !option)) {
      setLibraryError('Please fill all four options.');
      return;
    }

    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      setLibraryError('Correct answer must refer to Option A, B, C, or D.');
      return;
    }

    const questionId = `${targetTopic.id}-question-${Date.now()}`;
    const question = {
      questionId,
      topicId: targetTopic.id,
      topicTitle: targetTopic.title,
      concept: inferConceptFromTopic(targetTopic),
      question: questionText,
      options,
      correctIndex,
    };

    const nextTopics = addQuestionToTopic(targetTopic.id, question);
    setTopics(nextTopics);
    setSelectedTopicId(targetTopic.id);
    setQuestionTopicId(targetTopic.id);
    setSelectedQuestionId(questionId);
    setQuestionForm(makeEmptyQuestionForm());
    setLibraryMessage('Question added.');
  }

  function handleResetLibrary() {
    const confirmed = window.confirm('This will reset custom topics and questions to defaults. Continue?');
    if (!confirmed) return;

    const nextTopics = resetQuizTopics();
    setTopics(nextTopics);
    setSelectedTopicId(nextTopics[0]?.id || '');
    setQuestionTopicId(nextTopics[0]?.id || '');
    setSelectedQuestionId(nextTopics[0]?.questions?.[0]?.questionId || '');
    setTopicForm({ title: '' });
    setQuestionForm(makeEmptyQuestionForm());
    setLibraryError('');
    setLibraryMessage('Quiz library reset to defaults.');
  }

  function findNextQuestionInTopic(topicId, currentQuestionId) {
    if (!topicId || !currentQuestionId) return null;

    const topic = topics.find((item) => item.id === topicId);
    if (!topic || !Array.isArray(topic.questions)) return null;

    const currentIndex = topic.questions.findIndex((question) => question.questionId === currentQuestionId);
    if (currentIndex < 0) return null;

    return topic.questions[currentIndex + 1] || null;
  }

  function openQuizForQuestion(question, topic, statusMessage = 'Opening live quiz...') {
    if (!joinCode || !socket.connected) {
      setError('Start a live session before opening a quiz.');
      return;
    }

    if (!topic) {
      setError('Choose a quiz topic first.');
      return;
    }

    if (!question) {
      setError('Choose a question first.');
      return;
    }

    const quiz = makeLiveQuiz({
      ...question,
      topicId: topic.id,
      topicTitle: topic.title,
    });

    setIsBusy(true);
    setError('');
    setStatus(statusMessage);
    setAnswerRevealed(false);
    setQuizResults(emptyResultsFor(quiz));

    socket.emit('lecturer:open-quiz', { joinCode, quiz }, (response) => {
      setIsBusy(false);
      if (!response?.success) {
        setError(response?.error || 'Could not open live quiz.');
        setStatus('');
        return;
      }

      const openedQuiz = response.activeQuiz || quiz;
      setLiveQuiz(openedQuiz);
      setAnswerRevealed(openedQuiz.answerRevealed === true);
      setQuizResults(response.results || emptyResultsFor(openedQuiz));
      setStatus('Live quiz is open. Student answers will update here.');
    });
  }

  async function openLiveQuiz() {
    openQuizForQuestion(selectedQuestion, selectedTopic);
  }

  function openNextQuestion() {
    if (!liveQuiz || !answerRevealed) return;

    const topicId = liveQuiz.topicId || selectedTopicId;
    const currentQuestionId = getLibraryQuestionId(liveQuiz);
    const nextQuestion = findNextQuestionInTopic(topicId, currentQuestionId);
    const topic = topics.find((item) => item.id === topicId) || selectedTopic;

    if (!nextQuestion || !topic) {
      setStatus('No more questions in this topic.');
      return;
    }

    setSelectedTopicId(topic.id);
    setSelectedQuestionId(nextQuestion.questionId);
    openQuizForQuestion(nextQuestion, topic, 'Opening next question...');
  }

  async function revealAnswer() {
    if (!joinCode || !socket.connected || !liveQuiz || answerRevealed) return;

    setIsBusy(true);
    setError('');
    socket.emit('lecturer:reveal-answer', { joinCode }, (response) => {
      setIsBusy(false);
      if (!response?.success) {
        setError(response?.error || 'Could not reveal answer.');
        return;
      }

      setAnswerRevealed(true);
      setLiveQuiz((currentQuiz) => currentQuiz ? {
        ...currentQuiz,
        answerRevealed: true,
        correctIndex: Number.isInteger(response.correctIndex) ? response.correctIndex : currentQuiz.correctIndex,
      } : currentQuiz);
      if (response.results) setQuizResults(response.results);
      setStatus('Answer revealed to the class.');
    });
  }

  async function closeLiveQuiz() {
    if (!joinCode || !socket.connected) return;

    setIsBusy(true);
    setError('');
    socket.emit('lecturer:close-quiz', { joinCode }, (response) => {
      setIsBusy(false);
      if (!response?.success) {
        setError(response?.error || 'Could not close quiz.');
        return;
      }

      setLiveQuiz(null);
      setQuizResults(null);
      setAnswerRevealed(false);
      setStatus('Live quiz closed.');
    });
  }

  const shownQuiz = liveQuiz || selectedQuestion;
  const results = quizResults || emptyResultsFor(shownQuiz);
  const maxCount = Math.max(1, ...results.distribution);
  const waitingCount = liveQuiz ? (results.studentStatuses || []).filter((student) => !student.hasAnswered).length : 0;
  const canOpenQuiz = Boolean(joinCode && selectedTopic && selectedQuestion && !isBusy);
  const selectedTopicQuestions = selectedTopic?.questions || [];
  const nextQuestion = liveQuiz && answerRevealed
    ? findNextQuestionInTopic(liveQuiz.topicId || selectedTopicId, getLibraryQuestionId(liveQuiz))
    : null;
  const hasNextQuestion = Boolean(nextQuestion);
  const selectedQuestionIsDifferentFromLiveQuiz = Boolean(
    liveQuiz
    && selectedQuestion
    && getLibraryQuestionId(liveQuiz)
    && getLibraryQuestionId(liveQuiz) !== selectedQuestion.questionId,
  );

  return (
    <section className="card quiz-card live-quiz-card">
      <div className="quiz-left">
        <div className="section-title">
          Live Understanding Check <span className={joinCode ? 'badge-sim' : 'badge-soon'}>{joinCode ? 'Socket.io' : 'Needs session'}</span>
        </div>

        <div className="quiz-topic-panel">
          <div className="section-title small-title">Quiz Topics</div>
          <div className="quiz-selector-grid">
            <label className="field-group">
              <span>Select quiz topic</span>
              <select value={selectedTopicId} onChange={(event) => handleSelectTopic(event.target.value)}>
                {topics.length === 0 && <option value="">No topics available</option>}
                {topics.map((topic) => (
                  <option value={topic.id} key={topic.id}>{topic.title}</option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Select question</span>
              <select
                value={selectedQuestionId}
                onChange={(event) => setSelectedQuestionId(event.target.value)}
                disabled={!selectedTopic || selectedTopicQuestions.length === 0}
              >
                {!selectedTopic && <option value="">Choose topic first</option>}
                {selectedTopic && selectedTopicQuestions.length === 0 && <option value="">No questions in this topic</option>}
                {selectedTopicQuestions.map((question) => (
                  <option value={question.questionId} key={question.questionId}>{question.question}</option>
                ))}
              </select>
            </label>
          </div>

          {!selectedTopic && (
            <div className="empty-table-note">No topics available.</div>
          )}
        </div>

        {liveQuiz && (
          <div className="active-quiz-summary">
            <span className="status-badge answered">Active quiz</span>
            <span>{results.totalResponses} answered</span>
            <span>{waitingCount} waiting</span>
            <span>{answerRevealed ? 'Answer revealed' : 'Answer hidden'}</span>
          </div>
        )}

        {shownQuiz ? (
          <>
            {shownQuiz.topicTitle && <div className="quiz-topic-label">Topic: {shownQuiz.topicTitle}</div>}
            <div className="quiz-q">{shownQuiz.question}</div>
            <div className="quiz-opts">
              {shownQuiz.options.map((option, index) => {
                const isCorrectAfterReveal = liveQuiz && answerRevealed && index === shownQuiz.correctIndex;
                return (
                  <div key={`${shownQuiz.questionId}-${option}`} className={`quiz-opt ${isCorrectAfterReveal ? 'correct-soft' : ''}`}>
                    <span className="letter">{String.fromCharCode(65 + index)}</span>
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="message-box info-message">No questions in this topic yet. Add a question to start a live quiz.</div>
        )}

        <div className="quiz-feedback">
          {!joinCode && 'Start a live session to send a question to students.'}
          {joinCode && !selectedTopic && 'Choose a quiz topic first.'}
          {joinCode && selectedTopic && !selectedQuestion && 'Choose a question first.'}
          {joinCode && selectedTopic && selectedQuestion && !liveQuiz && 'Open Live Quiz to broadcast the selected question to students.'}
          {liveQuiz && selectedQuestionIsDifferentFromLiveQuiz && !isBusy && 'You selected a different question. Click Update Live Quiz to broadcast it to students.'}
          {liveQuiz && !selectedQuestionIsDifferentFromLiveQuiz && status}
        </div>
        {error && <div className="form-error">{error}</div>}

        <div className="btn-row" style={{ marginTop: 12 }}>
          <button className="btn primary" type="button" onClick={openLiveQuiz} disabled={!canOpenQuiz}>
            {liveQuiz ? 'Update Live Quiz' : 'Open Live Quiz'}
          </button>
          <button
            className={`btn ${liveQuiz && !answerRevealed && !isBusy ? 'primary live-quiz-action-button' : ''}`}
            type="button"
            onClick={revealAnswer}
            disabled={!liveQuiz || answerRevealed || isBusy}
          >
            Show Answer
          </button>
          {liveQuiz && answerRevealed && hasNextQuestion && (
            <button
              className="btn primary live-quiz-action-button"
              type="button"
              onClick={openNextQuestion}
              disabled={isBusy}
            >
              Next Question
            </button>
          )}
          <button
            className={`btn ${liveQuiz && !isBusy ? 'primary live-quiz-action-button' : ''}`}
            type="button"
            onClick={closeLiveQuiz}
            disabled={!liveQuiz || isBusy}
          >
            Close Quiz
          </button>
        </div>
        {liveQuiz && answerRevealed && !hasNextQuestion && (
          <div className="quiz-feedback next-question-note">No more questions in this topic.</div>
        )}

        <details className="quiz-management" open={false}>
          <summary>Manage Quiz Topics & Questions</summary>
          <div className="quiz-management-grid">
            <form className="quiz-builder-form" onSubmit={handleAddTopic}>
              <div className="section-title small-title">Add New Topic</div>
              <label className="field-group">
                <span>Topic title</span>
                <input
                  type="text"
                  value={topicForm.title}
                  onChange={(event) => setTopicForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Example: Orthogonality"
                />
              </label>
              <button className="btn primary" type="submit">Add Topic</button>
            </form>

            <form className="quiz-builder-form" onSubmit={handleAddQuestion}>
              <div className="section-title small-title">Add Question to Topic</div>
              <label className="field-group">
                <span>Add question under topic</span>
                <select
                  value={questionTopicId}
                  onChange={(event) => setQuestionTopicId(event.target.value)}
                  disabled={topics.length === 0}
                >
                  {topics.length === 0 && <option value="">No topics available</option>}
                  {topics.map((topic) => (
                    <option value={topic.id} key={`add-question-topic-${topic.id}`}>{topic.title}</option>
                  ))}
                </select>
              </label>
              {!questionTopicId && (
                <div className="message-box info-message">Choose or create a topic before adding a question.</div>
              )}
              {questionTopicId && (
                <div className="quiz-feedback">Adding to: {topics.find((topic) => topic.id === questionTopicId)?.title || 'Selected topic'}</div>
              )}
              <label className="field-group">
                <span>Question text</span>
                <textarea
                  value={questionForm.question}
                  onChange={(event) => setQuestionForm((current) => ({ ...current, question: event.target.value }))}
                  placeholder="Write the question"
                  rows="3"
                />
              </label>
              <div className="option-editor-grid">
                {questionForm.options.map((option, index) => (
                  <label className="field-group" key={`option-${index}`}>
                    <span>Option {String.fromCharCode(65 + index)}</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(event) => handleQuestionOptionChange(index, event.target.value)}
                      placeholder={`Answer ${String.fromCharCode(65 + index)}`}
                    />
                  </label>
                ))}
              </div>
              <div className="quiz-selector-grid">
                <label className="field-group">
                  <span>Correct answer</span>
                  <select
                    value={questionForm.correctIndex}
                    onChange={(event) => setQuestionForm((current) => ({ ...current, correctIndex: Number(event.target.value) }))}
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </label>
              </div>
              <div className="quiz-feedback">
                Related concept is selected automatically from the topic.
              </div>
              <button className="btn primary" type="submit" disabled={!questionTopicId}>Add Question</button>
            </form>
          </div>

          <div className="quiz-library-actions">
            <button className="btn" type="button" onClick={handleResetLibrary}>Reset Quiz Library</button>
            <span className="quiz-feedback">Custom topics are saved only in this browser using localStorage.</span>
          </div>
          {libraryMessage && <div className="message-box success-message">{libraryMessage}</div>}
          {libraryError && <div className="message-box error-message">{libraryError}</div>}
        </details>
      </div>

      <div className="quiz-right">
        <div className="section-title">Live Results <span className="badge-sim">In memory</span></div>
        <div className="class-stats">
          <div className="connected-row">
            <span className="dot-pulse"></span>
            <span><span className="num">{results.totalResponses}</span> responses</span>
          </div>
          {answerRevealed ? (
            <div className="bar-row">
              <div className="top"><span>Correct answers</span><b>{results.correctPct}%</b></div>
              <div className="bar"><span style={{ width: `${results.correctPct}%` }}></span></div>
            </div>
          ) : (
            <div className="quiz-feedback">Correct percentage is hidden until Show Answer.</div>
          )}
          {shownQuiz ? shownQuiz.options.map((option, index) => {
            const count = results.distribution[index] || 0;
            const width = `${Math.round((count / maxCount) * 100)}%`;
            const label = `${String.fromCharCode(65 + index)} - ${option}`;
            const isCorrectAfterReveal = answerRevealed && index === shownQuiz.correctIndex;
            return (
              <div className={`bar-row ${isCorrectAfterReveal ? 'correct-result-row' : ''}`} key={`result-${shownQuiz.questionId}-${index}`}>
                <div className="top"><span>{label}</span><b>{count}</b></div>
                <div className="bar"><span style={{ width }}></span></div>
              </div>
            );
          }) : (
            <div className="empty-table-note">No selected question yet.</div>
          )}
          <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 4 }}>
            Results are kept in memory and reset when the room closes or the server restarts.
          </div>
        </div>

        {liveQuiz && (
          <StudentAnswersPanel results={results} quiz={shownQuiz} answerRevealed={answerRevealed} />
        )}
      </div>
    </section>
  );
}
