import { Gender } from '../dto/credentialDto';

export interface UserInfo {
  updatePassword?: string;
  nickname?: string;
  gender?: Gender;
}

export interface User extends UserInfo {
  username: string;
  password: string;
}
