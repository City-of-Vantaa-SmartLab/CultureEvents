export interface JwtPayload {
  username: string;
  password: string;
  iat: number;
  exp: number;
}
