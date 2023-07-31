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
}
