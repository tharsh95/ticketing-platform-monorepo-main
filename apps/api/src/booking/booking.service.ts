import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { db, events, bookings, eq } from '@repo/database';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class BookingService {
  constructor(private readonly pricingService: PricingService) {}
  async create(createBookingDto: CreateBookingDto) {
    // Use a transaction and row-level lock to prevent overselling
    return await db.transaction(async (tx) => {
      // Lock the event row FOR UPDATE
      const [lockedEvent] = await tx
        .select()
        .from(events)
        .where(eq(events.id, createBookingDto.eventId))
        .for('update')
        .limit(1);

      if (!lockedEvent) {
        throw new NotFoundException('Event not found');
      }

      if (!lockedEvent.isActive) {
        throw new BadRequestException('Event is not active');
      }

      if (
        lockedEvent.availableTickets === null ||
        lockedEvent.availableTickets < createBookingDto.quantity
      ) {
        throw new BadRequestException(`Tickets available ${lockedEvent.availableTickets}`);
      }

      // Decrement available tickets atomically within the same transaction
      const newAvailable = (lockedEvent.availableTickets || 0) - createBookingDto.quantity;
      await tx
        .update(events)
        .set({ availableTickets: newAvailable, updatedAt: new Date() })
        .where(eq(events.id, lockedEvent.id));

      // Use dynamic pricing engine to resolve current unit price
      const breakdown = await this.pricingService.calculateForEvent(tx as any, lockedEvent as any);
      const unitPrice = breakdown.finalPrice;
      if (typeof unitPrice !== 'number' || Number.isNaN(unitPrice) || unitPrice <= 0) {
        throw new BadRequestException('Invalid calculated price');
      }

      // Create the booking within the transaction
      const unitPriceCents = Math.round(unitPrice * 100);
      const totalCents = unitPriceCents * createBookingDto.quantity;

      const [newBooking] = await tx
        .insert(bookings)
        .values({
          eventId: createBookingDto.eventId,
          userEmail: createBookingDto.userEmail,
          quantity: createBookingDto.quantity,
          pricePaid: totalCents,
        })
        .returning();

      if (!newBooking) {
        throw new BadRequestException('Failed to create booking');
      }

      return {
        id: newBooking.id,
        eventId: newBooking.eventId,
        userEmail: newBooking.userEmail,
        quantity: newBooking.quantity,
        amount: (newBooking.pricePaid ?? 0) / 100,
        createdAt: newBooking.createdAt,
      };
    });
  }

  async getBookingforEvent(id: number) {
    const [event] = await db.select({
      id: events.id,
      title: events.title,
      description: events.description,
      date: events.date,
      location: events.location,
      category: events.category,
      totalTickets: events.totalTickets,
      availableTickets: events.availableTickets,
      price: events.price,
      isActive: events.isActive,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
    }).from(events).where(eq(events.id, id)).limit(1);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const bookingsForEvent = await db
      .select()
      .from(bookings)
      .where(eq(bookings.eventId, id));

    return {
      ...{event},
      ...{bookings:bookingsForEvent},
    };
  }

  async getAllBooking(){
    const booking = await db.select().from(bookings)
    return booking
  }

  async getBookingsByEmail(email: string) {
    const userBookings = await db
      .select({
        id: bookings.id,
        eventId: bookings.eventId,
        userEmail: bookings.userEmail,
        quantity: bookings.quantity,
        pricePaid: bookings.pricePaid,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .where(eq(bookings.userEmail, email));

    // For each booking, get the event details
    const bookingsWithEvents = await Promise.all(
      userBookings.map(async (booking) => {
        const [event] = await db
          .select({
            id: events.id,
            title: events.title,
            description: events.description,
            date: events.date,
            location: events.location,
            category: events.category,
            totalTickets: events.totalTickets,
            availableTickets: events.availableTickets,
            price: events.price,
            isActive: events.isActive,
          })
          .from(events)
          .where(eq(events.id, booking.eventId))
          .limit(1);

        // Calculate current adjusted price for comparison
        let eventCurrentPrice: number | undefined;
        if (event) {
          try {
            const breakdown = await this.pricingService.calculateForEvent(db as any, event as any);
            eventCurrentPrice = breakdown.finalPrice;
          } catch (_) {
            eventCurrentPrice = undefined;
          }
        }

        return {
          ...booking,
          // convert stored cents to dollars for API response
          pricePaid: (booking.pricePaid ?? 0) / 100,
          event,
          eventCurrentPrice,
        };
      })
    );

    return bookingsWithEvents;
  }


}
