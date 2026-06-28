'use client';

export default function ActionButtons({
  onSave,
  onExportPDF,
  onPrint,
  onReset,
  isEditable,
  setIsEditable,
  hasSavedData,
  hasStudents,
}) {
  if (!hasStudents) return null;

  return (
    <div className="actions-section">
      <div className="card">
        <div className="card-title">
          <span>🎯</span>
          Actions
        </div>
        <div className="actions-bar">
          {isEditable ? (
            <button id="save-btn" className="btn btn-primary" onClick={onSave}>
              💾 Save Attendance
            </button>
          ) : (
            <button
              id="edit-btn"
              className="btn btn-gold"
              onClick={() => setIsEditable(true)}
            >
              ✏️ Edit Attendance
            </button>
          )}

          <button id="export-pdf-btn" className="btn btn-secondary" onClick={onExportPDF}>
            📄 Export PDF
          </button>

          <button id="print-btn" className="btn btn-secondary" onClick={onPrint}>
            🖨️ Print
          </button>

          {isEditable && (
            <button id="reset-btn" className="btn btn-danger" onClick={onReset}>
              🔄 Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
