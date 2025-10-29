import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EventsController } from '../events/events.controller';
import { EventsService } from '../events/events.service';
import { BookingController } from '../booking/booking.controller';
import { BookingService } from '../booking/booking.service';
import { PricingService } from '../pricing/pricing.service';
import { AnalyticsController } from '../analytics/analytics.controller';
import { AnalyticsService } from '../analytics/analytics.service';

@Module({
  controllers: [AppController,EventsController,BookingController,AnalyticsController],
  providers: [AppService,EventsService,BookingService,PricingService,AnalyticsService],
})
export class AppModule {}
