export class Errors {
  private constructor() {}

  static didNotProvideUsername() {
    return {
      success: false,
      details: {
        reason: "You did not provide the username",
        errorCode: 400,
      },
    };
  }
}
