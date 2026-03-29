import { useMemo } from "react";

const useLastSixMonths = () => {
  return useMemo(() => {
    const months = [];
    const today = new Date();

    // First day of current month
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Generate last 6 calendar months
    for (let i = 0; i < 6; i++) {
      const date = new Date(
        firstDayCurrentMonth.getFullYear(),
        firstDayCurrentMonth.getMonth() - i,
        1
      );

      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: date.toLocaleString("default", { month: "long" })
      });
    }

    return months;
  }, []);
};

export default useLastSixMonths;