// ALl functions that should not be async
import type { IFocus } from "@/models/focuses";

/**
 * Rank Name (String) : Maximum Points For Rank (Number)
 */
export const rankPoints = new Map<string, number | undefined>([
  ["Iron", 1000],
  ["Bronze-5", 2800],
  ["Bronze-4", 4600],
  ["Bronze-3", 6400],
  ["Bronze-2", 8200],
  ["Bronze-1", 10000],
  ["Silver-5", 12000],
  ["Silver-4", 14000],
  ["Silver-3", 16000],
  ["Silver-2", 18000],
  ["Silver-1", 20000],
  ["Gold-5", 26000],
  ["Gold-4", 32000],
  ["Gold-3", 38000],
  ["Gold-2", 44000],
  ["Gold-1", 50000],
  ["Platinum-5", 60000],
  ["Platinum-4", 70000],
  ["Platinum-3", 80000],
  ["Platinum-2", 90000],
  ["Platinum-1", 100000],
  ["Diamond-5", 120000],
  ["Diamond-4", 140000],
  ["Diamond-3", 160000],
  ["Diamond-2", 180000],
  ["Diamond-1", 200000],
  ["Masters", 1000000],
  ["Mythical", undefined],
]);

/**
 * Shuffles array into random order
 *
 * @param {T} array - The array to be shuffled
 * @returns {T[]} Returns the shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
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
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {number} Returns the difference (in days) between the two dates
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

/**
 * @param {number} time - The number of seconds to be converted
 * @returns {number} Time in minutes
 */
export function convertSecondsToMinutes(time: number): number {
  return time / 60;
}

/**
 * @param {number} time - The number of milliseconds to be converted
 * @returns {number} Time in minutes
 */
export function convertMsToMinutes(time: number): number {
  return time / 60000;
}

/**
 * @param {number} time - The number of milliseconds to be converted
 * @returns {number} Time in seconds
 */
export function convertMsToSeconds(time: number): number {
  return time / 1000;
}

/**
 * @param {number} time - The number of minutes to be converted
 * @returns {number} Time in hours
 */
export function convertMinutesToHours(time: number): number {
  return time / 60;
}

/**
 * @param {IFocus[]} arr - The array of type IFocus
 * @returns {number} Total time, that is, the sum arr
 */
export function getGroupedTotalFocusTime(arr: IFocus[]): number {
  let ret = 0;
  arr.map((focus) => {
    ret += focus.time;
  });
  Number(ret.toFixed(2));
  return ret;
}

/**
 * Converts a JavaScript Date object to string representation
 *
 * @returns {string | undefined} Readable string representation of a JavaScript Date object
 */
export function getReadableDate(oldDate: Date | undefined): string | undefined {
  if (!oldDate) {
    return;
  }
  const date = new Date(oldDate);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

/**
 * Print debugging :)
 */
// biome-ignore lint/suspicious/noExplicitAny: only for debugging
export function debug_print(args: any[] = []): void {
  console.log("----------------------------------------------------");
  console.log("DEBUG HERE");
  args.map((arg, index) => {
    console.log(`val ${index}: ${arg}`);
  });
  console.log("----------------------------------------------------");
}

/**
 *
 * Gets rank given the number of points
 *
 * @param {number} currentPoints - The number of points to check the rank of
 * @param {boolean} [ next ] - Flag to determine if checking for next tier
 * @returns {string | undefined} A string representation of the current tier (Rank-Division) or optionally, the next tier. Will return undefined if looking for next rank and current rank is Mythical
 */
export function getTier(
  currentPoints: number,
  next?: boolean,
): string | undefined {
  switch (true) {
    case currentPoints > 1000 && currentPoints <= 10000: {
      let tierName = "Bronze-";
      for (let i = 5; i > 0; i--) {
        const rankValue = rankPoints.get(tierName + i);
        if (rankValue !== undefined && rankValue >= currentPoints) {
          if (next && i > 1) {
            tierName += i - 1;
          } else if (next && i <= 1) {
            tierName = "Silver-5";
          } else {
            tierName += i;
          }
          break;
        }
      }
      return tierName;
    }
    case currentPoints <= 20000: {
      let tierName = "Silver-";
      for (let i = 5; i > 0; i--) {
        const rankValue = rankPoints.get(tierName + i);
        if (rankValue !== undefined && rankValue >= currentPoints) {
          if (next && i > 1) {
            tierName += i - 1;
          } else if (next && i <= 1) {
            tierName = "Gold-5";
          } else {
            tierName += i;
          }
          break;
        }
      }
      return tierName;
    }
    case currentPoints <= 50000: {
      let tierName = "Gold-";
      for (let i = 5; i > 0; i--) {
        const rankValue = rankPoints.get(tierName + i);
        if (rankValue !== undefined && rankValue >= currentPoints) {
          if (next && i > 1) {
            tierName += i - 1;
          } else if (next && i <= 1) {
            tierName = "Platinum-5";
          } else {
            tierName += i;
          }
          break;
        }
      }
      return tierName;
    }
    case currentPoints <= 100000: {
      let tierName = "Platinum-";
      for (let i = 5; i > 0; i--) {
        const rankValue = rankPoints.get(tierName + i);
        if (rankValue !== undefined && rankValue >= currentPoints) {
          if (next && i > 1) {
            tierName += i - 1;
          } else if (next && i <= 1) {
            tierName = "Diamond-5";
          } else {
            tierName += i;
          }
          break;
        }
      }
      return tierName;
    }
    case currentPoints <= 200000: {
      let tierName = "Diamond-";
      for (let i = 5; i > 0; i--) {
        const rankValue = rankPoints.get(tierName + i);
        if (rankValue !== undefined && rankValue >= currentPoints) {
          if (next && i > 1) {
            tierName += i - 1;
          } else if (next && i <= 1) {
            tierName = "Masters";
          } else {
            tierName += i;
          }
          break;
        }
      }
      return tierName;
    }
    case currentPoints <= 1000000: {
      if (next) {
        return "Mythical";
      }
      return "Masters";
    }
    case currentPoints > 1000000:
      if (next) {
        return undefined;
      }
      return "Mythical";
    default:
      if (next) {
        return "Bronze-5";
      }
      return "Iron";
  }
}
