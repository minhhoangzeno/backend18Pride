import { Body, Controller, Delete, Param, Post, Put, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req: any) {
    return this.userService.changePassword(changePasswordDto, req.user._doc._id)
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.userService.resetPassword(body.email)
  }

  @Post('verify-password')
  async verifyPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.verifyResetPassword(resetPasswordDto)
  }
}
