import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';


@Schema({
    collection: 'user',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class User {

    @Expose()
    @IsString()
    @ApiProperty()
    @Prop({ type: String, maxlength: 250 })
    name: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @Prop({ type: String, email: true })
    email: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @Prop({ type: String })
    password: string;

    @Expose()
    @IsString()
    @ApiProperty()
    @Prop({ type: String })
    coginitoId: string;
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);
