import { Role, User } from '@prisma/client';
import { Request } from 'express';

export class UsersResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class LoginResponse extends UsersResponse {
  id: string;
  username: string;
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
  email: string;
  password: string;
  role: Role;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class Payload {
  username: string;
  sub: {
    name: string;
  };
}

export class RequestWithUser extends Request {
  user?: User;
}
