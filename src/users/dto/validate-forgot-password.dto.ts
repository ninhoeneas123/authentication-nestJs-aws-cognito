import { IsNotEmpty, IsString } from "class-validator"

export class ValidateForgotPasswordDto{

    @IsString()
    @IsNotEmpty({ message: 'the email field cannot be empty' })
    email: string

    @IsString()
    @IsNotEmpty({ message: 'the code field cannot be empty' })
    code: string

    @IsString()
    @IsNotEmpty({ message: 'the newPassword field cannot be empty' })
    newPassword: string
    

}
