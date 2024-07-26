import React, { useContext, useState, useEffect } from "react";
import DataContext from "../context/dataContext";
const dispU = require("../utils/displayUtils.js");

const Quiz = () => {
  const {
    showRound,
    cuestion,
    round,
    score,
    scoreJustReceived,
    checkAnswer,
    correctAnswers,
    // selectedAnswer,
    cuestionIndex,
    moveForward,
    returnToStart,
  } = useContext(DataContext);

  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    if (showRound) {
      document.getElementById("text_input").focus();
      setStartTime(new Date());
    }
  }, [showRound, cuestionIndex]);

  const [playerInput, setPlayerInput] = useState("");

  const wrapperMoveForward = () => {
    setPlayerInput("");
    moveForward();
  };
  const cuestionIsFinished = correctAnswers?.length;

  return (
    <section
      className="bg-dark text-white"
      style={{ display: `${showRound ? "block" : "none"}` }}
    >
      <div className="container">
        <div className="row vh-100 align-items-start justify-content-center">
          <div className="col-lg-8 pb-5">
            <div className="d-flex flex-column justify-content-between align-items-center gap-md-3 px-1">
              <div className="mt-3 d-flex w-100 justify-content-between align-items-center gap-md-3 px-1">
                <button
                  className="btn w-5 h-25 bg-primarycolordark text-light px-2 mb-1"
                  style={{
                    height: "8px",
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                  }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to exit? Your score will be reset."
                      )
                    ) {
                      returnToStart();
                    }
                  }}
                >
                  EXIT
                </button>
                <h5 className="fs-normal lh-base text-right primarycolor">
                  {`Score: ${score}`}
                </h5>
              </div>

              <h5 className="mt-2 mb-4 fs-normal lh-base text-left">
                {round?.title}
              </h5>
            </div>
            <div
              className="card p-4"
              style={{
                background: "#3d3d3d",
                borderColor: "#646464",
                borderWidth: "1px",
              }}
            >
              <div className="d-flex justify-content-between gap-md-3">
                <h5 className="mb-2 fs-normal lh-base">
                  {cuestion?.question
                    ? cuestion.question
                    : "No question found."}
                </h5>
                <h5
                  className="primarycolor"
                  style={{
                    width: "100px",
                    textAlign: "right",
                  }}
                >
                  {cuestionIndex + 1}
                </h5>
              </div>
              <div>
                <form>
                  <input
                    id="text_input"
                    type="text"
                    onChange={(e) => {
                      if (cuestionIsFinished) {
                        return;
                      }
                      setPlayerInput(e.target.value);
                    }}
                    value={playerInput}
                    placeholder="Type your answer..."
                    className={`option w-100 text-start btn text-white py-2 px-3 mt-3 rounded btn-dark`} //${correctAnswer === item && "bg-success"}
                  ></input>
                  <button
                    type="submit"
                    className={`option w-100 text-center btn text-white py-2 px-3 mt-3 rounded btn-dark ${
                      cuestion &&
                      Object.keys(cuestion).includes("youWereCorrect")
                        ? cuestion.youWereCorrect
                          ? "bg-success"
                          : "bg-danger"
                        : "#3d3d3d"
                    }`}
                    disabled={!playerInput}
                    onClick={(event) => {
                      event.preventDefault();
                      if (cuestionIsFinished) {
                        wrapperMoveForward();
                      }
                      if (playerInput) {
                        console.log(cuestion.answers);
                        let secondsElapsed =
                          Math.floor(((new Date() - startTime) / 1000) * 10) /
                          10;
                        let putativeScore =
                          dispU.getPutativeScore(secondsElapsed);
                        checkAnswer(event, playerInput, putativeScore);
                      }
                    }}
                  >
                    {cuestionIsFinished
                      ? scoreJustReceived
                        ? `+${scoreJustReceived}!`
                        : "Next"
                      : "Submit"}
                  </button>
                </form>
                {cuestionIsFinished ? (
                  <div
                    className={`option w-100 text-start btn text-white py-1 px-3 mt-3 rounded btn-dark`} //${correctAnswer === item && "bg-success"}
                  >
                    {cuestion.answers &&
                      cuestion.answers.map((ans, ansIndex) => (
                        <p className="my-2" key={`ans-${ansIndex}`}>
                          {"✅ " + ans}
                        </p>
                      ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quiz;
