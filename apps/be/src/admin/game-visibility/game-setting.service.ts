import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameSetting, type GameSettingDocument } from './game-setting.schema';
import { GAME_CATALOG } from '../../games/games.catalog';

const VALID_GAME_IDS = new Set(GAME_CATALOG.map((g) => g.gameId));

function assertValidGameId(gameId: string): string {
  if (!VALID_GAME_IDS.has(gameId)) {
    throw new BadRequestException(`Invalid gameId: ${gameId}`);
  }
  return gameId;
}

@Injectable()
export class GameSettingService {
  private readonly logger = new Logger(GameSettingService.name);

  constructor(
    @InjectModel(GameSetting.name)
    private readonly model: Model<GameSettingDocument>,
  ) {}

  async getSettings(gameId: string): Promise<Record<string, unknown>> {
    if (typeof gameId !== 'string') {
      throw new BadRequestException('Invalid gameId');
    }
    const validGameId = assertValidGameId(gameId);
    const doc = await this.model.findOne({ gameId: validGameId }).lean().exec();
    return doc?.settings ?? {};
  }

  async getAllSettings(): Promise<Map<string, Record<string, unknown>>> {
    const docs = await this.model.find().lean().exec();
    const result = new Map<string, Record<string, unknown>>();
    for (const doc of docs) {
      result.set(doc.gameId, doc.settings);
    }
    return result;
  }

  async setSettings(
    gameId: string,
    settings: Record<string, unknown>,
    updatedBy: string,
  ): Promise<void> {
    if (typeof gameId !== 'string') {
      throw new BadRequestException('Invalid gameId');
    }
    const validGameId = assertValidGameId(gameId);
    await this.model.findOneAndUpdate(
      { gameId: validGameId },
      { settings, updatedBy },
      { upsert: true },
    );
    this.logger.log(`Settings for ${validGameId} updated by ${updatedBy}`);
  }
}
