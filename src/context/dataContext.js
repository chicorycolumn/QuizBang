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
  const [playerCuestionIndex, setPlayerCuestionIndex] = useState(0);
  const [cuestionIsFinished, setCuestionIsFinished] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [scoreJustReceived, setScoreJustReceived] = useState(0);
  const [optionsHaveChanged, setOptionsHaveChanged] = useState();

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

        let newCuestion = makeCuestion(round, prevCuestion, cuestionIndex);
        return newCuestion;
      }
    });
  }, [round, cuestionIndex]);

  // Start Quiz
  const startQuiz = (filename) => {
    fetch(`data/${filename}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.datums) {
          data.categories.forEach((category) => {
            if (!data.options) {
              data.options = [];
            }
            data.datums.forEach((datum) => {
              datum[category].split("//").forEach((value) => {
                let optionString = `${category}::${value}`;

                if (!data.options.includes(optionString)) {
                  data.options.push(optionString);
                }
              });
            });
          });
          data.categories.sort((x, y) => x.localeCompare(y));
        }

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

      const incrementScores = (scoreToAdd, multiplier = 1) => {
        scoreToAdd = Math.ceil(scoreToAdd * multiplier);
        setScoreJustReceived(scoreToAdd);
        setScore((prev) => prev + scoreToAdd);
        setTotalCorrect((prev) => prev + multiplier);
      };

      if (mark) {
        incrementScores(putativeScore, mark);
      }
    }
  };

  // Next Cuestion
  const moveForward = () => {
    // Go to next cuestion
    setCuestionIsFinished();
    setScoreJustReceived(0);
    setSelectedAnswer("");
    if (optionsHaveChanged) {
      setCuestionIndex(0);
      setOptionsHaveChanged();
      setTimeout(() => {
        setCuestionIndex((prev) => prev + 1);
      }, 250);
    } else {
      setCuestionIndex((prev) => prev + 1);
      setPlayerCuestionIndex((prev) => prev + 1);
    }
  };

  // Start Over
  const returnToStart = () => {
    setRound();
    setShowStart(true);
    setShowRound(false);
    setCuestionIsFinished();
    setSelectedAnswer("");
    setCuestionIndex(0);
    setPlayerCuestionIndex(0);
    setScore(0);
    setTotalCorrect(0);
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
        setRound,
        checkAnswer,
        cuestionIsFinished,
        cuestionIndex,
        playerCuestionIndex,
        moveForward,
        score,
        returnToStart,
        scoreJustReceived,
        totalCorrect,
        setOptionsHaveChanged,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
