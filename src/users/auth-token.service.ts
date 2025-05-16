import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

@Injectable()
export class AuthTokenService {
  create(user: User): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        { id: user.id, isAdmin: user.is_admin },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "1d",
        },
        (err: Error, token: string) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });
  }

  encrypt(payload: string): Promise<string> {
    return bcrypt.hash(payload, 10);
  }
}
