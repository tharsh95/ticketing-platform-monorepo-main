import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('events/:id')
  async getEventMetrics(@Param('id') id: string) {
    return this.analyticsService.getEventMetrics(+id);
  }

  @Get('summary')
  async getSystemSummary() {
    return this.analyticsService.getSystemSummary();
  }
}
