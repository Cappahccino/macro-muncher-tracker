interface AuthError {
  message: string;
}

export const handleAuthError = (error: AuthError): string => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes("email not confirmed")) {
    return "Email not confirmed";
  }
  
  if (errorMessage.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  
  if (errorMessage.includes("too many requests")) {
    return "Too many login attempts. Please try again later.";
  }
  
  if (errorMessage.includes("email rate limit exceeded")) {
    return "Too many verification email requests. Please try again later.";
  }
  
  return "An unexpected error occurred. Please try again.";
};