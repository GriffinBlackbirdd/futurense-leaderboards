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

// Aptitude Elements
const aptitudeModal = document.getElementById("aptitudeModal");
const closeAptitudeBtn = document.getElementsByClassName("close-aptitude")[0];
const aptitudeYesBtn = document.getElementById("aptitudeYes");
const aptitudeNoBtn = document.getElementById("aptitudeNo");
const saveAptitudeBtn = document.querySelector(".save-aptitude-btn");
const aptitudeAttempted = document.getElementById("aptitudeAttempted");
const aptitudeResponseImage = document.getElementById("aptitudeResponseImage");
const aptitudeResponse = document.getElementById("aptitudeResponse");
const aptitudeQuestionsInput = document.getElementById(
  "aptitudeQuestionsInput"
);

const youtubeCheck = document.getElementById("youtubeCheck");
const linkedinCheck = document.getElementById("linkedinCheck");
const youtubeSection = document.querySelector(".youtube-link");
const linkedinSection = document.querySelector(".linkedin-link");

const projectTypes = ["ml", "de", "ds", "cert", "proj", "sd"];

//current date
document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "/";
    return;
  }
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

// Notification function
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  const styles = document.createElement("style");
  styles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            background: linear-gradient(45deg, #4158D0, #C850C0);
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

        .notification.error {
            background: linear-gradient(45deg, #FF416C, #FF4B2B);
        }

        .notification.success {
            background: linear-gradient(45deg, #2ecc71, #27ae60);
        }
    `;

  document.head.appendChild(styles);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, 100);
}

// DSA Functions
function resetDSAValues() {
  dsaEasyInput.value = "0";
  dsaMediumInput.value = "0";
  dsaHardInput.value = "0";
}

function showResponseImage() {
  responseImage.src =
    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/big-thumbs-down-emoticon-emoticon.gif";
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
    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/big-thumbs-down-emoticon-emoticon.gif";
  sqlResponseImage.style.display = "block";
  sqlResponse.classList.add("show");
}

function hideSQLResponseImage() {
  sqlResponseImage.style.display = "none";
  sqlResponse.classList.remove("show");
}

// Aptitude Functions
function resetAptitudeValues() {
  aptitudeQuestionsInput.value = "0";
  document.getElementById("aptitudeQuestionsCount").value = "0";
}

function showAptitudeResponseImage() {
  aptitudeResponseImage.src =
    "https://qqeanlpfsgowrbzukhie.supabase.co/storage/v1/object/public/randoms/big-thumbs-down-emoticon-emoticon.gif";
  aptitudeResponseImage.style.display = "block";
  aptitudeResponse.classList.add("show");
}

function hideAptitudeResponseImage() {
  aptitudeResponseImage.style.display = "none";
  aptitudeResponse.classList.remove("show");
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

// Aptitude Event Handlers
aptitudeYesBtn.onclick = function () {
  aptitudeYesBtn.classList.add("active");
  aptitudeNoBtn.classList.remove("active");
  aptitudeAttempted.value = "true";
  hideAptitudeResponseImage();
  aptitudeModal.style.display = "block";
};

aptitudeNoBtn.onclick = function () {
  aptitudeNoBtn.classList.add("active");
  aptitudeYesBtn.classList.remove("active");
  aptitudeAttempted.value = "false";
  resetAptitudeValues();
  showAptitudeResponseImage();
};

closeAptitudeBtn.onclick = function () {
  aptitudeModal.style.display = "none";
  if (aptitudeQuestionsInput.value === "0") {
    aptitudeYesBtn.classList.remove("active");
    aptitudeNoBtn.classList.add("active");
    aptitudeAttempted.value = "false";
    showAptitudeResponseImage();
  }
};

saveAptitudeBtn.onclick = function() {
  const questions = document.getElementById("aptitudeQuestionsCount").value;
  console.log('Saving aptitude questions:', questions); // Add this log
  aptitudeQuestionsInput.value = questions;
  aptitudeModal.style.display = "none";
};

youtubeCheck.addEventListener("change", function () {
  youtubeSection.style.display = this.checked ? "block" : "none";
  if (!this.checked) {
    document.getElementById("youtubeLink").value = "";
  }
});

linkedinCheck.addEventListener("change", function () {
  linkedinSection.style.display = this.checked ? "block" : "none";
  if (!this.checked) {
    document.getElementById("linkedinLink").value = "";
  }
});

projectTypes.forEach((type) => {
  const checkbox = document.getElementById(`${type}Check`);
  const hoursDiv = document.getElementById(`${type}Hours`);

  checkbox.addEventListener("change", function () {
    hoursDiv.style.display = this.checked ? "block" : "none";
    if (!this.checked) {
      hoursDiv.querySelector("input").value = "";
    }
  });
});

//Window click handlers for modals
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
  if (event.target == aptitudeModal) {
    aptitudeModal.style.display = "none";
    if (aptitudeQuestionsInput.value === "0") {
      aptitudeYesBtn.classList.remove("active");
      aptitudeNoBtn.classList.add("active");
      aptitudeAttempted.value = "false";
      showAptitudeResponseImage();
    }
  }
};

// Form submission and loading spinner yay!
document
  .getElementById("activityForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector(".submit-btn");
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const userData = JSON.parse(localStorage.getItem("userData"));

    const formData = {
      date: new Date().toISOString(),
      userid: userData.email,
      cohort: userData.cohort, // Add cohort to the form data
      dsa_attempted: dsaAttempted.value === "true",
      dsa_easy: parseInt(dsaEasyInput.value) || 0,
      dsa_medium: parseInt(dsaMediumInput.value) || 0,
      dsa_hard: parseInt(dsaHardInput.value) || 0,
      sql_attempted: sqlAttempted.value === "true",
      sql_questions: parseInt(sqlQuestionsInput.value) || 0,
      aptitude_attempted: aptitudeAttempted.value === "true",
      aptitude_questions: parseInt(aptitudeQuestionsInput.value) || 0,
      youtube_checked: document.getElementById("youtubeCheck").checked,
      youtube_link: document.getElementById("youtubeCheck").checked
        ? document.getElementById("youtubeLink").value
        : null,
      linkedin_checked: document.getElementById("linkedinCheck").checked,
      linkedin_link: document.getElementById("linkedinCheck").checked
        ? document.getElementById("linkedinLink").value
        : null,
      ml_checked: document.getElementById("mlCheck").checked,
      ml_hours: parseFloat(document.querySelector("#mlHours input").value) || 0,
      de_checked: document.getElementById("deCheck").checked,
      de_hours: parseFloat(document.querySelector("#deHours input").value) || 0,
      ds_checked: document.getElementById("dsCheck").checked,
      ds_hours: parseFloat(document.querySelector("#dsHours input").value) || 0,
      cert_checked: document.getElementById("certCheck").checked,
      cert_hours:
        parseFloat(document.querySelector("#certHours input").value) || 0,
      proj_checked: document.getElementById("projCheck").checked,
      proj_hours:
        parseFloat(document.querySelector("#projHours input").value) || 0,
      sd_checked: document.getElementById("sdCheck").checked,
      sd_hours: parseFloat(document.querySelector("#sdHours input").value) || 0,
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

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.success) {
        showNotification("Activity logged successfully!", "success");
        setTimeout(() => {
          window.location.href = "/welcome";
        }, 1500);
      } else {
        showNotification(data.detail || "Failed to log activity", "error");
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while logging activity", "error");
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });