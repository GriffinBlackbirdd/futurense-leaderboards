// Initialize particles.js
particlesJS("particles-js", {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3,
      random: false,
      anim: {
        enable: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.6,
        },
      },
      push: {
        particles_nb: 3,
      },
    },
  },
  retina_detect: true,
});

// Get all DOM elements
// DSA Elements
const modal = document.getElementById("dsaModal");
const closeBtn = document.getElementsByClassName("close")[0];
const dsaYesBtn = document.getElementById("dsaYes");
const dsaNoBtn = document.getElementById("dsaNo");
const saveDsaBtn = document.querySelector(".save-dsa-btn");
const dsaAttempted = document.getElementById("dsaAttempted");
const responseImage = document.getElementById("responseImage");
const dsaResponse = document.getElementById("dsaResponse");
const dsaEasyInput = document.getElementById("dsaEasyInput");
const dsaMediumInput = document.getElementById("dsaMediumInput");
const dsaHardInput = document.getElementById("dsaHardInput");

// SQL Elements
const sqlModal = document.getElementById("sqlModal");
const closeSqlBtn = document.getElementsByClassName("close-sql")[0];
const sqlYesBtn = document.getElementById("sqlYes");
const sqlNoBtn = document.getElementById("sqlNo");
const saveSqlBtn = document.querySelector(".save-sql-btn");
const sqlAttempted = document.getElementById("sqlAttempted");
const sqlResponseImage = document.getElementById("sqlResponseImage");
const sqlResponse = document.getElementById("sqlResponse");
const sqlQuestionsInput = document.getElementById("sqlQuestionsInput");

// Display current date
document.addEventListener("DOMContentLoaded", function () {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const currentDate = new Date();
  document.getElementById("currentDate").textContent =
    currentDate.toLocaleDateString("en-US", options);
});

// DSA Functions
function resetDSAValues() {
  dsaEasyInput.value = "0";
  dsaMediumInput.value = "0";
  dsaHardInput.value = "0";
}

function showResponseImage() {
  responseImage.src =
    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/big-thumbs-down-emoticon-emoticon.gif?t=2025-01-12T11%3A46%3A51.552Z"; // Replace with your image URL
  responseImage.style.display = "block";
  dsaResponse.classList.add("show");
}

function hideResponseImage() {
  responseImage.style.display = "none";
  dsaResponse.classList.remove("show");
}

// SQL Functions
function resetSQLValues() {
  sqlQuestionsInput.value = "0";
  document.getElementById("sqlQueriesCount").value = "0";
}

function showSQLResponseImage() {
  sqlResponseImage.src =
    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/big-thumbs-down-emoticon-emoticon.gif?t=2025-01-12T11%3A46%3A51.552Z"; // Replace with your image URL
  sqlResponseImage.style.display = "block";
  sqlResponse.classList.add("show");
}

function hideSQLResponseImage() {
  sqlResponseImage.style.display = "none";
  sqlResponse.classList.remove("show");
}

// DSA Event Handlers
dsaYesBtn.onclick = function () {
  dsaYesBtn.classList.add("active");
  dsaNoBtn.classList.remove("active");
  dsaAttempted.value = "true";
  hideResponseImage();
  modal.style.display = "block";
};

dsaNoBtn.onclick = function () {
  dsaNoBtn.classList.add("active");
  dsaYesBtn.classList.remove("active");
  dsaAttempted.value = "false";
  resetDSAValues();
  showResponseImage();
};

closeBtn.onclick = function () {
  modal.style.display = "none";
  if (
    dsaEasyInput.value === "0" &&
    dsaMediumInput.value === "0" &&
    dsaHardInput.value === "0"
  ) {
    dsaYesBtn.classList.remove("active");
    dsaNoBtn.classList.add("active");
    dsaAttempted.value = "false";
    showResponseImage();
  }
};

saveDsaBtn.onclick = function () {
  const easy = document.getElementById("dsaEasy").value;
  const medium = document.getElementById("dsaMedium").value;
  const hard = document.getElementById("dsaHard").value;

  dsaEasyInput.value = easy;
  dsaMediumInput.value = medium;
  dsaHardInput.value = hard;

  modal.style.display = "none";
};

// SQL Event Handlers
sqlYesBtn.onclick = function () {
  sqlYesBtn.classList.add("active");
  sqlNoBtn.classList.remove("active");
  sqlAttempted.value = "true";
  hideSQLResponseImage();
  sqlModal.style.display = "block";
};

sqlNoBtn.onclick = function () {
  sqlNoBtn.classList.add("active");
  sqlYesBtn.classList.remove("active");
  sqlAttempted.value = "false";
  resetSQLValues();
  showSQLResponseImage();
};

closeSqlBtn.onclick = function () {
  sqlModal.style.display = "none";
  if (sqlQuestionsInput.value === "0") {
    sqlYesBtn.classList.remove("active");
    sqlNoBtn.classList.add("active");
    sqlAttempted.value = "false";
    showSQLResponseImage();
  }
};

saveSqlBtn.onclick = function () {
  const queries = document.getElementById("sqlQueriesCount").value;
  sqlQuestionsInput.value = queries;
  sqlModal.style.display = "none";
};

// Window click handlers for both modals
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    if (
      dsaEasyInput.value === "0" &&
      dsaMediumInput.value === "0" &&
      dsaHardInput.value === "0"
    ) {
      dsaYesBtn.classList.remove("active");
      dsaNoBtn.classList.add("active");
      dsaAttempted.value = "false";
      showResponseImage();
    }
  }
  if (event.target == sqlModal) {
    sqlModal.style.display = "none";
    if (sqlQuestionsInput.value === "0") {
      sqlYesBtn.classList.remove("active");
      sqlNoBtn.classList.add("active");
      sqlAttempted.value = "false";
      showSQLResponseImage();
    }
  }
};

// Notification function
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 100);
}

// Form submission
document
  .getElementById("activityForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      date: new Date().toISOString(),
      userid: JSON.parse(localStorage.getItem("userData")).email,
      dsa_attempted: dsaAttempted.value === "true",
      dsa_easy: parseInt(dsaEasyInput.value) || 0,
      dsa_medium: parseInt(dsaMediumInput.value) || 0,
      dsa_hard: parseInt(dsaHardInput.value) || 0,
      sql_attempted: sqlAttempted.value === "true",
      sql_questions: parseInt(sqlQuestionsInput.value) || 0,
      learning_hours: parseFloat(
        document.getElementById("learningHours").value
      ),
      learning_topic: document.getElementById("learningTopic").value,
      project_hours: parseFloat(document.getElementById("projectHours").value),
      project_description: document.getElementById("projectDescription").value,
    };

    try {
      const response = await fetch("/api/track-activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification("Activity logged successfully!");
        this.reset();
        // Reset DSA states
        dsaYesBtn.classList.remove("active");
        dsaNoBtn.classList.remove("active");
        hideResponseImage();
        resetDSAValues();
        // Reset SQL states
        sqlYesBtn.classList.remove("active");
        sqlNoBtn.classList.remove("active");
        hideSQLResponseImage();
        resetSQLValues();
      } else {
        showNotification(data.detail || "Failed to log activity", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while logging activity", "error");
    }
  });
