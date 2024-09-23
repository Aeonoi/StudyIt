// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export function shuffleArray<T>(array: T[]) {
  let j: number;
  let i: number;
  let x: T;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
}
