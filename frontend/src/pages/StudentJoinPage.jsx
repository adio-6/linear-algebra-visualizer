import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkRoom } from '../api/roomsApi.js';

function friendlyJoinError(error) {
  const message = String(error?.message || '');
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Could not reach the backend server. Make sure the backend is running and your frontend env points to it.';
  }
  return message || 'Could not check the room. Make sure the backend is running.';
}

export default function StudentJoinPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    const cleanNickname = nickname.trim();

    if (!cleanNickname) {
      setError('Please enter a nickname before joining.');
      return;
    }

    if (!code) {
      setError('Please enter a join code.');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const exists = await checkRoom(code);
      if (!exists) {
        setError('Room not found. Please check the code or ask the lecturer for a new code.');
        return;
      }

      sessionStorage.setItem('student:nickname', cleanNickname);
      navigate(`/student/${encodeURIComponent(code)}`);
    } catch (err) {
      setError(friendlyJoinError(err));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="landing-page">
      <form className="landing-card card join-card" onSubmit={handleSubmit}>
        <h1>Join a Session</h1>
        <p>Enter the lecturer join code. The app will check if the room exists before joining.</p>

        <label className="form-label">
          Nickname
          <input
            className="join-input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Dana"
            disabled={isChecking}
          />
        </label>

        <label className="form-label">
          Join code
          <input
            className="join-input"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            disabled={isChecking}
          />
        </label>

        {isChecking && <div className="message-box loading-message">Checking room...</div>}
        {error && <div className="message-box error-message">{error}</div>}

        <div className="landing-actions">
          <button className="btn primary" type="submit" disabled={isChecking}>{isChecking ? 'Checking...' : 'Join'}</button>
          <Link className="btn" to="/">Back Home</Link>
        </div>
      </form>
    </div>
  );
}
