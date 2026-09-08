import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChessSubscriptionUserDocument =
  HydratedDocument<ChessSubscriptionUser>;

export type SubscriptionTier = 'free' | 'premium' | 'pro';

@Schema({ timestamps: true, collection: 'chess_subscription_users' })
export class ChessSubscriptionUser {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ type: String, default: 'free', enum: ['free', 'premium', 'pro'] })
  tier!: SubscriptionTier;

  @Prop({ default: () => new Date() })
  startedAt!: Date;

  @Prop({ type: Date, default: null })
  expiresAt!: Date | null;

  @Prop({ type: Object, default: {} })
  dailyUsage!: {
    date: string;
    gameReviews: number;
    puzzles: number;
  };
}

export const ChessSubscriptionUserSchema = SchemaFactory.createForClass(
  ChessSubscriptionUser,
);
