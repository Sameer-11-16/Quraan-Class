'use client';

export default function DateBatchSelector({
  selectedDate,
  setSelectedDate,
  selectedBatch,
  setSelectedBatch,
  batches = [],
  onLoad,
  hasExisting,
  isLoaded,
  onBack,
  onManage,
}) {
  const activeBatch = batches.find((b) => b.id === selectedBatch);
  let isDayAllowed = true;
  let selectedDayName = '';

  if (selectedDate && activeBatch) {
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      selectedDayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      if (activeBatch.days && activeBatch.days.length > 0) {
        isDayAllowed = activeBatch.days.includes(selectedDayName);
      }
    }
  }

  return (
    <div className="selector-section">
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span>
            Select Date &amp; Batch
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onManage}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            ⚙️ Manage Batches &amp; Students
          </button>
        </div>
        <div className="selector-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="date-picker">Date ({selectedDayName || 'Select Date'})</label>
            <input
              id="date-picker"
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {hasExisting && (
              <span className="existing-badge">
                ✅ Attendance exists for this date
              </span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="batch-select">Batch</label>
            <select
              id="batch-select"
              className="form-select"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}{batch.days && batch.days.length > 0 ? ` (${batch.days.join(', ')})` : ''}
                </option>
              ))}
              {batches.length === 0 && (
                <option value="">No Batches - Add one first</option>
              )}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isLoaded && (
              <button
                id="back-btn"
                className="btn btn-secondary"
                onClick={onBack}
              >
                ⬅️ Back
              </button>
            )}
            <button
              id="load-attendance-btn"
              className="btn btn-primary"
              onClick={onLoad}
              disabled={batches.length === 0 || !selectedBatch || !isDayAllowed}
            >
              {isLoaded ? '🔄 Reload' : '📋 Load Students'}
            </button>
          </div>
        </div>

        {/* Day restriction banner */}
        {!isDayAllowed && activeBatch && activeBatch.days && activeBatch.days.length > 0 && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: '#FEE2E2',
            border: '1.5px solid #F87171',
            borderRadius: 'var(--radius-md)',
            color: '#991B1B',
            fontSize: '0.88rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideDown 0.3s ease'
          }}>
            <span style={{ fontSize: '1.3rem' }}>⛔</span>
            <div>
              <strong>Attendance Restricted:</strong> Batch <strong>{activeBatch.name}</strong> is scheduled only on <u>{activeBatch.days.join(', ')}</u>. Selected date ({selectedDate}) is a <strong>{selectedDayName}</strong>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
