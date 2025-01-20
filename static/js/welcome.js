// Particle.js configuration
particlesJS('particles-js', {
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
  });

  // Constants
  const DEADLINES = {
    resume: '2025-02-26',
    aptitude: '2025-02-26',
    mock: '2025-03-05',
    dp900: '2024-12-31',
    dp203: '2025-01-07',
    finalProject: '2025-03-05',
    aiCert: '2025-03-31',
    problemSolving: '2025-03-01'
  };

  const BADGES = {
    BRONZE: {
        name: 'Bronze',
        icon: '🏆',
        points: 5,
        message: 'You\'ve earned the Bronze badge! Keep going!'
    },
    SILVER: {
        name: 'Silver',
        icon: '💫',
        points: 10,
        message: 'Silver badge unlocked! Excellence awaits!'
    },
    GOLD: {
        name: 'Gold',
        icon: '⭐',
        points: 15,
        message: 'Congratulations! You\'ve achieved the Gold badge!'
    }
  };

  const MAX_POINTS = {
    resume: 1,
    aptitude: 1,
    mock: 2,
    dp900: 1,
    dp203: 3,
    finalProject: 3,
    aiCert: 4,
    problemSolving: 3
  };

// Add these styles to the head of the document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
  // Utility Functions
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatScore(score, element) {
    const formattedScore = formatNumber(score);
    if (score < 0) {
        element.classList.add('negative-score');
    } else {
        element.classList.remove('negative-score');
    }
    return formattedScore;
  }

  function calculateProgress(earned, max) {
    if (!earned || isNaN(earned) || earned <= 0) return 0;
    return Math.min(100, (earned / max) * 100);
  }

  function calculateDaysRemaining(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let color;
    if (diffDays <= 15) {
        color = '#FF2D55'; // Red for urgent
    } else if (diffDays <= 30) {
        color = '#FFD60A'; // Yellow for warning
    } else {
        color = '#2ECC71'; // Green for safe
    }

    return {
        days: diffDays,
        color: color
    };
  }

  // Badge Functions
  function checkBadges(points) {
    if (points <= 0) return;

    const earnedBadges = [];
    const previousPoints = parseInt(localStorage.getItem('previousPoints')) || 0;

    Object.values(BADGES).forEach(badge => {
        if (points >= badge.points) {
            earnedBadges.push(badge);
            if (previousPoints < badge.points && points >= badge.points) {
                showBadgeNotification(badge);
            }
        }
    });

    localStorage.setItem('previousPoints', points);
    updateBadgesDisplay(earnedBadges);
    updateBadgeMarkers(points);
  }

  function showBadgeNotification(badge) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.badge-notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification with inline styles
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.5s ease-out;
        display: flex;
        align-items: center;
        gap: 15px;
        backdrop-filter: blur(10px);
    `;

    notification.innerHTML = `
        <div style="font-size: 2em; min-width: 40px; text-align: center;">
            ${badge.icon}
        </div>
        <div>
            <h4 style="margin: 0; font-size: 16px; font-weight: 600; margin-bottom: 5px;">
                New Badge Unlocked!
            </h4>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                ${badge.message}
            </p>
        </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}


  function updateBadgeMarkers(points) {
    document.querySelectorAll('.badge-marker').forEach(marker => {
        const requiredPoints = parseInt(marker.dataset.points);
        const badgeIcon = marker.querySelector('.badge-icon');

        if (points >= requiredPoints) {
            badgeIcon.classList.add('earned');
        } else {
            badgeIcon.classList.remove('earned');
        }
    });
  }

  function updateBadgesDisplay(earnedBadges) {
    const showcase = document.getElementById('earnedBadges');
    showcase.innerHTML = earnedBadges.map(badge => `
        <div class="badge-item">
            <div class="badge-icon">${badge.icon}</div>
            <span class="badge-name">${badge.name}</span>
        </div>
    `).join('');
  }

  // Update Functions
  function updateFutureGlow(rank) {
    const futureGlow = document.getElementById('futureGlow');

    futureGlow.className = 'future-indicator';

    const rankNum = parseInt(rank);
    if (rankNum === 1) {
        futureGlow.classList.add('future-bright-100');
    } else if (rankNum === 2) {
        futureGlow.classList.add('future-bright-80');
    } else if (rankNum === 3) {
        futureGlow.classList.add('future-bright-60');
    } else if (rankNum === 4) {
        futureGlow.classList.add('future-dim-40');
    } else {
        futureGlow.classList.add('future-dim-20');
    }
  }

  function updateDeadlines() {
    Object.entries(DEADLINES).forEach(([key, deadline]) => {
        const element = document.getElementById(`${key}Days`);
        if (element) {
            const { days, color } = calculateDaysRemaining(deadline);
            element.textContent = `${days} days`;
            element.style.color = color;
        }
    });
  }

  function updatePointsDistribution(userData) {
    // Update individual points and progress bars
    Object.keys(MAX_POINTS).forEach(key => {
        const pointsElement = document.getElementById(`${key}Points`);
        const progressElement = document.getElementById(`${key}Progress`);
        if (pointsElement && progressElement) {
            const points = userData[`${key}Points`] || 0;
            pointsElement.textContent = formatScore(points, pointsElement);
            progressElement.style.width = `${calculateProgress(points, MAX_POINTS[key])}%`;
        }
    });

    // Calculate total points
    const total = Math.max(0, Object.keys(MAX_POINTS).reduce((sum, key) => {
        return sum + (userData[`${key}Points`] || 0);
    }, 0));

    // Update total displays
    document.getElementById('userPoints').textContent = formatNumber(total);
    document.getElementById('totalPointsDetail').textContent = formatNumber(total);

    // Update progress bar
    const progressPercentage = Math.min(100, (total / 15) * 100);
    const progressBar = document.getElementById('totalProgress');
    const progressText = document.getElementById('progressText');

    progressBar.classList.remove('progress-low', 'progress-medium', 'progress-high');
    progressText.classList.remove('low', 'medium', 'high');

    if (total <= 5) {
        progressBar.classList.add('progress-low');
        progressText.classList.add('low');
    } else if (total <= 10) {
        progressBar.classList.add('progress-medium');
        progressText.classList.add('medium');
    } else {
        progressBar.classList.add('progress-high');
        progressText.classList.add('high');
    }

    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${total}/15 points`;

    checkBadges(total);
  }

  // Main Initialization
  document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        document.getElementById('welcomeName').textContent = `Welcome back, ${userData.name}!`;
        document.querySelector('.user-email').textContent = userData.email;
        document.getElementById('userCategory').textContent = userData.category;
        document.getElementById('userRank').textContent = `#${userData.rank}`;
        document.getElementById('userPoints').textContent = formatNumber(userData.points);

        updatePointsDistribution(userData);
        updateFutureGlow(userData.rank);
        updateDeadlines();
    } else {
        window.location.href = '/';
    }
  });

  // Logout Function
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/';
  }

  // Handle dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const content = dropdown.querySelector('.dropdown-content');

        // Toggle dropdown on click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Close all other dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.querySelector('.dropdown-content').classList.remove('show');
                }
            });

            content.classList.toggle('show');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropdown-trigger')) {
            dropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.dropdown-content');
                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                }
            });
        }
    });
});