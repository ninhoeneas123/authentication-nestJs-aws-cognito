import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PasswordIsValid } from "src/utils/pipes/password-validation.validator";

// you can add validate using class-validator
export class ChangePasswordDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:'the newPassword field cannot be empty'})
    oldPassword:string

    @ApiProperty()
    @PasswordIsValid({ message: " A senha deve ter no minimo 8 caracteres dentre eles pelo menos 1 letra maiúscula, 1 numero, 1 caractere especial(@,#,$,&)" })
    newPassword:string
}