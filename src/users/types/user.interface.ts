import { Gender } from '../dto/credentialDto';

export interface UserInfo {
  updatePassword?: string;
  nickname?: string;
  gender?: Gender;
}

export interface User extends UserInfo {
  id: number;
  username: string;
  email: string;
  password: string;
  signupVerifyToken?: string;
}
