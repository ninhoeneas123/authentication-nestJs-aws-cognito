import { IsEmail, IsNotEmpty} from 'class-validator';

export class UpdateEmailDto {

    @IsNotEmpty({ message: 'O campo novo email precisa ser preenchido' })
    @IsEmail()
    newEmail: string;

}
