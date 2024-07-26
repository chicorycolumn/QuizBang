const stripSentence = (s) => {
  return s
    ? s
        .toLowerCase()
        .split("")
        // .filter((char) => /\p{Script=Latin}/u.test(char))
        .join("")
    : "";
};

export const validateAnswer = (correctArr, proposedStr) => {
  correctArr = correctArr.map((c) => stripSentence(c));
  proposedStr = stripSentence(proposedStr);
  return correctArr.includes(proposedStr);
};
