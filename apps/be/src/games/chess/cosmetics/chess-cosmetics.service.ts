import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChessCosmetic,
  type ChessCosmeticDocument,
} from './chess-cosmetic.schema';
import {
  ChessUserCosmetic,
  type ChessUserCosmeticDocument,
} from './chess-user-cosmetic.schema';
import { OCI_CONNECTION } from '../../../common/providers/mongo-connections.provider';

@Injectable()
export class ChessCosmeticsService {
  private readonly logger = new Logger(ChessCosmeticsService.name);

  constructor(
    @InjectModel(ChessCosmetic.name, OCI_CONNECTION)
    private readonly cosmeticModel: Model<ChessCosmeticDocument>,
    @InjectModel(ChessUserCosmetic.name, OCI_CONNECTION)
    private readonly userCosmeticModel: Model<ChessUserCosmeticDocument>,
  ) {}

  async getAllCosmetics(): Promise<ChessCosmeticDocument[]> {
    return this.cosmeticModel.find().sort({ price: 1 }).exec();
  }

  async getCosmeticsByType(type: string): Promise<ChessCosmeticDocument[]> {
    return this.cosmeticModel.find({ type }).sort({ price: 1 }).exec();
  }

  async getCosmetic(id: string): Promise<ChessCosmeticDocument> {
    const cosmetic = await this.cosmeticModel.findOne({ id }).exec();
    if (!cosmetic) throw new NotFoundException('Cosmetic not found');
    return cosmetic;
  }

  async purchaseCosmetic(
    userId: string,
    cosmeticId: string,
    userGems: number,
  ): Promise<{ success: boolean; remainingGems: number }> {
    const cosmetic = await this.getCosmetic(cosmeticId);

    const existing = await this.userCosmeticModel
      .findOne({ userId, cosmeticId })
      .lean();
    if (existing) {
      throw new BadRequestException('Already owned');
    }

    if (userGems < cosmetic.price) {
      throw new BadRequestException('Insufficient gems');
    }

    await this.userCosmeticModel.create({ userId, cosmeticId });
    const remainingGems = userGems - cosmetic.price;
    this.logger.log(
      `User ${userId} purchased cosmetic ${cosmeticId} for ${cosmetic.price} gems`,
    );
    return { success: true, remainingGems };
  }

  async getUserCosmetics(userId: string): Promise<string[]> {
    const docs = await this.userCosmeticModel.find({ userId }).lean();
    return docs.map((d) => d.cosmeticId);
  }

  async hasCosmetic(userId: string, cosmeticId: string): Promise<boolean> {
    const doc = await this.userCosmeticModel
      .findOne({ userId, cosmeticId })
      .lean();
    return !!doc;
  }
}
