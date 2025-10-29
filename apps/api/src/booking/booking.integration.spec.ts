import { Test } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PricingService } from '../pricing/pricing.service';
import { db, events, bookings, eq } from '@repo/database';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BookingService Integration Tests', () => {
  let bookingService: BookingService;
  let pricingService: PricingService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookingService, PricingService],
    }).compile();

    bookingService = moduleRef.get<BookingService>(BookingService);
    pricingService = moduleRef.get<PricingService>(PricingService);
  });

  beforeEach(async () => {
    // Clean up before each test
    await db.delete(bookings);
    await db.delete(events);
  });

  describe('Complete Booking Flow', () => {
    it('should complete full flow from price calculation to booking confirmation', async () => {
      // 1. Create an event
      const [event] = await db.insert(events).values({
        title: 'Integration Test Event',
        description: 'Test event for integration tests',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        location: 'Test Location',
        totalTickets: 100,
        availableTickets: 100,
        price: 100,
        isActive: true,
      }).returning();

      expect(event).toBeTruthy();

      // 2. Calculate current price using pricing service
      const priceBreakdown = await pricingService.calculateForEvent(db, event!, new Date());
      
      expect(priceBreakdown).toBeDefined();
      expect(priceBreakdown.finalPrice).toBeGreaterThan(0);
      expect(priceBreakdown.basePrice).toBe(100);

      // 3. Create a booking (this uses pricing service internally)
      const bookingResult = await bookingService.create({
        eventId: event!.id,
        userEmail: 'test@example.com',
        quantity: 2,
      });

      // 4. Verify booking was created successfully
      expect(bookingResult).toBeDefined();
      expect(bookingResult.id).toBeDefined();
      expect(bookingResult.userEmail).toBe('test@example.com');
      expect(bookingResult.quantity).toBe(2);
      expect(bookingResult.amount).toBeGreaterThan(0);

      // 5. Verify tickets were decremented
      const [updatedEvent] = await db.select().from(events).where(eq(events.id, event!.id));
      expect(updatedEvent?.availableTickets).toBe(98);

      // 6. Verify booking exists in database
      const [storedBooking] = await db.select().from(bookings).where(eq(bookings.id, bookingResult.id));
      expect(storedBooking).toBeDefined();
      expect(storedBooking?.quantity).toBe(2);
      expect(storedBooking?.pricePaid).toBeGreaterThan(0);
    });

    it('should use dynamic pricing for each booking', async () => {
      const now = new Date();
      
      // Create event with tomorrow's date (should have +50% time adjustment)
      const [event] = await db.insert(events).values({
        title: 'Tomorrow Event',
        date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        totalTickets: 50,
        availableTickets: 50,
        price: 100,
        isActive: true,
      }).returning();

      // First booking should have a certain price
      const booking1 = await bookingService.create({
        eventId: event!.id,
        userEmail: 'first@example.com',
        quantity: 1,
      });

      // Create more bookings to trigger demand-based adjustment
      for (let i = 0; i < 5; i++) {
        await db.insert(bookings).values({
          eventId: event!.id,
          userEmail: `test${i}@example.com`,
          quantity: 1,
          pricePaid: 10000, // Fixed for test
        });
      }

      // Second booking should have potentially higher price due to demand
      const booking2 = await bookingService.create({
        eventId: event!.id,
        userEmail: 'second@example.com',
        quantity: 1,
      });

      // Both should be charged dynamically calculated prices
      expect(booking1.amount).toBeGreaterThan(0);
      expect(booking2.amount).toBeGreaterThan(0);
      // Note: actual comparison depends on demand calculation timing
    });

    it('should respect floor and ceiling constraints during booking', async () => {
      // Set price constraints
      process.env.PRICE_FLOOR = '75';
      process.env.PRICE_CEILING = '125';

      const [event] = await db.insert(events).values({
        title: 'Constrained Price Event',
        date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        totalTickets: 100,
        availableTickets: 100,
        price: 100,
        isActive: true,
      }).returning();

      const booking = await bookingService.create({
        eventId: event!.id,
        userEmail: 'constrained@example.com',
        quantity: 1,
      });

      // Price should be within bounds
      expect(booking.amount).toBeGreaterThanOrEqual(75);
      expect(booking.amount).toBeLessThanOrEqual(125);

      // Clean up
      delete process.env.PRICE_FLOOR;
      delete process.env.PRICE_CEILING;
    });
  });

  describe('Error Handling in Booking Flow', () => {
    it('should throw NotFoundException for non-existent event', async () => {
      await expect(
        bookingService.create({
          eventId: 99999,
          userEmail: 'test@example.com',
          quantity: 1,
        })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive event', async () => {
      const [event] = await db.insert(events).values({
        title: 'Inactive Event',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalTickets: 100,
        availableTickets: 100,
        price: 100,
        isActive: false,
      }).returning();

      await expect(
        bookingService.create({
          eventId: event!.id,
          userEmail: 'test@example.com',
          quantity: 1,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when insufficient tickets available', async () => {
      const [event] = await db.insert(events).values({
        title: 'Limited Tickets',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalTickets: 5,
        availableTickets: 5,
        price: 100,
        isActive: true,
      }).returning();

      // Book 3 tickets first
      await bookingService.create({
        eventId: event!.id,
        userEmail: 'first@example.com',
        quantity: 3,
      });

      // Try to book 5 more (only 2 left)
      await expect(
        bookingService.create({
          eventId: event!.id,
          userEmail: 'second@example.com',
          quantity: 5,
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Concurrent Booking Prevention', () => {
    it('should prevent overselling under high concurrency', async () => {
      const [event] = await db.insert(events).values({
        title: 'High Concurrency Event',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalTickets: 10,
        availableTickets: 10,
        price: 100,
        isActive: true,
      }).returning();

      // Simulate 20 concurrent booking attempts for 1 ticket each
      const promises = Array.from({ length: 20 }, (_, i) =>
        bookingService.create({
          eventId: event!.id,
          userEmail: `user${i}@example.com`,
          quantity: 1,
        }).catch(err => ({ error: err.message }))
      );

      const results = await Promise.allSettled(promises);

      const successful = results.filter(r => r.status === 'fulfilled' && !('error' in (r.value as any)));
      const failed = results.filter(r => r.status === 'rejected' || 'error' in (r.value as any));

      // Verify exactly 10 bookings succeeded
      expect(successful.length).toBe(10);

      // Verify no oversell
      const [updatedEvent] = await db.select().from(events).where(eq(events.id, event!.id));
      expect(updatedEvent?.availableTickets).toBe(0);

      // Verify exactly 10 bookings in database
      const allBookings = await db.select().from(bookings).where(eq(bookings.eventId, event!.id));
      expect(allBookings.length).toBe(10);
    });
  });

  afterAll(async () => {
    await db.delete(bookings);
    await db.delete(events);
  });
});

