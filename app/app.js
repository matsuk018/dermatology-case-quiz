const cases = Array.isArray(window.DERMATOLOGY_CASES) ? window.DERMATOLOGY_CASES : [];

const quizScreen = document.querySelector("#quiz-screen");
const revealScreen = document.querySelector("#reveal-screen");
const answerForm = document.querySelector("#answer-form");
const choiceList = document.querySelector("#choice-list");
const submitButton = document.querySelector("#submit-answer");
const showAnswerButton = document.querySelector("#show-answer");
const resetButton = document.querySelector("#reset-quiz");
const resultLabel = document.querySelector("#result-label");

function getJstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDailyIndex(dateKey) {
  const anchor = Date.parse("2026-07-18T00:00:00Z");
  const target = Date.parse(`${dateKey}T00:00:00Z`);
  const dayOffset = Math.floor((target - anchor) / 86_400_000);
  return ((dayOffset % cases.length) + cases.length) % cases.length;
}

function getSelectedIndex() {
  const preview = Number(new URLSearchParams(window.location.search).get("case"));
  if (Number.isInteger(preview) && preview >= 0 && preview < cases.length) return preview;
  return getDailyIndex(getJstDateKey());
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function setSourceLink(selector, href) {
  document.querySelector(selector).href = href;
}

function renderChoices(caseData) {
  choiceList.replaceChildren();
  caseData.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    label.className = "choice-card";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "diagnosis";
    input.value = String(index);

    const marker = document.createElement("span");
    marker.className = "choice-marker";
    marker.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.className = "choice-text";
    text.textContent = choice;

    label.append(input, marker, text);
    choiceList.append(label);
  });
}

function renderQuestion(caseData, index) {
  const image = document.querySelector("#case-image");
  image.src = caseData.image;
  image.alt = caseData.imageAlt;
  setText("#case-summary", caseData.course);
  setText("#pool-progress", `${index + 1} / ${cases.length}`);
  setText("#today-label", getJstDateKey().replaceAll("-", "."));
  renderChoices(caseData);
}

function renderReveal(caseData) {
  setText("#diagnosis-text", caseData.diagnosis);
  setText("#grounds-text", caseData.grounds);
  setText("#differential-text", caseData.differential);
  setText("#learning-text", caseData.learning);
  setText("#source-authors", caseData.source.authors);
  setText("#source-title", caseData.source.title);
  setSourceLink("#source-pmc", `https://pmc.ncbi.nlm.nih.gov/articles/${caseData.source.pmcid}/`);
  setSourceLink("#source-pubmed", `https://pubmed.ncbi.nlm.nih.gov/${caseData.source.pmid}/`);
  setSourceLink("#source-doi", `https://doi.org/${caseData.source.doi}`);
}

function revealAnswer(caseData, selectedIndex) {
  const answered = Number.isInteger(selectedIndex);
  resultLabel.textContent = answered
    ? selectedIndex === caseData.answer
      ? "正解です"
      : `不正解です。選んだ答え：${caseData.choices[selectedIndex]}`
    : "答えを開示します";

  quizScreen.hidden = true;
  revealScreen.hidden = false;
  document.title = "答えと解説 | 皮膚科クイズ";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#reveal-title").focus({ preventScroll: true });
}

function resetQuestion() {
  revealScreen.hidden = true;
  quizScreen.hidden = false;
  answerForm.reset();
  submitButton.disabled = true;
  resultLabel.textContent = "";
  document.title = "本日の皮膚科クイズ";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (cases.length === 0) {
  document.body.textContent = "症例データを読み込めませんでした。";
} else {
  const caseIndex = getSelectedIndex();
  const caseData = cases[caseIndex];
  renderQuestion(caseData, caseIndex);
  renderReveal(caseData);

  answerForm.addEventListener("change", () => {
    submitButton.disabled = !answerForm.querySelector("input[name='diagnosis']:checked");
  });

  answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = answerForm.querySelector("input[name='diagnosis']:checked");
    if (!selected) return;
    revealAnswer(caseData, Number(selected.value));
  });

  showAnswerButton.addEventListener("click", () => revealAnswer(caseData));
  resetButton.addEventListener("click", resetQuestion);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The quiz remains usable online if service-worker registration is unavailable.
    });
  });
}
