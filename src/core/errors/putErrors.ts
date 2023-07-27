import { Errors } from "./errors";

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

  static putCommentPostDidNotProvideDetails() {
    return {
      success: false,
      details: {
        reason: "An item was null or undefined, try proving all the items",
        errorCode: 400,
      },
    };
  }

  static anItemIsNotAString() {
    return {
      success: false,
      details: {
        reason: "An item is not a string",
        errorCode: 400,
      },
    };
  }

  static canNotLikeAPostThatDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "This post does not exist",
        errorCode: 400,
      },
    };
  }

  static youveAlreadyLikedThisPost() {
    return {
      success: false,
      details: {
        reason: "You can not like a post you've already liked",
        errorCode: 400,
      },
    };
  }

  static youHaveNotLikedThisPost() {
    return {
      success: false,
      details: {
        reason: "You can not unlike a post you havent liked",
        errorCode: 400,
      },
    };
  }
}
