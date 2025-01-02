export const handleAuthError = (error: any) => {
  // Parse error message if it's a string
  let errorBody;
  try {
    errorBody = typeof error.body === 'string' ? JSON.parse(error.body) : error.body;
  } catch {
    errorBody = error.body;
  }

  const errorCode = errorBody?.code;
  const errorMessage = errorBody?.message;

  switch (errorCode) {
    case 'invalid_credentials':
      return 'Invalid email or password. Please try again.';
    case 'user_not_found':
      return 'No account found with this email address.';
    case 'email_not_confirmed':
      return 'Email not confirmed';
    default:
      return errorMessage || 'An error occurred during sign in. Please try again.';
  }
};