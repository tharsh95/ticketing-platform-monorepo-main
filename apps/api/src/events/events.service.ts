import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { db, events, Event, NewEvent, eq, seed } from '@repo/database';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class EventsService {
  constructor(private readonly pricingService: PricingService) {}
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent: NewEvent = {
      title: createEventDto.title,
      description: createEventDto.description,
      date: new Date(createEventDto.date),
      location: createEventDto.location,
      totalTickets: createEventDto.totalTickets,
      availableTickets: createEventDto.availableTickets,
      isActive: createEventDto.isActive ?? true,
    };

    const [event] = await db.insert(events).values(newEvent).returning();
    
    if (!event) {
      throw new Error('Failed to create event');
    }
    
    return event;
  }

  async findAll(): Promise<(Omit<Event, 'priceConfig'> & { currentPrice: number })[]> {
    const list = await db
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
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events).where(eq(events.isActive,true));

    const withPrices = await Promise.all(
      list.map(async (ev) => {
        const breakdown = await this.pricingService.calculateForEvent(db, ev as unknown as Event);
        return { ...ev, currentPrice: breakdown.finalPrice };
      })
    );
    return withPrices;
  }

  async findOne(id: number): Promise<Event & { pricing: import('../pricing/pricing.service').PriceBreakdown }> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    const pricing = await this.pricingService.calculateForEvent(db, event);
    return Object.assign(event, { pricing });
  }

  // async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
  //   const updateData: Partial<NewEvent> = {
  //     ...(updateEventDto.title && { title: updateEventDto.title }),
  //     ...(updateEventDto.description !== undefined && { description: updateEventDto.description }),
  //     ...(updateEventDto.date && { date: new Date(updateEventDto.date) }),
  //     ...(updateEventDto.location !== undefined && { location: updateEventDto.location }),
  //     ...(updateEventDto.totalTickets !== undefined && { totalTickets: updateEventDto.totalTickets }),
  //     ...(updateEventDto.availableTickets !== undefined && { availableTickets: updateEventDto.availableTickets }),
  //     ...(updateEventDto.isActive !== undefined && { isActive: updateEventDto.isActive }),
  //     updatedAt: new Date(),
  //   };

  //   const [event] = await db
  //     .update(events)
  //     .set(updateData)
  //     .where(eq(events.id, id))
  //     .returning();

  //   if (!event) {
  //     throw new NotFoundException(`Event with ID ${id} not found`);
  //   }

  //   return event;
  // }

  // async remove(id: number): Promise<void> {
  //   const [event] = await db.delete(events).where(eq(events.id, id)).returning();
    
  //   if (!event) {
  //     throw new NotFoundException(`Event with ID ${id} not found`);
  //   }
  // }

  async seed(): Promise<{ message: string; count: number }> {
    try {
      // Call the seed function from seed.ts
      await seed();
      
      // Get the count of events after seeding
      const eventsCount = await db.select().from(events);
      
      return {
        message: 'Database seeded successfully with sample events',
        count: eventsCount.length,
      };
    } catch (error) {
      throw new Error(`Failed to seed database: ${error}`);
    }
  }
}
