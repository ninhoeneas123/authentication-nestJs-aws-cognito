import { ExceptionsConstants } from './../utils/constants/exceptions';
import { AuthService } from './../auth/auth.service';
import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from "cache-manager";
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { HashPassword } from 'src/utils/hash-password';
import { UpdateEmailDto } from './dto/update-email.dto';
import { ValidateUpdateEmailDto } from './dto/validate-update-email.dto';
import { ReturnMessages } from 'src/utils/constants/return-messages';
import { ValidateForgotPasswordDto } from './dto/validate-forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService,
    private readonly hashPassword: HashPassword,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

  ) { }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = createUserDto;
    const userCognitoData = await this.authService.registerUser(user.password, user.email)
    user.coginitoId = userCognitoData.UserSub
    user.password = await this.hashPassword.hashPassword(user.password);
    await this.cacheManager.set('user-create-data', user, { ttl: 600 });

    return userCognitoData
  }

  async validateUser(code, email) {
    await this.authService.validateUser(code, email)
    const userData = await this.cacheManager.get('user-create-data');
    const user = await this.userModel.create(userData)

    if (!user) {
      throw new BadRequestException(ExceptionsConstants.FAILED_TO_CREATE_USER)
    }

    return { message: ReturnMessages.USER_CREATED_SUCCESSFULLY }
  }

  async updateEmail(updateEmailUserDto: UpdateEmailDto): Promise<any> {
    const { newEmail } = updateEmailUserDto
    return this.authService.updateEmail(newEmail)

  }

  async validateUpdateEmail(updateEmailUserDto: ValidateUpdateEmailDto, cognitoId: string): Promise<any> {
    const { code } = updateEmailUserDto
    const newEmail = await this.cacheManager.get('new-email');
    await this.authService.validateUpdateEmail(code)

    const updateEmailDb = await this.userModel.findOneAndUpdate({ cognitoId: cognitoId }, { email: newEmail })
    console.log(updateEmailDb)
    if (!updateEmailDb) {
      throw new BadRequestException(ExceptionsConstants.FAILED_TO_UPDATE_EMAIL)
    }
    return { message: ReturnMessages.UPDATE_SUCESS };
  }


  async changePasswordDto(changePasswordDto: ChangePasswordDto, coginitoId: string) {
    const { oldPassword, newPassword } = changePasswordDto
    const updateCoginitoPassword = await this.authService.changePassword(oldPassword, newPassword)
    const newPasswordHash = await this.hashPassword.hashPassword(newPassword);
    await this.userModel.findOneAndUpdate({ cognitoId: coginitoId }, { password: newPasswordHash });

    return updateCoginitoPassword
  }


  async validateForgotPassword(validateForgotPasswordDto: ValidateForgotPasswordDto) {
    const { code, newPassword } = validateForgotPasswordDto
    const email: string = await this.cacheManager.get('user-email')

    await this.authService.confirmForgotPassword(email, code, newPassword)
    const newPasswordHash = await this.hashPassword.hashPassword(newPassword);

    const updatePasswordDb = await this.userModel.findOneAndUpdate({ email }, { password: newPasswordHash });
    if (!updatePasswordDb) {
      throw new BadRequestException(ExceptionsConstants.FAILED_TO_FORGOT_PASSWORD)
    }
    return { message: ReturnMessages.UPDATE_SUCESS }
  }


  async deleteUser(cognitoId: string): Promise<any> {
    await this.authService.deleteuser()
    const deleteUserDb = await this.userModel.deleteOne({ cognitoId })
    if (deleteUserDb) {
      throw new BadRequestException(ExceptionsConstants.FAILED_TO_DELETE_USER)
    }

    return { message: ReturnMessages.USER_SUCCESSFULLY_DELETED };
  }


}
