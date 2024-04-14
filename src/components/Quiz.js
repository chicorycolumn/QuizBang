import React, { useContext, useState, useEffect } from "react";
import DataContext from "../context/dataContext";
const dataU = require("../utils/dataUtils.js");
const dispU = require("../utils/displayUtils.js");

const Quiz = () => {
  const {
    showRound,
    cuestion,
    round,
    checkAnswer,
    correctAnswers,
    selectedAnswer,
    cuestionIndex,
    moveForward,
  } = useContext(DataContext);

  useEffect(() => {
    if (showRound) {
      document.getElementById("text_input").focus();
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
            <h5 className="mb-5 mt-5 fs-normal lh-base text-center">
              {round?.title}
            </h5>
            <div
              className="card p-4"
              style={{ background: "#3d3d3d", borderColor: "#646464" }}
            >
              <div className="d-flex justify-content-between gap-md-3">
                <h5 className="mb-2 fs-normal lh-base">
                  {cuestion?.questionSentenceArr
                    ? cuestion?.questionSentenceArr[0]
                    : "nope"}
                </h5>
                <h5
                  style={{
                    color: "#60d600",
                    width: "100px",
                    textAlign: "right",
                  }}
                >
                  {cuestionIndex + 1} / {round?.cuestions?.length}
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
                    className={`option w-100 text-start btn text-white py-2 px-3 mt-3 rounded btn-dark`}
                    disabled={!playerInput}
                    onClick={(event) => {
                      event.preventDefault();
                      if (cuestionIsFinished) {
                        wrapperMoveForward();
                      }
                      if (playerInput) {
                        checkAnswer(event, playerInput);
                      }
                    }}
                  >
                    Submit
                  </button>
                </form>
                <button
                  className="btn py-2 w-100 mt-3 bg-primary text-light fw-bold"
                  onClick={wrapperMoveForward}
                  disabled={!selectedAnswer}
                >
                  {dispU.isLastQ(round, cuestionIndex)
                    ? "End Quiz"
                    : "Next Cuestion"}
                </button>
                {cuestionIsFinished ? (
                  <div
                    className={`option w-100 text-start btn text-white py-2 px-3 mt-3 rounded btn-dark`} //${correctAnswer === item && "bg-success"}
                  >
                    {cuestion?.answerSentenceArr.map(
                      (ansSent, ansSentIndex) => (
                        <p key={`ansSent-${ansSentIndex}`}>{ansSent}</p>
                      )
                    )}
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
