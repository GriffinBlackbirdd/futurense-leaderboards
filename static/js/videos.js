// HELLO, if you are reading this in the inspect mode.
function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;

    if (widthThreshold || heightThreshold) {
      document.body.innerHTML = `
          <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #141e30, #243b55);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
          ">
              <div style="
                  padding: 20px 40px;
                  background: rgba(255, 0, 0, 0.1);
                  border: 2px solid red;
                  border-radius: 20px;
                  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
                  animation: pulse 2s infinite;
              ">
                  <h1 style="
                      font-size: 3rem;
                      font-weight: bold;
                      margin: 0;
                      text-shadow: 2px 2px 5px black;
                  ">
                      Dev Tools Are Not Allowed
                  </h1>
                  <p style="
                      margin-top: 10px;
                      font-size: 1.2rem;
                      color: #ff4444;
                      text-shadow: 1px 1px 2px black;
                  ">
                      You will be redirected to the login page now...
                  </p>
              </div>
          </div>
      `;

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  }
  //Disable right-click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    return false;
  });

  //Detect keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Disable F12
    if (e.key === "F12") {
      document.body.innerHTML = `
          <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #141e30, #243b55);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
          ">
              <div style="
                  padding: 20px 40px;
                  background: rgba(255, 0, 0, 0.1);
                  border: 2px solid red;
                  border-radius: 20px;
                  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
                  animation: pulse 2s infinite;
              ">
                  <h1 style="
                      font-size: 3rem;
                      font-weight: bold;
                      margin: 0;
                      text-shadow: 2px 2px 5px black;
                  ">
                      Dev Tools Are Not Allowed
                  </h1>
                  <p style="
                      margin-top: 10px;
                      font-size: 1.2rem;
                      color: #ff4444;
                      text-shadow: 1px 1px 2px black;
                  ">
                      You will be redirected to the login page now...
                  </p>
              </div>
          </div>
      `;

      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
      document.body.innerHTML = `
          <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #141e30, #243b55);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
          ">
              <div style="
                  padding: 20px 40px;
                  background: rgba(255, 0, 0, 0.1);
                  border: 2px solid red;
                  border-radius: 20px;
                  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
                  animation: pulse 2s infinite;
              ">
                  <h1 style="
                      font-size: 3rem;
                      font-weight: bold;
                      margin: 0;
                      text-shadow: 2px 2px 5px black;
                  ">
                      Dev Tools Are Not Allowed
                  </h1>
                  <p style="
                      margin-top: 10px;
                      font-size: 1.2rem;
                      color: #ff4444;
                      text-shadow: 1px 1px 2px black;
                  ">
                      You will be redirected to the login page now...
                  </p>
              </div>
          </div>
      `;

      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "J") {
      document.body.innerHTML = `
          <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #141e30, #243b55);
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 20px;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
          ">
              <div style="
                  padding: 20px 40px;
                  background: rgba(255, 0, 0, 0.1);
                  border: 2px solid red;
                  border-radius: 20px;
                  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
                  animation: pulse 2s infinite;
              ">
                  <h1 style="
                      font-size: 3rem;
                      font-weight: bold;
                      margin: 0;
                      text-shadow: 2px 2px 5px black;
                  ">
                      Dev Tools Are Not Allowed
                  </h1>
                  <p style="
                      margin-top: 10px;
                      font-size: 1.2rem;
                      color: #ff4444;
                      text-shadow: 1px 1px 2px black;
                  ">
                      You will be redirected to the login page now...
                  </p>
              </div>
          </div>
      `;
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+U / Cmd+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === "u") {
      e.preventDefault();
      return false;
    }
  });

  // Clear console messages
  setInterval(function () {
    console.clear();
  }, 1000);

  // Debug detection
  function detectDebugger() {
    let debugging = false;
    const startTime = new Date();
    debugger;
    const endTime = new Date();

    if (endTime - startTime > 100) {
      debugging = true;
      window.location.href = "/"; //red to home
    }

    return debugging;
  }

  // Monitor element changes
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.getAttribute("data-secure") === "true") {
        window.location.href = "/"; // Red to home if the president is modigfied (secure element)
      }
    });
  });

  // Start monitoring for dev tools
  window.addEventListener("resize", detectDevTools);
  setInterval(detectDevTools, 1000);
  setInterval(detectDebugger, 1000);

  // Add protection to specific elements
  document.querySelectorAll(".secure-content").forEach((element) => {
    element.setAttribute("data-secure", "true");
    observer.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
    });
  });

  // Additional protection for the PDF viewer
  document.getElementById("pdfCanvas")?.addEventListener("copy", function (e) {
    e.preventDefault();
    return false;
  });

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


class VideoManager {
    constructor() {
        this.videoData = null;
        this.player = null;
        this.currentFilter = 'all';
        this.searchTerm = '';


        this.videoGrid = document.getElementById('videoGrid');
        this.filterContainer = document.getElementById('filterContainer');
        this.searchInput = document.getElementById('searchInput');
        this.modal = document.getElementById('videoModal');
        this.modalTitle = document.getElementById('modalTitle');

        this.init();
    }

    async init() {
        try {

            await this.fetchVideoData();


            this.setupFilters();
            this.renderVideos();
            this.setupEventListeners();
            this.initializeYouTubePlayer();

        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to load video content');
        }
    }

    async fetchVideoData() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            const response = await fetch('/api/video-content', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch video data');
            }

            const data = await response.json();
            if (data.success) {
                this.videoData = data.content;
            } else {
                throw new Error(data.detail || 'Failed to load video data');
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
            throw error;
        }
    }

    setupFilters() {

        const categories = [...new Set(Object.keys(this.videoData))];

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category;
            button.textContent = this.formatCategoryName(category);
            this.filterContainer.appendChild(button);
        });
    }

    formatCategoryName(category) {
        return category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    renderVideos(filter = 'all', searchTerm = '') {
        this.videoGrid.innerHTML = '';

        Object.entries(this.videoData).forEach(([category, videos]) => {
            if (filter === 'all' || filter === category) {
                const filteredVideos = videos.filter(video =>
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    video.description.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredVideos.length > 0) {
                    const section = this.createVideoSection(category, filteredVideos);
                    this.videoGrid.appendChild(section);
                }
            }
        });
    }

    createVideoSection(category, videos) {
        const section = document.createElement('div');
        section.className = 'video-section';
        section.dataset.category = category;

        const title = document.createElement('h2');
        title.className = 'section-title';
        title.innerHTML = `
            <i class="${this.getCategoryIcon(category)}"></i>
            ${this.formatCategoryName(category)}
        `;

        const videoCards = document.createElement('div');
        videoCards.className = 'video-cards';

        videos.forEach(video => {
            videoCards.appendChild(this.createVideoCard(video));
        });

        section.appendChild(title);
        section.appendChild(videoCards);
        return section;
    }

    getCategoryIcon(category) {
        const icons = {
            python: 'fab fa-python',
            data_engineering: 'fas fa-database',
            machine_learning: 'fas fa-robot',
            data_science: 'fas fa-chart-line',
            default: 'fas fa-video'
        };
        return icons[category] || icons.default;
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoId = video.id;

        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg"
                     alt="${video.title}"
                     onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
                <span class="duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <button class="watch-btn" onclick="videoManager.playVideo('${video.id}', '${video.title.replace(/'/g, "\\'")}')">
                    <i class="fab fa-youtube"></i>
                    Watch Now
                </button>
            </div>
        `;

        return card;
    }

    setupEventListeners() {

        this.searchInput.addEventListener('input', this.debounce(() => {
            this.searchTerm = this.searchInput.value.trim();
            this.renderVideos(this.currentFilter, this.searchTerm);
        }, 300));


        this.filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.filterContainer.querySelectorAll('.filter-btn')
                    .forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.renderVideos(this.currentFilter, this.searchTerm);
            }
        });


        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeVideo();
        });


        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeVideo();
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.closeVideo();
            }
        });
    }

    initializeYouTubePlayer() {
        if (window.YT) {
            this.createYouTubePlayer();
        } else {
            window.onYouTubeIframeAPIReady = () => {
                this.createYouTubePlayer();
            };
        }
    }

    createYouTubePlayer() {
        this.player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            playerVars: {
                'autoplay': 1,
                'modestbranding': 1,
                'rel': 0
            }
        });
    }

    playVideo(videoId, title) {
        this.modalTitle.textContent = title;
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (this.player && this.player.loadVideoById) {
            this.player.loadVideoById(videoId);
        }
    }

    closeVideo() {
        if (this.player && this.player.stopVideo) {
            this.player.stopVideo();
        }
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.videoGrid.appendChild(errorDiv);
    }
}

let videoManager;
document.addEventListener('DOMContentLoaded', () => {
    videoManager = new VideoManager();
});