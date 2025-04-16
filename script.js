let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = []; // To store user's answers for review
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const scoreText = document.getElementById("score-text");

// Load questions from JSON using async/await
async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("Failed to load questions");

    const data = await response.json();
    questions = data;
    showQuestion();
  } catch (error) {
    questionElement.textContent = "Failed to load questions.";
    console.error(error);
  }
}

// Show the current question
function showQuestion() {
  resetState();

  const questionData = questions[currentQuestionIndex];
  questionElement.textContent =  `Q${currentQuestionIndex+1} ) ` + questionData.question ;

  // Combine correct and incorrect answers
  const answers = [
    { text: questionData.correct_answer, correct: true },
    ...questionData.incorrect_answers.map(text => ({ text, correct: false }))
  ];
 

shuffleArray(answers);

  // Labels: A, B, C, D...
  const optionLabels = ["A", "B", "C", "D"];

  answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.classList.add("answer-styled");
    button.textContent = ` ${optionLabels[index]} )  ${answer.text}`;
    button.classList.add("answer-btn");
    button.addEventListener("click", () => selectAnswer(button, answer.correct));
    answersElement.appendChild(button);
  });
}

// Shuffle helper function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Reset buttons and UI state before showing a new question
function resetState() {
  nextButton.style.display = "none";
  submitButton.style.display = "none";
  answersElement.innerHTML = "";
}

// Handle answer selection
function selectAnswer(button, isCorrect) {
  const allButtons = answersElement.querySelectorAll("button");
  allButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
  }

  // Get the actual text of the selected answer
  const selectedText = button.textContent.split(')')[1].trim();

  // Save user's answer
  userAnswers.push({
    question: questions[currentQuestionIndex].question,
    correctAnswer: questions[currentQuestionIndex].correct_answer,
    selectedAnswer: selectedText,
    isCorrect: isCorrect
  });

  if (currentQuestionIndex < questions.length - 1) {
    nextButton.style.display = "inline-block";
  } else {
    submitButton.style.display = "inline-block";
  }
}

// Move to next question
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  showQuestion();
});

// Show final score
submitButton.addEventListener("click", () => {
  resetState();
  questionElement.textContent = "Quiz Complete!";
  scoreText.style.display = "block";
  scoreText.textContent = `Your Score: ${score} / ${questions.length}`;

  // Show review section
  const reviewSection = document.getElementById("review-section");
  reviewSection.innerHTML = "<h3>Review Answers:</h3>";
  reviewSection.style.display = "block";

  userAnswers.forEach((ans, index) => {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");
    reviewItem.innerHTML = `
      <p><strong>Q${index + 1})</strong> ${ans.question}</p>
      <p style="color: ${ans.isCorrect ? 'green' : 'red'};">
        Your Answer: ${ans.selectedAnswer} ${ans.isCorrect ? '✅' : '❌'}
      </p>
      <p style="color: green;">Correct Answer: ${ans.correctAnswer}</p>
      <hr>
    `;
    reviewSection.appendChild(reviewItem);
  });
});



// Start the quiz
loadQuestions();
