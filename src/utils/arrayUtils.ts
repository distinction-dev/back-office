export const onlyUnique = (value: any, index: number, array: any[]) => {
  return array.indexOf(value) === index;
};
export const polishData = (value: any) => {
  if (value !== null || value !== undefined) return value;
};
