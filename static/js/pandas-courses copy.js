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

("use strict");

const SQLCourses = (function () {
  // Private variables
  let _pdfDoc = null;
  let _pageNum = 1;
  let _pageRendering = false;
  let _pageNumPending = null;
  let _scale = 1.5;
  let _currentSessionId = null;

  const _elements = {
    canvas: document.getElementById("pdfCanvas"),
    modal: document.getElementById("pdfModal"),
    modalTitle: document.getElementById("modalTitle"),
    loadingEl: document.querySelector(".loading"),
    currentPage: document.getElementById("currentPage"),
    totalPages: document.getElementById("totalPages"),
    zoomLevel: document.getElementById("zoomLevel"),
    downloadBtn: document.getElementById("downloadResourcesBtn"),
    sessionsGrid: document.querySelector(".sessions-grid"),
  };

  const _ctx = _elements.canvas?.getContext("2d");

  async function _fetchSessions() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        window.location.href = "/login";
        return [];
      }

      console.log("Fetching sessions...");
      const response = await fetch("/api/pandas-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Response not OK:", response.status);
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (!data.success || !data.sessions) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format");
      }

      return data.sessions;
    } catch (error) {
      console.error("Error in _fetchSessions:", error);
      return [];
    }
  }

  async function _renderPage(num) {
    if (!_pdfDoc) return;

    _pageRendering = true;
    _elements.loadingEl.style.display = "block";

    try {
      const page = await _pdfDoc.getPage(num);

      const viewport = page.getViewport({ scale: 1.0 });
      const container = document.querySelector(".pdf-container");
      const maxWidth = container.clientWidth - 80;
      const desiredScale = maxWidth / viewport.width;
      const finalViewport = page.getViewport({ scale: desiredScale * _scale });

      _elements.canvas.height = finalViewport.height;
      _elements.canvas.width = finalViewport.width;

      const renderContext = {
        canvasContext: _ctx,
        viewport: finalViewport,
        enableWebGL: true,
      };

      await page.render(renderContext).promise;

      _elements.currentPage.textContent = num;
      _elements.totalPages.textContent = _pdfDoc.numPages;

      document.getElementById("prevPage").disabled = num <= 1;
      document.getElementById("firstPage").disabled = num <= 1;
      document.getElementById("nextPage").disabled = num >= _pdfDoc.numPages;
      document.getElementById("lastPage").disabled = num >= _pdfDoc.numPages;

      _elements.loadingEl.style.display = "none";
      _pageRendering = false;

      if (_pageNumPending !== null) {
        _renderPage(_pageNumPending);
        _pageNumPending = null;
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      _elements.loadingEl.textContent = "Error rendering page";
    }
  }

  function _queueRenderPage(num) {
    if (_pageRendering) {
      _pageNumPending = num;
    } else {
      _renderPage(num);
    }
  }

  async function _downloadResources(sessionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      _elements.downloadBtn.disabled = true;
      _elements.downloadBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Downloading...';

      const response = await fetch(`/api/resources/pandas/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download resources");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Pandas_Session_${sessionId}_Resources.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resources:", error);
      alert("Failed to download resources. Please try again.");
    } finally {
      _elements.downloadBtn.disabled = false;
      _elements.downloadBtn.innerHTML =
        '<i class="fas fa-download"></i> Download Resources';
    }
  }

  async function _loadPDF(pdfUrl, title, sessionId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view PDF content");
        window.location.href = "/login";
        return;
      }

      _elements.modal.style.display = "block";
      _elements.modalTitle.textContent = title;
      document.body.style.overflow = "hidden";
      _elements.loadingEl.style.display = "block";
      _elements.loadingEl.textContent = "Loading PDF...";
      _currentSessionId = sessionId;

      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        httpHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadingTask.onProgress = function (progress) {
        if (progress.total) {
          const percent = (progress.loaded / progress.total) * 100;
          _elements.loadingEl.textContent = `Loading PDF... ${Math.round(
            percent
          )}%`;
        }
      };

      _pdfDoc = await loadingTask.promise;
      _pageNum = 1;
      _scale = 1.5;
      _updateZoomLevel();
      await _renderPage(_pageNum);
    } catch (error) {
      console.error("Error loading PDF:", error);
      _elements.loadingEl.textContent = "Error loading PDF";

      if (error.message.includes("401")) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else {
        alert("Error loading PDF. Please try again.");
      }
    }
  }

  function _updateZoomLevel() {
    if (_elements.zoomLevel) {
      _elements.zoomLevel.textContent = `${Math.round(_scale * 100)}%`;
    }
  }

  async function _createSessionCards() {
    console.log("Creating session cards...");
    if (!_elements.sessionsGrid) {
      console.error("Sessions grid element not found");
      return;
    }

    try {
      _elements.sessionsGrid.innerHTML =
        '<div class="loading">Loading courses...</div>';

      const sessions = await _fetchSessions();
      console.log("Sessions received:", sessions);

      if (!sessions || sessions.length === 0) {
        console.error("No sessions received");
        _elements.sessionsGrid.innerHTML =
          '<div class="error">No courses available. Please try again later.</div>';
        return;
      }

      _elements.sessionsGrid.innerHTML = "";

      sessions.forEach((session, index) => {
        console.log(`Creating card for session ${index + 1}`);
        const card = document.createElement("div");
        card.className = "session-card";
        card.innerHTML = `
                    <h3 class="session-title">${
                      session.title || "Untitled Session"
                    }</h3>
                    <p class="session-info">
                        <i class="far fa-clock"></i> ${
                          session.info || "Duration not specified"
                        }
                    </p>
                    <p class="session-topics">
                        <strong>Topics covered:</strong><br>
                        ${session.topics || "Topics not specified"}
                    </p>
                `;
        card.addEventListener("click", () => {
          console.log(`Clicked session ${session.id}`);
          _loadPDF(session.pdfUrl, session.title, session.id);
        });
        _elements.sessionsGrid.appendChild(card);
      });
      console.log("Session cards created successfully");
    } catch (error) {
      console.error("Error creating session cards:", error);
      _elements.sessionsGrid.innerHTML =
        '<div class="error">Error loading courses. Please try again later.</div>';
    }
  }

  function _setupEventListeners() {
    _elements.downloadBtn?.addEventListener("click", () => {
      if (_currentSessionId) {
        _downloadResources(_currentSessionId);
      }
    });

    document.getElementById("firstPage")?.addEventListener("click", () => {
      if (_pageNum !== 1) {
        _pageNum = 1;
        _queueRenderPage(_pageNum);
      }
    });

    document.getElementById("prevPage")?.addEventListener("click", () => {
      if (_pageNum > 1) {
        _pageNum--;
        _queueRenderPage(_pageNum);
      }
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
      if (_pdfDoc && _pageNum < _pdfDoc.numPages) {
        _pageNum++;
        _queueRenderPage(_pageNum);
      }
    });

    document.getElementById("lastPage")?.addEventListener("click", () => {
      if (_pdfDoc && _pageNum !== _pdfDoc.numPages) {
        _pageNum = _pdfDoc.numPages;
        _queueRenderPage(_pageNum);
      }
    });

    document.getElementById("zoomIn")?.addEventListener("click", () => {
      if (_scale < 3.0) {
        _scale += 0.25;
        _updateZoomLevel();
        _queueRenderPage(_pageNum);
      }
    });

    document.getElementById("zoomOut")?.addEventListener("click", () => {
      if (_scale > 0.5) {
        _scale -= 0.25;
        _updateZoomLevel();
        _queueRenderPage(_pageNum);
      }
    });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
      _elements.modal.style.display = "none";
      document.body.style.overflow = "auto";
      _pdfDoc = null;
      _pageNum = 1;
      _scale = 1.5;
      _currentSessionId = null;
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (_pdfDoc) {
          _queueRenderPage(_pageNum);
        }
      }, 100);
    });

    window.addEventListener("click", (event) => {
      if (event.target === _elements.modal) {
        _elements.modal.style.display = "none";
        document.body.style.overflow = "auto";
        _pdfDoc = null;
        _pageNum = 1;
        _scale = 1.5;
        _currentSessionId = null;
      }
    });
  }

  async function init() {
    console.log("Initializing SQL Courses...");
    try {
      await _createSessionCards();
      _setupEventListeners();
      console.log("SQL Courses initialized successfully");
    } catch (error) {
      console.error("Error initializing SQL Courses:", error);
      if (_elements.sessionsGrid) {
        _elements.sessionsGrid.innerHTML =
          '<div class="error">Failed to initialize courses. Please refresh the page.</div>';
      }
    }
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", SQLCourses.init);
