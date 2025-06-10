import { Controller, Get, Post, Patch, Delete, Body, Req, Query, Param, BadRequestException } from '@nestjs/common';

import { createError, handleError } from '@utils/handle-error';

import { AuthTokenService } from './auth-token.service';
import { UsersService } from './users.service';

import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly authTokenService: AuthTokenService, private readonly usersService: UsersService) { }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const user = await this.usersService.getByCorporateId(loginData);
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

  @Get('users')
  async getPaginated(@Query('query') queryQ: string, @Query('page') pageQ: string, @Query('limit') limitQ: string) {
    try {
      const page = +pageQ;
      if (isNaN(page) || page <= 0) {
        throw createError(BadRequestException, 'page', 'Page number must be greater than 0');
      }

      const limit = +limitQ;
      if (isNaN(limit) || limit <= 0) {
        throw createError(BadRequestException, 'limit', 'Limit number must be greater than 0');
      }

      const query = queryQ || '';
      return await this.usersService.getPaginated(query, page, limit);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Get('users/:id')
  async get(@Param('id') id: string) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.usersService.get(+id);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Post('users')
  async create(@Body() createDTO: CreateUserDto) {
    createDTO.password = await this.authTokenService.encrypt(createDTO.password);
    return await this.usersService.prcreate(createDTO);
    //return await this.usersService.create(createDTO);
  }

  @Patch('users/password/:id')
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDTO: UpdatePasswordDto) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      updatePasswordDTO.password = await this.authTokenService.encrypt(updatePasswordDTO.password);
      return await this.usersService.updatePassword(+id, updatePasswordDTO);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Patch('users/:id')
  async update(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDto) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.usersService.update(+id, updateUserDTO);
    } catch (error: any) {
      return handleError(error);
    }
  }

  @Delete('users/:id')
  async delete(@Param('id') id: string) {
    try {
      if (isNaN(+id)) {
        throw createError(BadRequestException, 'invalidId', 'Id must be a number');
      }

      return await this.usersService.delete(+id);
    } catch (error: any) {
      return handleError(error);
    }
  }
}
