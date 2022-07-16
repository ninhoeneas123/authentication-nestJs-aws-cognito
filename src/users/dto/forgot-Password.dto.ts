import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ForgotPasswordDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'the email field cannot be empty' })
    email: string
}
