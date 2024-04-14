import React, { useContext } from "react";
import DataContext from "../context/dataContext";
import mainLogo from "../logo192.png";
var context = require.context("../../public/data", true);

const Start = () => {
  const { startQuiz, showStart } = useContext(DataContext);
  let roundNames = context
    .keys()
    .filter((k) => !k.includes("json"))
    .map((k) => k.slice(2));

  return (
    <section
      className="text-white text-center bg-dark"
      style={{ display: `${showStart ? "block" : "none"}` }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-8 pb-5 mt-5">
            <img src={mainLogo} alt="Lingfinity logo" className="w-25" />
            <h1 className="fw-bold mb-4">Lingfinity</h1>

            <div className="border border-primary row align-items-center justify-content-center">
              {roundNames.map((roundName) => (
                <button
                  onClick={() => {
                    startQuiz(roundName);
                  }}
                  className="btn w-75 px-4 mb-1 py-2 bg-light text-dark fw-bold"
                >
                  {roundName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Start;
