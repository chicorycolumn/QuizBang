export const selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getNumArr = (start, finish) => {
  start = start - 1;
  return Array.from({ length: finish - start }, (_, i) => start + 1 + i);
};
