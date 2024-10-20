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
    cuestionIsFinished,
    playerCuestionIndex,
    moveForward,
    returnToStart,
    totalCorrect,
    setRound,
    setOptionsHaveChanged,
  } = useContext(DataContext);

  const [startTime, setStartTime] = useState(new Date());
  const [showOptions, setShowOptions] = useState();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (showRound) {
      document.getElementById("text_input").focus();
      setStartTime(new Date());
    }
  }, [showRound, playerCuestionIndex]);

  useEffect(() => {
    const listenForEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        document.getElementById("exit_button").click();
      }
    };

    if (round) {
      document.addEventListener("keyup", listenForEscape);

      if (round.options && round.options.length) {
        round.options.sort((x, y) => x.localeCompare(y));
        let opts = [];
        round.options.forEach((opt) => {
          if (opt.includes("::")) {
            let catName = opt.split("::")[0];
            if (
              !opts.some((op) => op.type === "name" && op.value === catName)
            ) {
              opts.push({
                type: "name",
                value: catName,
              });
            }
            opts.push({
              type: "value",
              value: opt.split("::")[1],
              combined: opt,
            });
          } else {
            opts.push({ type: "value", value: opt, combined: opt });
          }
        });
        setOptions(opts || []);
      }
    }

    return () => {
      document.removeEventListener("keyup", listenForEscape);
    };
  }, [round]);

  const [playerInput, setPlayerInput] = useState("");

  const wrapperMoveForward = () => {
    setPlayerInput("");
    moveForward();
  };

  const wereYouCorrect = () => {
    let baseColor = "#3d3d3d";

    if (cuestion && Object.keys(cuestion).includes("yourMark")) {
      if (cuestion.yourMark === 1) {
        return "bg-success";
      }
      if (cuestion.yourMark === 0.5) {
        return "bg-warning";
      }
      if (cuestion.yourMark === 0) {
        return "bg-danger";
      }
    }

    return baseColor;
  };

  const getPercentage = () => {
    return (
      Math.round(
        (totalCorrect / (playerCuestionIndex + (cuestionIsFinished ? 1 : 0))) *
          100
      ) || 0
    );
  };

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
                <div className="w-25 d-flex justify-content-left">
                  <button
                    id="exit_button"
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
                        setPlayerInput("");
                        setShowOptions();
                        setOptions([]);

                        returnToStart();
                      }
                    }}
                  >
                    EXIT
                  </button>
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <h5 className="fs-normal lh-base text-right primarycolor">
                    {`${score}`}
                  </h5>
                </div>
                <div className="w-25 d-flex justify-content-end">
                  <h5
                    className="fs-normal lh-base text-right primarycolor"
                    onClick={() => {
                      console.log({ round });
                    }}
                  >
                    {`${getPercentage()}%`}
                  </h5>
                </div>
              </div>

              <h5 className="mt-2 mb-2 fs-normal lh-base text-left">
                {round?.title}
              </h5>
            </div>

            {options.length ? (
              <div>
                <button
                  style={{
                    background: "none",
                    color: "white",
                    fontSize: "10px",
                    width: "77.5px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (showOptions) {
                      wrapperMoveForward();
                    }
                    setShowOptions((prev) => !prev);
                    setTimeout(() => {
                      if (round?.selectedOptions) {
                        round.selectedOptions.forEach((selectedOption) => {
                          let el = document.getElementById(
                            `option-${selectedOption}`
                          );
                          if (el) {
                            el.checked = true;
                          }
                        });
                      }
                    }, 50);
                  }}
                >
                  {`${showOptions ? "Save" : "Show"} options`}
                </button>
                {showOptions
                  ? options.map((option, optionIndex) => {
                      if (option.type === "name") {
                        return (
                          <p
                            className="my-0"
                            key={`${optionIndex}-name-${option.combined}`}
                          >
                            {option.value.toUpperCase()}
                          </p>
                        );
                      }
                      return (
                        <div key={`${optionIndex}-value-${option.combined}`}>
                          <input
                            type="checkbox"
                            id={`option-${option.combined}`}
                            name={`option-${option.combined}`}
                            onChange={(e) => {
                              e.stopPropagation();
                              setRound((prev) => {
                                if (!prev.selectedOptions) {
                                  prev.selectedOptions = [];
                                }
                                if (e.target.checked) {
                                  prev.selectedOptions.push(option.combined);
                                } else {
                                  prev.selectedOptions =
                                    prev.selectedOptions.filter(
                                      (x) => x !== option.combined
                                    );
                                }
                                return prev;
                              });
                              setOptionsHaveChanged(true);
                            }}
                          />
                          <label htmlFor={`option-${option.combined}`}>
                            {dispU.capitalise(option.value)}
                          </label>
                        </div>
                      );
                    })
                  : ""}
              </div>
            ) : (
              ""
            )}

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
                  {playerCuestionIndex + 1}
                </h5>
              </div>
              <div>
                <form>
                  <input
                    id="text_input"
                    type={cuestion?.inputType || "text"}
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
                    className={`option w-100 text-center btn text-white py-2 px-3 mt-3 rounded btn-dark ${wereYouCorrect()}`}
                    disabled={!playerInput}
                    onClick={(event) => {
                      event.preventDefault();
                      if (cuestionIsFinished) {
                        wrapperMoveForward();
                      }
                      if (playerInput) {
                        let secondsElapsed =
                          Math.floor(((new Date() - startTime) / 1000) * 10) /
                          10;
                        let putativeScore =
                          dispU.getPutativeScore(secondsElapsed);
                        checkAnswer(
                          event,
                          playerInput,
                          putativeScore,
                          round,
                          cuestion
                        );
                      }
                    }}
                  >
                    {cuestionIsFinished
                      ? scoreJustReceived
                        ? `+${scoreJustReceived}${
                            cuestion?.yourMark === 0.5 ? " (half points)" : "!"
                          }`
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
                    {cuestion?.datum.notes &&
                      cuestion.datum.notes.map((note, noteIndex) => (
                        <p className="my-2" key={`note-${noteIndex}`}>
                          {"💡 " + note}
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
