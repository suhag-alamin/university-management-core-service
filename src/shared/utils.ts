import { WeekDays } from '@prisma/client';

export const asyncForEach = async (array: any, callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array');
  }
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
};

export const hasTimeConflict = (
  existingSlots: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }[],
  newSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`2023-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`2023-01-01T${slot.endTime}:00`);
    const newStart = new Date(`2023-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`2023-01-01T${newSlot.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
    return false;
  }
};
