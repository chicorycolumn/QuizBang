const uUtils = require("./universalUtils.js");

export const makeCuestion = (quiz, prevCuestion, cuestionIndex) => {
  let previousDatum = prevCuestion?.datum;
  let uniqueKey = quiz.uniqueKey || "name";

  let datums = quiz.datums;
  if (quiz.selectedOptions && quiz.selectedOptions.length) {
    datums = datums.filter((datum) => {
      return quiz.selectedOptions.some((selectedOption) => {
        let [category, value] = selectedOption.split("::");
        return datum[category].split("//").includes(value);
      });
    });
  }
  console.log({ datums });
  let datumIndex = cuestionIndex % datums.length;

  let datum;
  if (datumIndex) {
    datum = datums[datumIndex];
  } else if (datumIndex === 0) {
    uUtils.shuffle(datums);
    datum = datums[datumIndex];
  } else {
    datum = uUtils.selectRandom(
      datums.filter(
        (datum) =>
          !previousDatum || previousDatum[uniqueKey] !== datum[uniqueKey]
      )
    );
  }

  let { fieldsToTest } = quiz;
  if (!fieldsToTest || !fieldsToTest.length) {
    fieldsToTest = Object.keys(datums[0]);
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
    let pseudoTemplateString = quiz.questionPhrasingPerUnknown[unknownField];
    return pseudoTemplateString
      .split("")
      .map((char) => (char === "$" ? knownItem : char))
      .join("");
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

  datums.forEach((datum) => {
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

  let allAnswers = [];
  datums.forEach((datum) => {
    let _unknowns = getFields(datum[unknownField]);
    _unknowns.forEach((_unknown) => {
      if (!allAnswers.includes(_unknown)) {
        allAnswers.push(_unknown);
      }
    });
  });

  let cuestion = { question, answers, datum, allAnswers };

  if (quiz.inputTypes && Object.keys(quiz.inputTypes).includes(unknownField)) {
    cuestion.inputType = quiz.inputTypes[unknownField];
  }

  return cuestion;
};
