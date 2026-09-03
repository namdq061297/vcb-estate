export const LOGIN_VALIDATION_MESSAGES = {
  fullNameRequired: 'Vui lòng nhập họ và tên',
  documentIdRequired: 'Vui lòng nhập số giấy tờ tùy thân',
  phoneRequired: 'Vui lòng nhập số điện thoại',
  phonePattern: 'Số điện thoại không đúng định dạng (10 số, bắt đầu bằng 0)',
  captchaRequired: 'Vui lòng nhập mã CAPTCHA',
  captchaInvalid: 'Mã CAPTCHA không đúng, vui lòng thử lại',
  captchaLoadFailed: 'Không thể tải CAPTCHA, vui lòng bấm làm mới',
} as const;