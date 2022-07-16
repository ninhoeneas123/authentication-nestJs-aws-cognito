import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class RefreshTokenDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message:'the token field cannot be empty'})
    token:string
 
}
