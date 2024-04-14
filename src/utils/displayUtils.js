export const isLastQ = (round, cIndex) => {
  return cIndex + 1 >= round?.cuestions?.length;
};
