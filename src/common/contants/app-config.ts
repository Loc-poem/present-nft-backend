export const AppConfig = {
  SALT_ROUND: 10,
  LOGIN_STEP: {
    VERIFY_OTP_CODE: 1,
    ADD_INFO: 2,
    ADD_WALLET: 3,
    ACTIVE: 4,
  },
  EMAIL_SUBJECT: {
    VERIFY_ACCOUNT: "Verify your account",
    FORGOT_PASSWORD: "Reset password",
  },
  FILE_IMAGE_UPLOAD: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'],
  MAX_FILE_IMAGE_UPLOAD: 3145728, //3 * 1024 * 1024,
  FOLDER_IMAGE_UPLOAD: {
    COLLECTION_LOGO: 'collection-logo'
  },
  LIMIT: 10,
  OFFSET: 0,
}