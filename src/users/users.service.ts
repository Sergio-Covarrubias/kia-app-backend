import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';

import { createError, handleError } from '@utils/handle-error';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User
    ) { }

    async create(signinData: UserDto) {
        try {
            const user = await User.findOne({
                raw: true,
                where: { corporate_id: signinData.corporateId },
                attributes: ['id'],
            });

            if (user != null) {
                throw createError(BadRequestException, 'corporateId', `User with corporate ID ${signinData.corporateId} already exists`);
            }

            const userToCreate = {
                corporate_id: signinData.corporateId,
                password: signinData.password,
                is_admin: signinData.isAdmin,
            };

            return await User.create(userToCreate);
        } catch (error: any) {
            return handleError(error);
        }
    }

    async put(putData: UserDto) {
        const [count] = await User.update(
            {
                password: putData.password,
                is_admin: putData.isAdmin,
            },
            { where: { corporate_id: putData.corporateId } }
        );

        if (count === 0) {
            throw createError(BadRequestException, 'nonExistingId', `User with corporate ID ${putData.corporateId} does not exist`);
        }
    }

    async delete(corporateId: string) {
        const count = await User.destroy({
            where: { corporate_id: corporateId },
        });

        if (count === 0) {
            throw createError(BadRequestException, 'nonExistingId', `User with corporate ID ${corporateId} does not exist`);
        }
    }

    async find(loginData: LoginDto) {
        try {
            const user = await User.findOne({
                raw: true,
                where: { corporate_id: loginData.corporateId },
            });

            if (!user) {
                throw createError(BadRequestException, 'corporateId', `No user with corporate ID ${loginData.corporateId}`);
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
}
