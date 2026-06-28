'use client';

import { useState, useEffect } from 'react';
import {
  getBatches,
  addBatch,
  deleteBatch,
  getStudents,
  addStudent,
  deleteStudent,
} from '@/lib/storage';

export default function ManageStudents({ onClose, addToast }) {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [newBatchName, setNewBatchName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');
  const [selectedBatchForAdd, setSelectedBatchForAdd] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  // --- AI Bulk Import State ---
  const [showAiImport, setShowAiImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkImportBatch, setBulkImportBatch] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    setBatches(getBatches());
    setStudents(getStudents());
  }, []);

  const handleAddBatch = () => {
    if (!newBatchName.trim()) return;
    const batch = addBatch(newBatchName.trim());
    setBatches((prev) => [...prev, batch]);
    setNewBatchName('');
    if (addToast) addToast(`Batch "${batch.name}" added successfully!`, 'success');
  };

  const handleDeleteBatch = (batchId) => {
    if (!confirm('Are you sure? This will remove the batch. Students in this batch will remain but will have no batch assigned.')) return;
    deleteBatch(batchId);
    setBatches((prev) => prev.filter((b) => b.id !== batchId));
    if (addToast) addToast('Batch deleted.', 'info');
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentCode.trim() || !selectedBatchForAdd) return;
    const student = addStudent(newStudentName.trim(), newStudentCode.trim(), selectedBatchForAdd);
    setStudents((prev) => [...prev, student]);
    setNewStudentName('');
    setNewStudentCode('');
    if (addToast) addToast(`Student "${student.name}" added successfully!`, 'success');
  };

  const handleDeleteStudent = (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    deleteStudent(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (addToast) addToast('Student deleted.', 'info');
  };

  // --- Groq Parsing Handlers ---
  const handleParseText = async () => {
    if (!bulkText.trim()) {
      if (addToast) addToast('Please paste some student text/list to parse.', 'error');
      return;
    }
    if (!bulkImportBatch) {
      if (addToast) addToast('Please select a target batch.', 'error');
      return;
    }

    setIsParsing(true);
    setParsedStudents([]);
    try {
      const res = await fetch('/api/parse-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: bulkText }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse text.');
      }
      setParsedStudents((data.students || []).map((s, idx) => ({
        ...s,
        id: Date.now() + idx,
        checked: true
      })));
      if (addToast) addToast(`Successfully parsed ${data.students?.length || 0} students!`, 'success');
    } catch (err) {
      if (addToast) addToast(err.message || 'An error occurred during parsing.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggleParsedCheck = (id) => {
    setParsedStudents(prev =>
      prev.map(s => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleImportParsed = () => {
    const activeToImport = parsedStudents.filter(s => s.checked);
    if (activeToImport.length === 0) {
      alert('No students selected for import.');
      return;
    }

    let addedCount = 0;
    activeToImport.forEach((student) => {
      // If code is empty or missing, generate a serial code
      const studentCode = student.code?.trim() || `QS-${Math.floor(100 + Math.random() * 900)}`;
      addStudent(student.name.trim(), studentCode, bulkImportBatch);
      addedCount++;
    });

    setStudents(getStudents()); // Refresh student list
    setParsedStudents([]); // Clear preview
    setBulkText(''); // Clear input textarea
    setShowAiImport(false); // Hide panel
    if (addToast) addToast(`Successfully imported ${addedCount} students!`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="modal-title" style={{ margin: 0, flex: 1 }}>⚙️ Manage Data</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid var(--gray-200)' }}>
          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === 'students' ? 'var(--green-50)' : 'transparent',
              borderBottom: activeTab === 'students' ? '3px solid var(--green-600)' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === 'students' ? 'var(--green-800)' : 'var(--gray-500)',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 150ms ease',
            }}
          >
            👤 Students
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === 'batches' ? 'var(--green-50)' : 'transparent',
              borderBottom: activeTab === 'batches' ? '3px solid var(--green-600)' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: activeTab === 'batches' ? 'var(--green-800)' : 'var(--gray-500)',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 150ms ease',
            }}
          >
            📦 Batches
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {/* ==================== BATCHES TAB ==================== */}
          {activeTab === 'batches' && (
            <div>
              {/* Add Batch Form */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                padding: '16px',
                background: 'var(--green-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--green-200)',
              }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Batch Name (e.g. Batch C - Intermediate)"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBatch()}
                  style={{ flex: 1, fontSize: '0.9rem' }}
                />
                <button className="btn btn-primary" onClick={handleAddBatch}>
                  ➕ Add Batch
                </button>
              </div>

              {/* Batch List */}
              {batches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
                  <p>No batches yet. Add your first batch above.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {batches.map((batch) => (
                    <div
                      key={batch.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'var(--white)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--gray-200)',
                        transition: 'all 150ms ease',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--green-800)' }}>{batch.name}</span>
                        <span style={{
                          marginLeft: '10px',
                          fontSize: '0.75rem',
                          color: 'var(--gray-400)',
                          background: 'var(--gray-100)',
                          padding: '2px 8px',
                          borderRadius: '100px',
                        }}>
                          {students.filter((s) => s.batch === batch.id).length} students
                        </span>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBatch(batch.id)}
                        style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== STUDENTS TAB ==================== */}
          {activeTab === 'students' && (
            <div>
              {/* Header actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 500 }}>Add students individually or in bulk</span>
                <button
                  className="btn btn-gold btn-sm"
                  onClick={() => setShowAiImport(!showAiImport)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ⚡ {showAiImport ? 'Hide AI Import' : 'AI Bulk Import (Groq)'}
                </button>
              </div>

              {/* AI Bulk Import Section */}
              {showAiImport && (
                <div style={{
                  marginBottom: '20px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--gold-400)',
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--late-text)', fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚡ Bulk Student AI Parser
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ color: 'var(--late-text)' }}>Target Batch</label>
                    <select
                      className="form-select"
                      value={bulkImportBatch}
                      onChange={(e) => setBulkImportBatch(e.target.value)}
                      style={{ border: '2px solid var(--gold-300)' }}
                    >
                      <option value="">Select Batch...</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ color: 'var(--late-text)' }}>Paste Student Text / Code Names</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder="Example:&#10;1. QS-021 Ahmad Raza&#10;2. QS-022 Fatimah Zahra&#10;Or paste CSV, WhatsApp message, or lists..."
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        border: '2px solid var(--gold-300)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setShowAiImport(false);
                        setParsedStudents([]);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-gold btn-sm"
                      onClick={handleParseText}
                      disabled={isParsing}
                    >
                      {isParsing ? '⏳ Parsing with AI...' : '✨ Parse with AI'}
                    </button>
                  </div>

                  {/* Parsed Preview Table */}
                  {parsedStudents.length > 0 && (
                    <div style={{ marginTop: '20px', background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--green-800)', marginBottom: '10px', fontSize: '0.9rem' }}>
                        📋 Extracted Student Preview ({parsedStudents.filter(s => s.checked).length} selected)
                      </div>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ background: 'var(--gray-50)', textAlign: 'left' }}>
                              <th style={{ padding: '6px', width: '40px' }}>Import</th>
                              <th style={{ padding: '6px', width: '100px' }}>Code</th>
                              <th style={{ padding: '6px' }}>Full Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedStudents.map((student) => (
                              <tr key={student.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '6px', textAlign: 'center' }}>
                                  <input
                                    type="checkbox"
                                    checked={student.checked}
                                    onChange={() => handleToggleParsedCheck(student.id)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </td>
                                <td style={{ padding: '6px' }}>
                                  <input
                                    type="text"
                                    value={student.code}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setParsedStudents(prev =>
                                        prev.map(s => (s.id === student.id ? { ...s, code: val } : s))
                                      );
                                    }}
                                    style={{
                                      border: '1px solid var(--gray-300)',
                                      padding: '2px 6px',
                                      fontSize: '0.8rem',
                                      borderRadius: '4px',
                                      fontFamily: 'monospace',
                                      width: '80px'
                                    }}
                                  />
                                </td>
                                <td style={{ padding: '6px' }}>
                                  <input
                                    type="text"
                                    value={student.name}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setParsedStudents(prev =>
                                        prev.map(s => (s.id === student.id ? { ...s, name: val } : s))
                                      );
                                    }}
                                    style={{
                                      border: '1px solid var(--gray-300)',
                                      padding: '2px 6px',
                                      fontSize: '0.8rem',
                                      borderRadius: '4px',
                                      width: '100%'
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary btn-sm" onClick={handleImportParsed}>
                          🚀 Confirm &amp; Import Students
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add Student Form */}
              {!showAiImport && (
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '20px',
                  padding: '16px',
                  background: 'var(--green-50)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--green-200)',
                  flexWrap: 'wrap',
                }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Student Code (e.g. QS-021)"
                    value={newStudentCode}
                    onChange={(e) => setNewStudentCode(e.target.value)}
                    style={{ flex: '0 0 150px', fontSize: '0.9rem' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full Name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    style={{ flex: 1, fontSize: '0.9rem', minWidth: '160px' }}
                  />
                  <select
                    className="form-select"
                    value={selectedBatchForAdd}
                    onChange={(e) => setSelectedBatchForAdd(e.target.value)}
                    style={{ flex: '0 0 200px', fontSize: '0.9rem' }}
                  >
                    <option value="">Select Batch...</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={handleAddStudent}>
                    ➕ Add Student
                  </button>
                </div>
              )}

              {batches.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'var(--gold-500)',
                  background: 'var(--late-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--late-border)',
                  marginBottom: '16px',
                }}>
                  ⚠️ Please add a batch first in the &quot;Batches&quot; tab before adding students.
                </div>
              )}

              {/* Student List grouped by batch */}
              {batches.map((batch) => {
                const batchStudents = students.filter((s) => s.batch === batch.id);
                if (batchStudents.length === 0) return null;
                return (
                  <div key={batch.id} style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'var(--green-700)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      📦 {batch.name}
                      <span style={{
                        fontSize: '0.7rem',
                        background: 'var(--green-100)',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        fontWeight: 500,
                      }}>
                        {batchStudents.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {batchStudents.map((student, idx) => (
                        <div
                          key={student.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 16px',
                            background: 'var(--white)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--gray-100)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--gray-400)', fontSize: '0.8rem', width: '24px' }}>{idx + 1}</span>
                            <span style={{
                              fontFamily: 'monospace',
                              fontSize: '0.82rem',
                              color: 'var(--green-700)',
                              background: 'var(--green-50)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 500,
                            }}>
                              {student.code}
                            </span>
                            <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{student.name}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--gray-400)',
                              fontSize: '1rem',
                              padding: '4px',
                              transition: 'color 150ms ease',
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#DC2626'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--gray-400)'}
                            title="Delete student"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {students.length === 0 && batches.length > 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
                  <p>No students yet. Add your first student above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
