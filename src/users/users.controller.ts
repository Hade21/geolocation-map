import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('/api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @Post('/register')
  // async register() {
  //     return this.usersService.register();
  // }
}
