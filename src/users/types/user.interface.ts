import { Gender } from '../dto/credentialDto';

export interface UserInfo {
  nickname?: string;
  gender?: Gender;
}

export interface User extends UserInfo {
  username: string;
  password: string;
}
