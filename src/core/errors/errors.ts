export class Errors {
  static didNotProvideUsername() {
    return {
      success: false,
      details: {
        reason: "You did not provide the username",
        errorCode: 400,
      },
    };
  }

  static didNotProvideDetails() {
    return {
      success: false,
      details: {
        reason: "An item was null or undefined, try proving all the items",
        errorCode: 400,
      },
    };
  }
}
