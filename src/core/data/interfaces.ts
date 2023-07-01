export interface IUser {
  uuid: string;
  username: string;
  display_name: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  password: string;
  description: string;
  location: string;
  followers: string[];
  following: string[];
  verified: boolean;
  posts: string[];
  profilePicture: string;
  banner: string;
  creationDate: number;
}

export interface IPostToken {
  uuid: string;
}

export interface ITokenPayload {
  uuid: string;
  scopes: ITokenPayloadScopes;
}

export interface ITokenPayloadScopes {
  // Dhruv Scopes
  dhruv_canUpdateUsers: boolean;
  dhruv_canDeleteUsers: boolean;
  dhruv_canGod: boolean;
  // Basic Scopes
  canEditSelf: boolean;
  canMakePost: boolean;
  canCreateUser: boolean;
  canSendMessages: boolean;
  canUserFetchSelf: boolean;
  canReadOtherProfiles: boolean;
  canDeleteSelf: boolean;
}

export interface IUserLogin {
  username: string;
  password: string;
}
