import { Errors } from "./errors";

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
