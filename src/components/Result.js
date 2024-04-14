import React, { useContext, useEffect } from "react";
import DataContext from "../context/dataContext";

const Result = () => {
  const { showResult, round, marks, returnToStart } = useContext(DataContext);

  useEffect(() => {
    const listenForEnter = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("return_to_main_menu_button").click();
      }
    };

    if (showResult) {
      document.addEventListener("keypress", listenForEnter);
    }

    return () => {
      document.removeEventListener("keypress", listenForEnter);
    };
  }, [showResult]);

  const getResultEmoji = () => {
    let resultEmojis = ["D", "C", "B", "A", "A*"];
    let totalPossibleMarks = round.cuestions.length * 10;
    let resultEmojiIndex = Math.floor((marks * 4) / totalPossibleMarks);
    return resultEmojis[resultEmojiIndex];
  };

  return (
    <section
      className="bg-dark text-white"
      style={{ display: `${showResult ? "block" : "none"}` }}
    >
      {showResult ? (
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 pt-5 pb-5">
              <div className={`text-light text-center p-5 rounded`}>
                <h1 className="mb-2 fw-bold">{`Grade: ${getResultEmoji()}`}</h1>
                <h3 className="mb-3 fw-bold">
                  You scored {marks} out of {round.cuestions.length * 10}
                </h3>

                <button
                  id="return_to_main_menu_button"
                  type="submit"
                  onClick={returnToStart}
                  className="btn mb-4 mt-3 py-2 px-4 btn-light fw-bold d-inline"
                >
                  Return to Main Menu
                </button>

                {round?.cuestions.map((cuestion, cuestIndex) => (
                  <div
                    className={`mt-3 pt-1 pb-3 ${
                      cuestion.youWereCorrect ? "bg-success" : "bg-danger"
                    }`}
                    key={`cuestion-${cuestIndex}`}
                  >
                    <h5 className="mb-2 fs-normal lh-base">{`${
                      cuestion.youWereCorrect ? "✓" : "✗"
                    } ${cuestIndex + 1}/${round.cuestions.length} ${
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
