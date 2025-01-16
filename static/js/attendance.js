particlesJS('particles-js', {
  "particles": {
      "number": {
          "value": 80,
          "density": {
              "enable": true,
              "value_area": 800
          }
      },
      "color": {
          "value": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96E6B3", "#FFD93D"]
      },
      "shape": {
          "type": ["circle", "triangle"],
          "stroke": {
              "width": 0,
              "color": "#000000"
          }
      },
      "opacity": {
          "value": 0.6,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 1,
              "opacity_min": 0.3,
              "sync": false
          }
      },
      "size": {
          "value": 4,
          "random": true,
          "anim": {
              "enable": true,
              "speed": 2,
              "size_min": 0.1,
              "sync": false
          }
      },
      "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#4ECDC4",
          "opacity": 0.4,
          "width": 1
      },
      "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "bounce",
          "bounce": true,
          "attract": {
              "enable": true,
              "rotateX": 600,
              "rotateY": 1200
          }
      }
  },
  "interactivity": {
      "detect_on": "canvas",
      "events": {
          "onhover": {
              "enable": true,
              "mode": "bubble"
          },
          "onclick": {
              "enable": true,
              "mode": "push"
          },
          "resize": true
      },
      "modes": {
          "grab": {
              "distance": 200,
              "line_linked": {
                  "opacity": 0.8
              }
          },
          "bubble": {
              "distance": 200,
              "size": 6,
              "duration": 2,
              "opacity": 0.8,
              "speed": 3
          },
          "repulse": {
              "distance": 200,
              "duration": 0.4
          },
          "push": {
              "particles_nb": 4
          },
          "remove": {
              "particles_nb": 2
          }
      }
  },
  "retina_detect": true
});
//default date to today
document.getElementById('attendanceDate').valueAsDate = new Date();

// checking if att alr exist or no
async function checkExistingAttendance() {
  const date = document.getElementById('attendanceDate').value;
  const session = document.getElementById('sessionSelect').value;

  if (!date || !session) return;

  try {
      const response = await fetch(`/api/check-attendance/${date}/${session}`);
      const data = await response.json();

      if (data.success && data.exists) {
          showNotification('Attendance has already been marked for this session', 'error');
          document.getElementById('submitAttendance').disabled = true;

          // upsert if att alr exist in bekend
          if (data.attendance && data.attendance.length > 0) {
              data.attendance.forEach(record => {
                  const status = session === '1' ? record.morning_session : record.afternoon_session;
                  if (status) {
                      const radio = document.querySelector(`input[id="${status}_${record.student_email}"]`);
                      if (radio) radio.checked = true;
                  }
              });
              // physically disable all radio buttons
              document.querySelectorAll('input[type="radio"]').forEach(radio => {
                  radio.disabled = true;
              });
          }
      } else {
          document.getElementById('submitAttendance').disabled = false;
          // Enable all radio buttons
          document.querySelectorAll('input[type="radio"]').forEach(radio => {
              radio.disabled = false;
              radio.checked = false;
          });
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

//event listeners for date and session changes - they always look creepy
document.getElementById('attendanceDate').addEventListener('change', checkExistingAttendance);
document.getElementById('sessionSelect').addEventListener('change', checkExistingAttendance);

//fetch students
async function fetchStudents() {
  try {
      const response = await fetch('/api/get-students');
      const data = await response.json();

      if (data.success) {
          const studentList = document.getElementById('studentList');
          studentList.innerHTML = data.students.map(student => `
              <div class="student-item" data-email="${student.email}" data-name="${student.name}">
                  <div class="student-name">${student.name || student.email}</div>
                  <div class="attendance-options">
                      <div class="radio-group">
                          <input type="radio"
                                 id="present_${student.email}"
                                 name="attendance_${student.email}"
                                 value="present"
                                 required>
                          <label for="present_${student.email}">Present</label>
                      </div>
                      <div class="radio-group">
                          <input type="radio"
                                 id="absent_${student.email}"
                                 name="attendance_${student.email}"
                                 value="absent"
                                 required>
                          <label for="absent_${student.email}">Absent</label>
                      </div>
                  </div>
              </div>
          `).join('');
      } else {
          showNotification('Failed to fetch students', 'error');
      }
  } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to fetch students', 'error');
  }
}

//validate form before submission and throw poppus idf any errors
function validateForm() {
  const date = document.getElementById('attendanceDate').value;
  const session = document.getElementById('sessionSelect').value;
  const studentItems = document.querySelectorAll('.student-item');

  if (!date || !session) {
      showNotification('Please select date and session', 'error');
      return false;
  }

  let allSelected = true;
  studentItems.forEach(item => {
      const email = item.dataset.email;
      const selected = document.querySelector(`input[name="attendance_${email}"]:checked`);
      if (!selected) {
          allSelected = false;
      }
  });

  if (!allSelected) {
      showNotification('Please mark attendance for all students', 'error');
      return false;
  }

  return true;
}

//notification function
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  const styles = document.createElement('style');
  styles.textContent = `
      .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 25px;
          border-radius: 10px;
          color: white;
          font-size: 1em;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transform: translateX(120%);
          transition: transform 0.3s ease;
          z-index: 1000;
          backdrop-filter: blur(10px);
      }

      .notification.show {
          transform: translateX(0);
      }

      .notification.success {
          background: linear-gradient(45deg, #2ecc71, #27ae60);
      }

      .notification.error {
          background: linear-gradient(45deg, #e74c3c, #c0392b);
      }
  `;

  document.head.appendChild(styles);
  document.body.appendChild(notification);

  //show notification
  setTimeout(() => {
      notification.classList.add('show');
      setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => notification.remove(), 300);
      }, 3000);
  }, 100);
}

//submit attendance finally
async function submitAttendance() {
  if (!validateForm()) return;

  const submitBtn = document.getElementById('submitAttendance');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  const date = document.getElementById('attendanceDate').value;
  const session = document.getElementById('sessionSelect').value;
  const studentItems = document.querySelectorAll('.student-item');

  const attendanceData = {
      date: date,
      session: parseInt(session),
      attendance: []
  };

  studentItems.forEach(item => {
      const email = item.dataset.email;
      const name = item.dataset.name;
      const status = document.querySelector(`input[name="attendance_${email}"]:checked`).value;
      attendanceData.attendance.push({
          student_email: email,
          student_name: name,
          status: status
      });
  });

  try {
      const response = await fetch('/api/submit-attendance', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(attendanceData)
      });

      const data = await response.json();

      if (data.success) {
          showNotification('Attendance submitted successfully', 'success');
          //reset the form after successful submission
          setTimeout(() => {
              document.getElementById('sessionSelect').value = '';
              document.querySelectorAll('input[type="radio"]').forEach(radio => {
                  radio.checked = false;
              });
              checkExistingAttendance();
          }, 1500);
      } else {
          showNotification(data.detail || 'Failed to submit attendance', 'error');
      }
  } catch (error) {
      console.error('Error:', error);
      showNotification('Failed to submit attendance', 'error');
  } finally {
      submitBtn.classList.remove('loading');
  }
}

// Init the opage
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
  checkExistingAttendance();

  document.getElementById('submitAttendance').addEventListener('click', (e) => {
      e.preventDefault();
      submitAttendance();
  });
});