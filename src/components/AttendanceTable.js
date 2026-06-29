'use client';

import { useState } from 'react';

export default function AttendanceTable({
  students,
  attendance,
  onRecordChange,
  onMarkAllPresent,
  isEditable,
}) {
  const [viewMode, setViewMode] = useState('card');

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
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-header" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              <span>📝</span>
              Attendance Sheet
            </div>
            
            {/* View Switcher Toggle */}
            <div style={{ display: 'flex', background: 'var(--gray-100)', padding: '3px', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  background: viewMode === 'table' ? 'var(--green-600)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--white)' : 'var(--gray-600)',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                📋 Table View
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setViewMode('card')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  background: viewMode === 'card' ? 'var(--green-600)' : 'transparent',
                  color: viewMode === 'card' ? 'var(--white)' : 'var(--gray-600)',
                  boxShadow: viewMode === 'card' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                🎴 Card View
              </button>
            </div>
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

        {viewMode === 'table' ? (
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
        ) : (
          <div className="attendance-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            padding: '20px',
            background: 'var(--gray-50)',
          }}>
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
                <div
                  key={student.id}
                  className="student-attendance-card"
                  style={{
                    background: 'var(--white)',
                    borderRadius: '12px',
                    border: '1px solid var(--gray-200)',
                    boxShadow: 'var(--shadow-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'all 200ms ease',
                    position: 'relative',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gray-100)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: 'var(--green-50)',
                        color: 'var(--green-800)',
                        fontWeight: '700',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        border: '1px solid var(--green-200)'
                      }}>{index + 1}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--gray-800)' }}>{student.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--green-700)', fontWeight: 500, fontFamily: 'monospace' }}>{student.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Class Attendance */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Class Att.</span>
                      <div className="status-group" style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Present' ? '' : 'Present')}
                          className={`status-btn present ${record.classAttendance === 'Present' ? 'active' : ''}`}
                        >
                          ✓ Present
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Absent' ? '' : 'Absent')}
                          className={`status-btn absent ${record.classAttendance === 'Absent' ? 'active' : ''}`}
                        >
                          ✕ Absent
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'classAttendance', record.classAttendance === 'Late' ? '' : 'Late')}
                          className={`status-btn late ${record.classAttendance === 'Late' ? 'active' : ''}`}
                        >
                          ⏱ Late
                        </button>
                      </div>
                    </div>

                    {/* Halqa Attendance */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-600)' }}>Halqa Att.</span>
                      <div className="status-group" style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Present' ? '' : 'Present')}
                          className={`status-btn present ${record.halqaAttendance === 'Present' ? 'active' : ''}`}
                        >
                          ✓ Present
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Absent' ? '' : 'Absent')}
                          className={`status-btn absent ${record.halqaAttendance === 'Absent' ? 'active' : ''}`}
                        >
                          ✕ Absent
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaAttendance', record.halqaAttendance === 'Late' ? '' : 'Late')}
                          className={`status-btn late ${record.halqaAttendance === 'Late' ? 'active' : ''}`}
                        >
                          ⏱ Late
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Yes/No Options Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 14px',
                    background: 'var(--gray-50)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--gray-200)'
                  }}>
                    {/* Halqa Participation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Participation</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaParticipation', record.halqaParticipation === 'Yes' ? '' : 'Yes')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.halqaParticipation === 'Yes' ? '#D1FAE5' : 'var(--white)',
                            color: record.halqaParticipation === 'Yes' ? '#065F46' : 'var(--gray-500)',
                            borderColor: record.halqaParticipation === 'Yes' ? '#34D399' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'halqaParticipation', record.halqaParticipation === 'No' ? '' : 'No')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.halqaParticipation === 'No' ? '#FEE2E2' : 'var(--white)',
                            color: record.halqaParticipation === 'No' ? '#991B1B' : 'var(--gray-500)',
                            borderColor: record.halqaParticipation === 'No' ? '#F87171' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Notes Marks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Notes Marks</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'notesMarks', record.notesMarks === 'Yes' ? '' : 'Yes')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.notesMarks === 'Yes' ? '#D1FAE5' : 'var(--white)',
                            color: record.notesMarks === 'Yes' ? '#065F46' : 'var(--gray-500)',
                            borderColor: record.notesMarks === 'Yes' ? '#34D399' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'notesMarks', record.notesMarks === 'No' ? '' : 'No')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.notesMarks === 'No' ? '#FEE2E2' : 'var(--white)',
                            color: record.notesMarks === 'No' ? '#991B1B' : 'var(--gray-500)',
                            borderColor: record.notesMarks === 'No' ? '#F87171' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Homework */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Homework</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'homework', record.homework === 'Yes' ? '' : 'Yes')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.homework === 'Yes' ? '#D1FAE5' : 'var(--white)',
                            color: record.homework === 'Yes' ? '#065F46' : 'var(--gray-500)',
                            borderColor: record.homework === 'Yes' ? '#34D399' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'homework', record.homework === 'No' ? '' : 'No')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.homework === 'No' ? '#FEE2E2' : 'var(--white)',
                            color: record.homework === 'No' ? '#991B1B' : 'var(--gray-500)',
                            borderColor: record.homework === 'No' ? '#F87171' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Follow Up */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Follow Up</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'followUp', record.followUp === 'Yes' ? '' : 'Yes')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.followUp === 'Yes' ? '#D1FAE5' : 'var(--white)',
                            color: record.followUp === 'Yes' ? '#065F46' : 'var(--gray-500)',
                            borderColor: record.followUp === 'Yes' ? '#34D399' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          disabled={!isEditable}
                          onClick={() => onRecordChange(student.id, 'followUp', record.followUp === 'No' ? '' : 'No')}
                          style={{
                            flex: 1,
                            padding: '5px 0',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            borderRadius: '6px',
                            background: record.followUp === 'No' ? '#FEE2E2' : 'var(--white)',
                            color: record.followUp === 'No' ? '#991B1B' : 'var(--gray-500)',
                            borderColor: record.followUp === 'No' ? '#F87171' : 'var(--gray-200)',
                            cursor: isEditable ? 'pointer' : 'default',
                            transition: 'all 150ms ease'
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remarks Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-600)' }}>Remarks</span>
                    <input
                      type="text"
                      placeholder="Write a remark..."
                      value={record.remark || ''}
                      onChange={(e) => onRecordChange(student.id, 'remark', e.target.value)}
                      disabled={!isEditable}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        border: '2px solid var(--gray-200)',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none',
                        transition: 'border-color 150ms ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
