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
            <label className="form-label" htmlFor="date-picker">Date</label>
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
                  {batch.name}
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
              disabled={batches.length === 0 || !selectedBatch}
            >
              {isLoaded ? '🔄 Reload' : '📋 Load Students'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
