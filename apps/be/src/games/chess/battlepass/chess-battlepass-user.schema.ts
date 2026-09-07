import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChessBattlePassUserDocument = HydratedDocument<ChessBattlePassUser>;

@Schema({ timestamps: true, collection: 'chess_battlepass_users' })
export class ChessBattlePassUser {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ default: 'season-1' })
  seasonId!: string;

  @Prop({ default: 1 })
  level!: number;

  @Prop({ default: 0 })
  xp!: number;

  @Prop({ type: [Number], default: [] })
  claimedRewards!: number[];

  @Prop({ default: false })
  purchasedPremium!: boolean;
}

export const ChessBattlePassUserSchema =
  SchemaFactory.createForClass(ChessBattlePassUser);

ChessBattlePassUserSchema.index({ userId: 1, seasonId: 1 }, { unique: true });
