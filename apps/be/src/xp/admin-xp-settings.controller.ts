import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { XpSettingsService } from './xp-settings.service';
import { UpdateXpSettingsDto } from './dto/update-xp-settings.dto';
import type { AuthenticatedUser } from '../auth/jwt/jwt.strategy';

interface RequestWithUser {
  user: AuthenticatedUser;
}

@Controller('admin/xp-settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminXpSettingsController {
  constructor(private readonly service: XpSettingsService) {}

  @Get()
  list() {
    return this.service.listAll();
  }

  @Put(':scope')
  async update(
    @Req() req: RequestWithUser,
    @Param('scope') scope: string,
    @Body() dto: UpdateXpSettingsDto,
  ) {
    await this.service.updateSettings(scope, dto, req.user.userId);
    const all = await this.service.listAll();
    return all.find((s) => s.scope === scope);
  }

  @Delete(':scope')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reset(@Param('scope') scope: string) {
    await this.service.resetToDefaults(scope);
  }
}
