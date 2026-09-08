import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChessBattlePassUser,
  ChessBattlePassUserSchema,
} from './chess-battlepass-user.schema';
import { ChessBattlePassService } from './chess-battlepass.service';
import { OCI_CONNECTION } from '../../../common/providers/mongo-connections.provider';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: ChessBattlePassUser.name,
          schema: ChessBattlePassUserSchema,
        },
      ],
      OCI_CONNECTION,
    ),
  ],
  providers: [ChessBattlePassService],
  exports: [ChessBattlePassService],
})
export class ChessBattlePassModule {}
