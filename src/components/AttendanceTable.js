'use client';

export default function AttendanceTable({
  students,
  attendance,
  onRecordChange,
  onMarkAllPresent,
  isEditable,
}) {
  if (!students || students.length === 0) {
    return (
      <div className="table-section">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">No Students Found</h3>
            <p className="empty-state-text">
              Select a date and batch above, then click &quot;Load Students&quot; to view the attendance list.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const attendanceDropdownStyle = (value) => {
    let borderColor = 'var(--gray-200)';
    let bg = 'var(--white)';
    let color = 'var(--gray-600)';
    if (value === 'Present') { borderColor = '#34D399'; bg = '#D1FAE5'; color = '#065F46'; }
    if (value === 'Absent') { borderColor = '#F87171'; bg = '#FEE2E2'; color = '#991B1B'; }
    if (value === 'Late') { borderColor = '#FBBF24'; bg = '#FEF3C7'; color = '#92400E'; }
    return {
      padding: '6px 24px 6px 10px',
      fontSize: '0.82rem',
      fontWeight: 600,
      borderRadius: '100px',
      border: `2px solid ${borderColor}`,
      background: bg,
      color: color,
      outline: 'none',
      cursor: isEditable ? 'pointer' : 'default',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      minWidth: '100px',
      transition: 'all 150ms ease',
    };
  };

  const yesNoDropdownStyle = (value) => {
    let borderColor = 'var(--gray-200)';
    let bg = 'var(--white)';
    let color = 'var(--gray-600)';
    if (value === 'Yes') { borderColor = '#34D399'; bg = '#D1FAE5'; color = '#065F46'; }
    if (value === 'No') { borderColor = '#F87171'; bg = '#FEE2E2'; color = '#991B1B'; }
    return {
      padding: '6px 24px 6px 10px',
      fontSize: '0.82rem',
      fontWeight: 600,
      borderRadius: '100px',
      border: `2px solid ${borderColor}`,
      background: bg,
      color: color,
      outline: 'none',
      cursor: isEditable ? 'pointer' : 'default',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      minWidth: '80px',
      transition: 'all 150ms ease',
    };
  };

  return (
    <div className="table-section">
      {/* Desktop view (Full table layout) */}
      <div className="desktop-view">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-header" style={{ padding: '16px 20px 0' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              <span>📝</span>
              Attendance Sheet
            </div>
            {isEditable && (
              <button
                id="mark-all-present-btn"
                className="btn btn-sm btn-primary"
                onClick={onMarkAllPresent}
              >
                ✅ Mark All Present
              </button>
            )}
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}>
            <table className="attendance-table" style={{ width: '100%', minWidth: '1000px' }}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ width: '100px' }}>Code</th>
                  <th style={{ width: '170px' }}>Full Name</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Class Att.</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Halqa Att.</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Halqa Part.</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Notes Marks</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Homework</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Follow Up</th>
                  <th style={{ minWidth: '160px' }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const record = attendance[student.id] || {
                    classAttendance: '',
                    halqaAttendance: '',
                    halqaParticipation: '',
                    notesMarks: '',
                    homework: '',
                    followUp: '',
                    remark: '',
                  };

                  return (
                    <tr key={student.id}>
                      <td data-label="#">
                        <span className="student-serial">{index + 1}</span>
                      </td>
                      <td data-label="Code">
                        <span className="student-code">{student.code}</span>
                      </td>
                      <td data-label="Full Name">
                        <span className="student-name">{student.name}</span>
                      </td>

                      {/* Class Attendance Dropdown */}
                      <td data-label="Class Att." style={{ textAlign: 'center' }}>
                        <select
                          value={record.classAttendance || ''}
                          onChange={(e) => onRecordChange(student.id, 'classAttendance', e.target.value)}
                          disabled={!isEditable}
                          style={attendanceDropdownStyle(record.classAttendance)}
                        >
                          <option value="">--</option>
                          <option value="Present">✓ Present</option>
                          <option value="Absent">✕ Absent</option>
                          <option value="Late">⏱ Late</option>
                        </select>
                      </td>

                      {/* Halqa Attendance Dropdown */}
                      <td data-label="Halqa Att." style={{ textAlign: 'center' }}>
                        <select
                          value={record.halqaAttendance || ''}
                          onChange={(e) => onRecordChange(student.id, 'halqaAttendance', e.target.value)}
                          disabled={!isEditable}
                          style={attendanceDropdownStyle(record.halqaAttendance)}
                        >
                          <option value="">--</option>
                          <option value="Present">✓ Present</option>
                          <option value="Absent">✕ Absent</option>
                          <option value="Late">⏱ Late</option>
                        </select>
                      </td>

                      {/* Halqa Participation Dropdown */}
                      <td data-label="Halqa Part." style={{ textAlign: 'center' }}>
                        <select
                          value={record.halqaParticipation || ''}
                          onChange={(e) => onRecordChange(student.id, 'halqaParticipation', e.target.value)}
                          disabled={!isEditable}
                          style={yesNoDropdownStyle(record.halqaParticipation)}
                        >
                          <option value="">--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>

                      {/* Notes Marks Dropdown */}
                      <td data-label="Notes Marks" style={{ textAlign: 'center' }}>
                        <select
                          value={record.notesMarks || ''}
                          onChange={(e) => onRecordChange(student.id, 'notesMarks', e.target.value)}
                          disabled={!isEditable}
                          style={yesNoDropdownStyle(record.notesMarks)}
                        >
                          <option value="">--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>

                      {/* Homework Dropdown */}
                      <td data-label="Homework" style={{ textAlign: 'center' }}>
                        <select
                          value={record.homework || ''}
                          onChange={(e) => onRecordChange(student.id, 'homework', e.target.value)}
                          disabled={!isEditable}
                          style={yesNoDropdownStyle(record.homework)}
                        >
                          <option value="">--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>

                      {/* Follow Up Dropdown */}
                      <td data-label="Follow Up" style={{ textAlign: 'center' }}>
                        <select
                          value={record.followUp || ''}
                          onChange={(e) => onRecordChange(student.id, 'followUp', e.target.value)}
                          disabled={!isEditable}
                          style={yesNoDropdownStyle(record.followUp)}
                        >
                          <option value="">--</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>

                      {/* Remarks Input */}
                      <td data-label="Remarks">
                        <input
                          type="text"
                          placeholder="Write a remark..."
                          value={record.remark || ''}
                          onChange={(e) => onRecordChange(student.id, 'remark', e.target.value)}
                          disabled={!isEditable}
                          style={{
                            width: '100%',
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            borderRadius: '6px',
                            border: '2px solid var(--gray-200)',
                            fontFamily: 'Inter, sans-serif',
                            outline: 'none',
                            transition: 'border-color 150ms ease',
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile view (Pill-button and cards layout) */}
      <div className="mobile-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            <span>📝</span>
            Attendance List
          </div>
          {isEditable && (
            <button
              id="mark-all-present-btn-mobile"
              className="btn btn-sm btn-primary"
              onClick={onMarkAllPresent}
            >
              ✅ Mark All Present
            </button>
          )}
        </div>
        <div className="mobile-student-list">
          {students.map((student, index) => {
            const record = attendance[student.id] || {
              classAttendance: '',
              halqaAttendance: '',
              halqaParticipation: '',
              notesMarks: '',
              homework: '',
              followUp: '',
              remark: '',
            };

            return (
              <div className="mobile-student-card" key={student.id}>
                {/* Header info */}
                <div className="mobile-card-header">
                  <div className="student-info">
                    <span className="serial-badge">#{index + 1}</span>
                    <span className="student-name">{student.name}</span>
                  </div>
                  <div className="student-meta">
                    <span className="student-code">{student.code}</span>
                  </div>
                </div>

                {/* Card controls */}
                <div className="mobile-card-body">
                  {/* Class Attendance */}
                  <div className="mobile-control-row">
                    <label>Class Attendance</label>
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={`segmented-btn present ${record.classAttendance === 'Present' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Present' ? '' : 'Present')}
                      >
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn absent ${record.classAttendance === 'Absent' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Absent' ? '' : 'Absent')}
                      >
                        ✕ Absent
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn late ${record.classAttendance === 'Late' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Late' ? '' : 'Late')}
                      >
                        ⏱ Late
                      </button>
                    </div>
                  </div>

                  {/* Halqa Attendance */}
                  <div className="mobile-control-row">
                    <label>Halqa Attendance</label>
                    <div className="segmented-control">
                      <button
                        type="button"
                        className={`segmented-btn present ${record.halqaAttendance === 'Present' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Present' ? '' : 'Present')}
                      >
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn absent ${record.halqaAttendance === 'Absent' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Absent' ? '' : 'Absent')}
                      >
                        ✕ Absent
                      </button>
                      <button
                        type="button"
                        className={`segmented-btn late ${record.halqaAttendance === 'Late' ? 'active' : ''}`}
                        disabled={!isEditable}
                        onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Late' ? '' : 'Late')}
                      >
                        ⏱ Late
                      </button>
                    </div>
                  </div>

                  {/* 2x2 Toggles Grid for Yes/No fields */}
                  <div className="mobile-toggles-grid">
                    {/* Halqa Participation */}
                    <div className="mobile-toggle-item">
                      <span>💬 Halqa Part.</span>
                      <div className="yes-no-control">
                        <button
                          type="button"
                          className={`yes-no-btn yes ${record.halqaParticipation === 'Yes' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaParticipation', record.halqaParticipation === 'Yes' ? '' : 'Yes')}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`yes-no-btn no ${record.halqaParticipation === 'No' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaParticipation', record.halqaParticipation === 'No' ? '' : 'No')}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Notes Marks */}
                    <div className="mobile-toggle-item">
                      <span>📝 Notes Marks</span>
                      <div className="yes-no-control">
                        <button
                          type="button"
                          className={`yes-no-btn yes ${record.notesMarks === 'Yes' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'notesMarks', record.notesMarks === 'Yes' ? '' : 'Yes')}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`yes-no-btn no ${record.notesMarks === 'No' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'notesMarks', record.notesMarks === 'No' ? '' : 'No')}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Homework */}
                    <div className="mobile-toggle-item">
                      <span>🏠 Homework</span>
                      <div className="yes-no-control">
                        <button
                          type="button"
                          className={`yes-no-btn yes ${record.homework === 'Yes' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'homework', record.homework === 'Yes' ? '' : 'Yes')}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`yes-no-btn no ${record.homework === 'No' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'homework', record.homework === 'No' ? '' : 'No')}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Follow Up */}
                    <div className="mobile-toggle-item">
                      <span>📞 Follow Up</span>
                      <div className="yes-no-control">
                        <button
                          type="button"
                          className={`yes-no-btn yes ${record.followUp === 'Yes' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'followUp', record.followUp === 'Yes' ? '' : 'Yes')}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className={`yes-no-btn no ${record.followUp === 'No' ? 'active' : ''}`}
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'followUp', record.followUp === 'No' ? '' : 'No')}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remarks Row */}
                  <div className="mobile-remarks-row">
                    <label>Remarks</label>
                    <input
                      type="text"
                      className="mobile-remarks-input"
                      placeholder="Write a remark..."
                      value={record.remark || ''}
                      disabled={!isEditable}
                      onChange={(e) => onRecordChange(student.id, 'remark', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
