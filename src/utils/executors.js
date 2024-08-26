const uUtils = require("./universalUtils.js");

export const executors = {
  celsiusFahrenheit: (round) => {
    let ranges =
      round.selectedOptions &&
      round.selectedOptions.includes("extreme temperatures")
        ? {
            f: [-80, 570],
            c: [-60, 300],
          }
        : {
            f: [-5, 122],
            c: [-20, 50],
          };

    let convertFrom = {
      f: (fah) => {
        return (fah - 32) / 1.8;
      },
      c: (cel) => {
        return cel * 1.8 + 32;
      },
    };

    let knownField = uUtils.selectRandom(["f", "c"]);
    let unknownField = knownField === "f" ? "c" : "f";

    let rangedArr = uUtils.getNumArr(
      ranges[knownField][0],
      ranges[knownField][1]
    );
    let known = uUtils.selectRandom(rangedArr);
    let _unknown = Math.round(convertFrom[knownField](known) * 10) / 10;
    let unknown = Math.round(_unknown);

    let question = `What is ${known}${knownField.toUpperCase()} in ${unknownField.toUpperCase()}? You must round your answer.`;
    let answers = [unknown];

    let halfMarkAnswers = [];
    answers.forEach((ans) => {
      halfMarkAnswers.push(ans - 1);
      halfMarkAnswers.push(ans - 2);
      halfMarkAnswers.push(ans + 1);
      halfMarkAnswers.push(ans + 2);
    });
    if (!answers.includes(_unknown)) {
      answers.push(_unknown);
    }

    return {
      question,
      answers,
      halfMarkAnswers,
      datum: knownField,
      inputType: "number",
    };
  },

  quickMaths1: (quiz, prevCuestion) => {
    let previousOperation = prevCuestion?.datum;
    let operations = ["mul", "div", "add", "sub"];

    operations.push(...operations);
    if (quiz.selectedOptions) {
      if (quiz.selectedOptions.includes("exponents")) {
        operations.push("exp");
        operations.push("exp");
      }
      if (quiz.selectedOptions.includes("percentages")) {
        operations.push("per");
        operations.push("per");
      }
      if (quiz.selectedOptions.includes("fractions")) {
        operations.push("fra");
        operations.push("fra");
      }
    }

    let operation = uUtils.selectRandom(
      operations.filter((op) => !previousOperation || op !== previousOperation)
    );

    let operationFunctions = {
      exp: () => {
        let num = uUtils.selectRandom(
          uUtils.getNumArr(2, 20).filter((n) => n !== 10)
        );
        let exponent;
        if (num < 5) {
          exponent = uUtils.selectRandom(uUtils.getNumArr(3, 6));
        } else if (num < 10) {
          exponent = uUtils.selectRandom(uUtils.getNumArr(2, 4));
        } else {
          exponent = uUtils.selectRandom(uUtils.getNumArr(2, 3));
        }

        let unknown = num ** exponent;
        return [`${num}^${exponent}`, unknown];
      },
      per: () => {
        let unknown = uUtils.selectRandom(uUtils.getNumArr(12, 200));
        let percentage = uUtils.selectRandom(
          uUtils
            .getNumArr(2, 99)
            .filter((n) => n !== 10)
            .filter((n) => !(100 % n) || !(((100 / n) * 40) % 10))
        );
        let known = unknown * (100 / percentage);
        return [`${percentage}% of ${known}`, unknown];
      },
      fra: () => {
        let num = uUtils.selectRandom(uUtils.getNumArr(12, 99));
        let numerator = uUtils.selectRandom(uUtils.getNumArr(2, 12));
        let denominator =
          numerator + uUtils.selectRandom(uUtils.getNumArr(1, 12));

        let known = num * denominator;
        let unknown = num * numerator;

        return [`${numerator}/${denominator} of ${known}`, unknown];
      },
      add: () => {
        let numA = uUtils.selectRandom(uUtils.getNumArr(101, 999));
        let numB = uUtils.selectRandom(
          uUtils.getNumArr(101, 999).filter((n) => n !== numA)
        );
        let unknown = numA + numB;
        return [`${numA} + ${numB}`, unknown];
      },
      sub: () => {
        let numA = uUtils.selectRandom(uUtils.getNumArr(101, 999));
        let numB = uUtils.selectRandom(
          uUtils.getNumArr(101, 999).filter((n) => n !== numA)
        );
        if (numA > numB) {
          let unknown = numA - numB;
          return [`${numA} - ${numB}`, unknown];
        }
        let unknown = numB - numA;
        return [`${numB} - ${numA}`, unknown];
      },
      mul: () => {
        let numA = uUtils.selectRandom(uUtils.getNumArr(12, 99));
        let numB = uUtils.selectRandom(
          uUtils.getNumArr(12, 99).filter((n) => n !== numA)
        );
        let unknown = numA * numB;
        return [`${numA} × ${numB}`, unknown];
      },
      div: () => {
        let numA = uUtils.selectRandom(uUtils.getNumArr(2, 9));
        let numB = uUtils.selectRandom(
          uUtils.getNumArr(12, 99).filter((n) => n !== numA)
        );
        let multiplied = numA * numB;
        return Math.round(Math.random())
          ? [`${multiplied} ÷ ${numA}`, numB]
          : [`${multiplied} ÷ ${numB}`, numA];
      },
    };
    let data = operationFunctions[operation]();
    let question = data[0];
    let answers = [data[1]];
    return { question, answers, datum: operation, inputType: "number" };
  },
};
