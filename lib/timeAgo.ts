import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const customLocale = {
  ...enUS,
  formatDistance: (token: string, count: number) => {
    const formatDistanceLocale: Record<string, string> = {
      lessThanXSeconds: "just now",
      xSeconds: `${count}s ago`,
      halfAMinute: "30s ago",
      lessThanXMinutes: `${count}min ago`,
      xMinutes: `${count}mins ago`,
      aboutXHours: `${count}hr ago`,
      xHours: `${count}hrs ago`,
      xDays: `${count}days ago`,
      aboutXWeeks: `${count}${count === 1 ? "week" : "weeks"} ago`,
      xWeeks: `${count}${count === 1 ? "week" : "weeks"} ago`,
      aboutXMonths: `${count}${count === 1 ? "month" : "months"} ago`,
      xMonths: `${count}${count === 1 ? "month" : "months"} ago`,
      aboutXYears: `${count}${count === 1 ? "year" : "years"} ago`,
      xYears: `${count}${count === 1 ? "year" : "years"} ago`,
      overXYears: `${count}${count === 1 ? "year" : "years"} ago`,
      almostXYears: `${count}${count === 1 ? "year" : "years"} ago`,
    };

    return formatDistanceLocale[token];
  },
};

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), {
    locale: customLocale,
  });
}

export default timeAgo;
