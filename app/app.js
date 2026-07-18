const cases = Array.isArray(window.DERMATOLOGY_CASES) ? window.DERMATOLOGY_CASES : [];

const quizScreen = document.querySelector("#quiz-screen");
const revealScreen = document.querySelector("#reveal-screen");
const answerForm = document.querySelector("#answer-form");
const choiceList = document.querySelector("#choice-list");
const submitButton = document.querySelector("#submit-answer");
const showAnswerButton = document.querySelector("#show-answer");
const resetButton = document.querySelector("#reset-quiz");
const resultLabel = document.querySelector("#result-label");
const archiveScreen = document.querySelector("#archive-screen");
const archiveList = document.querySelector("#archive-list");
const archiveEmpty = document.querySelector("#archive-empty");
const todayTab = document.querySelector("#today-tab");
const archiveTab = document.querySelector("#archive-tab");

const ANCHOR_DATE_KEY = "2026-07-18";
const DAY_IN_MS = 86_400_000;

function getJstDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDailyIndex(dateKey) {
  const anchor = Date.parse(`${ANCHOR_DATE_KEY}T00:00:00Z`);
  const target = Date.parse(`${dateKey}T00:00:00Z`);
  const dayOffset = Math.floor((target - anchor) / DAY_IN_MS);
  return ((dayOffset % cases.length) + cases.length) % cases.length;
}

function getDayOffset(dateKey = getJstDateKey()) {
  const anchor = Date.parse(`${ANCHOR_DATE_KEY}T00:00:00Z`);
  const target = Date.parse(`${dateKey}T00:00:00Z`);
  return Math.floor((target - anchor) / DAY_IN_MS);
}

function getReleaseDateKey(index) {
  const releaseDate = new Date(Date.parse(`${ANCHOR_DATE_KEY}T00:00:00Z`) + index * DAY_IN_MS);
  return releaseDate.toISOString().slice(0, 10);
}

function formatDateKey(dateKey) {
  return dateKey.replaceAll("-", ".");
}

function getPreviewIndex() {
  const previewValue = new URLSearchParams(window.location.search).get("case");
  if (previewValue === null) return null;
  const preview = Number(previewValue);
  return Number.isInteger(preview) && preview >= 0 && preview < cases.length ? preview : null;
}

function getSelectedIndex() {
  const preview = getPreviewIndex();
  if (preview !== null) return preview;
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

function renderQuestion(caseData, index, isPastQuestion) {
  const image = document.querySelector("#case-image");
  image.src = caseData.image;
  image.alt = caseData.imageAlt;
  setText("#case-summary", caseData.course);
  setText("#pool-progress", `${index + 1} / ${cases.length}`);
  setText("#today-label", formatDateKey(isPastQuestion ? getReleaseDateKey(index) : getJstDateKey()));
  setText("#screen-title", isPastQuestion ? `過去問 第${index + 1}問` : "本日の皮膚科クイズ");
  setText("#schedule-note", isPastQuestion ? "過去に出題した問題を表示しています。" : "次の問題は日本時間の0時に切り替わります。");
  renderChoices(caseData);
}

function renderArchive() {
  archiveList.replaceChildren();
  const pastCount = Math.min(Math.max(getDayOffset(), 0), cases.length);

  for (let index = pastCount - 1; index >= 0; index -= 1) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const question = document.createElement("span");
    const date = document.createElement("time");

    link.className = "archive-link";
    link.href = `?case=${index}`;
    question.className = "archive-question";
    question.textContent = `第${index + 1}問`;
    date.className = "archive-date";
    date.dateTime = getReleaseDateKey(index);
    date.textContent = formatDateKey(date.dateTime);

    link.append(question, date);
    item.append(link);
    archiveList.append(item);
  }

  archiveEmpty.hidden = pastCount !== 0;
}

function setNavigationState(activeView) {
  todayTab.setAttribute("aria-pressed", String(activeView === "today"));
  archiveTab.setAttribute("aria-pressed", String(activeView === "archive"));
}

function showArchive() {
  quizScreen.hidden = true;
  revealScreen.hidden = true;
  archiveScreen.hidden = false;
  renderArchive();
  setNavigationState("archive");
  setText("#screen-title", "過去の問題");
  setText("#pool-progress", `${archiveList.childElementCount}問`);
  document.title = "過去の問題 | 皮膚科クイズ";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#archive-title").focus({ preventScroll: true });
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
  archiveScreen.hidden = true;
  revealScreen.hidden = true;
  quizScreen.hidden = false;
  answerForm.reset();
  submitButton.disabled = true;
  resultLabel.textContent = "";
  document.title = getPreviewIndex() === null ? "本日の皮膚科クイズ" : `過去問 第${getPreviewIndex() + 1}問 | 皮膚科クイズ`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (cases.length === 0) {
  document.body.textContent = "症例データを読み込めませんでした。";
} else {
  const caseIndex = getSelectedIndex();
  const caseData = cases[caseIndex];
  const isPastQuestion = getPreviewIndex() !== null;
  renderQuestion(caseData, caseIndex, isPastQuestion);
  renderReveal(caseData);
  setNavigationState(isPastQuestion ? "archive" : "today");

  if (isPastQuestion) document.title = `過去問 第${caseIndex + 1}問 | 皮膚科クイズ`;

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
  archiveTab.addEventListener("click", showArchive);
  todayTab.addEventListener("click", () => {
    if (getPreviewIndex() !== null) {
      window.location.assign(window.location.pathname);
      return;
    }

    archiveScreen.hidden = true;
    revealScreen.hidden = true;
    quizScreen.hidden = false;
    renderQuestion(caseData, caseIndex, false);
    renderReveal(caseData);
    resetQuestion();
    setNavigationState("today");
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The quiz remains usable online if service-worker registration is unavailable.
    });
  });
}
