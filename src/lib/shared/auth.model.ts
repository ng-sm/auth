export interface AuthResponse {
  accessToken: string;
}

export interface AuthJWT {
  user: any;
  sub: string;
  iat: string;
  exp: string;
}
