import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { db, events, bookings, eq } from '@repo/database';

export type EventMetrics = {
  eventId: number;
  eventTitle: string;
  totalSold: number;
  revenue: number;
  averagePrice: number;
  remainingTickets: number | null;
  sellOutPercentage: number;
  totalBookings: number;
};

export type SystemSummary = {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  totalRevenue: number;
  averageTicketPrice: number;
  totalTicketsSold: number;
  averageEventAttendance: number;
};

@Injectable()
export class AnalyticsService {
  create(createAnalyticsDto: CreateAnalyticsDto) {
    return 'This action adds a new analytics';
  }

  findAll() {
    return `This action returns all analytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }

  async getEventMetrics(eventId: number): Promise<EventMetrics> {
    // Get event details
    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Get all bookings for this event
    const eventBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.eventId, eventId));

    const totalSold = eventBookings.reduce((sum, booking) => sum + booking.quantity, 0);
    const revenue = eventBookings.reduce((sum, booking) => sum + (booking.pricePaid || 0), 0);
    const averagePrice = totalSold > 0 ? revenue / totalSold : 0;
    const remainingTickets = event.availableTickets;
    const sellOutPercentage = event.totalTickets && event.totalTickets > 0
      ? (totalSold / event.totalTickets) * 100
      : 0;
    const totalBookings = eventBookings.length;

    return {
      eventId: event.id,
      eventTitle: event.title || '',
      totalSold,
      revenue,
      averagePrice,
      remainingTickets,
      sellOutPercentage,
      totalBookings,
    };
  }

  async getSystemSummary(): Promise<SystemSummary> {
    // Get all events
    const allEvents = await db.select().from(events);
    
    // Get all bookings
    const allBookings = await db.select().from(bookings);

    const totalEvents = allEvents.length;
    const activeEvents = allEvents.filter(e => e.isActive).length;
    const totalBookings = allBookings.length;
    
    const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking.pricePaid || 0), 0);
    const totalTicketsSold = allBookings.reduce((sum, booking) => sum + booking.quantity, 0);
    const averageTicketPrice = totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;
    
    const averageEventAttendance = totalEvents > 0
      ? totalTicketsSold / totalEvents
      : 0;

    return {
      totalEvents,
      activeEvents,
      totalBookings,
      totalRevenue,
      averageTicketPrice,
      totalTicketsSold,
      averageEventAttendance,
    };
  }
}
