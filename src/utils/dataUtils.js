const strip = (s, modifiers) => {
  if (modifiers.ignorePunctuation) {
    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  if (modifiers.ignorePunctuationAndDiacritics) {
    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  if (modifiers.ignorePunctuationAndDiacriticsAndBrackets) {
    if (typeof s === "string") {
      if (s.split("").includes("(")) {
        let cleaned = "";
        let ignoring = false;
        s.split("").forEach((char) => {
          if (!ignoring && !"()".includes(char)) {
            cleaned += char;
          }
          if (char === "(") {
            ignoring = true;
          }
          if (ignoring && char === ")") {
            ignoring = false;
          }
        });
        s = cleaned;
      }
    }

    return s || s === 0
      ? s
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .split("")
          .filter((char) => /\p{Script=Latin}/u.test(char))
          .join("")
          .trim()
      : "";
  }

  return s || s === 0 ? s.toString().toLowerCase().trim() : "";
};

const checkIfOneCharacterOut = (shorterAnswer, longerAnswer) => {
  console.log({ shorterAnswer, longerAnswer });
  let longerAnswerModified = [];
  let errorCount = 0;

  longerAnswer.split("").forEach((longChar, index) => {
    if (errorCount > 1) {
      return;
    }
    if (errorCount === 1) {
      index = index - 1;
    }
    let shortChar = shorterAnswer.length > index ? shorterAnswer[index] : false;
    if (longChar === shortChar) {
      longerAnswerModified.push(longChar);
    } else {
      errorCount++;
    }
  });

  if (errorCount > 1) {
    return false;
  }
  return longerAnswerModified.join("") === shorterAnswer;
};

const checkIfAnswerIfOneCharacterOut = (
  correctAnswerStripped,
  playerAnswerStripped,
  allAnswersStripped
) => {
  if (correctAnswerStripped === playerAnswerStripped) {
    return true;
  }

  const alphabeticalCharsOnly = (s) => /^\p{L}+$/gu.test(s);

  if (
    !alphabeticalCharsOnly(correctAnswerStripped) ||
    !alphabeticalCharsOnly(playerAnswerStripped)
  ) {
    return false;
  }

  if (correctAnswerStripped.length < 3 || playerAnswerStripped.length < 3) {
    return false;
  }

  if (
    allAnswersStripped
      .filter((a) => a !== correctAnswerStripped)
      .includes(playerAnswerStripped)
  ) {
    return false;
  }

  if (correctAnswerStripped.length === playerAnswerStripped.length) {
    let errorCount = correctAnswerStripped
      .split("")
      .filter((correctChar, index) => {
        let playerChar = playerAnswerStripped[index];
        return correctChar !== playerChar;
      }).length;
    return errorCount <= 1;
  }

  if (correctAnswerStripped.length === playerAnswerStripped.length - 1) {
    return checkIfOneCharacterOut(correctAnswerStripped, playerAnswerStripped);
  }

  if (playerAnswerStripped.length === correctAnswerStripped.length - 1) {
    return checkIfOneCharacterOut(playerAnswerStripped, correctAnswerStripped);
  }
  return false;
};

export const validateAnswer = (
  playerAnswer,
  correctArr,
  halfCorrectArr = [],
  modifiers,
  allAnswers
) => {
  let playerAnswerStripped = strip(playerAnswer, modifiers);
  let correctArrStripped = correctArr.map((s) => strip(s, modifiers));

  if (correctArrStripped.includes(playerAnswerStripped)) {
    return 1;
  }

  let halfCorrectArrStripped = halfCorrectArr.map((s) => strip(s, modifiers));
  if (halfCorrectArrStripped.includes(playerAnswerStripped)) {
    return 0.5;
  }

  let allAnswersStripped = allAnswers.map((s) => strip(s, modifiers));

  if (
    correctArrStripped.some((correctAnswerStripped) =>
      checkIfAnswerIfOneCharacterOut(
        correctAnswerStripped,
        playerAnswerStripped,
        allAnswersStripped
      )
    )
  ) {
    return 1;
  }

  if (
    halfCorrectArrStripped.some((halfCorrectAnswerStripped) =>
      checkIfAnswerIfOneCharacterOut(
        halfCorrectAnswerStripped,
        playerAnswerStripped,
        allAnswersStripped
      )
    )
  ) {
    return 0.5;
  }

  return 0;
};
