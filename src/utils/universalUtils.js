export const selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getNumArr = (range) => {
  let start = range[0] - 1;
  let finish = range[1];
  return Array.from({ length: finish - start }, (_, i) => start + 1 + i);
};
