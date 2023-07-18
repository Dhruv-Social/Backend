export type User = {
  uuid: string;
  scopes: {
    dhruv_canUpdateUsers: boolean;
    dhruv_canDeleteUsers: boolean;
    dhruv_canGod: boolean;
    canEditSelf: boolean;
    canMakePost: boolean;
    canCreateUser: boolean;
    canSendMessages: boolean;
    canUserFetchSelf: boolean;
    canReadOtherProfiles: boolean;
    canDeleteSelf: boolean;
  };
  iat: number;
  exp: number;
};
