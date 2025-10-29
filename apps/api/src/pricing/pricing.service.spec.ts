import { Test } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { Event } from '@repo/database';

describe('PricingService', () => {
  let service: PricingService;
  let mockDb: any;
  let mockNow: Date;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = moduleRef.get(PricingService);
    
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([]),
    };
    
    mockNow = new Date('2024-01-15T12:00:00Z');
  });

  describe('Time-Based Pricing Rule', () => {
    const baseEvent: Partial<Event> = {
      id: 1,
      price: 100,
      totalTickets: 100,
      availableTickets: 100,
    };

    it('applies +50% adjustment for events tomorrow (1 day)', async () => {
      const tomorrow = new Date(mockNow.getTime() + 1 * 24 * 60 * 60 * 1000);
      const event = { ...baseEvent, date: tomorrow } as Event;
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.timeBased).toBe(0.5);
      expect(result.finalPrice).toBeGreaterThan(100);
    });

    it('applies +20% adjustment for events within 7 days', async () => {
      const inThreeDays = new Date(mockNow.getTime() + 3 * 24 * 60 * 60 * 1000);
      const event = { ...baseEvent, date: inThreeDays } as Event;
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.timeBased).toBe(0.2);
    });

    it('applies no adjustment for events 30+ days away', async () => {
      const inThirtyDays = new Date(mockNow.getTime() + 35 * 24 * 60 * 60 * 1000);
      const event = { ...baseEvent, date: inThirtyDays } as Event;
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.timeBased).toBe(0);
      expect(result.finalPrice).toBeCloseTo(100);
    });
  });

  describe('Inventory-Based Pricing Rule', () => {
    const baseEvent: Partial<Event> = {
      id: 1,
      price: 100,
      // Use a fixed future date to avoid relying on mockNow at module init time
      date: new Date('2024-12-31T12:00:00Z'),
    };

    it('applies +25% adjustment when less than 20% inventory remains', async () => {
      const event = {
        ...baseEvent,
        totalTickets: 100,
        availableTickets: 15, // 15% remaining
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]); // No demand
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.inventoryBased).toBe(0.25);
      expect(result.finalPrice).toBeCloseTo(125);
    });

    it('applies no adjustment when more than 20% inventory remains', async () => {
      const event = {
        ...baseEvent,
        totalTickets: 100,
        availableTickets: 80, // 80% remaining
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.inventoryBased).toBe(0);
      expect(result.finalPrice).toBeCloseTo(100);
    });

    it('handles no total tickets gracefully', async () => {
      const event = {
        ...baseEvent,
        totalTickets: null,
        availableTickets: 50,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.inventoryBased).toBe(0);
    });
  });

  describe('Demand-Based Pricing Rule', () => {
    const baseEvent: Partial<Event> = {
      id: 1,
      price: 100,
      // Use a fixed future date to avoid relying on mockNow at module init time
      date: new Date('2024-12-31T12:00:00Z'),
      totalTickets: 100,
      availableTickets: 100,
    };

    it('applies +15% adjustment when more than 10 bookings in last hour', async () => {
      // Mock 12 bookings in the last hour
      mockDb.where.mockResolvedValueOnce(Array(12).fill({ id: 1, createdAt: new Date() }));
      
      const result = await service.calculateForEvent(mockDb, baseEvent as Event, mockNow);
      
      expect(result.adjustments.demandBased).toBe(0.15);
      expect(result.finalPrice).toBeCloseTo(115);
    });

    it('applies no adjustment when less than 10 bookings in last hour', async () => {
      // Mock 5 bookings in the last hour
      mockDb.where.mockResolvedValueOnce(Array(5).fill({ id: 1, createdAt: new Date() }));
      
      const result = await service.calculateForEvent(mockDb, baseEvent as Event, mockNow);
      
      expect(result.adjustments.demandBased).toBe(0);
      expect(result.finalPrice).toBeCloseTo(100);
    });

    it('applies no adjustment when no bookings exist', async () => {
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, baseEvent as Event, mockNow);
      
      expect(result.adjustments.demandBased).toBe(0);
    });
  });

  describe('Combined Rules', () => {
    it('combines time and inventory adjustments correctly', async () => {
      const tomorrow = new Date(mockNow.getTime() + 1 * 24 * 60 * 60 * 1000);
      const event = {
        id: 1,
        price: 100,
        date: tomorrow,
        totalTickets: 100,
        availableTickets: 10, // Low inventory
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]); // No demand
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.timeBased).toBe(0.5);
      expect(result.adjustments.inventoryBased).toBe(0.25);
      expect(result.adjustments.demandBased).toBe(0);
      
      // Weighted sum = 0.5 * 1 + 0.25 * 1 = 0.75
      expect(result.weightedSum).toBe(0.75);
      expect(result.finalPrice).toBeCloseTo(175);
    });

    it('combines all three adjustments correctly', async () => {
      const tomorrow = new Date(mockNow.getTime() + 1 * 24 * 60 * 60 * 1000);
      const event = {
        id: 1,
        price: 100,
        date: tomorrow,
        totalTickets: 100,
        availableTickets: 10,
      } as Event;
      
      // Mock high demand
      mockDb.where.mockResolvedValueOnce(Array(15).fill({ id: 1, createdAt: new Date() }));
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.adjustments.timeBased).toBe(0.5);
      expect(result.adjustments.demandBased).toBe(0.15);
      expect(result.adjustments.inventoryBased).toBe(0.25);
      
      const weightedSum = 0.5 * 1 + 0.15 * 1 + 0.25 * 1;
      expect(result.weightedSum).toBe(weightedSum);
    });
  });

  describe('Floor and Ceiling Constraints', () => {
    beforeEach(() => {
      process.env.PRICE_FLOOR = '50';
      process.env.PRICE_CEILING = '200';
    });

    afterEach(() => {
      delete process.env.PRICE_FLOOR;
      delete process.env.PRICE_CEILING;
    });

    it('enforces floor constraint', async () => {
      const event = {
        id: 1,
        price: 100,
        date: new Date(mockNow.getTime() + 100 * 24 * 60 * 60 * 1000),
        totalTickets: 100,
        availableTickets: 100,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      // Even with no adjustments, price should be at least 50
      expect(result.floor).toBe(50);
      expect(result.finalPrice).toBeGreaterThanOrEqual(50);
    });

    it('enforces ceiling constraint', async () => {
      const tomorrow = new Date(mockNow.getTime() + 1 * 24 * 60 * 60 * 1000);
      const event = {
        id: 1,
        price: 150,
        date: tomorrow,
        totalTickets: 100,
        availableTickets: 10,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce(Array(12).fill({ id: 1, createdAt: new Date() }));
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      // With adjustments, price could be 150 * 1.9 = 285, but ceiling should cap at 200
      expect(result.ceiling).toBe(200);
      expect(result.finalPrice).toBeLessThanOrEqual(200);
    });

    it('allows price within bounds', async () => {
      const inTenDays = new Date(mockNow.getTime() + 10 * 24 * 60 * 60 * 1000);
      const event = {
        id: 1,
        price: 100,
        date: inTenDays,
        totalTickets: 100,
        availableTickets: 100,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.finalPrice).toBeGreaterThanOrEqual(50);
      expect(result.finalPrice).toBeLessThanOrEqual(200);
    });
  });

  describe('Price Calculation Formula', () => {
    it('calculates weighted sum correctly', async () => {
      const event = {
        id: 1,
        price: 100,
        date: new Date(mockNow.getTime() + 100 * 24 * 60 * 60 * 1000),
        totalTickets: 100,
        availableTickets: 100,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      expect(result.basePrice).toBe(100);
      expect(result.adjustments.timeBased).toBe(0);
      expect(result.adjustments.inventoryBased).toBe(0);
      expect(result.adjustments.demandBased).toBe(0);
      expect(result.weightedSum).toBe(0);
      expect(result.unclampedPrice).toBe(100);
      expect(result.finalPrice).toBe(100);
    });

    it('formula: finalPrice = basePrice × (1 + weightedSum)', async () => {
      const tomorrow = new Date(mockNow.getTime() + 1 * 24 * 60 * 60 * 1000);
      const event = {
        id: 1,
        price: 100,
        date: tomorrow,
        totalTickets: 100,
        availableTickets: 100,
      } as Event;
      
      mockDb.where.mockResolvedValueOnce([]);
      
      const result = await service.calculateForEvent(mockDb, event, mockNow);
      
      // timeBased = 0.5, weightedSum = 0.5 * 1 = 0.5
      // finalPrice = 100 * (1 + 0.5) = 150
      expect(result.finalPrice).toBeCloseTo(150);
      expect(result.unclampedPrice).toBeCloseTo(150);
    });
  });
});

