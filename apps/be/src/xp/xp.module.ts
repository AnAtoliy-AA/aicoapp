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

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: XpSettings.name, schema: XpSettingsSchema },
        { name: User.name, schema: UserSchema },
      ],
      OCI_CONNECTION,
    ),
  ],
  providers: [XpSettingsService, PrestigeService, RolesGuard],
  controllers: [AdminXpSettingsController, PrestigeController],
  exports: [XpSettingsService, PrestigeService],
})
export class XpModule {}
