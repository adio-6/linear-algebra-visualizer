import { useEffect, useState } from 'react';
import { socket } from '../api/socketClient.js';

export default function StudentLiveQuiz({ joinCode, quiz, results, answerReveal, onAnswered }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState('Choose one answer.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedChoice(null);
    setFeedback('Choose one answer.');
    setIsSubmitting(false);
    setError('');
  }, [quiz?.questionId]);

  useEffect(() => {
    if (!quiz || selectedChoice === null) return;

    if (answerReveal?.answerRevealed && answerReveal.questionId === quiz.questionId) {
      const isCorrect = selectedChoice === answerReveal.correctIndex;
      setFeedback(isCorrect ? '✓ Correct answer.' : `✗ Not quite. Correct answer: ${String.fromCharCode(65 + answerReveal.correctIndex)}.`);
    }
  }, [answerReveal, quiz, selectedChoice]);

  if (!quiz) {
    return (
      <section className="card student-live-quiz-card">
        <div className="card-section">
          <div className="section-title">Live Quiz</div>
          <div className="message-box info-message">No active live quiz right now. When the lecturer opens a question, it will appear here.</div>
        </div>
      </section>
    );
  }

  const answerRevealed = quiz.answerRevealed === true || (answerReveal?.answerRevealed === true && answerReveal.questionId === quiz.questionId);
  const revealedCorrectIndex = answerRevealed
    ? (Number.isInteger(answerReveal?.correctIndex) ? answerReveal.correctIndex : quiz.correctIndex)
    : null;

  function submitAnswer(choiceIndex) {
    if (answerRevealed || isSubmitting) return;

    const previousChoice = selectedChoice;
    setSelectedChoice(choiceIndex);
    setIsSubmitting(true);
    setError('');

    socket.emit('student:quiz-response', {
      joinCode,
      questionId: quiz.questionId,
      choiceIndex,
    }, (response) => {
      setIsSubmitting(false);
      if (!response?.success) {
        setError(response?.error || 'Could not submit answer.');
        setFeedback(previousChoice === null ? 'Try again in a moment.' : 'Could not update your answer. Your previous choice is still selected.');
        setSelectedChoice(previousChoice);
        return;
      }

      if (response.answerRevealed && Number.isInteger(response.correctIndex)) {
        const correct = response.correct === true;
        setFeedback(correct ? '✓ Correct answer.' : `✗ Not quite. Correct answer: ${String.fromCharCode(65 + response.correctIndex)}.`);
      } else {
        setFeedback('Answer submitted. You can change your answer until the lecturer reveals the correct answer.');
      }

      onAnswered?.(choiceIndex, response);
    });
  }

  const maxCount = Math.max(1, ...(results?.distribution || []));

  return (
    <section className="card student-live-quiz-card">
      <div className="card-section">
        <div className="section-title">Live Quiz <span className="badge-sim">From lecturer</span></div>
        {quiz.topicTitle && <div className="quiz-topic-label">Topic: {quiz.topicTitle}</div>}
        <div className="quiz-q">{quiz.question}</div>
        <div className="quiz-opts">
          {quiz.options.map((option, index) => {
            const isSelected = selectedChoice === index;
            const showCorrect = answerRevealed && index === revealedCorrectIndex;
            const showWrong = answerRevealed && isSelected && index !== revealedCorrectIndex;
            const cls = ['quiz-opt'];
            if (showCorrect) cls.push('correct');
            if (showWrong) cls.push('wrong');
            if (isSelected) cls.push('selected');
            return (
              <button
                key={`${quiz.questionId}-${option}`}
                className={cls.join(' ')}
                type="button"
                onClick={() => submitAnswer(index)}
                disabled={answerRevealed || isSubmitting}
              >
                <span className="letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
        <div className="quiz-feedback">
          {isSubmitting ? 'Submitting...' : feedback}
        </div>
        {selectedChoice !== null && !answerRevealed && !isSubmitting && (
          <div className="quiz-feedback quiz-change-hint">
            Current choice: {String.fromCharCode(65 + selectedChoice)}. Click another option to change it.
          </div>
        )}
        {answerRevealed && (
          <div className="quiz-feedback quiz-change-hint">
            The answer has been revealed, so your response is locked.
          </div>
        )}
        {error && <div className="form-error">{error}</div>}
      </div>

      {results && (
        <div className="card-section">
          <div className="section-title">Class Results</div>
          <div className="class-stats">
            <div className="connected-row">
              <span className="dot-pulse"></span>
              <span><span className="num">{results.totalResponses}</span> responses</span>
            </div>
            {answerRevealed && (
              <div className="quiz-feedback">Class correct rate: {results.correctPct}%</div>
            )}
            {quiz.options.map((option, index) => {
              const count = results.distribution[index] || 0;
              const width = `${Math.round((count / maxCount) * 100)}%`;
              const isCorrectAfterReveal = answerRevealed && index === revealedCorrectIndex;
              return (
                <div className={`bar-row ${isCorrectAfterReveal ? 'correct-result-row' : ''}`} key={`student-result-${quiz.questionId}-${index}`}>
                  <div className="top"><span>{String.fromCharCode(65 + index)} - {option}</span><b>{count}</b></div>
                  <div className="bar"><span style={{ width }}></span></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
