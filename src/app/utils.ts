export const bpmToHz = (tempo: number, subDiv = 16) => {
  return (tempo / (60 * 4)) * subDiv;
};
