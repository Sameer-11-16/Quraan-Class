// API utility functions for fetching from our Next.js + MongoDB backend

// ============================================
// ATTENDANCE
// ============================================

export async function saveAttendance(date, batch, records) {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, batch, records }),
  });
  if (!res.ok) throw new Error('Failed to save attendance');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function getAttendance(date, batch) {
  const res = await fetch(`/api/attendance?date=${date}&batch=${batch}`);
  if (!res.ok) throw new Error('Failed to fetch attendance');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data; // will be { date, batch, records: {} } or null
}

export async function deleteAttendance(date, batch) {
  // We didn't build a DELETE route for attendance yet, but we can add one if needed.
  // Currently, the UI doesn't allow deleting a whole attendance day directly from standard flow 
  // (only overwriting it).
  console.warn("deleteAttendance API not implemented yet");
}

export async function getAllAttendanceKeys() {
  // Not used actively in UI except for debugging/clearing. 
  // With a database, we usually don't need this client-side.
  return [];
}

// ============================================
// BATCHES
// ============================================

export async function getBatches() {
  const res = await fetch('/api/batches');
  if (!res.ok) throw new Error('Failed to fetch batches');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function addBatch(name) {
  const res = await fetch('/api/batches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to add batch');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function deleteBatch(batchId) {
  const res = await fetch(`/api/batches?id=${batchId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete batch');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return true;
}

// ============================================
// STUDENTS
// ============================================

export async function getStudents() {
  const res = await fetch('/api/students');
  if (!res.ok) throw new Error('Failed to fetch students');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function getStudentsByBatch(batchId) {
  const res = await fetch(`/api/students?batchId=${batchId}`);
  if (!res.ok) throw new Error('Failed to fetch students by batch');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function addStudent(name, code, batchId) {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, code, batchId }),
  });
  if (!res.ok) throw new Error('Failed to add student');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export async function deleteStudent(studentId) {
  const res = await fetch(`/api/students?id=${studentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete student');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return true;
}

// Add a new function for bulk import that wasn't in storage.js
export async function addStudentsBulk(studentsArray) {
  const res = await fetch('/api/students/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ students: studentsArray }),
  });
  if (!res.ok) throw new Error('Failed to bulk add students');
  const json = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}
