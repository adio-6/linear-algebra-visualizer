import { useEffect, useMemo, useState } from 'react';
import { fetchQuizTopics } from '../api/quizLibraryApi.js';
import { loadQuizTopics } from '../utils/quizStorage.js';

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

function normalizeQuestion(question, topic) {
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

function normalizeTopics(value) {
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
      ? topic.questions.map((question) => normalizeQuestion(question, safeTopic))
      : [];

    return safeTopic;
  }).filter((topic) => topic.id && topic.title);
}

function answerLetter(index) {
  return Number.isInteger(index) ? String.fromCharCode(65 + index) : '—';
}

export default function PracticeQuiz() {
  const [topics, setTopics] = useState(() => normalizeTopics(loadQuizTopics()));
  const [librarySource, setLibrarySource] = useState('local');
  const [isLoading, setIsLoading] = useState(true);
  const [libraryMessage, setLibraryMessage] = useState('Loading quiz library...');
  const [selectedTopicId, setSelectedTopicId] = useState(() => normalizeTopics(loadQuizTopics())[0]?.id || '');
  const [selectedQuestionId, setSelectedQuestionId] = useState(() => normalizeTopics(loadQuizTopics())[0]?.questions?.[0]?.questionId || '');
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLibrary() {
      setIsLoading(true);
      setLibraryMessage('Loading quiz library...');

      try {
        const serverTopics = normalizeTopics(await fetchQuizTopics());
        if (!isMounted) return;

        if (serverTopics.length === 0) {
          throw new Error('Server quiz library returned no topics.');
        }

        setTopics(serverTopics);
        setLibrarySource('server');
        setLibraryMessage('Quiz library: Server database');
        setSelectedTopicId((current) => current && serverTopics.some((topic) => topic.id === current) ? current : serverTopics[0]?.id || '');
        setSelectedQuestionId((current) => {
          if (serverTopics.some((topic) => topic.questions.some((question) => question.questionId === current))) return current;
          return serverTopics[0]?.questions?.[0]?.questionId || '';
        });
      } catch (error) {
        if (!isMounted) return;

        const localTopics = normalizeTopics(loadQuizTopics());
        setTopics(localTopics);
        setLibrarySource('local');
        setLibraryMessage('Using local quiz library because server library is unavailable.');
        setSelectedTopicId((current) => current && localTopics.some((topic) => topic.id === current) ? current : localTopics[0]?.id || '');
        setSelectedQuestionId((current) => {
          if (localTopics.some((topic) => topic.questions.some((question) => question.questionId === current))) return current;
          return localTopics[0]?.questions?.[0]?.questionId || '';
        });
        console.warn('Practice quiz library fallback:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) || null,
    [topics, selectedTopicId],
  );

  const selectedQuestion = useMemo(
    () => selectedTopic?.questions?.find((question) => question.questionId === selectedQuestionId) || null,
    [selectedTopic, selectedQuestionId],
  );

  useEffect(() => {
    if (!selectedTopic && topics[0]) {
      setSelectedTopicId(topics[0].id);
      setSelectedQuestionId(topics[0].questions?.[0]?.questionId || '');
      return;
    }

    if (selectedTopic && !selectedTopic.questions.some((question) => question.questionId === selectedQuestionId)) {
      setSelectedQuestionId(selectedTopic.questions?.[0]?.questionId || '');
    }
  }, [topics, selectedTopic, selectedQuestionId]);

  useEffect(() => {
    setSelectedChoice(null);
    setChecked(false);
  }, [selectedQuestionId]);

  function handleTopicChange(topicId) {
    const nextTopic = topics.find((topic) => topic.id === topicId) || null;
    setSelectedTopicId(topicId);
    setSelectedQuestionId(nextTopic?.questions?.[0]?.questionId || '');
    setSelectedChoice(null);
    setChecked(false);
  }

  function handleQuestionChange(questionId) {
    setSelectedQuestionId(questionId);
    setSelectedChoice(null);
    setChecked(false);
  }

  function checkAnswer() {
    if (selectedChoice === null) return;
    setChecked(true);
  }

  function goToNextQuestion() {
    if (!selectedTopic || !selectedQuestion) return;

    const currentIndex = selectedTopic.questions.findIndex((question) => question.questionId === selectedQuestion.questionId);
    const nextQuestion = selectedTopic.questions[currentIndex + 1] || selectedTopic.questions[0] || null;

    if (nextQuestion) {
      setSelectedQuestionId(nextQuestion.questionId);
      setSelectedChoice(null);
      setChecked(false);
    }
  }

  const canCheck = selectedQuestion && selectedChoice !== null && !checked;
  const isCorrect = checked && selectedChoice === selectedQuestion?.correctIndex;
  const hasNextQuestion = selectedTopic && selectedTopic.questions.length > 1;

  return (
    <section className="card practice-quiz-card">
      <div className="card-section">
        <div className="section-title">Practice Quiz</div>
        <p className="practice-note">Choose a topic and answer questions independently. These answers are not sent to a live class.</p>
        <div className={`quiz-library-status ${librarySource === 'server' ? 'server-source' : 'local-source'}`}>
          {libraryMessage}
        </div>

        {isLoading ? (
          <div className="message-box loading-message">Loading quiz library...</div>
        ) : topics.length === 0 ? (
          <div className="message-box warning-message">No quiz topics are available right now.</div>
        ) : (
          <>
            <div className="quiz-selector-grid practice-selector-grid">
              <label className="field-group">
                Select topic
                <select value={selectedTopicId} onChange={(e) => handleTopicChange(e.target.value)}>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{topic.title}</option>
                  ))}
                </select>
              </label>

              <label className="field-group">
                Select question
                <select value={selectedQuestionId} onChange={(e) => handleQuestionChange(e.target.value)} disabled={!selectedTopic?.questions?.length}>
                  {(selectedTopic?.questions || []).map((question, index) => (
                    <option key={question.questionId} value={question.questionId}>Question {index + 1}</option>
                  ))}
                </select>
              </label>
            </div>

            {!selectedQuestion ? (
              <div className="message-box warning-message">This topic has no questions yet.</div>
            ) : (
              <div className="practice-question-panel">
                {selectedQuestion.topicTitle && <div className="quiz-topic-label">Topic: {selectedQuestion.topicTitle}</div>}
                <div className="quiz-q">{selectedQuestion.question}</div>
                <div className="quiz-opts">
                  {selectedQuestion.options.map((option, index) => {
                    const isSelected = selectedChoice === index;
                    const isCorrectOption = checked && index === selectedQuestion.correctIndex;
                    const isWrongSelection = checked && isSelected && index !== selectedQuestion.correctIndex;
                    const cls = ['quiz-opt'];
                    if (isSelected) cls.push('selected');
                    if (isCorrectOption) cls.push('correct');
                    if (isWrongSelection) cls.push('wrong');

                    return (
                      <button
                        key={`${selectedQuestion.questionId}-${index}`}
                        className={cls.join(' ')}
                        type="button"
                        onClick={() => {
                          if (checked) return;
                          setSelectedChoice(index);
                        }}
                        disabled={checked}
                      >
                        <span className="letter">{answerLetter(index)}</span>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="practice-quiz-actions">
                  <button className="btn primary" type="button" onClick={checkAnswer} disabled={!canCheck}>Check Answer</button>
                  {hasNextQuestion && <button className="btn" type="button" onClick={goToNextQuestion}>Next Question</button>}
                </div>

                <div className="quiz-feedback">
                  {!checked && selectedChoice === null && 'Choose one answer.'}
                  {!checked && selectedChoice !== null && `Current choice: ${answerLetter(selectedChoice)}. Click Check Answer when ready.`}
                  {checked && isCorrect && '✓ Correct answer.'}
                  {checked && !isCorrect && `✗ Incorrect. Correct answer: ${answerLetter(selectedQuestion.correctIndex)} - ${selectedQuestion.options[selectedQuestion.correctIndex]}`}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
