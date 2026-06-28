// LocalStorage utility functions for attendance, students, and batches

const STORAGE_KEY = 'quraan_attendance';
const STUDENTS_KEY = 'quraan_students';
const BATCHES_KEY = 'quraan_batches';

// ============================================
// ATTENDANCE
// ============================================

export function saveAttendance(date, batch, records) {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY}_${date}_${batch}`;
  const data = {
    date,
    batch,
    records,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function getAttendance(date, batch) {
  if (typeof window === 'undefined') return null;
  const key = `${STORAGE_KEY}_${date}_${batch}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function getAllAttendanceKeys() {
  if (typeof window === 'undefined') return [];
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY)) {
      keys.push(key);
    }
  }
  return keys;
}

export function deleteAttendance(date, batch) {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_KEY}_${date}_${batch}`;
  localStorage.removeItem(key);
}

// ============================================
// BATCHES
// ============================================

export function getBatches() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BATCHES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveBatches(batches) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
}

export function addBatch(name) {
  const batches = getBatches();
  const id = 'batch-' + Date.now();
  batches.push({ id, name });
  saveBatches(batches);
  return { id, name };
}

export function deleteBatch(batchId) {
  let batches = getBatches();
  batches = batches.filter((b) => b.id !== batchId);
  saveBatches(batches);
}

// ============================================
// STUDENTS
// ============================================

export function getStudents() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStudents(students) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getStudentsByBatch(batchId) {
  return getStudents().filter((s) => s.batch === batchId);
}

export function addStudent(name, code, batchId) {
  const students = getStudents();
  const id = Date.now() + Math.floor(Math.random() * 10000);
  const student = { id, code, name, batch: batchId };
  students.push(student);
  saveStudents(students);
  return student;
}

export function deleteStudent(studentId) {
  let students = getStudents();
  students = students.filter((s) => s.id !== studentId);
  saveStudents(students);
}

export function updateStudent(studentId, updates) {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index !== -1) {
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
  }
}
