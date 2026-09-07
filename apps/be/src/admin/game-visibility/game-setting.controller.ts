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
import { IsObject } from 'class-validator';

const ALLOWED_SETTING_KEYS = [
  'availableDifficulties',
  'aivsaiDifficulties',
] as const;

class SetSettingsDto {
  @IsObject()
  settings!: Record<string, unknown>;
}

/**
 * Sanitize settings to prevent NoSQL injection.
 * Only allows known keys with string or string[] values.
 */
function sanitizeSettings(
  raw: Record<string, unknown>,
): Record<string, string | string[]> {
  const safe: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!(ALLOWED_SETTING_KEYS as readonly string[]).includes(key)) continue;
    if (typeof value === 'string') {
      safe[key] = value;
    } else if (
      Array.isArray(value) &&
      value.every((v) => typeof v === 'string')
    ) {
      safe[key] = value;
    }
  }
  return safe;
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
    const safeSettings = sanitizeSettings(dto.settings);
    await this.settingService.setSettings(gameId, safeSettings, userId);
    return { success: true };
  }
}
