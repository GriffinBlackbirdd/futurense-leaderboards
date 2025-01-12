// Initialize particles.js
particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 60,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle"
      },
      "opacity": {
        "value": 0.3,
        "random": false,
        "anim": {
          "enable": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 4,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.6
          }
        },
        "push": {
          "particles_nb": 3
        }
      }
    },
    "retina_detect": true
  }
);

// Helper Functions
function formatDate(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Initialize date display
document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    document.getElementById('currentDate').textContent = formatDate(currentDate);

    // Load recent activity
    loadRecentActivity();

    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        window.location.href = '/';
    }
});

document.getElementById('activityForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Get the current date in local timezone
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60 * 1000));

  const formData = {
      date: localDate.toISOString(),
      userid: JSON.parse(localStorage.getItem('userData')).email,
      dsa_questions: parseInt(document.getElementById('dsaQuestions').value),
      dsa_platform: document.getElementById('dsaPlatform').value,
      sql_questions: parseInt(document.getElementById('sqlQuestions').value),
      sql_platform: document.getElementById('sqlPlatform').value,
      learning_hours: parseFloat(document.getElementById('learningHours').value),
      learning_topic: document.getElementById('learningTopic').value,
      project_hours: parseFloat(document.getElementById('projectHours').value),
      project_description: document.getElementById('projectDescription').value
  };

  try {
      const response = await fetch('/api/track-activity', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
          showNotification('Activity logged successfully!');
          this.reset();
          loadRecentActivity();
      } else {
          showNotification(data.detail || 'Failed to log activity', 'error');
      }
  } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred while logging activity', 'error');
  }
});

// Load recent activity
async function loadRecentActivity() {
    try {
        const response = await fetch('/api/recent-activity', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (data.success) {
            const timeline = document.getElementById('activityTimeline');
            timeline.innerHTML = data.activities
                .map(activity => `
                    <div class="timeline-entry">
                        <div class="timeline-date">${formatDate(new Date(activity.date))}</div>
                        <div class="timeline-details">
                            <p>🎯 DSA: ${activity.dsaQuestions} problems on ${activity.dsaPlatform}</p>
                            <p>💻 SQL: ${activity.sqlQuestions} queries on ${activity.sqlPlatform}</p>
                            <p>📚 Learned: ${activity.learningTopic} (${activity.learningHours}hrs)</p>
                            <p>🔨 Project: ${activity.projectDescription} (${activity.projectHours}hrs)</p>
                        </div>
                    </div>
                `)
                .join('');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to load recent activity', 'error');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/';
}