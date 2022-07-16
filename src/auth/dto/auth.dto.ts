import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class AuthDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:'the email field cannot be empty'})
    email:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:'the password field cannot be empty'})
    password:string

}
