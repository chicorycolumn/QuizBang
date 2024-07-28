export const selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getNumArr = (start, finish) => {
  start = start - 1;
  return Array.from({ length: finish - start }, (_, i) => start + 1 + i);
};

export const shuffle = (array) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};
