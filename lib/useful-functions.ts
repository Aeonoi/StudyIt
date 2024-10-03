import type { IFocus } from "@/models/focuses";

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
 * @returns Returns the difference (in days) between the two dates
 */
export function compareTwoDates(date1: Date, date2: Date): number {
  // set to use UTC
  date1.setUTCHours(0, 0, 0, 0);
  date2.setUTCHours(0, 0, 0, 0);

  // Calculate the difference in time (milliseconds) between the two dates
  const differenceInTime = Math.abs(date1.getTime() - date2.getTime());

  // Convert the time difference from milliseconds to days
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  // Check if the difference is exactly 1 day
  return differenceInDays;
}

export function convertSecondsToMinutes(time: number): number {
  return time / 60;
}

export function convertMsToMinutes(time: number): number {
  return (time / 1000) * 60;
}

export function convertMsToSeconds(time: number): number {
  return time / 1000;
}

export function exportISOString(date: Date): string {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`;
}

export function getGroupedTotalFocusTime(arr: IFocus[]) {
  let ret = 0;
  arr.map((focus) => {
    ret += focus.time;
  });
  Number(ret.toFixed(2));
  return ret;
}

// biome-ignore lint/suspicious/noExplicitAny: only for debugging
export function debug_print(args: any[] = []) {
  console.log("----------------------------------------------------");
  console.log("DEBUG HERE");
  args.map((arg, index) => {
    console.log(`val ${index}: ${arg}`);
  });
  console.log("----------------------------------------------------");
}
