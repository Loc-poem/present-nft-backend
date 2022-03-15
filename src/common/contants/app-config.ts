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
  }
}