import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import { createError, handleError } from '@utils/handle-error';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,

    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User
  ) { }

  async getPaginated(query: string, page: number, limit: number) {
    const users = await User.findAll({
      offset: (page - 1) * limit,
      limit: limit,
      where: {
        corporate_id: { [Op.iLike]: `%${query}%` }
      },
      order: [['corporate_id', 'ASC'], ['id', 'ASC']],
      attributes: ['id', 'corporate_id', 'is_admin']
    });

    const formattedUsers = users.map((user) => {
      user = user.get({ plain: true });

      return {
        id: user.id,
        corporateId: user.corporate_id,
        isAdmin: user.is_admin,
      };
    });

    const count = await User.count({
      where: {
        corporate_id: { [Op.iLike]: `%${query}%` }
      },
    });

    return {
      users: formattedUsers,
      totalPages: Math.ceil(count / limit),
    };
  }

  async get(userId: number) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ['corporate_id', 'is_admin'],
      }).then((user) => user?.get({ plain: true }));

      if (!user) {
        throw createError(BadRequestException, 'nonExisting', `No user with ID value ${userId} exists`)
      }

      const formattedUser = {
        corporateId: user.corporate_id,
        isAdmin: user.is_admin,
      };

      return formattedUser;
    } catch (error: any) {
      return handleError(error);
    }
  }

  async getByCorporateId(loginData: LoginDto) {
    try {
      const user = await User.findOne({
        raw: true,
        where: { corporate_id: loginData.corporateId },
      });

      if (!user) {
        throw createError(BadRequestException, 'nonExisting', `No user with corporate ID ${loginData.corporateId}`);
      }

      const isMatch = await bcrypt.compare(loginData.password, user.password);
      if (!isMatch) {
        throw createError(BadRequestException, 'password', 'Incorrect password');
      }

      return user;
    } catch (error: any) {
      return handleError(error);
    }
  }

  async create(postData: CreateUserDto) {
    try {
      const user = await User.findOne({
        raw: true,
        where: { corporate_id: postData.corporateId },
        attributes: ['id'],
      });

      if (user != null) {
        throw createError(BadRequestException, 'existing', `User with corporate ID ${postData.corporateId} already exists`);
      }

      const deletedUser = await User.findOne({
        paranoid: false,
        where: { corporate_id: postData.corporateId },
        attributes: ['id'],
      });

      if (deletedUser) {
        await deletedUser.restore();
        await deletedUser.update({
          password: postData.password,
          is_admin: postData.isAdmin,
        });

        return deletedUser;
      } else {
        const userToCreate = {
          corporate_id: postData.corporateId,
          password: postData.password,
          is_admin: postData.isAdmin,
        };

        return await User.create(userToCreate);
      }
    } catch (error: any) {
      return handleError(error);
    }
  }

  async updatePassword(userId: number, updatePasswordData: UpdatePasswordDto) {
    const user = await User.findByPk(userId, {
      attributes: ['id']
    });

    if (!user) {
      throw createError(BadRequestException, 'nonExisting', `User with ID ${userId} does not exist`);
    }

    await user.update(updatePasswordData);
  }

  async update(userId: number, updateUserData: UpdateUserDto) {
    const user = await User.findByPk(userId, {
      attributes: ['id']
    });

    if (!user) {
      throw createError(BadRequestException, 'nonExisting', `User with ID ${userId} does not exist`);
    }

    await user.update({
      is_admin: updateUserData.isAdmin,
    });
  }

  async delete(userId: number) {
    const count = await User.destroy({
      where: { id: userId },
    });

    if (count === 0) {
      throw createError(BadRequestException, 'nonExisting', `User with corporate ID ${userId} does not exist`);
    }
  }

  async prcreate(postData: CreateUserDto) {
    try {
      await this.sequelize.query(`
        CALL create_user(
          :corporateId,
          :password,
          :isAdmin
        )`,
        {
          replacements: {
            corporateId: postData.corporateId,
            password: postData.password,
            isAdmin: postData.isAdmin,
          },
        },
      );
    } catch (error: any) {
      const parsed = JSON.parse(error.message);
      return handleError(createError(BadRequestException, parsed.type, parsed.message));
    }
  }
}
