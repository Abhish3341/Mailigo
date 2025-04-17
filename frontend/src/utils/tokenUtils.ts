interface DecodedToken {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  isFirstLogin: boolean;
}

export const decodeToken = (token: string): DecodedToken | null => {
  if (!token || typeof token !== 'string') {
    console.error('Invalid token provided to decodeToken');
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};