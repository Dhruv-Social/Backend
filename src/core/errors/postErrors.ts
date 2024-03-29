import { Errors } from "./errors";

export class PostErrors extends Errors {
  private constructor() {
    super();
  }

  static postUserInvalidDetails() {
    return {
      success: false,
      details: {
        reason: "An item was null or undefined, try proving all the items",
        errorCode: 400,
      },
    };
  }

  static postUserUsernameFailed() {
    return {
      success: false,
      details: {
        reason:
          "Username failed checks, username can only contain numbers and alphabet",
        errorCode: 400,
      },
    };
  }

  static postUserPasswordFailed() {
    return {
      success: false,
      details: {
        reason:
          "Password failed checks, password must be greater than 7 character and can not cntain white space",
        errorCode: 400,
      },
    };
  }

  static postUserLocationFailed() {
    return {
      success: false,
      details: {
        reason: "Location can only be in New Zealand",
        errorCode: 400,
      },
    };
  }

  static postUserEmailSendError() {
    return {
      success: false,
      details: {
        reason: "Unknown error when sending email",
        errorCode: 400,
      },
    };
  }

  static createPostUserDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "This user does not exist",
        errorCode: 400,
      },
    };
  }

  static postUserUserWithUsernameExists() {
    return {
      success: false,
      details: {
        reason: "User with that username already exists",
        errorCode: 400,
      },
    };
  }

  static verifyUserError() {
    return {
      success: false,
      details: {
        reason: "An Error occoured with verifying your account",
        errorCode: 400,
      },
    };
  }
}
