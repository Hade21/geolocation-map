import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Request } from 'express';

export class UsersResponse {
  @ApiProperty({ type: String, description: 'User ID' })
  id: string;
  @ApiProperty({ type: String, description: 'User name' })
  username: string;
  @ApiProperty({ type: String, description: 'User first name' })
  firstName: string;
  @ApiProperty({ type: String, description: 'User last name' })
  lastName: string;
  @ApiProperty({ type: String, description: 'User email' })
  email: string;
  @ApiPropertyOptional({ type: String, description: 'User role' })
  role?: string;
}

export class LoginResponse extends UsersResponse {
  @ApiProperty({ type: String, description: 'User ID' })
  id: string;
  @ApiProperty({ type: String, description: 'User name' })
  username: string;
  @ApiProperty({ type: String, description: 'token' })
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export class RefreshResponse {
  @ApiProperty({ type: String, description: 'token' })
  token: {
    accessToken: string;
  };
}

export class CreateUserRequest {
  @ApiHideProperty()
  id: string;
  @ApiProperty({
    type: String,
    description: 'User name',
    required: true,
    minLength: 1,
    maxLength: 50,
    example: 'Hade21',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'User first name',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'Muhammad',
  })
  firstName: string;
  @ApiProperty({
    type: String,
    description: 'User last name',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'Abdurrohman',
  })
  lastName: string;
  @ApiProperty({
    type: String,
    description: 'User email',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'WY2Cf@example.com',
  })
  email: string;
  @ApiProperty({
    type: String,
    description: 'User password',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'password',
  })
  password: string;
  @ApiPropertyOptional({
    type: String,
    description: 'User role',
    required: true,
    minLength: 1,
    maxLength: 50,
    example: 'USER',
  })
  role: Role;
}

export class LoginUserRequest {
  @ApiProperty({
    type: String,
    description: 'User name',
    required: true,
    minLength: 1,
    maxLength: 50,
    example: 'Hade21',
  })
  username: string;
  @ApiProperty({
    type: String,
    description: 'User password',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'password',
  })
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

export class ChangePassword {
  @ApiProperty({
    type: String,
    description: 'User old password',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'password',
  })
  oldPassword: string;
  @ApiProperty({
    type: String,
    description: 'User new password',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'password',
  })
  newPassword: string;
  @ApiProperty({
    type: String,
    description: 'User confirm password',
    required: true,
    minLength: 1,
    maxLength: 100,
    example: 'password',
  })
  confirmPassword: string;
}
