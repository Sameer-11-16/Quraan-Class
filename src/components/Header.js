'use client';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-icon">📖</div>
          <div>
            <h1 className="header-title">Quraan Attendance</h1>
            <p className="header-subtitle">Class Management System</p>
          </div>
        </div>
        <div className="header-date">
          <span>🗓️</span>
          <span>{today}</span>
        </div>
      </div>
    </header>
  );
}
