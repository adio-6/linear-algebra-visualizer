import { useEffect, useMemo, useState } from 'react';
import { socket } from '../api/socketClient.js';
import {
  addQuestionToTopic as addLocalQuestionToTopic,
  createTopic as createLocalTopic,
  loadQuizTopics,
  saveQuizTopics,
  deleteTopic as deleteLocalTopic,
  deleteQuestionFromTopic as deleteLocalQuestionFromTopic,
} from '../utils/quizStorage.js';
import { quizWithoutExplanations } from '../data/quizzes.js';
import {
  addQuestionToTopic as addServerQuestionToTopic,
  createQuizTopic,
  deleteQuizQuestion as deleteServerQuestion,
  deleteQuizTopic as deleteServerTopic,
  fetchQuizTopics,
} from '../api/quizLibraryApi.js';

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


function normalizeLibraryQuestion(question, topic) {
  const questionId = question.questionId || question.id || `${topic.id}-question-${Date.now()}`;
  return {
    ...question,
    id: question.id || questionId,
    questionId,
    topicId: question.topicId || topic.id,
    topicTitle: question.topicTitle || topic.title,
    concept: question.concept || topic.concept || inferConceptFromTopic(topic),
    options: Array.isArray(question.options) ? question.options : [],
    correctIndex: Number(question.correctIndex),
  };
}

function normalizeLibraryTopics(value) {
  if (!Array.isArray(value)) return [];
  return value.map((topic) => {
    const safeTopic = {
      ...topic,
      id: topic.id,
      title: String(topic.title || 'Untitled topic').trim(),
      concept: topic.concept || inferConceptFromTopic(topic),
      questions: [],
    };
    safeTopic.questions = Array.isArray(topic.questions)
      ? topic.questions.map((question) => normalizeLibraryQuestion(question, safeTopic))
      : [];
    return safeTopic;
  }).filter((topic) => topic.id && topic.title);
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
  const [librarySource, setLibrarySource] = useState('local');
  const [libraryLoading, setLibraryLoading] = useState(true);
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
  const [deleteTopicId, setDeleteTopicId] = useState(selectedTopicId);
  const [deleteQuestionTopicId, setDeleteQuestionTopicId] = useState(selectedTopicId);
  const [deleteQuestionId, setDeleteQuestionId] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadServerLibrary() {
      setLibraryLoading(true);
      setLibraryError('');
      try {
        const serverTopics = normalizeLibraryTopics(await fetchQuizTopics());
        if (!isMounted) return;

        if (serverTopics.length === 0) {
          throw new Error('Server quiz library returned no topics.');
        }

        setTopics(serverTopics);
        setSelectedTopicId((current) => current && serverTopics.some((topic) => topic.id === current) ? current : serverTopics[0]?.id || '');
        setQuestionTopicId((current) => current && serverTopics.some((topic) => topic.id === current) ? current : serverTopics[0]?.id || '');
        setSelectedQuestionId((current) => {
          if (serverTopics.some((topic) => topic.questions.some((question) => question.questionId === current))) return current;
          return serverTopics[0]?.questions?.[0]?.questionId || '';
        });
        setLibrarySource('server');
        setLibraryMessage('Quiz library: Server database');
      } catch (error) {
        if (!isMounted) return;
        const localTopics = loadQuizTopics();
        setTopics(localTopics);
        setSelectedTopicId((current) => current && localTopics.some((topic) => topic.id === current) ? current : localTopics[0]?.id || '');
        setQuestionTopicId((current) => current && localTopics.some((topic) => topic.id === current) ? current : localTopics[0]?.id || '');
        setSelectedQuestionId((current) => {
          if (localTopics.some((topic) => topic.questions.some((question) => question.questionId === current))) return current;
          return localTopics[0]?.questions?.[0]?.questionId || '';
        });
        setLibrarySource('local');
        setLibraryError('Using local quiz library because server library is unavailable.');
        console.warn('Server quiz library unavailable. Falling back to localStorage.', error);
      } finally {
        if (isMounted) setLibraryLoading(false);
      }
    }

    loadServerLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

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
    const topicIds = new Set(topics.map((topic) => topic.id));
    const fallbackTopicId = selectedTopicId || topics[0]?.id || '';

    if (!deleteTopicId || !topicIds.has(deleteTopicId)) {
      setDeleteTopicId(fallbackTopicId);
    }

    if (!deleteQuestionTopicId || !topicIds.has(deleteQuestionTopicId)) {
      setDeleteQuestionTopicId(fallbackTopicId);
      const fallbackTopic = topics.find((topic) => topic.id === fallbackTopicId);
      setDeleteQuestionId(fallbackTopic?.questions?.[0]?.questionId || '');
      return;
    }

    const questionTopic = topics.find((topic) => topic.id === deleteQuestionTopicId);
    const questionIds = new Set((questionTopic?.questions || []).map((question) => question.questionId));
    if (!deleteQuestionId || !questionIds.has(deleteQuestionId)) {
      setDeleteQuestionId(questionTopic?.questions?.[0]?.questionId || '');
    }
  }, [topics, selectedTopicId, deleteTopicId, deleteQuestionTopicId, deleteQuestionId]);

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

  async function refreshServerTopics(preferredTopicId = '', preferredQuestionId = '') {
    const serverTopics = normalizeLibraryTopics(await fetchQuizTopics());
    setTopics(serverTopics);
    setLibrarySource('server');

    const nextTopicId = preferredTopicId && serverTopics.some((topic) => topic.id === preferredTopicId)
      ? preferredTopicId
      : serverTopics[0]?.id || '';
    const nextTopic = serverTopics.find((topic) => topic.id === nextTopicId) || null;
    const nextQuestionId = preferredQuestionId && nextTopic?.questions?.some((question) => question.questionId === preferredQuestionId)
      ? preferredQuestionId
      : nextTopic?.questions?.[0]?.questionId || '';

    setSelectedTopicId(nextTopicId);
    setQuestionTopicId(nextTopicId);
    setSelectedQuestionId(nextQuestionId);
    return serverTopics;
  }

  async function handleAddTopic(event) {
    event.preventDefault();
    setLibraryError('');
    setLibraryMessage('');

    const title = topicForm.title.trim();
    if (!title) {
      setLibraryError('Topic title is required.');
      return;
    }

    if (librarySource === 'server') {
      try {
        setIsBusy(true);
        const topic = await createQuizTopic(title);
        const nextTopics = await refreshServerTopics(topic.id, '');
        setSelectedTopicId(topic.id);
        setQuestionTopicId(topic.id);
        setSelectedQuestionId(nextTopics.find((item) => item.id === topic.id)?.questions?.[0]?.questionId || '');
        setTopicForm({ title: '' });
        setLibraryMessage('Topic added. You can now add questions to it.');
      } catch (error) {
        setLibraryError(error.message || 'Could not add topic to server database.');
      } finally {
        setIsBusy(false);
      }
      return;
    }

    const topic = createLocalTopic(title);
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

  async function handleAddQuestion(event) {
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

    if (librarySource === 'server') {
      try {
        setIsBusy(true);
        const question = await addServerQuestionToTopic(targetTopic.id, {
          question: questionText,
          options,
          correctIndex,
        });
        const questionId = question.questionId || question.id;
        await refreshServerTopics(targetTopic.id, questionId);
        setQuestionForm(makeEmptyQuestionForm());
        setLibraryMessage('Question added.');
      } catch (error) {
        setLibraryError(error.message || 'Could not add question to server database.');
      } finally {
        setIsBusy(false);
      }
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

    const nextTopics = addLocalQuestionToTopic(targetTopic.id, question);
    setTopics(nextTopics);
    setSelectedTopicId(targetTopic.id);
    setQuestionTopicId(targetTopic.id);
    setSelectedQuestionId(questionId);
    setQuestionForm(makeEmptyQuestionForm());
    setLibraryMessage('Question added.');
  }

  async function handleDeleteTopic() {
    setLibraryError('');
    setLibraryMessage('');

    const topic = topics.find((item) => item.id === deleteTopicId) || null;
    if (!topic) {
      setLibraryError('Choose a topic to delete.');
      return;
    }

    const confirmed = window.confirm(`Delete topic "${topic.title}" and all of its questions? This action cannot be undone.`);
    if (!confirmed) return;

    if (librarySource === 'server') {
      try {
        setIsBusy(true);
        await deleteServerTopic(topic.id);
        const nextTopics = await refreshServerTopics('', '');
        const nextTopicId = nextTopics[0]?.id || '';
        setDeleteTopicId(nextTopicId);
        setDeleteQuestionTopicId(nextTopicId);
        setDeleteQuestionId(nextTopics[0]?.questions?.[0]?.questionId || '');
        setLibraryMessage('Topic deleted from the server database.');
      } catch (error) {
        setLibraryError(error.message || 'Could not delete topic from server database.');
      } finally {
        setIsBusy(false);
      }
      return;
    }

    const nextTopics = deleteLocalTopic(topic.id);
    setTopics(nextTopics);
    const nextTopicId = nextTopics[0]?.id || '';
    setSelectedTopicId((current) => current === topic.id ? nextTopicId : current);
    setQuestionTopicId((current) => current === topic.id ? nextTopicId : current);
    setSelectedQuestionId((current) => topic.questions.some((question) => question.questionId === current) ? nextTopics[0]?.questions?.[0]?.questionId || '' : current);
    setDeleteTopicId(nextTopicId);
    setDeleteQuestionTopicId(nextTopicId);
    setDeleteQuestionId(nextTopics[0]?.questions?.[0]?.questionId || '');
    setLibraryMessage('Topic deleted from local fallback library.');
  }

  async function handleDeleteQuestion() {
    setLibraryError('');
    setLibraryMessage('');

    const topic = topics.find((item) => item.id === deleteQuestionTopicId) || null;
    const question = topic?.questions?.find((item) => item.questionId === deleteQuestionId) || null;

    if (!topic) {
      setLibraryError('Choose a topic before deleting a question.');
      return;
    }

    if (!question) {
      setLibraryError('Choose a question to delete.');
      return;
    }

    const confirmed = window.confirm(`Delete this question from "${topic.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    if (librarySource === 'server') {
      try {
        setIsBusy(true);
        await deleteServerQuestion(topic.id, question.questionId);
        const nextTopics = await refreshServerTopics(topic.id, '');
        const refreshedTopic = nextTopics.find((item) => item.id === topic.id) || null;
        setDeleteQuestionTopicId(refreshedTopic?.id || nextTopics[0]?.id || '');
        setDeleteQuestionId(refreshedTopic?.questions?.[0]?.questionId || nextTopics[0]?.questions?.[0]?.questionId || '');
        setLibraryMessage('Question deleted from the server database.');
      } catch (error) {
        setLibraryError(error.message || 'Could not delete question from server database.');
      } finally {
        setIsBusy(false);
      }
      return;
    }

    const nextTopics = deleteLocalQuestionFromTopic(topic.id, question.questionId);
    setTopics(nextTopics);
    const refreshedTopic = nextTopics.find((item) => item.id === topic.id) || null;
    const nextQuestionId = refreshedTopic?.questions?.[0]?.questionId || '';
    if (selectedTopicId === topic.id && selectedQuestionId === question.questionId) {
      setSelectedQuestionId(nextQuestionId);
    }
    setDeleteQuestionTopicId(topic.id);
    setDeleteQuestionId(nextQuestionId);
    setLibraryMessage('Question deleted from local fallback library.');
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
          <div className="quiz-library-status">
            {libraryLoading ? 'Loading quiz library...' : `Quiz library: ${librarySource === 'server' ? 'Server database' : 'Local fallback'}`}
          </div>
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
              <button className="btn primary" type="submit" disabled={isBusy || libraryLoading}>Add Topic</button>
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
              <button className="btn primary" type="submit" disabled={!questionTopicId || isBusy || libraryLoading}>Add Question</button>
            </form>
          </div>

          <div className="quiz-delete-management">
            <form className="quiz-builder-form delete-builder-form" onSubmit={(event) => { event.preventDefault(); handleDeleteTopic(); }}>
              <div className="section-title small-title">Delete Topic</div>
              <label className="field-group">
                <span>Topic to delete</span>
                <select
                  value={deleteTopicId}
                  onChange={(event) => setDeleteTopicId(event.target.value)}
                  disabled={topics.length === 0 || isBusy || libraryLoading}
                >
                  {topics.length === 0 && <option value="">No topics available</option>}
                  {topics.map((topic) => (
                    <option value={topic.id} key={`delete-topic-${topic.id}`}>{topic.title}</option>
                  ))}
                </select>
              </label>
              <button className="btn danger-btn" type="submit" disabled={!deleteTopicId || isBusy || libraryLoading}>Delete Topic</button>
              <div className="quiz-feedback">Deleting a topic also deletes all questions under it.</div>
            </form>

            <form className="quiz-builder-form delete-builder-form" onSubmit={(event) => { event.preventDefault(); handleDeleteQuestion(); }}>
              <div className="section-title small-title">Delete Question</div>
              <label className="field-group">
                <span>Topic</span>
                <select
                  value={deleteQuestionTopicId}
                  onChange={(event) => {
                    const topicId = event.target.value;
                    const topic = topics.find((item) => item.id === topicId);
                    setDeleteQuestionTopicId(topicId);
                    setDeleteQuestionId(topic?.questions?.[0]?.questionId || '');
                  }}
                  disabled={topics.length === 0 || isBusy || libraryLoading}
                >
                  {topics.length === 0 && <option value="">No topics available</option>}
                  {topics.map((topic) => (
                    <option value={topic.id} key={`delete-question-topic-${topic.id}`}>{topic.title}</option>
                  ))}
                </select>
              </label>
              <label className="field-group">
                <span>Question to delete</span>
                <select
                  value={deleteQuestionId}
                  onChange={(event) => setDeleteQuestionId(event.target.value)}
                  disabled={!deleteQuestionTopicId || isBusy || libraryLoading}
                >
                  {(topics.find((topic) => topic.id === deleteQuestionTopicId)?.questions || []).length === 0 && <option value="">No questions available</option>}
                  {(topics.find((topic) => topic.id === deleteQuestionTopicId)?.questions || []).map((question, index) => (
                    <option value={question.questionId} key={`delete-question-${question.questionId}`}>{index + 1}. {question.question}</option>
                  ))}
                </select>
              </label>
              <button className="btn danger-btn" type="submit" disabled={!deleteQuestionId || isBusy || libraryLoading}>Delete Question</button>
              <div className="quiz-feedback">This deletes only the selected question.</div>
            </form>
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
