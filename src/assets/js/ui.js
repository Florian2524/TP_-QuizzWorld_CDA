window.UI = {
  levelLabels: {
    debutant: "Débutant",
    confirme: "Confirmé",
    expert: "Expert"
  },

  renderHome() {
    const app = this.getApp();
    const cardsHtml = appState.categories.map((category) => this.buildHomeCard(category)).join("");

    app.innerHTML = `
      <section class="home-screen">
        <div class="home-shell">
          <header class="home-shell__header">
            <h1 class="home-shell__title">Quizz World</h1>
          </header>

          <section class="home-shell__grid">
            ${cardsHtml}
          </section>
        </div>
      </section>

      <div id="player-modal" class="modal hidden">
        <div class="modal__overlay"></div>

        <div class="modal__content">
          <button id="close-modal-btn" class="modal__close" type="button" aria-label="Fermer">×</button>

          <h2 class="modal__title">Saisir votre prénom</h2>

          <p class="modal__text">
            Rubrique : <strong id="selected-category-label"></strong><br>
            Niveau : <strong id="selected-level-label"></strong>
          </p>

          <form id="player-form" class="modal__form">
            <label for="player-name" class="modal__label">Prénom</label>
            <input
              type="text"
              id="player-name"
              class="modal__input"
              placeholder="Entrez votre prénom"
              autocomplete="off"
            >

            <p id="player-name-error" class="modal__error"></p>

            <button type="submit" class="modal__submit">Valider</button>
          </form>
        </div>
      </div>
    `;

    this.bindHomeEvents();
  },

  renderSummary() {
    const app = this.getApp();

    app.innerHTML = `
      <section class="summary-page">
        <div class="summary-shell">
          <header class="summary-header">
            <h1 class="summary-header__title">Quizz World</h1>
            <p class="summary-header__subtitle">
              ${appState.category.title} - Niveau ${this.formatLevelLabel(appState.level).toLowerCase()}
            </p>
            <p class="summary-header__intro">
              ${appState.playerName}, vous allez pouvoir démarrer ce Quizz !!!
            </p>
          </header>

          <div class="summary-visual">
            <img src="${appState.category.image}" alt="${appState.category.title}" class="summary-visual__image">
          </div>

          <div class="summary-actions summary-actions--maquette">
            <button id="back-home-btn" class="summary-button summary-button--secondary" type="button">
              Retour à l'accueil
            </button>

            <button id="start-quiz-btn" class="summary-button summary-button--primary" type="button">
              Démarrez le Quizz
            </button>
          </div>
        </div>
      </section>
    `;

    this.bindSummaryEvents();
  },

  renderQuiz() {
    const app = this.getApp();
    const currentQuestion = Quiz.getCurrentQuestion();

    if (!currentQuestion) {
      this.renderError("Aucune question n'est disponible.");
      return;
    }

    const answersHtml = currentQuestion.propositions
      .map((proposition, index) => this.buildAnswerCard(proposition, index))
      .join("");

    app.innerHTML = `
      <section class="quiz-page">
        <div class="quiz-shell">
          <header class="quiz-header">
            <h1 class="quiz-header__title">Quizz World</h1>
            <p class="quiz-header__subtitle">
              ${appState.category.title} - Niveau ${this.formatLevelLabel(appState.level).toLowerCase()}
            </p>
          </header>

          <div class="quiz-question-box">
            <p class="quiz-question-box__text">
              Question ${appState.currentQuestionIndex + 1} : ${currentQuestion.question}
            </p>
          </div>

          <div class="answers-grid">
            ${answersHtml}
          </div>

          <div class="quiz-bottom-row">
            <div id="quiz-dropzone" class="quiz-dropzone">
              Posez votre réponse ici !!!
            </div>

            <div class="quiz-actions">
              <button id="quiz-next-btn" class="quiz-next-btn" type="button" disabled>
                Suivant
              </button>
            </div>
          </div>

          <div id="quiz-feedback" class="quiz-feedback hidden"></div>
        </div>
      </section>
    `;

    this.bindQuizEvents();
    DragDrop.init();
  },

  renderFinalScore() {
    const app = this.getApp();
    const total = appState.questions.length;
    const score = appState.score;
    const message = this.getScoreMessage(score, total);

    app.innerHTML = `
      <section class="result-page">
        <div class="result-shell">
          <header class="result-header">
            <h1 class="result-header__title">Quizz World</h1>
            <p class="result-header__subtitle">
              ${appState.category.title} - Niveau ${this.formatLevelLabel(appState.level).toLowerCase()}
            </p>
          </header>

          <div class="result-card">
            <p class="result-card__player">Bravo ${appState.playerName} !</p>
            <p class="result-card__score">${score} / ${total}</p>
            <p class="result-card__message">${message}</p>
          </div>

          <div class="summary-actions summary-actions--maquette">
            <button id="restart-quiz-btn" class="summary-button summary-button--secondary" type="button">
              Rejouer
            </button>

            <button id="restart-home-btn" class="summary-button summary-button--primary" type="button">
              Retour accueil
            </button>
          </div>
        </div>
      </section>
    `;

    document.getElementById("restart-quiz-btn").addEventListener("click", async () => {
      await Quiz.start();
    });

    document.getElementById("restart-home-btn").addEventListener("click", () => {
      this.resetSelection();
      this.renderHome();
    });
  },

  renderError(message) {
    const app = this.getApp();

    app.innerHTML = `
      <section class="error-page">
        <div class="error-shell">
          <h1 class="error-panel__title">Erreur</h1>
          <p class="error-panel__text">${message}</p>

          <button id="error-home-btn" class="summary-button summary-button--primary" type="button">
            Retour à l'accueil
          </button>
        </div>
      </section>
    `;

    document.getElementById("error-home-btn").addEventListener("click", () => {
      this.resetSelection();
      this.renderHome();
    });
  },

  bindHomeEvents() {
    const levelInputs = document.querySelectorAll('.home-card__level input[type="radio"]');

    levelInputs.forEach((input) => {
      input.addEventListener("change", ({ target }) => {
        const card = target.closest(".home-card");
        const categoryId = card?.dataset.categoryId;
        const category = appState.categories.find((item) => item.id === categoryId);

        if (!category) {
          return;
        }

        appState.category = category;
        appState.level = target.value;

        this.openPlayerModal();
      });
    });

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      this.closePlayerModal();
    });

    document.querySelector(".modal__overlay").addEventListener("click", () => {
      this.closePlayerModal();
    });

    document.getElementById("player-form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.handlePlayerFormSubmit();
    });
  },

  bindSummaryEvents() {
    document.getElementById("back-home-btn").addEventListener("click", () => {
      this.resetSelection();
      this.renderHome();
    });

    document.getElementById("start-quiz-btn").addEventListener("click", async () => {
      await Quiz.start();
    });
  },

  bindQuizEvents() {
    document.getElementById("quiz-next-btn").addEventListener("click", () => {
      Quiz.goToNextQuestion();
    });
  },

  handleDroppedAnswer(selectedAnswer, draggedCard) {
    const result = Quiz.checkAnswer(selectedAnswer);

    if (!result) {
      return;
    }

    const dropzone = document.getElementById("quiz-dropzone");
    const feedback = document.getElementById("quiz-feedback");
    const nextButton = document.getElementById("quiz-next-btn");
    const answerCards = document.querySelectorAll(".answer-card");

    feedback.classList.remove("quiz-feedback--correct", "quiz-feedback--wrong");
    dropzone.classList.remove("quiz-dropzone--correct", "quiz-dropzone--wrong");
    dropzone.textContent = selectedAnswer;

    answerCards.forEach((card) => {
      card.draggable = false;
      card.classList.add("answer-card--locked");
    });

    if (result.isCorrect) {
      this.showCorrectAnswer(feedback, dropzone, draggedCard, result);
    } else {
      this.showWrongAnswer(feedback, dropzone, draggedCard, answerCards, result);
    }

    nextButton.disabled = false;
  },

  showCorrectAnswer(feedback, dropzone, draggedCard, result) {
    dropzone.classList.add("quiz-dropzone--correct");
    draggedCard.classList.add("answer-card--correct");

    feedback.classList.remove("hidden");
    feedback.classList.add("quiz-feedback--correct");
    feedback.innerHTML = `
      <strong>Bonne réponse !</strong>
      ${result.anecdote ? `<br>${result.anecdote}` : ""}
    `;
  },

  showWrongAnswer(feedback, dropzone, draggedCard, answerCards, result) {
    dropzone.classList.add("quiz-dropzone--wrong");
    draggedCard.classList.add("answer-card--wrong-choice");

    const correctCard = Array.from(answerCards).find(
      (card) => card.dataset.answerValue === result.correctAnswer
    );

    if (correctCard) {
      correctCard.classList.add("answer-card--correct");
    }

    feedback.classList.remove("hidden");
    feedback.classList.add("quiz-feedback--wrong");
    feedback.innerHTML = `
      <strong>Mauvaise réponse.</strong><br>
      La bonne réponse était : ${result.correctAnswer}
    `;
  },

  openPlayerModal() {
    const modal = document.getElementById("player-modal");
    const categoryLabel = document.getElementById("selected-category-label");
    const levelLabel = document.getElementById("selected-level-label");
    const playerInput = document.getElementById("player-name");
    const errorElement = document.getElementById("player-name-error");

    categoryLabel.textContent = appState.category.title;
    levelLabel.textContent = this.formatLevelLabel(appState.level);
    playerInput.value = appState.playerName;
    errorElement.textContent = "";

    modal.classList.remove("hidden");
    playerInput.focus();
  },

  closePlayerModal() {
    document.getElementById("player-modal").classList.add("hidden");
    document.getElementById("player-name-error").textContent = "";
  },

  handlePlayerFormSubmit() {
    const playerInput = document.getElementById("player-name");
    const errorElement = document.getElementById("player-name-error");
    const playerName = playerInput.value.trim();

    if (playerName.length < 2) {
      errorElement.textContent = "Le prénom doit contenir au moins 2 caractères.";
      playerInput.focus();
      return;
    }

    appState.playerName = playerName;
    errorElement.textContent = "";

    this.closePlayerModal();
    this.renderSummary();
  },

  resetSelection() {
    appState.playerName = "";
    appState.category = null;
    appState.level = "";
    appState.questions = [];
    appState.currentQuestionIndex = 0;
    appState.score = 0;
    appState.hasAnsweredCurrentQuestion = false;
  },

  formatLevelLabel(level) {
    return this.levelLabels[level] || level;
  },

  getScoreMessage(score, total) {
    const ratio = score / total;

    if (ratio === 1) {
      return "Score parfait, excellent travail !";
    }

    if (ratio >= 0.8) {
      return "Très bon résultat, tu maîtrises très bien ce sujet.";
    }

    if (ratio >= 0.5) {
      return "Bon travail, il reste encore un peu d'entraînement.";
    }

    return "Ce n'est qu'un début, retente le quiz pour progresser.";
  },

  buildHomeCard(category) {
    return `
      <article class="home-card" data-category-id="${category.id}">
        <h2 class="home-card__title">${category.title}</h2>

        <div class="home-card__media">
          <img
            src="${category.image}"
            alt="${category.title}"
            class="home-card__image"
          >
        </div>

        <div class="home-card__levels">
          ${this.buildLevelInput(category.id, "debutant", "Débutant")}
          ${this.buildLevelInput(category.id, "confirme", "Confirmé")}
          ${this.buildLevelInput(category.id, "expert", "Expert")}
        </div>
      </article>
    `;
  },

  buildLevelInput(categoryId, value, label) {
    return `
      <label class="home-card__level">
        <input type="radio" name="level-${categoryId}" value="${value}">
        <span>${label}</span>
      </label>
    `;
  },

  buildAnswerCard(proposition, index) {
    return `
      <div
        class="answer-card"
        data-answer-index="${index}"
        data-answer-value="${this.escapeHtmlAttribute(proposition)}"
      >
        ${proposition}
      </div>
    `;
  },

  escapeHtmlAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  },

  getApp() {
    return document.getElementById("app");
  }
};