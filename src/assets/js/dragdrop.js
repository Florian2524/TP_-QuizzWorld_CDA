window.DragDrop = {
  init() {
    const answerCards = document.querySelectorAll(".answer-card");
    const dropzone = document.getElementById("quiz-dropzone");

    answerCards.forEach((card) => {
      card.setAttribute("draggable", "true");

      card.addEventListener("dragstart", (event) => {
        if (appState.hasAnsweredCurrentQuestion) {
          event.preventDefault();
          return;
        }

        card.classList.add("answer-card--dragging");
        event.dataTransfer.setData("text/plain", card.dataset.answerValue);
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("answer-card--dragging");
      });
    });

    dropzone.addEventListener("dragover", (event) => {
      if (appState.hasAnsweredCurrentQuestion) {
        return;
      }

      event.preventDefault();
      dropzone.classList.add("quiz-dropzone--over");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("quiz-dropzone--over");
    });

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("quiz-dropzone--over");

      if (appState.hasAnsweredCurrentQuestion) {
        return;
      }

      const selectedAnswer = event.dataTransfer.getData("text/plain");
      const draggedCard = document.querySelector(
        `.answer-card[data-answer-value="${CSS.escape(selectedAnswer)}"]`
      );

      if (!selectedAnswer || !draggedCard) {
        return;
      }

      UI.handleDroppedAnswer(selectedAnswer, draggedCard);
    });
  }
};