import { AuthService } from 'src/auth/auth.service';
import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto';
import { ValidateCreateUserDto } from './dto/validate-user.dto';
import { ResendCodeValidateUserDto } from './dto/resend-ccode-validate-user.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ForgotPasswordDto } from './dto/forgot-Password.dto';
import { ValidateUpdateEmailDto } from './dto/validate-update-email.dto';
import { ValidateForgotPasswordDto } from './dto/validate-forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("User")
@Controller("user")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService

  ) { }

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('validate-user')
  async validateSignUp(@Body() validateCreateUserDto: ValidateCreateUserDto) {
    const { code, email } = validateCreateUserDto
    return await this.usersService.validateUser(code, email)
  }

  @Post('validate-user/resend-code')
  async resendCodeValidateSignUp(@Body() resendCodeValidateUser: ResendCodeValidateUserDto) {
    const { email } = resendCodeValidateUser

    return await this.authService.resendConfirmationCode(email)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("update-email")
  updateEmail(@Req() req: any, @Body() updateEmailUserDto: UpdateEmailDto) {
    return this.usersService.updateEmail(updateEmailUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("validate-update-email")
  validateUpdateEmail(@Req() req: any, @Body() validateUpdateEmailDto: ValidateUpdateEmailDto) {
    const { sub } = req.user
    console.log(sub)
    return this.usersService.validateUpdateEmail(validateUpdateEmailDto, sub);
  }

  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<Object> {
    const { email } = forgotPasswordDto
    return this.authService.forgotPassword(email)
  }
  @Post("validate-forgot-password")
  validateForgotPassword(@Req() req: any, @Body() validateForgotPasswordDto: ValidateForgotPasswordDto): Promise<Object> {
    return this.usersService.validateForgotPassword(validateForgotPasswordDto)
  }


  @UseGuards(AuthGuard('jwt'))
  @Post("change-password")
  changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto): Promise<Object> {
    const { sub } = req.user
    return this.usersService.changePasswordDto(changePasswordDto, sub)
  }


  @UseGuards(AuthGuard('jwt'))
  @Delete("delete")
  deleteUser(@Req() req: any): Promise<any> {
    const { sub } = req.user
    return this.usersService.deleteUser(sub);
  }
}
