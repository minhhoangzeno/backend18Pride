import { Body, Controller, Delete, Param, Post, Put, UseGuards, Request, Get, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
  @Get()
  async findAll(@Query('activePage') activePage: number, @Query('limit') limit: number) {
    return this.userService.findAll(activePage, limit);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto)
  }


  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (file) {
      return this.userService.updateUser(id, updateUserDto, file);
    } else {
      return this.userService.updateUser(id, updateUserDto);
    }
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SuperAdmin')
  @Post('role/:id')
  async changeRoleUser(@Param('id') id: string, @Body() body: any) {
    return this.userService.roleUser(id, body.role)
  }
}
