// HELLO, if you are reading this in the inspect mode.
// welcome.js configuration
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


function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function calculateDaysRemaining(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let color;
    if (diffDays <= 15) {
        color = '#FF2D55';
    } else if (diffDays <= 30) {
        color = '#FFD60A';
    } else {
        color = '#2ECC71';
    }

    return {
        days: diffDays,
        color: color
    };
}


function updateDeadlines() {
    const deadlineElements = {
        resume: document.getElementById('resumeDays'),
        aptitude: document.getElementById('aptitudeDays'),
        mock: document.getElementById('mockDays'),
        dp900: document.getElementById('dp900Days'),
        dp203: document.getElementById('dp203Days'),
        finalProject: document.getElementById('finalProjectDays'),
        aiCert: document.getElementById('aiCertDays'),
        problemSolving: document.getElementById('problemSolvingDays')
    };

    for (const [key, element] of Object.entries(deadlineElements)) {
        if (element) {
            const { days, color } = calculateDaysRemaining(DEADLINES[key]);
            element.textContent = `${days} days`;
            element.style.color = color;
            element.style.fontWeight = '600';
        }
    }
}


function updateFutureGlow(rank) {
    const futureGlow = document.getElementById('futureGlow');
    console.log('Updating future glow for rank:', rank);


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


function calculateProgress(earned, max) {
    if (!earned || isNaN(earned)) return 0;
    return Math.min(100, (earned / max) * 100);
}


function updatePointsDistribution(userData) {

    const maxPoints = {
        resume: 1,
        aptitude: 1,
        mock: 2,
        dp900: 1,
        dp203: 3,
        finalProject: 3,
        aiCert: 4,
        problemSolving: 3
    };

    const totalMaxPoints = Object.values(maxPoints).reduce((a, b) => a + b, 0); // Total is 25


    // Resume
    document.getElementById('resumePoints').textContent = formatNumber(userData.resumePoints || 0);
    document.getElementById('resumeProgress').style.width = `${calculateProgress(userData.resumePoints, maxPoints.resume)}%`;

    // Aptitude
    document.getElementById('aptitudePoints').textContent = formatNumber(userData.aptitudePoints || 0);
    document.getElementById('aptitudeProgress').style.width = `${calculateProgress(userData.aptitudePoints, maxPoints.aptitude)}%`;

    // Mock
    document.getElementById('mockPoints').textContent = formatNumber(userData.mockPoints || 0);
    document.getElementById('mockProgress').style.width = `${calculateProgress(userData.mockPoints, maxPoints.mock)}%`;

    // DP900
    document.getElementById('dp900Points').textContent = formatNumber(userData.dp900Points || 0);
    document.getElementById('dp900Progress').style.width = `${calculateProgress(userData.dp900Points, maxPoints.dp900)}%`;

    // DP203
    document.getElementById('dp203Points').textContent = formatNumber(userData.dp203Points || 0);
    document.getElementById('dp203Progress').style.width = `${calculateProgress(userData.dp203Points, maxPoints.dp203)}%`;

    // Final Project
    document.getElementById('finalProjectPoints').textContent = formatNumber(userData.finalProjectPoints || 0);
    document.getElementById('finalProjectProgress').style.width = `${calculateProgress(userData.finalProjectPoints, maxPoints.finalProject)}%`;

    // AI Cert
    document.getElementById('aiCertPoints').textContent = formatNumber(userData.aiCertPoints || 0);
    document.getElementById('aiCertProgress').style.width = `${calculateProgress(userData.aiCertPoints, maxPoints.aiCert)}%`;

    // Problem Solving
    document.getElementById('problemSolvingPoints').textContent = formatNumber(userData.problemSolvingPoints || 0);
    document.getElementById('problemSolvingProgress').style.width = `${calculateProgress(userData.problemSolvingPoints, maxPoints.problemSolving)}%`;


    const total = (userData.resumePoints || 0) +
                 (userData.aptitudePoints || 0) +
                 (userData.mockPoints || 0) +
                 (userData.dp900Points || 0) +
                 (userData.dp203Points || 0) +
                 (userData.finalProjectPoints || 0) +
                 (userData.aiCertPoints || 0) +
                 (userData.problemSolvingPoints || 0);


    document.getElementById('userPoints').textContent = formatNumber(total);


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
}


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


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/';
}