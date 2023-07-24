import { Errors } from "./errors";

export class GetErrors extends Errors {
  private constructor() {
    super();
  }

  static postDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "The post you requested does not exist",
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

  static userDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "This user does not exist",
        errorCode: 400,
      },
    };
  }

  static reelsError() {
    return {
      success: false,
      details: {
        reason: "An error occoured while fetching reel, try again late",
        errorCode: 400,
      },
    };
  }

  static getUserDidNotProvideDetails() {
    return {
      success: false,
      details: {
        reason: "An item was null or undefined, try proving all the items",
        errorCode: 400,
      },
    };
  }

  static getUserDoesNotExist() {
    return {
      success: false,
      details: {
        reason: "This user does not exist",
        errorCode: 400,
      },
    };
  }
}
