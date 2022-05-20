import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserStatus } from '../enum/user-status.enum';
import { UserRole } from '../enum/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    id: mongoose.Schema.Types.ObjectId;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ unique: true, required: true })
    password: string;

    @Prop({ unique: true })
    confirmationCode: string;

    @Prop({ default: UserStatus.Pending })
    status: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ default: UserRole.User })
    role: string

    @Prop({ default: null })
    photoURL: string;

    @Prop({ default: new Date() })
    createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);