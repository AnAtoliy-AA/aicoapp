import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChessUserCosmeticDocument = HydratedDocument<ChessUserCosmetic>;

@Schema({ timestamps: true, collection: 'chess_user_cosmetics' })
export class ChessUserCosmetic {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, index: true })
  cosmeticId!: string;

  @Prop({ default: () => new Date() })
  purchasedAt!: Date;
}

export const ChessUserCosmeticSchema =
  SchemaFactory.createForClass(ChessUserCosmetic);

ChessUserCosmeticSchema.index({ userId: 1, cosmeticId: 1 }, { unique: true });
