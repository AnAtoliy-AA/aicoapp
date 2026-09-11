import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XpSettings, XpSettingsSchema } from './schemas/xp-settings.schema';
import { XpSettingsService } from './xp-settings.service';
import { AdminXpSettingsController } from './admin-xp-settings.controller';
import { PrestigeService } from './prestige.service';
import { PrestigeController } from './prestige.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { OCI_CONNECTION } from '../common/providers/mongo-connections.provider';

/**
 * XpModule does NOT import AuthModule to avoid circular dependencies.
 * RolesGuard is provided locally (same pattern as EconomyModule).
 * User model is imported on the default connection for RolesGuard.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature(
      [{ name: XpSettings.name, schema: XpSettingsSchema }],
      OCI_CONNECTION,
    ),
  ],
  providers: [XpSettingsService, PrestigeService, RolesGuard],
  controllers: [AdminXpSettingsController, PrestigeController],
  exports: [XpSettingsService, PrestigeService],
})
export class XpModule {}
