import React, { useContext, useState } from "react";
import DataContext from "../context/dataContext";

const Quiz = () => {
  const {
    showRound,
    cuestion,
    round,
    checkAnswer,
    correctAnswers,
    selectedAnswer,
    cuestionIndex,
    nextCuestion,
    showTheResult,
  } = useContext(DataContext);

  const [playerInput, setPlayerInput] = useState("");

  return (
    <section
      className="bg-dark text-white"
      style={{ display: `${showRound ? "block" : "none"}` }}
    >
      <div className="container">
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="col-lg-8">
            <div
              className="card p-4"
              style={{ background: "#3d3d3d", borderColor: "#646464" }}
            >
              <div className="d-flex justify-content-between gap-md-3">
                <h5 className="mb-2 fs-normal lh-base">{round?.title}</h5>
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
                  {cuestionIndex} / {round?.cuestions?.length}
                </h5>
              </div>
              <div>
                <input
                  onChange={(e) => {
                    setPlayerInput(e.target.value);
                  }}
                  value={playerInput}
                  placeholder="Type your answer..."
                  className={`option w-100 text-start btn text-white py-2 px-3 mt-3 rounded btn-dark`} //${correctAnswer === item && "bg-success"}
                ></input>
                <button
                  className={`option w-100 text-start btn text-white py-2 px-3 mt-3 rounded btn-dark`}
                  onClick={(event) => checkAnswer(event, playerInput)}
                >
                  Submit
                </button>
                {correctAnswers?.length ? (
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

              {cuestionIndex + 1 !== round?.cuestions?.length ? (
                <button
                  className="btn py-2 w-100 mt-3 bg-primary text-light fw-bold"
                  onClick={() => {
                    setPlayerInput("");
                    nextCuestion();
                  }}
                  disabled={!selectedAnswer}
                >
                  Next Cuestion
                </button>
              ) : (
                <button
                  className="btn py-2 w-100 mt-3 bg-primary text-light fw-bold"
                  onClick={showTheResult}
                  disabled={!selectedAnswer}
                >
                  Show Result
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quiz;
