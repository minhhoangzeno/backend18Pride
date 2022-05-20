import { Injectable } from '@nestjs/common';
import { HttpExceptError } from 'src/helpers/error';
import { UserStatus } from 'src/user/enum/user-status.enum';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService,
    private jwtService: JwtService
  ) { }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user) {
      if (user.status == UserStatus.Pending) {
        throw new HttpExceptError('Pending Account. Please Verify Your Email!', 403)
      }
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new HttpExceptError('Wrong is email or password', 403)
      }
    } else {
      throw new HttpExceptError('Wrong is email or password', 403)
    }
  }

  async login(user: any) {
    const payload = user;
    let token = this.jwtService.sign(payload);
    const { password, _id, confirmationCode, ...other } = user._doc
    return {
      access_token: token,
      user: other
    }
  }
}
