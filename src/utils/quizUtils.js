const selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const makeCuestion = (quiz, previousDatum) => {
  let uniqueKey = quiz.uniqueKey || "name";

  let datum = selectRandom(
    quiz["datums"].filter(
      (datum) => !previousDatum || previousDatum[uniqueKey] !== datum[uniqueKey]
    )
  );
  let { fieldsToTest } = quiz;
  if (!fieldsToTest || !fieldsToTest.length) {
    fieldsToTest = Object.keys(quiz.datums[0]);
  }
  console.log(fieldsToTest);
  let fields = fieldsToTest.filter(
    (field) => datum[field] || datum[field] === 0
  );

  let unknownField = selectRandom(fields);

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

  let knownField = selectRandom(
    availableKnownFields.filter((field) => field !== unknownField)
  );
  let label = quiz["label"];
  let question;

  const getField = (raw) => {
    return selectRandom(raw.toString().split("//"));
  };
  const getFields = (raw) => {
    return raw.toString().split("//");
  };

  if (unknownField === "name") {
    question = `Which ${label} has ${knownField} of ${getField(
      datum[knownField]
    )}?`;
  } else if (knownField === "name") {
    question = `What is the ${unknownField} of ${getField(datum[knownField])}?`;
  } else {
    question = `What is the ${unknownField} of the ${label} with ${knownField} of ${getField(
      datum[knownField]
    )}?`;
  }

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

  return { question, answers, datum };
};
