import * as bcrypt from 'bcrypt'

export class HashPassword {

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds)
        return hashPassword
    }
}