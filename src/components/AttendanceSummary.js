'use client';

export default function AttendanceSummary({ total, classPresent, halqaPresent, homeworkYes }) {
  const getPercent = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="summary-section">
      <div className="summary-grid">
        {/* Total Students Card */}
        <div className="summary-card total">
          <div className="summary-icon">👥</div>
          <div className="summary-count" key={`total-${total}`}>{total}</div>
          <div className="summary-label">Total Students</div>
          <div className="summary-bar">
            <div className="summary-bar-fill" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Class Attendance Card */}
        <div className="summary-card present">
          <div className="summary-icon">🏫</div>
          <div className="summary-count" key={`class-${classPresent}`}>
            {classPresent} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--gray-500)' }}>({getPercent(classPresent)}%)</span>
          </div>
          <div className="summary-label">Class Present</div>
          <div className="summary-bar">
            <div className="summary-bar-fill" style={{ width: `${getPercent(classPresent)}%` }} />
          </div>
        </div>

        {/* Halqa Attendance Card */}
        <div className="summary-card present" style={{ borderLeft: '3px solid var(--green-600)' }}>
          <div className="summary-icon">🕌</div>
          <div className="summary-count" key={`halqa-${halqaPresent}`}>
            {halqaPresent} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--gray-500)' }}>({getPercent(halqaPresent)}%)</span>
          </div>
          <div className="summary-label">Halqa Present</div>
          <div className="summary-bar">
            <div className="summary-bar-fill" style={{ width: `${getPercent(halqaPresent)}%` }} />
          </div>
        </div>

        {/* Homework Card */}
        <div className="summary-card late">
          <div className="summary-icon">📖</div>
          <div className="summary-count" key={`hw-${homeworkYes}`}>
            {homeworkYes} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--gray-500)' }}>({getPercent(homeworkYes)}%)</span>
          </div>
          <div className="summary-label">Homework Done</div>
          <div className="summary-bar">
            <div className="summary-bar-fill" style={{ width: `${getPercent(homeworkYes)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
