const uUtils = require("./universalUtils.js");

const _celsiusFahrenheit = (ranges) => {
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

  let rangedArr = uUtils.getNumArr(ranges[knownField]);
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

  let datum = null;
  return { question, answers, halfMarkAnswers, datum };
};

export const executors = {
  celsiusFahrenheitExtreme: () => {
    return _celsiusFahrenheit({
      f: [-80, 570],
      c: [-60, 300],
    });
  },
  celsiusFahrenheit: () => {
    return _celsiusFahrenheit({
      f: [-5, 122],
      c: [-20, 50],
    });
  },
  quickMaths1: (previousOperation) => {
    let operations = [
      "mul",
      "div",
      "add",
      "sub",
      "mul",
      "div",
      "add",
      "sub",
      "mul",
      "div",
      "add",
      "sub",
      "exp",
      "per",
      "fra",
    ];
    let operation = uUtils
      .selectRandom(operations)
      .filter((op) => !previousOperation || op !== previousOperation);
  },
};
