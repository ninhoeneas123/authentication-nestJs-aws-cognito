import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { PasswordIsValid } from "src/utils/pipes/password-validation.validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @MaxLength(250)
    @IsNotEmpty({ message: "The name field cannot be empty" })
    name: string

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty({ message: "The email field cannot be empty" })
    email: string

    @ApiProperty()
    @IsString()
    @PasswordIsValid({ message: " The password must be at least 8 characters long, including at least 1 uppercase letter, 1 number, 1 special character(@,#,$,&)" })
    password: string

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    @IsOptional()
    coginitoId: string

}
