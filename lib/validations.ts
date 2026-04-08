/**
 * Validation utilities for security constraints
 * Email, Phone, Password, Username
 */

// ========== EMAIL VALIDATION ==========
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) return { valid: false, error: 'Email không được để trống' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email quá dài (tối đa 254 ký tự)' };
  }

  return { valid: true };
};

// ========== PHONE VALIDATION (Vietnamese Format) ==========
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) return { valid: true }; // Phone là optional trong form
  
  // Vietnamese phone numbers: 10 digits, starts with 0
  const vietnamPhoneRegex = /^0\d{9}$/;
  
  if (!vietnamPhoneRegex.test(phone)) {
    return { valid: false, error: 'Số điện thoại không hợp lệ. Định dạng: 0XXXXXXXXX (10 số)' };
  }

  // Check against common invalid patterns
  const invalidPatterns = [
    /^0{10}$/, // All zeros
    /^0(\d)\1{8}$/, // All same digit (e.g., 0111111111)
  ];

  for (const pattern of invalidPatterns) {
    if (pattern.test(phone)) {
      return { valid: false, error: 'Số điện thoại không hợp lệ' };
    }
  }

  return { valid: true };
};

// ========== PASSWORD VALIDATION ==========
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!password) {
    return { valid: false, errors: ['Mật khẩu không được để trống'] };
  }

  // Minimum 8 characters (instead of 6)
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }

  // Maximum 128 characters (prevent extremely long passwords)
  if (password.length > 128) {
    errors.push('Mật khẩu tối đa 128 ký tự');
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ in hoa (A-Z)');
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ thường (a-z)');
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 chữ số (0-9)');
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*...)');
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty123', 'abc123456', 'admin123'];
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    errors.push('Mật khẩu quá đơn giản hoặc thường được sử dụng. Vui lòng chọn mật khẩu khác');
  }

  // Check for consecutive characters (e.g., abc, 123, xyz)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Mật khẩu không được chứa 3 ký tự giống nhau liên tiếp');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ========== USERNAME VALIDATION ==========
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (!username) return { valid: false, error: 'Tên đăng nhập không được để trống' };

  // Username: 3-32 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;
  
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Tên đăng nhập phải 3-32 ký tự, chỉ chứa chữ, số, và dấu gạch dưới' };
  }

  // Cannot start with numbers
  if (/^\d/.test(username)) {
    return { valid: false, error: 'Tên đăng nhập không được bắt đầu bằng số' };
  }

  // Cannot have consecutive underscores
  if (/__/.test(username)) {
    return { valid: false, error: 'Tên đăng nhập không được chứa dấu gạch dưới liên tiếp' };
  }

  return { valid: true };
};

// ========== FULL NAME VALIDATION ==========
export const validateFullName = (fullName: string): { valid: boolean; error?: string } => {
  if (!fullName || !fullName.trim()) {
    return { valid: false, error: 'Họ tên không được để trống' };
  }

  if (fullName.length < 2) {
    return { valid: false, error: 'Họ tên phải có ít nhất 2 ký tự' };
  }

  if (fullName.length > 100) {
    return { valid: false, error: 'Họ tên tối đa 100 ký tự' };
  }

  // Allow Vietnamese characters, spaces, and hyphens
  const nameRegex = /^[a-zA-ZÀ-ỹ\s\-']{2,100}$/;
  if (!nameRegex.test(fullName)) {
    return { valid: false, error: 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang' };
  }

  return { valid: true };
};

// ========== OTP VALIDATION ==========
export const validateOTP = (otp: string): { valid: boolean; error?: string } => {
  if (!otp) return { valid: false, error: 'Mã OTP không được để trống' };

  if (!/^\d{6}$/.test(otp)) {
    return { valid: false, error: 'Mã OTP phải là 6 chữ số' };
  }

  return { valid: true };
};

// ========== ADDRESS VALIDATION ==========
export const validateAddress = (address: string): { valid: boolean; error?: string } => {
  if (!address || !address.trim()) {
    return { valid: false, error: 'Địa chỉ không được để trống' };
  }

  if (address.length < 5) {
    return { valid: false, error: 'Địa chỉ phải có ít nhất 5 ký tự' };
  }

  if (address.length > 255) {
    return { valid: false, error: 'Địa chỉ tối đa 255 ký tự' };
  }

  return { valid: true };
};
