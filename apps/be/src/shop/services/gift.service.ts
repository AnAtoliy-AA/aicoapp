import { runInTransaction } from '../../common/utils/transaction.util';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { User, type UserDocument } from '../../auth/schemas/user.schema';
import {
  UserInventoryItem,
  type UserInventoryItemDocument,
} from '../schemas/user-inventory-item.schema';
import {
  ShopAdminAudit,
  type ShopAdminAuditDocument,
} from '../schemas/shop-admin-audit.schema';
import { InventoryService } from './inventory.service';
import { FriendsService } from '../../friends/friends.service';
import { equipKeyFor } from '../lib/shop-types';
import { getCatalogItem } from '../lib/shop-catalog';
import type { GiftResult } from '../interfaces/shop-views';

interface InventoryRowSnapshot {
  _id: import('mongoose').Types.ObjectId;
  userId: import('mongoose').Types.ObjectId;
  itemId: string;
  purchaseId: string;
  acquiredVia: string;
  paidAmount?: number | null;
  paidCurrency?: string | null;
  soldAt?: Date | null;
  createdAt?: Date;
}

@Injectable()
export class GiftService {
  private readonly logger = new Logger(GiftService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserInventoryItem.name)
    private readonly inventoryModel: Model<UserInventoryItemDocument>,
    @InjectModel(ShopAdminAudit.name)
    private readonly auditModel: Model<ShopAdminAuditDocument>,
    private readonly inventory: InventoryService,
    private readonly friends: FriendsService,
  ) {}

  async gift(
    senderId: string,
    recipientId: string,
    itemId: string,
    message: string,
  ): Promise<GiftResult> {
    if (senderId === recipientId) {
      throw new BadRequestException('shop.cannotGiftSelf');
    }

    const friendIds = await this.friends.getFriendIds(senderId);
    if (!friendIds.includes(recipientId)) {
      throw new ForbiddenException('shop.notFriends');
    }

    const def = getCatalogItem(itemId);
    if (!def) throw new NotFoundException('shop.unknownItem');
    if (def.starter === true) {
      throw new BadRequestException('shop.starterNotGift');
    }

    const senderObjId = new Types.ObjectId(senderId);
    const purchaseId = `gift-${senderId}-${recipientId}-${itemId}-${Date.now()}`;

    let recipientRow!: InventoryRowSnapshot;

    await runInTransaction(this.connection, async (session) => {
      const row = await this.inventoryModel
        .findOne(
          {
            userId: senderObjId,
            itemId,
            soldAt: null,
          },
          null,
          { session },
        )
        .lean<InventoryRowSnapshot | null>();

      if (!row) throw new BadRequestException('shop.notOwned');

      // Mark sender's row as gifted (soldAt set).
      await this.inventoryModel.updateOne(
        { _id: row._id },
        { $set: { soldAt: new Date() } },
        { session },
      );

      // Create new inventory row for recipient.
      const created = await this.inventoryModel.create(
        [
          {
            userId: new Types.ObjectId(recipientId),
            itemId: def.id,
            purchaseId,
            acquiredVia: 'gift',
            paidAmount: null,
            paidCurrency: null,
          },
        ],
        { session },
      );
      recipientRow = created[0];

      // Audit trail.
      await this.auditModel.create(
        [
          {
            adminUserId: new Types.ObjectId(senderId),
            action: 'grant',
            subjectItemId: def.id,
            subjectUserId: new Types.ObjectId(recipientId),
            reason: `Gift from friend: ${message}`,
          },
        ],
        { session },
      );
    });

    // Clear equip if the sender had this item equipped.
    if (def) {
      const equipKey = equipKeyFor(def.category);
      if (equipKey) {
        const senderUser = await this.userModel
          .findById(senderId, { [equipKey]: 1 })
          .lean<{ [key: string]: string | null } | null>();
        if (senderUser && senderUser[equipKey] === itemId) {
          await this.inventory.clearEquipIfPointsAt(
            senderId,
            itemId,
            def.category,
          );
        }
      }
    }

    return {
      inventoryItem: {
        rowId: recipientRow._id.toString(),
        itemId: recipientRow.itemId,
        purchaseId: recipientRow.purchaseId,
        acquiredVia: recipientRow.acquiredVia as
          'coins' | 'gems' | 'arcadeum' | 'grant' | 'starter' | 'gift',
        paidAmount: recipientRow.paidAmount ?? null,
        paidCurrency:
          (recipientRow.paidCurrency as 'coins' | 'gems' | null) ?? null,
        soldAt: recipientRow.soldAt ? recipientRow.soldAt.toISOString() : null,
        createdAt: (recipientRow.createdAt ?? new Date()).toISOString(),
      },
    };
  }
}
