import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChessSubscriptionUser,
  ChessSubscriptionUserSchema,
} from './chess-subscription-user.schema';
import { ChessSubscriptionService } from './chess-subscription.service';
import { OCI_CONNECTION } from '../../../common/providers/mongo-connections.provider';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ChessSubscriptionUser.name,
          schema: ChessSubscriptionUserSchema,
        },
      ],
      OCI_CONNECTION,
    ),
  ],
  providers: [ChessSubscriptionService],
  exports: [ChessSubscriptionService],
})
export class ChessSubscriptionModule {}
