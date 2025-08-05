// Get current datetime in local timezone format (YYYY-MM-DDThh:mm)
export const getCurrentDateTimeLocal = (): string => {
  const now = new Date();
  // Add a small buffer to account for any delay in user interaction
  now.setMinutes(now.getMinutes() - 1);
  return now.toISOString().slice(0, 16);
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Check if a date is in the past
export const isPastDate = (date: string): boolean => {
  const now = new Date();
  now.setSeconds(0, 0); // Normalize seconds and milliseconds
  return new Date(date) < now;
};

// Check if return date is before or equal to departure date
export const isReturnBeforeDeparture = (departure: string, returnDate: string): boolean => {
  return new Date(returnDate) <= new Date(departure);
};

// Validate if departure date is in the future
export const validateFutureDate = (date: string): { isValid: boolean; message: string } => {
  if (!date) return { isValid: false, message: 'Date and time are required' };
  
  const selectedDate = new Date(date);
  const now = new Date();
  
  // Add a 30-minute buffer to account for current time
  now.setMinutes(now.getMinutes() - 30);
  
  if (selectedDate < now) {
    return { 
      isValid: false, 
      message: 'Selected date and time must be in the future (minimum 30 minutes from now)' 
    };
  }
  
  return { isValid: true, message: '' };
};
