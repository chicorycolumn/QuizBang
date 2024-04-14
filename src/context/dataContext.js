import { createContext, useState, useEffect } from "react";
const dataU = require("../utils/dataUtils.js");
const dispU = require("../utils/displayUtils.js");

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [round, setRound] = useState();
  const [cuestion, setCuestion] = useState({});
  const [cuestionIndex, setCuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [marks, setMarks] = useState(0);

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showRound, setShowRound] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load JSON Data
  useEffect(() => {}, []);

  // Set a Single Cuestion
  useEffect(() => {
    setCuestion(round?.cuestions[cuestionIndex]);
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
  const checkAnswer = (event, selected) => {
    let isCorrect = dataU.validateAnswer(cuestion.answerSentenceArr, selected);
    cuestion["yourAnswer"] = selected;
    cuestion["youWereCorrect"] = isCorrect;

    if (!selectedAnswer) {
      setCorrectAnswers(cuestion.answerSentenceArr);
      setSelectedAnswer(selected);

      if (isCorrect) {
        event.target.classList.add("bg-success");
        setMarks(marks + 10);
      } else {
        event.target.classList.add("bg-danger");
      }
    }
  };

  // Next Cuestion
  const moveForward = () => {
    if (dispU.isLastQ(round, cuestionIndex)) {
      // End quiz
      setShowResult(true);
      setShowStart(false);
      setShowRound(false);
    } else {
      // Go to next cuestion
      setCorrectAnswers([]);
      setSelectedAnswer("");
      const wrongBtn = document.querySelector("button.bg-danger");
      wrongBtn?.classList.remove("bg-danger");
      const rightBtn = document.querySelector("button.bg-success");
      rightBtn?.classList.remove("bg-success");
      setCuestionIndex((prev) => prev + 1);
    }
  };

  // Start Over
  const returnToStart = () => {
    setRound();
    setShowStart(true);
    setShowResult(false);
    setShowRound(false);
    setCorrectAnswers([]);
    setSelectedAnswer("");
    setCuestionIndex(0);
    setMarks(0);
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
        showResult,
        marks,
        returnToStart,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
