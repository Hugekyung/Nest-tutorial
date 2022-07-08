import { Gender } from '../dto/credentialDto';

export interface User {
  username: string;
  password: string;
}

export interface UserInfo {
  nickname?: string;
  gender?: Gender;
}
