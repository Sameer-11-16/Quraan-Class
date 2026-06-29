'use client';

import { useState, useEffect, useCallback } from 'react';

async function getAllAttendanceHistory() {
  const res = await fetch('/api/attendance');
  if (!res.ok) throw new Error('Failed to fetch history');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export default function AttendanceHistory({ onClose, onJumpToDate }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBatch, setFilterBatch] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllAttendanceHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const allBatches = [...new Set(history.map((h) => h.batchName))];

  const filtered = history.filter((h) => {
    const matchesBatch = !filterBatch || h.batchName === filterBatch;
    const matchesSearch =
      !searchQuery ||
      h.date.includes(searchQuery) ||
      h.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const formatDate = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPresentPct = (h) => {
    if (!h.totalStudents) return 0;
    return Math.round((h.classPresentCount / h.totalStudents) * 100);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '800px',
          marginTop: '20px',
          marginBottom: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 100%)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              fontSize: '1.5rem',
              width: '42px', height: '42px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>🗂️</div>
            <div>
              <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1.1rem' }}>Attendance History</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>All previous attendance records</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none', color: 'white',
              width: '34px', height: '34px',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Filters */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--gray-200)',
          display: 'flex', gap: '10px', flexWrap: 'wrap',
          background: 'var(--green-50)',
        }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search by date or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: '180px', fontSize: '0.875rem' }}
          />
          <select
            className="form-select"
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            style={{ flex: '0 0 180px', fontSize: '0.875rem' }}
          >
            <option value="">All Batches</option>
            {allBatches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div style={{
            display: 'flex', alignItems: 'center',
            fontSize: '0.8rem', color: 'var(--green-700)',
            fontWeight: 600,
            padding: '0 8px',
          }}>
            {filtered.length} records
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
              <p>Loading attendance history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📭</div>
              <p>No attendance records found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((h) => {
                const pct = getPresentPct(h);
                const barColor = pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626';
                return (
                  <div
                    key={h.id}
                    style={{
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 16px',
                      background: 'var(--white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap',
                      transition: 'box-shadow 150ms ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Left: Date + Batch */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{
                        fontWeight: 700,
                        color: 'var(--green-900)',
                        fontSize: '0.95rem',
                        marginBottom: '2px',
                      }}>
                        📅 {formatDate(h.date)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{
                          fontSize: '0.72rem', fontWeight: 600,
                          background: '#D1FAE5', color: '#065F46',
                          padding: '2px 8px', borderRadius: '100px',
                          border: '1px solid #A7F3D0',
                        }}>
                          📦 {h.batchName}
                        </span>
                        <span style={{
                          fontSize: '0.72rem', color: 'var(--gray-400)',
                          background: 'var(--gray-100)',
                          padding: '2px 8px', borderRadius: '100px',
                        }}>
                          {h.totalStudents} students
                        </span>
                      </div>
                    </div>

                    {/* Center: Stats + Bar */}
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: '0.75rem', color: 'var(--gray-600)',
                        marginBottom: '4px',
                      }}>
                        <span>✅ {h.classPresentCount} Present</span>
                        <span>❌ {h.classAbsentCount} Absent</span>
                        <span style={{ fontWeight: 700, color: barColor }}>{pct}%</span>
                      </div>
                      <div style={{
                        height: '6px', borderRadius: '100px',
                        background: 'var(--gray-200)', overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: barColor,
                          borderRadius: '100px',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>

                    {/* Right: Jump button */}
                    <button
                      onClick={() => onJumpToDate(h.date, h.batchId)}
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        borderRadius: '8px',
                        border: '1.5px solid #059669',
                        background: 'transparent',
                        color: '#059669',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#059669';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#059669';
                      }}
                    >
                      👁️ View
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
