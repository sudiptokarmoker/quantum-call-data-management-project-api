export const hasTimeConflict = (
  existingSlots: {
    startTime: string;
    endTime: string;
    date: string;
  }[],
  newSlot: {
    startTime: string;
    endTime: string;
    date: string;
  }
) => {
  for (const slot of existingSlots) {
    console.log(slot.date);
    console.log(new Date());

    const existingStart = new Date(`${slot.date}T${slot.startTime}:00`);
    const existingEnd = new Date(`${slot.date}T${slot.endTime}:00`);
    const newStart = new Date(`${newSlot.date}T${newSlot.startTime}:00`);
    const newEnd = new Date(`${newSlot.date}T${newSlot.endTime}:00`);

    console.log(existingStart);

    if (newStart < existingEnd && newEnd > existingStart) {
      console.log(true);
      return true;
    }
  }
  console.log(false);

  return false;
};

export const getLastNDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};


export const validateImageTypeAndSize = (file: any, size: number = 5) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const maxSize = size * 1024 * 1024; // 5 MB is default

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, Webp, BMP.');
  }

  if (file.size > maxSize) {
    throw new Error(`File size exceeds the ${size}MB limit.`);
  }

  return true; // Validation passed
};
