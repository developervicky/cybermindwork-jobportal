import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const customLocale = {
  ...enUS,
  formatDistance: (token: string, count: number) => {
    const formatDistanceLocale: Record<string, string> = {
      lessThanXSeconds: "just now",
      xSeconds: `${count}s Ago`,
      halfAMinute: "30s Ago",
      lessThanXMinutes: `${count}min Ago`,
      xMinutes: `${count}mins Ago`,
      aboutXHours: `${count}hr Ago`,
      xHours: `${count}hrs Ago`,
      xDays: `${count}days Ago`,
      aboutXWeeks: `${count}${count === 1 ? "week" : "weeks"} Ago`,
      xWeeks: `${count}${count === 1 ? "week" : "weeks"} Ago`,
      aboutXMonths: `${count}${count === 1 ? "month" : "months"} Ago`,
      xMonths: `${count}${count === 1 ? "month" : "months"} Ago`,
      aboutXYears: `${count}${count === 1 ? "year" : "years"} Ago`,
      xYears: `${count}${count === 1 ? "year" : "years"} Ago`,
      overXYears: `${count}${count === 1 ? "year" : "years"} Ago`,
      almostXYears: `${count}${count === 1 ? "year" : "years"} Ago`,
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
