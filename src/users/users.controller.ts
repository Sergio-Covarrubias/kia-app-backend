import { Controller, Get, Post, Put, Delete, Body, Req, Query } from '@nestjs/common';

import { AuthTokenService } from './auth-token.service';
import { UsersService } from './users.service';

import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly authTokenService: AuthTokenService, private readonly usersService: UsersService) { }

  @Post('signin')
  async signin(@Body() signinData: UserDto) {
    signinData.password = await this.authTokenService.encrypt(signinData.password);
    
    const user = await this.usersService.create(signinData);
    const token = await this.authTokenService.create(user);

    return {
      token,
      id: user.id,
      isAdmin: user.is_admin,
    };
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {    
    const user = await this.usersService.find(loginData);
    const token = await this.authTokenService.create(user);

    return {
      token,
      id: user.id,
      isAdmin: user.is_admin,
    };
  }

  // Verifies that user is logged in
  @Get('validate')
  validate(@Req() req: any) {
    const user = req.user;
    return {
        id: user.id,
        isAdmin: user.isAdmin,
    };
  }

  @Post('user')
  async create(@Body() createDTO: UserDto) {
    createDTO.password = await this.authTokenService.encrypt(createDTO.password);
    await this.usersService.create(createDTO);
  }

  @Put('user')
  async put(@Body() putDTO: UserDto) {
    putDTO.password = await this.authTokenService.encrypt(putDTO.password);
    await this.usersService.put(putDTO);
  }

  @Delete('user')
  async delete(@Query('corporate_id') corporateId: string) {
    await this.usersService.delete(corporateId);
  }
}
