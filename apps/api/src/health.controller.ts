import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'General health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return { success: true, status: 'ok' };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  @ApiResponse({ status: 200, description: 'Service is live' })
  getLiveHealth() {
    return { success: true, status: 'live' };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  getReadinessHealth() {
    return { success: true, status: 'ready' };
  }

  @Get('ready/live')
  @ApiOperation({ summary: 'Compatibility health route' })
  @ApiResponse({ status: 200, description: 'Service is ready and live' })
  getReadyLiveHealth() {
    return { success: true, status: 'ready-live' };
  }
}
