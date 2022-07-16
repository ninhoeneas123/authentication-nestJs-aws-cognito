import { IsNotEmpty, IsString } from "class-validator"

export class ValidateUpdateEmailDto{

    @IsString()
    @IsNotEmpty({ message: 'the code field cannot be empty' })
    code: string
  
}