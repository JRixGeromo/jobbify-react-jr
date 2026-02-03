export function calculateTrialDays(signupDate: string): number {
  const signup = new Date(signupDate);
  if (isNaN(signup.getTime())) {
    return 0; // Return 0 if the date is invalid
  }
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - signup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, 14 - diffDays);
} 