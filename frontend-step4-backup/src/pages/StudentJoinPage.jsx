import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function StudentJoinPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const code = joinCode.trim();
    if (!code) return;
    if (nickname.trim()) {
      sessionStorage.setItem('student:nickname', nickname.trim());
    }
    navigate(`/student/${encodeURIComponent(code)}`);
  }

  return (
    <div className="landing-page">
      <form className="landing-card card join-card" onSubmit={handleSubmit}>
        <h1>Join a Session</h1>
        <p>Enter the lecturer join code. Backend validation will be added later.</p>

        <label className="form-label">
          Nickname
          <input className="join-input" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Dana" />
        </label>

        <label className="form-label">
          Join code
          <input className="join-input" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="ABC123" />
        </label>

        <div className="landing-actions">
          <button className="btn primary" type="submit">Join</button>
          <Link className="btn" to="/">Back Home</Link>
        </div>
      </form>
    </div>
  );
}
