import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ type: 'noToken', message: 'No token' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET!, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ type: 'invalidToken', message: 'Invalid token' });
      } else if (!user.isAdmin) {
        return res.status(403).json({ type: 'noAdmin', message: 'The user does not have admin permissions' });
      }

      req.user = user;
      next();
    });
  }
}
