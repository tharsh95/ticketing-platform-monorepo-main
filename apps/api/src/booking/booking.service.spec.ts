import { Test } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { db, events, bookings, eq } from '@repo/database';
import { PricingService } from '../pricing/pricing.service';

describe('BookingService concurrency', () => {
  let service: BookingService;
  let pricingService: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: PricingService,
          useValue: {
            calculateForEvent: jest.fn().mockResolvedValue({ finalPrice: 100 }),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(BookingService);
    pricingService = moduleRef.get(PricingService);
  });

  it('allows only one booking when only one ticket remains under concurrency', async () => {
    // Create an event with 1 available ticket
    const [event] = await db
      .insert(events)
      .values({
        title: 'Concurrency Test',
        description: 'ct',
        date: new Date(),
        location: 'x',
        totalTickets: 1,
        availableTickets: 1,
        isActive: true,
      })
      .returning();

    expect(event).toBeTruthy();
    const eventId = event!.id;

    // Two concurrent booking attempts
    const attempt1 = service.create({ eventId: eventId, userEmail: 'a@b.com', quantity: 1 } as any);
    const attempt2 = service.create({ eventId: eventId, userEmail: 'c@d.com', quantity: 1 } as any);

    const results = await Promise.allSettled([attempt1, attempt2]);

    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    // Verify no oversell
    const [updated] = await db.select().from(events).where(eq(events.id, eventId));
    expect(updated?.availableTickets).toBe(0);

    const allBookings = await db.select().from(bookings).where(eq(bookings.eventId, eventId));
    expect(allBookings.length).toBe(1);
  });
});
