import { Injectable } from '@nestjs/common';
import { db as defaultDb, bookings, Event, eq } from '@repo/database';

type DatabaseLike = typeof defaultDb;

export type PriceBreakdown = {
  basePrice: number;
  adjustments: {
    timeBased: number; // unweighted
    demandBased: number; // unweighted
    inventoryBased: number; // unweighted
  };
  weights: {
    timeBased: number;
    demandBased: number;
    inventoryBased: number;
  };
  weightedSum: number;
  unclampedPrice: number;
  floor?: number;
  ceiling?: number;
  finalPrice: number;
};

@Injectable()
export class PricingService {
  private getWeights() {
    const timeBased = Number(process.env.PRICE_WEIGHT_TIME ?? '1');
    const demandBased = Number(process.env.PRICE_WEIGHT_DEMAND ?? '1');
    const inventoryBased = Number(process.env.PRICE_WEIGHT_INVENTORY ?? '1');
    return { timeBased, demandBased, inventoryBased };
  }

  private getThresholds() {
    const demandThreshold = Number(process.env.DEMAND_THRESHOLD ?? '10');
    const inventoryThreshold = Number(process.env.INVENTORY_THRESHOLD ?? '0.2');
    return { demandThreshold, inventoryThreshold };
  }

  private getBounds() {
    const floor = process.env.PRICE_FLOOR ? Number(process.env.PRICE_FLOOR) : undefined;
    const ceiling = process.env.PRICE_CEILING ? Number(process.env.PRICE_CEILING) : undefined;
    return { floor, ceiling };
  }

  private resolveBasePrice(event: Event): number {
    const value = typeof event.price === 'number' ? event.price: 0;
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      throw new Error('Invalid base price for event');
    }
    return value;
  }

  private computeTimeAdjustment(eventDate: Date, now: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor((eventDate.getTime() - now.getTime()) / msPerDay);
    if (days <= 1) return 0.5; // +50%
    if (days <= 7) return 0.2; // +20%
    return 0; // 30+ days default handled implicitly
  }

  private computeInventoryAdjustment(totalTickets: number | null, availableTickets: number | null, inventoryThreshold: number): number {
    if (!totalTickets || totalTickets <= 0 || availableTickets === null || availableTickets === undefined) {
      return 0;
    }
    const remainingRatio = availableTickets / totalTickets;
    return remainingRatio < inventoryThreshold ? 0.25 : 0; // +25%
  }

  private async computeDemandAdjustment(db: DatabaseLike, eventId: number, now: Date, demandThreshold: number): Promise<number> {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    // Count bookings for this event in the last hour
    const results = await db
      .select({ id: bookings.id, createdAt: bookings.createdAt })
      .from(bookings)
      .where(eq(bookings.eventId, eventId));
    const count = results.filter((b: any) => (b as any).createdAt ? new Date((b as any).createdAt) >= oneHourAgo : false).length;
    return count > demandThreshold ? 0.15 : 0; // +15%
  }

  async calculateForEvent(db: DatabaseLike, event: Event, now = new Date()): Promise<PriceBreakdown> {
    const weights = this.getWeights();
    const thresholds = this.getThresholds();
    const bounds = this.getBounds();
    const basePrice = this.resolveBasePrice(event);
    const timeAdj = this.computeTimeAdjustment(new Date(event.date as any), now);
    const inventoryAdj = this.computeInventoryAdjustment(event.totalTickets ?? null, event.availableTickets ?? null, thresholds.inventoryThreshold);
    const demandAdj = await this.computeDemandAdjustment(db, event.id, now, thresholds.demandThreshold);
    const weightedSum = timeAdj * weights.timeBased + demandAdj * weights.demandBased + inventoryAdj * weights.inventoryBased;
    const unclampedPrice = basePrice * (1 + weightedSum);

    const finalPrice = this.applyBounds(unclampedPrice, bounds);

    return {
      basePrice,
      adjustments: {
        timeBased: timeAdj,
        demandBased: demandAdj,
        inventoryBased: inventoryAdj,
      },
      weights,
      weightedSum,
      unclampedPrice,
      floor: bounds.floor,
      ceiling: bounds.ceiling,
      finalPrice,
    };
  }

  private applyBounds(price: number, bounds: { floor?: number; ceiling?: number }): number {
    let result = price;
    if (typeof bounds.floor === 'number') {
      result = Math.max(result, bounds.floor);
    }
    if (typeof bounds.ceiling === 'number') {
      result = Math.min(result, bounds.ceiling);
    }
    return result;
  }
}


