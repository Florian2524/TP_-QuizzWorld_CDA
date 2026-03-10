window.Quiz = {
  async start() {
    try {
      const data = await this.loadCategoryQuestions(appState.category.json);
      const levelKey = this.getJsonLevelKey(appState.level);
      const questions = data.quizz[levelKey];

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Aucune question trouvée pour ce niveau.");
      }

      appState.questions = questions.slice(0, 10);
      appState.currentQuestionIndex = 0;
      appState.score = 0;
      appState.hasAnsweredCurrentQuestion = false;

      UI.renderQuiz();
    } catch (error) {
      console.error("Erreur au démarrage du quiz :", error);
      UI.renderError("Impossible de charger le quiz pour cette rubrique.");
    }
  },

  async loadCategoryQuestions(jsonPath) {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error(`Chargement impossible : ${jsonPath}`);
    }

    return await response.json();
  },

  getJsonLevelKey(level) {
    const map = {
      debutant: "débutant",
      confirme: "confirmé",
      expert: "expert"
    };

    return map[level];
  },

  getCurrentQuestion() {
    return appState.questions[appState.currentQuestionIndex] || null;
  },

  checkAnswer(selectedAnswer) {
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion || appState.hasAnsweredCurrentQuestion) {
      return null;
    }

    const isCorrect = selectedAnswer === currentQuestion.réponse;

    if (isCorrect) {
      appState.score += 1;
    }

    appState.hasAnsweredCurrentQuestion = true;

    return {
      isCorrect,
      correctAnswer: currentQuestion.réponse,
      anecdote: currentQuestion.anecdote || ""
    };
  },

  goToNextQuestion() {
    appState.currentQuestionIndex += 1;
    appState.hasAnsweredCurrentQuestion = false;

    if (appState.currentQuestionIndex >= appState.questions.length) {
      UI.renderFinalScore();
      return;
    }

    UI.renderQuiz();
  }
};