import React, { useContext } from "react";
import DataContext from "../context/dataContext";
import mainLogo from "../logo192.png";

const Start = () => {
  const { startQuiz, showStart } = useContext(DataContext);
  return (
    <section
      className="text-white text-center bg-dark"
      style={{ display: `${showStart ? "block" : "none"}` }}
    >
      <div className="container">
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="col-lg-8 pb-5">
            <img src={mainLogo} alt="Lingfinity logo" className="w-25" />
            <h1 className="fw-bold mb-4">Lingfinity</h1>
            <button
              onClick={startQuiz}
              className="btn px-4 py-2 bg-light text-dark fw-bold"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Start;
