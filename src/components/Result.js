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
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 pt-5 pb-5">
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
                  <div className="mt-5" key={`cuestion-${cuestionIndex}`}>
                    <h5 className="mb-2 fs-normal lh-base">{`${
                      cuestion.youWereCorrect ? "✓" : "✗"
                    } ${cuestionIndex + 1}/${round.cuestions.length} ${
                      cuestion.questionSentenceArr[0]
                    }`}</h5>
                    <h6 className="mb-2 fs-normal lh-base">Your answer:</h6>
                    <p className="m-0">{cuestion.yourAnswer}</p>
                    <h6 className="mt-3 mb-2 fs-normal lh-base">
                      Correct answers:
                    </h6>
                    {cuestion.answerSentenceArr.map((corrAns, corrAnsIndex) => (
                      <p className="m-0" key={`corrAns-${corrAnsIndex}`}>
                        {corrAns}
                      </p>
                    ))}
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
