// NIIT School Management App - Vanilla JS
// Data persistence via localStorage

const SECTIONS = ['dashboard', 'students', 'courses', 'attendance', 'quizzes', 'reports', 'settings'];
const studentsKey = 'niit_students';
const coursesKey = 'niit_courses';
const attendanceKey = 'niit_attendance';
const quizzesKey = 'niit_quizzes';

// Add Chart.js for analytics
const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartScript);

// Utility functions
function getData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function showNotification(msg, success = true) {
  const notif = document.getElementById('notification');
  notif.textContent = msg;
  notif.style.background = success ? '#28A745' : '#d32f2f';
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 2200);
}

// Navigation
const sidebarLinks = document.querySelectorAll('.sidebar nav ul li');
sidebarLinks.forEach(link => {
  link.onclick = () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    SECTIONS.forEach(sec => {
      const el = document.getElementById(`${sec}-section`);
      if (el) el.classList.remove('active');
    });
    const section = document.getElementById(`${link.dataset.section}-section`);
    if (section) section.classList.add('active');
    if (link.dataset.section === 'dashboard') updateDashboard();
    if (link.dataset.section === 'students') renderStudents();
    if (link.dataset.section === 'courses') renderCourses();
    if (link.dataset.section === 'attendance') renderAttendance();
    if (link.dataset.section === 'quizzes') renderQuizzes();
    if (link.dataset.section === 'reports') renderReports();
  };
});

// Dashboard
function updateDashboard() {
  document.getElementById('stat-students').textContent = getData(studentsKey).length;
  document.getElementById('stat-courses').textContent = getData(coursesKey).length;
  document.getElementById('stat-attendance').textContent = getData(attendanceKey).length;
  document.getElementById('stat-quizzes').textContent = getData(quizzesKey).length;
  // Recent students
  const students = getData(studentsKey).slice(-5).reverse();
  const recentList = document.getElementById('recent-students');
  if (recentList) {
    recentList.innerHTML = students.length ? students.map(s => `<li class='list-group-item'>${s.name} (${s.program})</li>`).join('') : '<li class="list-group-item">No recent registrations.</li>';
  }
}

// Students
function renderStudents() {
  const students = getData(studentsKey);
  const tbody = document.querySelector('#students-table tbody');
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    const status = s.status || 'Active';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.program}</td><td>${s.course}</td><td>${s.phone}</td><td><span class='badge bg-${status==='Active'?'success':'secondary'}'>${status}</span></td>
      <td><button class="btn secondary" onclick="editStudent(${i})"><span class="material-icons">edit</span></button>
      <button class="btn secondary" onclick="deleteStudent(${i})"><span class="material-icons">delete</span></button></td>`;
    tbody.appendChild(tr);
  });
}

document.getElementById('add-student-btn').onclick = () => openStudentModal();
document.getElementById('close-student-modal').onclick = closeStudentModal;

document.getElementById('student-form').onsubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('student-id').value;
  const name = document.getElementById('student-name').value.trim();
  const email = document.getElementById('student-email').value.trim();
  const program = document.getElementById('student-program').value.trim();
  const course = document.getElementById('student-course').value;
  const phone = document.getElementById('student-phone').value.trim();
  if (!name || !email || !program || !course || !phone) {
    showNotification('All fields are required.', false);
    return;
  }
  let students = getData(studentsKey);
  if (id) {
    students[id] = { name, email, program, course, phone };
    showNotification('Student updated successfully.');
  } else {
    if (students.some(s => s.email === email)) {
      showNotification('Email already registered.', false);
      return;
    }
    students.push({ name, email, program, course, phone });
    showNotification('Student registered successfully.');
  }
  setData(studentsKey, students);
  closeStudentModal();
  renderStudents();
  updateDashboard();
};

function openStudentModal(editId = null) {
  const modal = document.getElementById('student-modal');
  const form = document.getElementById('student-form');
  const courses = getData(coursesKey);
  const courseSelect = document.getElementById('student-course');
  courseSelect.innerHTML = courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  if (editId !== null) {
    const s = getData(studentsKey)[editId];
    document.getElementById('student-id').value = editId;
    document.getElementById('student-name').value = s.name;
    document.getElementById('student-email').value = s.email;
    document.getElementById('student-program').value = s.program;
    document.getElementById('student-course').value = s.course;
    document.getElementById('student-phone').value = s.phone;
    document.getElementById('student-modal-title').textContent = 'Edit Student';
  } else {
    form.reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-modal-title').textContent = 'Add Student';
  }
  modal.classList.add('active');
}
function closeStudentModal() {
  document.getElementById('student-modal').classList.remove('active');
}
window.editStudent = openStudentModal;
window.deleteStudent = function(id) {
  if (!confirm('Delete this student?')) return;
  let students = getData(studentsKey);
  students.splice(id, 1);
  setData(studentsKey, students);
  renderStudents();
  updateDashboard();
  showNotification('Student deleted.');
};

document.getElementById('student-search').oninput = function() {
  const q = this.value.toLowerCase();
  const students = getData(studentsKey);
  const tbody = document.querySelector('#students-table tbody');
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    if (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.program.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q)
    ) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.program}</td><td>${s.course}</td><td>${s.phone}</td><td><span class='badge bg-${s.status==='Active'?'success':'secondary'}'>${s.status || 'Active'}</span></td>
        <td><button class="btn secondary" onclick="editStudent(${i})"><span class="material-icons">edit</span></button>
        <button class="btn secondary" onclick="deleteStudent(${i})"><span class="material-icons">delete</span></button></td>`;
      tbody.appendChild(tr);
    }
  });
};

// Courses
function renderCourses() {
  const courses = getData(coursesKey);
  const students = getData(studentsKey);
  const tbody = document.querySelector('#courses-table tbody');
  tbody.innerHTML = '';
  courses.forEach((c, i) => {
    const enrolled = students.filter(s => s.course === c.name).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.name}</td><td>${c.description}</td><td>${c.duration}</td><td>${enrolled}</td>
      <td><button class="btn secondary" onclick="editCourse(${i})"><span class="material-icons">edit</span></button>
      <button class="btn secondary" onclick="deleteCourse(${i})"><span class="material-icons">delete</span></button></td>`;
    tbody.appendChild(tr);
  });
}
document.getElementById('add-course-btn').onclick = () => openCourseModal();
document.getElementById('close-course-modal').onclick = closeCourseModal;
document.getElementById('course-form').onsubmit = function(e) {
  e.preventDefault();
  const id = document.getElementById('course-id').value;
  const name = document.getElementById('course-name').value.trim();
  const description = document.getElementById('course-description').value.trim();
  const duration = document.getElementById('course-duration').value.trim();
  if (!name || !description || !duration) {
    showNotification('All fields are required.', false);
    return;
  }
  let courses = getData(coursesKey);
  if (id) {
    courses[id] = { name, description, duration };
    showNotification('Course updated successfully.');
  } else {
    if (courses.some(c => c.name === name)) {
      showNotification('Course already exists.', false);
      return;
    }
    courses.push({ name, description, duration });
    showNotification('Course added successfully.');
  }
  setData(coursesKey, courses);
  closeCourseModal();
  renderCourses();
  updateDashboard();
};
function openCourseModal(editId = null) {
  const modal = document.getElementById('course-modal');
  const form = document.getElementById('course-form');
  if (editId !== null) {
    const c = getData(coursesKey)[editId];
    document.getElementById('course-id').value = editId;
    document.getElementById('course-name').value = c.name;
    document.getElementById('course-description').value = c.description;
    document.getElementById('course-duration').value = c.duration;
    document.getElementById('course-modal-title').textContent = 'Edit Course';
  } else {
    form.reset();
    document.getElementById('course-id').value = '';
    document.getElementById('course-modal-title').textContent = 'Add Course';
  }
  modal.classList.add('active');
}
function closeCourseModal() {
  document.getElementById('course-modal').classList.remove('active');
}
window.editCourse = openCourseModal;
window.deleteCourse = function(id) {
  if (!confirm('Delete this course?')) return;
  let courses = getData(coursesKey);
  courses.splice(id, 1);
  setData(coursesKey, courses);
  renderCourses();
  updateDashboard();
  showNotification('Course deleted.');
};

// Attendance
function renderAttendance() {
  const students = getData(studentsKey);
  const tbody = document.querySelector('#attendance-table tbody');
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td><input type="checkbox" class="attendance-checkbox" data-id="${i}"></td><td><input type="text" class="form-control form-control-sm attendance-remark" data-id="${i}" placeholder="Remarks"></td>`;
    tbody.appendChild(tr);
  });
  // Load attendance for selected date
  const date = document.getElementById('attendance-date').value;
  if (date) {
    const records = getData(attendanceKey).find(r => r.date === date);
    if (records) {
      records.present.forEach(idx => {
        tbody.querySelector(`.attendance-checkbox[data-id='${idx}']`).checked = true;
      });
      if (records.remarks) {
        Object.entries(records.remarks).forEach(([idx, remark]) => {
          const input = tbody.querySelector(`.attendance-remark[data-id='${idx}']`);
          if (input) input.value = remark;
        });
      }
    }
  }
}
document.getElementById('attendance-date').onchange = renderAttendance;
document.getElementById('save-attendance-btn').onclick = function() {
  const date = document.getElementById('attendance-date').value;
  if (!date) {
    showNotification('Select a date.', false);
    return;
  }
  const checkboxes = document.querySelectorAll('.attendance-checkbox');
  const remarksInputs = document.querySelectorAll('.attendance-remark');
  const present = [];
  const remarks = {};
  checkboxes.forEach(cb => { if (cb.checked) present.push(Number(cb.dataset.id)); });
  remarksInputs.forEach(input => { if (input.value) remarks[input.dataset.id] = input.value; });
  let records = getData(attendanceKey);
  const idx = records.findIndex(r => r.date === date);
  if (idx >= 0) {
    records[idx].present = present;
    records[idx].remarks = remarks;
  } else {
    records.push({ date, present, remarks });
  }
  setData(attendanceKey, records);
  updateDashboard();
  showNotification('Attendance saved.');
};

// Quizzes: Upload and list
function renderQuizzes() {
  const quizzes = getData(quizzesKey);
  const tbody = document.querySelector('#quizzes-table tbody');
  tbody.innerHTML = '';
  quizzes.forEach((q, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${q.title}</td><td>${q.course}</td><td><a href="${q.file}" download>Download</a></td><td>${q.date}</td>
      <td><button class="btn secondary" onclick="deleteQuiz(${i})"><span class="material-icons">delete</span></button></td>`;
    tbody.appendChild(tr);
  });
}
document.getElementById('add-quiz-btn').onclick = function() {
  const title = prompt('Quiz Title:');
  if (!title) return;
  const course = prompt('Course:');
  if (!course) return;
  const file = prompt('Quiz File URL (PDF/DOCX):');
  if (!file) return;
  const date = new Date().toISOString().slice(0,10);
  let quizzes = getData(quizzesKey);
  quizzes.push({ title, course, file, date });
  setData(quizzesKey, quizzes);
  renderQuizzes();
  updateDashboard();
  showNotification('Quiz uploaded.');
};
window.deleteQuiz = function(i) {
  let quizzes = getData(quizzesKey);
  quizzes.splice(i, 1);
  setData(quizzesKey, quizzes);
  renderQuizzes();
  updateDashboard();
  showNotification('Quiz deleted.');
};

// Reports: Analytics with Chart.js
function renderReports() {
  if (window.Chart) {
    // Attendance chart
    const attendanceData = getData(attendanceKey);
    const dates = attendanceData.map(r => r.date);
    const counts = attendanceData.map(r => r.present.length);
    const ctx1 = document.getElementById('attendance-chart').getContext('2d');
    if (window.attendanceChart) window.attendanceChart.destroy();
    window.attendanceChart = new Chart(ctx1, {
      type: 'line',
      data: { labels: dates, datasets: [{ label: 'Attendance', data: counts, borderColor: '#7fc7a3', backgroundColor: 'rgba(127,199,163,0.2)' }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
    // Enrollment chart
    const courses = getData(coursesKey);
    const students = getData(studentsKey);
    const courseNames = courses.map(c => c.name);
    const enrollCounts = courseNames.map(name => students.filter(s => s.course === name).length);
    const ctx2 = document.getElementById('enrollment-chart').getContext('2d');
    if (window.enrollmentChart) window.enrollmentChart.destroy();
    window.enrollmentChart = new Chart(ctx2, {
      type: 'bar',
      data: { labels: courseNames, datasets: [{ label: 'Enrolled', data: enrollCounts, backgroundColor: '#2a3a5c' }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  } else {
    setTimeout(renderReports, 500);
  }
}

// Export students as CSV
const exportBtn = document.getElementById('export-students-btn');
if (exportBtn) {
  exportBtn.onclick = function() {
    const students = getData(studentsKey);
    const csv = ['Name,Email,Program,Course,Phone,Status'];
    students.forEach(s => {
      csv.push([s.name, s.email, s.program, s.course, s.phone, s.status || 'Active'].join(','));
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
}

// Add dark mode toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle && darkModeToggle.addEventListener('change', function() {
  document.body.classList.toggle('dark-mode', this.checked);
});

// Add logout button
const logoutBtn = document.getElementById('logout-btn');
logoutBtn && logoutBtn.addEventListener('click', function() {
  showNotification('Logged out (demo only)', true);
});

// Update admin name in sidebar and settings
const adminNameInput = document.getElementById('admin-name-input');
const adminNameDisplay = document.getElementById('admin-name');
if (adminNameInput && adminNameDisplay) {
  adminNameInput.addEventListener('input', function() {
    adminNameDisplay.textContent = this.value;
  });
}

// Modal close on background click
Array.from(document.querySelectorAll('.modal')).forEach(modal => {
  modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
});

// Demo data for students, courses, and attendance
(function seedDemoData() {
  if (!localStorage.getItem('niit_students')) {
    const courses = [
      { name: 'Computer Science', description: 'CS Fundamentals', duration: '4 years' },
      { name: 'Business Admin', description: 'Business Management', duration: '3 years' },
      { name: 'Data Science', description: 'Data Analysis & AI', duration: '2 years' },
      { name: 'Cyber Security', description: 'Security & Networks', duration: '2 years' },
      { name: 'Digital Marketing', description: 'Marketing in Digital Age', duration: '1 year' }
    ];
    const students = [
      { name: 'Alice Johnson', email: 'alice.johnson@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345601', status: 'Active' },
      { name: 'Bob Smith', email: 'bob.smith@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345602', status: 'Active' },
      { name: 'Carol White', email: 'carol.white@niit.edu', program: 'BBA', course: 'Business Admin', phone: '08012345603', status: 'Active' },
      { name: 'David Brown', email: 'david.brown@niit.edu', program: 'BSc', course: 'Data Science', phone: '08012345604', status: 'Active' },
      { name: 'Eve Black', email: 'eve.black@niit.edu', program: 'BSc', course: 'Cyber Security', phone: '08012345605', status: 'Active' },
      { name: 'Frank Green', email: 'frank.green@niit.edu', program: 'BBA', course: 'Business Admin', phone: '08012345606', status: 'Active' },
      { name: 'Grace Lee', email: 'grace.lee@niit.edu', program: 'BSc', course: 'Data Science', phone: '08012345607', status: 'Active' },
      { name: 'Henry Adams', email: 'henry.adams@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345608', status: 'Active' },
      { name: 'Ivy Clark', email: 'ivy.clark@niit.edu', program: 'BBA', course: 'Digital Marketing', phone: '08012345609', status: 'Active' },
      { name: 'Jack Miller', email: 'jack.miller@niit.edu', program: 'BSc', course: 'Cyber Security', phone: '08012345610', status: 'Active' },
      { name: 'Kathy Wilson', email: 'kathy.wilson@niit.edu', program: 'BSc', course: 'Data Science', phone: '08012345611', status: 'Active' },
      { name: 'Leo Turner', email: 'leo.turner@niit.edu', program: 'BBA', course: 'Business Admin', phone: '08012345612', status: 'Active' },
      { name: 'Mona Scott', email: 'mona.scott@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345613', status: 'Active' },
      { name: 'Nina Evans', email: 'nina.evans@niit.edu', program: 'BSc', course: 'Digital Marketing', phone: '08012345614', status: 'Active' },
      { name: 'Oscar King', email: 'oscar.king@niit.edu', program: 'BSc', course: 'Cyber Security', phone: '08012345615', status: 'Active' },
      { name: 'Paul Young', email: 'paul.young@niit.edu', program: 'BBA', course: 'Business Admin', phone: '08012345616', status: 'Active' },
      { name: 'Queen Harris', email: 'queen.harris@niit.edu', program: 'BSc', course: 'Data Science', phone: '08012345617', status: 'Active' },
      { name: 'Ray Allen', email: 'ray.allen@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345618', status: 'Active' },
      { name: 'Sara Baker', email: 'sara.baker@niit.edu', program: 'BSc', course: 'Digital Marketing', phone: '08012345619', status: 'Active' },
      { name: 'Tom Carter', email: 'tom.carter@niit.edu', program: 'BSc', course: 'Cyber Security', phone: '08012345620', status: 'Active' },
      { name: 'Uma Davis', email: 'uma.davis@niit.edu', program: 'BBA', course: 'Business Admin', phone: '08012345621', status: 'Active' },
      { name: 'Victor Edwards', email: 'victor.edwards@niit.edu', program: 'BSc', course: 'Data Science', phone: '08012345622', status: 'Active' },
      { name: 'Wendy Foster', email: 'wendy.foster@niit.edu', program: 'BSc', course: 'Computer Science', phone: '08012345623', status: 'Active' },
      { name: 'Xander Grant', email: 'xander.grant@niit.edu', program: 'BSc', course: 'Cyber Security', phone: '08012345624', status: 'Active' },
      { name: 'Yara Hill', email: 'yara.hill@niit.edu', program: 'BSc', course: 'Digital Marketing', phone: '08012345625', status: 'Active' }
    ];
    const attendance = [
      { date: '2025-05-12', present: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], remarks: { '2': 'Late', '5': 'Sick' } },
      { date: '2025-05-13', present: [0,2,3,4,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24], remarks: { '1': 'Absent', '5': 'Sick' } },
      { date: '2025-05-14', present: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24], remarks: {} }
    ];
    localStorage.setItem('niit_courses', JSON.stringify(courses));
    localStorage.setItem('niit_students', JSON.stringify(students));
    localStorage.setItem('niit_attendance', JSON.stringify(attendance));
  }
})();

// Initial load
updateDashboard();
renderStudents();
renderCourses();
document.getElementById('attendance-date').value = new Date().toISOString().slice(0,10);
renderAttendance();
renderQuizzes();
renderReports();
