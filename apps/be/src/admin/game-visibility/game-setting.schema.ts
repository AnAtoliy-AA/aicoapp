import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'game_settings' })
export class GameSetting extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  gameId!: string;

  @Prop({ type: Object, default: {} })
  settings!: Record<string, unknown>;

  @Prop({ required: true, trim: true })
  updatedBy!: string;
}

export type GameSettingDocument = GameSetting;
export const GameSettingSchema = SchemaFactory.createForClass(GameSetting);
