export class UsersResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export class LoginResponse extends UsersResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export class RefreshResponse {
  token: {
    accessToken: string;
  };
}

export class CreateUserRequest {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}
