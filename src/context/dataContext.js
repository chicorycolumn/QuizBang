import { createContext, useState, useEffect } from "react";
const dataU = require("../utils/dataUtils.js");
const quizU = require("../utils/quizUtils.js");
const uUtils = require("../utils/universalUtils.js");
const executors = require("../utils/executors.js").executors;

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [round, setRound] = useState();
  const [cuestion, setCuestion] = useState({});
  const [cuestionIndex, setCuestionIndex] = useState(0);
  const [cuestionIsFinished, setCuestionIsFinished] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [scoreJustReceived, setScoreJustReceived] = useState(0);

  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showRound, setShowRound] = useState(false);

  // // Load JSON Data
  // useEffect(() => {}, []);

  // Set a Single Cuestion
  useEffect(() => {
    setCuestion((prevCuestion) => {
      if (round) {
        if (round.datums && !(cuestionIndex % round.datums.length)) {
          uUtils.shuffle(round.datums);
        }

        let makeCuestion = round.executor
          ? executors[round.executor]
          : quizU.makeCuestion;

        let newCuestion = makeCuestion(
          round,
          prevCuestion,
          round.datums && cuestionIndex % round.datums.length
        );
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
  const checkAnswer = (event, selected, putativeScore, modifiers) => {
    let answers = cuestion.answers;
    let halfMarkAnswers = cuestion.halfMarkAnswers;

    let mark = dataU.validateAnswer(
      selected,
      answers,
      halfMarkAnswers,
      modifiers
    );

    cuestion["yourAnswer"] = selected;
    cuestion["yourMark"] = mark;

    if (!selectedAnswer) {
      setCuestionIsFinished(true);
      setSelectedAnswer(selected);

      if (mark === 1) {
        setScoreJustReceived(putativeScore);
        setScore((prev) => prev + putativeScore);
      } else if (mark === 0.5) {
        let halfScore = Math.ceil(putativeScore / 2);
        setScoreJustReceived(halfScore);
        setScore((prev) => prev + halfScore);
      }
    }
  };

  // Next Cuestion
  const moveForward = () => {
    // Go to next cuestion
    setCuestionIsFinished();
    setScoreJustReceived(0);
    setSelectedAnswer("");
    setCuestionIndex((prev) => prev + 1);
  };

  // Start Over
  const returnToStart = () => {
    setRound();
    setShowStart(true);
    setShowRound(false);
    setCuestionIsFinished();
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
        cuestionIsFinished,
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
