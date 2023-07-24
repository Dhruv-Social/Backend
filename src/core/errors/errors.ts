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

export class PutErrors extends Errors {
  private constructor() {
    super();
  }

  static followUserYouAlreadyFollow() {
    return {
      success: false,
      details: {
        reason: "You already follow this user",
        errorCode: 400,
      },
    };
  }

  static unfollowUserYouDontFollow() {
    return {
      success: false,
      details: {
        reason: "You can not unfollow a user you don't follow",
        errorCode: 400,
      },
    };
  }

  static followUserIncorrectUuid() {
    return {
      success: false,
      details: {
        reason: "This UUID does not exis in the database",
        errorCode: 400,
      },
    };
  }
}

export class DeleteErrors extends Errors {
  private constructor() {
    super();
  }

  static deletePostPostDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "The post uuid you specified does not exist",
        errorCode: 400,
      },
    };
  }

  static deleteYouCanNotDeleteAnotherPost() {
    return {
      success: false,
      details: {
        reason: "You can not delete a post that does not exist to you",
        errorCode: 400,
      },
    };
  }
}

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

  static postUserUserWithUsernameExists() {
    return {
      success: false,
      details: {
        reason: "User with that username already exists",
        errorCode: 400,
      },
    };
  }
}

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
