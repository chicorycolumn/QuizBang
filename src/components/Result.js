import React, { useContext } from "react";
import DataContext from "../context/dataContext";

const Result = () => {
  const { showResult, round, marks, startOver } = useContext(DataContext);
  return (
    <section
      className="bg-dark text-white"
      style={{ display: `${showResult ? "block" : "none"}` }}
    >
      {round ? (
        <div className="container">
          <div className="row vh-100 align-items-center justify-content-center">
            <div className="col-lg-6">
              <div
                className={`text-light text-center p-5 rounded ${
                  marks > (round.cuestions.length * 5) / 2
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                <h1 className="mb-2 fw-bold">
                  {marks > (round.cuestions.length * 5) / 2
                    ? "Awesome!"
                    : "Oops!"}
                </h1>
                <h3 className="mb-3 fw-bold">
                  Your score is {marks} out of {round.cuestions.length * 5}
                </h3>

                <button
                  onClick={startOver}
                  className="btn py-2 px-4 btn-light fw-bold d-inline"
                >
                  Start Over
                </button>

                {round?.cuestions.map((cuestion, cuestionIndex) => (
                  <div key={`cuestion-${cuestionIndex}`}>
                    <h5 className="mb-2 fs-normal lh-base">{`${
                      cuestion.youWereCorrect ? "✓" : "✗"
                    } ${cuestionIndex + 1}/${round.cuestions.length} ${
                      cuestion.questionSentenceArr[0]
                    }`}</h5>
                    <h6 className="mb-2 fs-normal lh-base">Correct answers:</h6>
                    {cuestion.answerSentenceArr.map((corrAns, corrAnsIndex) => (
                      <p key={`corrAns-${corrAnsIndex}`}>{corrAns}</p>
                    ))}
                    <h6 className="mb-2 fs-normal lh-base">Your answer:</h6>
                    <p>{cuestion.yourAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default Result;
