import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { XpSettings, XpSettingsSchema } from './schemas/xp-settings.schema';
import { XpSettingsService } from './xp-settings.service';
import { AdminXpSettingsController } from './admin-xp-settings.controller';
import { PrestigeService } from './prestige.service';
import { PrestigeController } from './prestige.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';

/**
 * XpModule does NOT import AuthModule to avoid circular dependencies.
 * RolesGuard is provided locally (same pattern as EconomyModule).
 * User model and XpSettings are both on the default connection.
 */
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: XpSettings.name, schema: XpSettingsSchema },
    ]),
  ],
  providers: [XpSettingsService, PrestigeService, RolesGuard],
  controllers: [AdminXpSettingsController, PrestigeController],
  exports: [XpSettingsService, PrestigeService],
})
export class XpModule {}
