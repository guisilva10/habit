/* eslint-disable no-empty-pattern */
export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates.sort().reverse();
  const today = new Date().toISOString().split("T")[0];

  let streak = 0;
  const currentDate = new Date(today);

  for (const {} of sortedDates) {
    const date = currentDate.toISOString().split("T")[0];
    if (sortedDates.includes(date)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const isCompletedToday = (habit: {
  completedDates: string[];
}): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return habit.completedDates.includes(today);
};
