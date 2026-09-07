import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChessBattlePassUser,
  type ChessBattlePassUserDocument,
} from './chess-battlepass-user.schema';
import { OCI_CONNECTION } from '../../../common/providers/mongo-connections.provider';

export interface BattlePassSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  maxLevel: number;
}

export interface BattlePassReward {
  level: number;
  tier: 'free' | 'premium';
  type: 'coins' | 'cosmetic' | 'emote' | 'title';
  itemId: string;
  amount: number;
}

const XP_PER_LEVEL = 100;
const SEASON_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class ChessBattlePassService {
  private readonly logger = new Logger(ChessBattlePassService.name);

  constructor(
    @InjectModel(ChessBattlePassUser.name, OCI_CONNECTION)
    private readonly model: Model<ChessBattlePassUserDocument>,
  ) {}

  getCurrentSeason(): BattlePassSeason {
    return {
      id: 'season-1',
      name: 'Season 1',
      startDate: new Date(),
      endDate: new Date(Date.now() + SEASON_DURATION_MS),
      maxLevel: 50,
    };
  }

  async getUserProgress(
    userId: string,
  ): Promise<{ level: number; xp: number; xpToNext: number }> {
    const season = this.getCurrentSeason();
    const doc = await this.model
      .findOne({ userId, seasonId: season.id })
      .lean();
    if (!doc) return { level: 1, xp: 0, xpToNext: XP_PER_LEVEL };
    return {
      level: doc.level,
      xp: doc.xp,
      xpToNext: XP_PER_LEVEL - (doc.xp % XP_PER_LEVEL),
    };
  }

  async addXp(
    userId: string,
    amount: number,
  ): Promise<{
    level: number;
    xp: number;
    xpToNext: number;
    leveledUp: boolean;
  }> {
    const season = this.getCurrentSeason();
    const doc = await this.model.findOneAndUpdate(
      { userId, seasonId: season.id },
      { $inc: { xp: amount } },
      { new: true, upsert: true },
    );

    const newLevel = Math.floor(doc.xp / XP_PER_LEVEL) + 1;
    const cappedLevel = Math.min(newLevel, season.maxLevel);
    const leveledUp = cappedLevel > doc.level;

    if (leveledUp) {
      doc.level = cappedLevel;
      await doc.save();
      this.logger.log(
        `User ${userId} leveled up to ${cappedLevel} (season: ${season.id})`,
      );
    }

    return {
      level: cappedLevel,
      xp: doc.xp,
      xpToNext: XP_PER_LEVEL - (doc.xp % XP_PER_LEVEL),
      leveledUp,
    };
  }

  async claimReward(userId: string, level: number): Promise<boolean> {
    const season = this.getCurrentSeason();
    const doc = await this.model.findOne({ userId, seasonId: season.id });
    if (!doc || doc.level < level) return false;
    if (doc.claimedRewards.includes(level)) return false;
    doc.claimedRewards.push(level);
    await doc.save();
    return true;
  }

  getRewardsForLevel(level: number): BattlePassReward[] {
    const rewards: BattlePassReward[] = [];
    if (level % 5 === 0) {
      rewards.push({
        level,
        tier: 'free',
        type: 'coins',
        itemId: 'coins',
        amount: 100,
      });
    }
    if (level % 10 === 0) {
      rewards.push({
        level,
        tier: 'premium',
        type: 'cosmetic',
        itemId: `board-theme-${level}`,
        amount: 1,
      });
    }
    return rewards;
  }
}
