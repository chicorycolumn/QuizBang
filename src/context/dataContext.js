import { createContext, useState, useEffect } from "react";
const dataU = require("../utils/dataUtils.js");
const dispU = require("../utils/displayUtils.js");
const quizU = require("../utils/quizUtils.js");

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [round, setRound] = useState();
  const [cuestion, setCuestion] = useState({});
  const [cuestionIndex, setCuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [scoreJustReceived, setScoreJustReceived] = useState(0);

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showRound, setShowRound] = useState(false);

  // Load JSON Data
  useEffect(() => {}, []);

  // Set a Single Cuestion
  useEffect(() => {
    setCuestion((prevCuestion) => {
      if (round) {
        let newCuestion = quizU.makeCuestion(round, prevCuestion?.datum);
        return newCuestion;
      }
    });
  }, [round, cuestionIndex]);

  // Start Quiz
  const startQuiz = (filename) => {
    fetch(`data/${filename}.json`)
      .then((res) => res.json())
      .then((data) => {
        setRound(data);
        setShowStart(false);
        setShowRound(true);
      });
  };

  // Check Answer
  const checkAnswer = (event, selected, putativeScore) => {
    let answers = cuestion.answers;

    let isCorrect = dataU.validateAnswer(answers, selected);
    cuestion["yourAnswer"] = selected;
    cuestion["youWereCorrect"] = isCorrect;

    if (!selectedAnswer) {
      setCorrectAnswers(answers);
      setSelectedAnswer(selected);

      if (isCorrect) {
        setScoreJustReceived(putativeScore);
        setScore((prev) => prev + putativeScore);
      }
    }
  };

  // Next Cuestion
  const moveForward = () => {
    // Go to next cuestion
    setCorrectAnswers([]);
    setScoreJustReceived(0);
    setSelectedAnswer("");
    setCuestionIndex((prev) => prev + 1);
  };

  // Start Over
  const returnToStart = () => {
    setRound();
    setShowStart(true);
    setShowRound(false);
    setCorrectAnswers([]);
    setSelectedAnswer("");
    setCuestionIndex(0);
    setScore(0);
    const wrongBtn = document.querySelector("button.bg-danger");
    wrongBtn?.classList.remove("bg-danger");
    const rightBtn = document.querySelector("button.bg-success");
    rightBtn?.classList.remove("bg-success");
  };

  return (
    <DataContext.Provider
      value={{
        startQuiz,
        showStart,
        showRound,
        cuestion,
        round,
        checkAnswer,
        correctAnswers,
        selectedAnswer,
        cuestionIndex,
        moveForward,
        score,
        returnToStart,
        scoreJustReceived,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
