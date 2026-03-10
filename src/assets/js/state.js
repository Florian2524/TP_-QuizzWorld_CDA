window.appState = {
  // Données de session
  playerName: "",
  category: null,
  level: "",
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  hasAnsweredCurrentQuestion: false,

  // Référentiel des rubriques disponibles
  categories: [
    {
      id: "internet",
      title: "Internet",
      image: "./assets/img/internet.jpg",
      json: "./assets/json/quizzinternet.json"
    },
    {
      id: "javascript",
      title: "JavaScript",
      image: "./assets/img/javascript.png",
      json: "./assets/json/quizzjavascript.json"
    },
    {
      id: "microsoft",
      title: "Microsoft",
      image: "./assets/img/microsoft.jpg",
      json: "./assets/json/quizzmicrosoft.json"
    },
    {
      id: "nintendo",
      title: "Nintendo",
      image: "./assets/img/nintendo.jpg",
      json: "./assets/json/quizznintendo.json"
    },
    {
      id: "nombres",
      title: "Nombres",
      image: "./assets/img/nombres.jpg",
      json: "./assets/json/quizznombres.json"
    },
    {
      id: "php",
      title: "PHP",
      image: "./assets/img/PHP.jpg",
      json: "./assets/json/quizzphp.json"
    },
    {
      id: "web",
      title: "Web",
      image: "./assets/img/web.jpg",
      json: "./assets/json/quizzweb.json"
    },
    {
      id: "dates20",
      title: "Dates 20e siècle",
      image: "./assets/img/dates20.jpg",
      json: "./assets/json/quizzdates20.json"
    }
  ]
};