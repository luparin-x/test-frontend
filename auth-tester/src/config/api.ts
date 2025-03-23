const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined');
}

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  BIOMETRIC_REGISTER: `${API_BASE_URL}/auth/biometric/register`,
  BIOMETRIC_LOGIN: `${API_BASE_URL}/auth/biometric`,
  OTP_REQUEST: `${API_BASE_URL}/auth/otp/request`,
  OTP_VERIFY: `${API_BASE_URL}/auth/otp/verify`,
} as const;

export default API_ENDPOINTS; 