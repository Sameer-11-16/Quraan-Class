'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import DateBatchSelector from '@/components/DateBatchSelector';
import SearchBar from '@/components/SearchBar';
import AttendanceSummary from '@/components/AttendanceSummary';
import AttendanceTable from '@/components/AttendanceTable';
import ActionButtons from '@/components/ActionButtons';
import Toast, { useToast } from '@/components/Toast';
import ManageStudents from '@/components/ManageStudents';
import {
  saveAttendance,
  getAttendance,
  getBatches,
  getStudentsByBatch,
} from '@/lib/api';
import AuthWrapper from '@/components/AuthWrapper';

export default function Home() {
  // --- State ---
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const { toasts, addToast, removeToast } = useToast();

  // --- Load batches ---
  const loadInitialBatches = useCallback(async () => {
    try {
      setIsLoadingBatches(true);
      const existingBatches = await getBatches();
      setBatches(existingBatches);
      if (existingBatches.length > 0) {
        setSelectedBatch(existingBatches[0].id);
      }
    } catch (error) {
      addToast('Failed to load batches from database', 'error');
    } finally {
      setIsLoadingBatches(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadInitialBatches();
  }, [loadInitialBatches]);

  // --- Check if attendance exists for selected date/batch ---
  useEffect(() => {
    const checkAttendance = async () => {
      if (selectedDate && selectedBatch) {
        try {
          const existing = await getAttendance(selectedDate, selectedBatch);
          setHasExisting(!!existing);
        } catch (error) {
          console.error("Error checking attendance:", error);
          setHasExisting(false);
        }
      }
    };
    checkAttendance();
  }, [selectedDate, selectedBatch]);

  // --- Load students ---
  const loadStudents = useCallback(async () => {
    if (!selectedBatch) {
      addToast('Please select a batch first', 'error');
      return;
    }
    
    addToast('Loading students and records...', 'info');
    
    try {
      const batchStudents = await getStudentsByBatch(selectedBatch);
      setStudents(batchStudents);

      // Check if attendance already exists in DB
      const existing = await getAttendance(selectedDate, selectedBatch);
      if (existing && existing.records) {
        const normalized = {};
        batchStudents.forEach((s) => {
          const rec = existing.records[s.id];
          if (rec) {
            normalized[s.id] = {
              classAttendance: rec.classAttendance || '',
              halqaAttendance: rec.halqaAttendance || '',
              halqaParticipation: rec.halqaParticipation || '',
              notesMarks: rec.notesMarks || '',
              homework: rec.homework || '',
              followUp: rec.followUp || '',
              remark: rec.remark || '',
            };
          } else {
            normalized[s.id] = {
              classAttendance: '',
              halqaAttendance: '',
              halqaParticipation: '',
              notesMarks: '',
              homework: '',
              followUp: '',
              remark: '',
            };
          }
        });
        setAttendance(normalized);
        setIsEditable(false);
        addToast('Loaded saved attendance for this date', 'success');
      } else {
        // Initialize with empty attendance
        const initial = {};
        batchStudents.forEach((s) => {
          initial[s.id] = {
            classAttendance: '',
            halqaAttendance: '',
            halqaParticipation: '',
            notesMarks: '',
            homework: '',
            followUp: '',
            remark: '',
          };
        });
        setAttendance(initial);
        setIsEditable(true);
      }

      setIsLoaded(true);
    } catch (err) {
      addToast('Failed to load data from database', 'error');
    }
  }, [selectedDate, selectedBatch, addToast]);

  // --- Search filtering ---
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase().trim();
    return students.filter(
      (s) =>
         s.name.toLowerCase().includes(query) ||
         s.code.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // --- Summary calculations ---
  const summary = useMemo(() => {
    const total = students.length;
    let classPresent = 0;
    let halqaPresent = 0;
    let homeworkYes = 0;

    students.forEach((s) => {
      const record = attendance[s.id] || {};
      if (record.classAttendance === 'Present') classPresent++;
      if (record.halqaAttendance === 'Present') halqaPresent++;
      if (record.homework === 'Yes') homeworkYes++;
    });

    return { total, classPresent, halqaPresent, homeworkYes };
  }, [students, attendance]);

  // --- Handlers ---
  const handleRecordChange = (studentId, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {
          classAttendance: '',
          halqaAttendance: '',
          halqaParticipation: '',
          notesMarks: '',
          homework: '',
          followUp: '',
          remark: '',
        }),
        [field]: value,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    setAttendance((prev) => {
      const updated = { ...prev };
      students.forEach((s) => {
        updated[s.id] = {
          ...(updated[s.id] || {
            classAttendance: '',
            halqaAttendance: '',
            halqaParticipation: '',
            notesMarks: '',
            homework: '',
            followUp: '',
            remark: '',
          }),
          classAttendance: 'Present',
          halqaAttendance: 'Present',
        };
      });
      return updated;
    });
    addToast('Marked all as Present for Class & Halqa', 'info');
  };

  const handleSave = async () => {
    // Validate that all students have been marked for Class Attendance and Halqa Attendance
    const unmarked = students.filter(
      (s) => !attendance[s.id]?.classAttendance || !attendance[s.id]?.halqaAttendance
    );
    if (unmarked.length > 0) {
      addToast(
        `${unmarked.length} student(s) haven't been marked for Class or Halqa attendance yet.`,
        'error'
      );
      return;
    }

    addToast('Saving to database...', 'info');
    
    try {
      await saveAttendance(selectedDate, selectedBatch, attendance);
      setIsEditable(false);
      setHasExisting(true);
      addToast('Attendance saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save attendance', 'error');
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    const initial = {};
    students.forEach((s) => {
      initial[s.id] = {
        classAttendance: '',
        halqaAttendance: '',
        halqaParticipation: '',
        notesMarks: '',
        homework: '',
        followUp: '',
        remark: '',
      };
    });
    setAttendance(initial);
    setShowResetModal(false);
    addToast('Attendance has been reset', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    addToast('Generating PDF...', 'info');

    const html2pdf = (await import('html2pdf.js')).default;
    const batchName = batches.find((b) => b.id === selectedBatch)?.name || selectedBatch;

    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.fontFamily = 'Inter, Arial, sans-serif';
    pdfContent.style.color = '#111827';

    pdfContent.innerHTML = `
      <div style="text-align: center; padding: 15px 0; border-bottom: 3px solid #047857; margin-bottom: 15px;">
        <h1 style="font-size: 24px; color: #065F46; margin: 0 0 4px 0; font-family: serif;">📖 Quraan Class & Halqa Attendance</h1>
        <p style="font-size: 14px; color: #6B7280; margin: 0;">Comprehensive Session Record</p>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 14px; color: #374151;">
        <div><strong>Date:</strong> ${selectedDate}</div>
        <div><strong>Batch:</strong> ${batchName}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
        <thead>
          <tr style="background: #ECFDF5;">
            <th style="padding: 8px; text-align: left; border: 1px solid #D1D5DB; color: #065F46;">#</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #D1D5DB; color: #065F46;">Code</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #D1D5DB; color: #065F46;">Full Name</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">Class Att.</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">Halqa Att.</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">Participation</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">Notes</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">HW</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #D1D5DB; color: #065F46;">Follow Up</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #D1D5DB; color: #065F46;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${students
            .map(
              (s, i) => {
                const rec = attendance[s.id] || {};
                return \`
                <tr>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB;">\${i + 1}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; color: #047857; font-weight: 500;">\${s.code}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; font-weight: 500;">\${s.name}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center;">
                    <span style="padding: 2px 6px; border-radius: 100px; font-size: 10px; font-weight: 600;
                      \${rec.classAttendance === 'Present' ? 'background: #D1FAE5; color: #065F46;' : ''}
                      \${rec.classAttendance === 'Absent' ? 'background: #FEE2E2; color: #991B1B;' : ''}
                      \${rec.classAttendance === 'Late' ? 'background: #FEF3C7; color: #92400E;' : ''}
                    ">
                      \${rec.classAttendance || 'Not Marked'}
                    </span>
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center;">
                    <span style="padding: 2px 6px; border-radius: 100px; font-size: 10px; font-weight: 600;
                      \${rec.halqaAttendance === 'Present' ? 'background: #D1FAE5; color: #065F46;' : ''}
                      \${rec.halqaAttendance === 'Absent' ? 'background: #FEE2E2; color: #991B1B;' : ''}
                      \${rec.halqaAttendance === 'Late' ? 'background: #FEF3C7; color: #92400E;' : ''}
                    ">
                      \${rec.halqaAttendance || 'Not Marked'}
                    </span>
                  </td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-weight: 600; color: \${rec.halqaParticipation === 'Yes' ? '#059669' : '#DC2626'}">\${rec.halqaParticipation || '-'}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-weight: 600; color: \${rec.notesMarks === 'Yes' ? '#059669' : '#DC2626'}">\${rec.notesMarks || '-'}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-weight: 600; color: \${rec.homework === 'Yes' ? '#059669' : '#DC2626'}">\${rec.homework || '-'}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; text-align: center; font-weight: 600; color: \${rec.followUp === 'Yes' ? '#059669' : '#DC2626'}">\${rec.followUp || '-'}</td>
                  <td style="padding: 6px 8px; border: 1px solid #E5E7EB; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${rec.remark || ''}</td>
                </tr>
              \`;
              }
            )
            .join('')}
        </tbody>
      </table>
      <div style="display: flex; gap: 20px; padding: 12px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB; font-size: 12px;">
        <div><strong>Total Students:</strong> ${summary.total}</div>
        <div style="color: #059669;"><strong>Class Present:</strong> ${summary.classPresent}</div>
        <div style="color: #047857;"><strong>Halqa Present:</strong> ${summary.halqaPresent}</div>
        <div style="color: #D97706;"><strong>Homework Done:</strong> ${summary.homeworkYes}</div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Attendance_${selectedDate}_${selectedBatch}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
    };

    try {
      await html2pdf().set(opt).from(pdfContent).save();
      addToast('PDF exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export PDF', 'error');
    }
  };

  const handleCloseManage = async () => {
    setIsManageOpen(false);
    
    // Refresh batches dropdown from DB
    try {
      const currentBatches = await getBatches();
      setBatches(currentBatches);
      
      if (selectedBatch && !currentBatches.some(b => b.id === selectedBatch)) {
        const fallback = currentBatches[0]?.id || '';
        setSelectedBatch(fallback);
        setIsLoaded(false);
      } else if (!selectedBatch && currentBatches.length > 0) {
        setSelectedBatch(currentBatches[0].id);
      } else if (isLoaded) {
        // Reload active student list to reflect any edits/additions
        const batchStudents = await getStudentsByBatch(selectedBatch);
        setStudents(batchStudents);
        
        // Update attendance map keys for any new/removed students
        setAttendance(prev => {
          const next = { ...prev };
          batchStudents.forEach(s => {
            if (!next[s.id]) {
              next[s.id] = {
                classAttendance: '',
                halqaAttendance: '',
                halqaParticipation: '',
                notesMarks: '',
                homework: '',
                followUp: '',
                remark: '',
              };
            }
          });
          return next;
        });
      }
    } catch (error) {
      addToast('Failed to refresh data after closing settings', 'error');
    }
  };

  return (
    <AuthWrapper>
      <Header />
      <main className="main-container">
        {isLoadingBatches ? (
           <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : (
          <DateBatchSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            batches={batches}
            onLoad={loadStudents}
            hasExisting={hasExisting}
            isLoaded={isLoaded}
            onBack={() => {
              setIsLoaded(false);
              setSearchQuery('');
            }}
            onManage={() => setIsManageOpen(true)}
          />
        )}

        {isLoaded && !isLoadingBatches && (
          <>
            {!isEditable && (
              <div className="edit-mode-banner">
                <span>🔒</span>
                Attendance is saved. Click &quot;Edit Attendance&quot; to make changes.
              </div>
            )}

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultCount={filteredStudents.length}
              totalCount={students.length}
            />

            <AttendanceSummary
              total={summary.total}
              classPresent={summary.classPresent}
              halqaPresent={summary.halqaPresent}
              homeworkYes={summary.homeworkYes}
            />

            <AttendanceTable
              students={filteredStudents}
              attendance={attendance}
              onRecordChange={handleRecordChange}
              onMarkAllPresent={handleMarkAllPresent}
              isEditable={isEditable}
            />

            <ActionButtons
              onSave={handleSave}
              onExportPDF={handleExportPDF}
              onPrint={handlePrint}
              onReset={handleReset}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
              hasSavedData={hasExisting}
              hasStudents={students.length > 0}
            />
          </>
        )}

        {!isLoaded && !isLoadingBatches && (
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="empty-state">
              <div className="empty-state-icon">🕌</div>
              <h3 className="empty-state-title">Welcome to Quraan Class Attendance</h3>
              <p className="empty-state-text">
                Select a date and batch above, then click &quot;Load Students&quot; to begin marking attendance.
              </p>
            </div>
          </div>
        )}
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Reset Attendance?</h3>
            <p className="modal-text">
              This will clear all attendance marks for the current session. Saved
              data will not be affected until you save again.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmReset}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Students/Batches Modal */}
      {isManageOpen && (
        <ManageStudents onClose={handleCloseManage} addToast={addToast} />
      )}
    </AuthWrapper>
  );
}
