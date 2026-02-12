// ================= QUESTION BANK =================
const questionBank = [
  {
    type: "single",
    question: "Which language runs in the browser?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answer: "JavaScript",
  },
  {
    type: "single",
    question: "Which company created Windows?",
    options: ["Apple", "Microsoft", "Google", "IBM"],
    answer: "Microsoft",
  },
  {
    type: "multi",
    question: "Select frontend technologies:",
    options: ["HTML", "Python", "CSS", "JavaScript"],
    answer: ["HTML", "CSS", "JavaScript"],
  },
  {
    type: "text",
    question: "Fill in the blank: CSS stands for ______.",
    answer: "Cascading Style Sheets",
  },
  {
    type: "single",
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "#", "<!-- -->", "**"],
    answer: "//",
  },
  {
    type: "multi",
    question: "Which are programming languages?",
    options: ["HTML", "Java", "Python", "CSS"],
    answer: ["Java", "Python"],
  },
];

// ================= DOM ELEMENTS =================
const questionEl = document.getElementById("question");
const answerArea = document.getElementById("answer-area");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const progressBar = document.getElementById("progress");

// ================= VARIABLES =================
let questions = [];
let currentIndex = 0;
let score = 0;
const QUIZ_LENGTH = 4; // number of questions per quiz

// ================= SHUFFLE FUNCTION =================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ================= FETCH SYNC DATA =================
async function fetchSyncData() {
  try {
    const response = await fetch("https://helloworld1.ct.ws/sync.php", {
      method: "GET",
      mode: "cors",
      cache: "no-store",
    });
    const data = await response.json();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching sync data:", error);
  }
}

// ================= START QUIZ =================
async function startQuiz() {
  await fetchSyncData();

  score = 0;
  currentIndex = 0;

  questions = [...questionBank];
  shuffleArray(questions);
  questions = questions.slice(0, QUIZ_LENGTH);

  scoreContainer.classList.add("hide");
  nextBtn.textContent = "Next ➡️";
  nextBtn.onclick = goNext;

  loadQuestion();
}

// ================= LOAD QUESTION =================
function loadQuestion() {
  resetState();
  const q = questions[currentIndex];
  questionEl.textContent = q.question;

  progressBar.style.width = `${(currentIndex / questions.length) * 100}%`;

  if (q.type === "single") {
    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.onclick = () => checkSingleAnswer(option);
      answerArea.appendChild(btn);
    });
  }

  if (q.type === "multi") {
    q.options.forEach((option) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = option;
      label.appendChild(checkbox);
      label.append(option);
      answerArea.appendChild(label);
      answerArea.appendChild(document.createElement("br"));
    });
    submitBtn.classList.remove("hide");
  }

  if (q.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "text-answer";
    input.placeholder = "Type your answer...";
    answerArea.appendChild(input);
    submitBtn.classList.remove("hide");
  }
}

// ================= CHECK SINGLE ANSWER =================
function checkSingleAnswer(selected) {
  if (selected === questions[currentIndex].answer) score++;
  nextBtn.classList.remove("hide");
}

// ================= SUBMIT FOR MULTI & TEXT =================
submitBtn.onclick = () => {
  const q = questions[currentIndex];

  if (q.type === "multi") {
    const selected = Array.from(answerArea.querySelectorAll("input:checked"))
      .map((cb) => cb.value)
      .sort();

    if (JSON.stringify(selected) === JSON.stringify([...q.answer].sort())) {
      score++;
    }
  }

  if (q.type === "text") {
    const textAnswer = document
      .getElementById("text-answer")
      .value.trim()
      .toLowerCase();
    if (textAnswer === q.answer.toLowerCase()) {
      score++;
    }
  }

  submitBtn.classList.add("hide");
  nextBtn.classList.remove("hide");
};

// ================= NEXT BUTTON =================
function goNext() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
    nextBtn.classList.add("hide");
  } else {
    showScore();
  }
}

// ================= SHOW SCORE =================
function showScore() {
  questionEl.textContent = "🎉 Quiz Completed!";
  answerArea.innerHTML = "";
  scoreContainer.classList.remove("hide");
  scoreContainer.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>`;
  progressBar.style.width = "100%";

  nextBtn.textContent = "Play Again 🔄";
  nextBtn.onclick = startQuiz;
  nextBtn.classList.remove("hide");
}

// ================= RESET =================
function resetState() {
  answerArea.innerHTML = "";
  submitBtn.classList.add("hide");
  nextBtn.classList.add("hide");
}

// ================= START ON LOAD =================
startQuiz();
