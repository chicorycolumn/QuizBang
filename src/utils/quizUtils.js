const uUtils = require("./universalUtils.js");

export const makeCuestion = (quiz, prevCuestion) => {
  let previousDatum = prevCuestion?.datum;
  let uniqueKey = quiz.uniqueKey || "name";

  let datum = uUtils.selectRandom(
    quiz["datums"].filter(
      (datum) => !previousDatum || previousDatum[uniqueKey] !== datum[uniqueKey]
    )
  );
  let { fieldsToTest } = quiz;
  if (!fieldsToTest || !fieldsToTest.length) {
    fieldsToTest = Object.keys(quiz.datums[0]);
  }

  let fields = fieldsToTest.filter(
    (field) => datum[field] || datum[field] === 0
  );

  let unknownField = uUtils.selectRandom(fields);

  let availableKnownFields = fields
    .filter((field) => datum[field] || datum[field] === 0)
    .filter((f) => {
      if (quiz.forThisUnknownUseOnlyTheseKnowns) {
        let availables = quiz.forThisUnknownUseOnlyTheseKnowns[unknownField];
        if (availables) {
          return availables.includes(f);
        }
      }
      return true;
    });

  let knownField = uUtils.selectRandom(
    availableKnownFields.filter((field) => field !== unknownField)
  );
  let label = quiz["label"] || unknownField;

  const getField = (raw) => {
    return uUtils.selectRandom(raw.toString().split("//"));
  };
  const getFields = (raw) => {
    return raw.toString().split("//");
  };
  const getGenericPhrasing = (label, knownField, unknownField, knownItem) => {
    if (unknownField === "name") {
      return `Which ${label} has ${knownField} of ${knownItem}?`;
    } else if (knownField === "name") {
      return `What is the ${unknownField} of ${knownItem}?`;
    } else {
      return `What is the ${unknownField} of the ${label} with ${knownField} of ${knownItem}?`;
    }
  };
  const getSpecificPhrasing = (unknownField, knownItem) => {
    return eval(quiz.questionPhrasingPerUnknown[unknownField]);
  };

  let knownValue = getField(datum[knownField]);

  let question = quiz.questionPhrasingPerUnknown
    ? getSpecificPhrasing(unknownField, knownValue)
    : getGenericPhrasing(label, knownField, unknownField, knownValue);

  let answers = getFields(datum[unknownField]);

  if (quiz.forThisUnknownAcceptAlsoThisUnknown) {
    let additionalAnswerFields =
      quiz.forThisUnknownAcceptAlsoThisUnknown[unknownField] || [];
    additionalAnswerFields
      .filter((additionalAnswerField) => additionalAnswerField !== knownField)
      .forEach((additionalAnswerField) => {
        let additionalAnswers = getFields(datum[additionalAnswerField]);
        additionalAnswers.forEach((additionalAnswer) => {
          if (!answers.includes(additionalAnswer)) {
            answers.push(additionalAnswer);
          }
        });
      });
  }

  quiz.datums.forEach((datum) => {
    let _knowns = getFields(datum[knownField]);
    if (_knowns.includes(knownValue)) {
      let _unknowns = getFields(datum[unknownField]);
      _unknowns.forEach((_unknown) => {
        if (!answers.includes(_unknown)) {
          answers.push(_unknown);
        }
      });
    }
  });

  return { question, answers, datum };
};
