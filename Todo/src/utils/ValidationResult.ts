interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmailAndPassword = (
  email: string,
  password: string,
  confirmPass?: string,
): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {isValid: false, message: 'Please enter a valid email address.'};
  }

  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long.',
    };
  }

  if (confirmPass !== undefined && password !== confirmPass) {
    return {isValid: false, message: 'Confirm password does not match.'};
  }

  return {isValid: true, message: ''};
};
