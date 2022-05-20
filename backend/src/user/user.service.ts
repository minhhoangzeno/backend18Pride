import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { Model } from 'mongoose';
import { characters, messageEmailInvaild, messageEmailUnquie, messageNotFound, messagePasswordInvaild, statusCodeErrorUser } from 'src/constant';
import { HttpExceptError } from 'src/helpers/error';
import { sendEmailForgotPassword, sendEmailRegister } from 'src/helpers/sendEmail';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserStatus } from './enum/user-status.enum';
import { User, UserDocument } from './schemas/user.schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  //find One User
  async findOne(email: string): Promise<User | undefined> {
    let user = await this.userModel.findOne({ email });
    return user;
  }

  // create User
  async register(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUniqueBeforeRegister(createUserDto.email)
    let token = '';
    for (let i = 0; i < 25; i++) {
      token += characters[Math.floor(Math.random() * characters.length)];
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds)
    const user = new this.userModel({ ...createUserDto, confirmationCode: token, password: hash });
    sendEmailRegister(user.lastName, user.email, user.confirmationCode)
    return user.save();
  }

  // check unique email
  async checkUniqueBeforeRegister(email: string) {
    let userEmail = await this.userModel.findOne({ email });
    if (userEmail) {
      throw new HttpExceptError(messageEmailUnquie, statusCodeErrorUser)
    }
  }

  // confirmation code -> status Active
  async verifyUser(confirmationCode: string) {
    let user = await this.userModel.findOne({ confirmationCode });
    if (user) {
      if (user.status == UserStatus.Active) {
        throw new HttpExceptError(messageNotFound, HttpStatus.NOT_FOUND)
      } else if (user.status == UserStatus.Pending) {
        user.status = UserStatus.Active;
        return user.save();
      }
    }
  }

  // update User
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto).then(result => {
      return result;
    }).catch(err => {
      throw new HttpExceptError(messageNotFound, HttpStatus.NOT_FOUND)
    })
  }

  // delete User
  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id).catch(() => {
      throw new HttpExceptError(messageNotFound, HttpStatus.NOT_FOUND)
    })
  }

  // change password User
  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    let user = await this.userModel.findById(userId);
    if (user) {
      const isMatchPassword = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
      if (isMatchPassword) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(changePasswordDto.password, saltOrRounds);
        user.password = hash;
        user.save();
      } else {
        throw new HttpExceptError(messagePasswordInvaild, statusCodeErrorUser)
      }
    } else {
      throw new HttpExceptError(messageNotFound, HttpStatus.NOT_FOUND);
    }
  }

  // reset password
  async resetPassword(email: string) {
    let user = await this.userModel.findOne({ email });
    if (user) {
      sendEmailForgotPassword(user.lastName, user.email, user.confirmationCode);
    } else {
      throw new HttpExceptError(messageEmailInvaild, statusCodeErrorUser)
    }
  }

  // verify reset password 
  async verifyResetPassword(resetPasswordDto: ResetPasswordDto) {
    let user = await this.userModel.findOne({ confirmationCode: resetPasswordDto.confirmationCode });
    if (!user) {
      throw new HttpExceptError(messageNotFound, HttpStatus.NOT_FOUND)
    } else {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);
      user.password = hash;
      let token = '';
      for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }
      user.confirmationCode = token;
      user.save();
    }
  }
}
