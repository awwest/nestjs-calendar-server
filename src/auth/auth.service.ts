import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }

  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}
