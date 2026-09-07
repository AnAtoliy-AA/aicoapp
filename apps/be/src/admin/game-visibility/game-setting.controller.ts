import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { GameSettingService } from './game-setting.service';

class SetSettingsDto {
  settings!: Record<string, unknown>;
}

@Controller('admin/game-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class GameSettingController {
  constructor(private readonly settingService: GameSettingService) {}

  @Get()
  async getAllSettings() {
    const allSettings = await this.settingService.getAllSettings();
    const result: Record<string, Record<string, unknown>> = {};
    for (const [gameId, settings] of allSettings) {
      result[gameId] = settings;
    }
    return { settings: result };
  }

  @Get(':gameId')
  async getSettings(@Param('gameId') gameId: string) {
    const settings = await this.settingService.getSettings(gameId);
    return { gameId, settings };
  }

  @Put(':gameId')
  async setSettings(
    @Param('gameId') gameId: string,
    @Body() dto: SetSettingsDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as { userId: string })?.userId;
    await this.settingService.setSettings(gameId, dto.settings, userId);
    return { success: true };
  }
}
