import { Errors } from "./errors";

export class AuthErrors extends Errors {
  private constructor() {
    super();
  }

  static authUserDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "User does not exist",
        errorCode: 400,
      },
    };
  }

  static authPasswordIncorrect() {
    return {
      success: false,
      details: {
        reason: "Password is incorrect",
        errorCode: 400,
      },
    };
  }

  static authFailedToken() {
    return {
      success: false,
      details: {
        reason: "The token provided failed checks",
        errorCode: 400,
      },
    };
  }

  static authTokenDoesNotExistInRedisCache() {
    return {
      success: false,
      details: {
        reason: "You do not exist in the database",
        errorCode: 400,
      },
    };
  }

  static authOldRefreshToken() {
    return {
      success: false,
      details: {
        reason: "You do not exist in the database",
        errorCode: 400,
      },
    };
  }
}
