import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendCodeValidateUserDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}