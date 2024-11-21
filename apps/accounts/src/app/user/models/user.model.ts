import { IUser, UserRole } from '@libs/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document implements IUser {
  _id: unknown;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.STUDENT,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
