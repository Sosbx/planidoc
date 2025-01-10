import { getDaysArray } from './dateUtils';

export const calculatePercentages = (
  selections: Record<string, 'primary' | 'secondary' | null>,
  startDate: Date,
  endDate: Date
) => {
  const days = getDaysArray(startDate, endDate);
  const totalSlots = days.length * 3; // 3 periods per day
  
  const primaryCount = Object.values(selections).filter(v => v === 'primary').length;
  const secondaryCount = Object.values(selections).filter(v => v === 'secondary').length;
  
  return {
    primary: (primaryCount / totalSlots) * 100,
    secondary: (secondaryCount / totalSlots) * 100
  };
};

export const wouldExceedLimit = (
  selections: Record<string, 'primary' | 'secondary' | null>,
  startDate: Date,
  endDate: Date,
  type: 'primary' | 'secondary',
  limit: number
) => {
  const { primary, secondary } = calculatePercentages(selections, startDate, endDate);
  return type === 'primary' ? primary > limit : secondary > limit;
};