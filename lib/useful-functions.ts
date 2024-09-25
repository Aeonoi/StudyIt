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

/**
 * Compares two dates and determines if they are consecutive or back to back to each other (compares day, hours are neglible)
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns Returns whether two dates are consecutive (back-to-back)
 */
export function compareTwoDates(date1: Date, date2: Date) {
  const d1: Date = new Date(date1);
  const d2: Date = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // Calculate the difference in time (milliseconds) between the two dates
  const differenceInTime = Math.abs(d1.getTime() - d2.getTime());

  // Convert the time difference from milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  console.log(`difference: ${differenceInDays}`);

  // Check if the difference is exactly 1 day
  return differenceInDays === 1;
}
