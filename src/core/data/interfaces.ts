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
  followers: [{}];
  following: [{}];
  verified: boolean;
  posts: string[];
  profilePicture: string;
  banner: string;
  creationDate: number;
}

export interface IPostToken {
  uuid: string;
}
