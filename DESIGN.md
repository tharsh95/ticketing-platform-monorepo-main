## Design Overview

This system implements a full‑stack ticketing platform with dynamic pricing, safe booking under concurrency, and a clear monorepo architecture for separation of concerns and reuse.

### Pricing Algorithm and Design Choices
Pricing is computed in `PricingService.calculateForEvent` and composes three rule families: time‑based, demand‑based, and inventory‑based. Each rule returns an unweighted adjustment (e.g., 0.5 for +50%). The final price is calculated as `finalPrice = basePrice × (1 + Σ(weight_i × adjustment_i))`, then clamped by optional floor/ceiling bounds.

Time‑based adjustments increase price as the event approaches (e.g., +50% within 1 day, +20% within 7 days). Inventory‑based adjustments increase price when remaining tickets fall below a configurable threshold (default 20%). Demand‑based adjustments react to recent bookings (count within last hour), adding +15% when above a threshold. All three rules are deterministic and easily testable. Weights and thresholds are environment‑driven, enabling tuning without redeploys. We purposely keep each rule readable and side‑effect free; demand reads recent booking timestamps via Drizzle to avoid heavy joins.

### Concurrency Control for Bookings
Bookings use a single transactional boundary with row‑level locking on the event row (`FOR UPDATE`) to prevent overselling. Inside the transaction, we re‑check availability, decrement `availableTickets`, and insert the booking. This guarantees only one successful booking when contention occurs for the last tickets. Prices are resolved at booking time using the pricing engine, then stored in cents to avoid floating‑point inaccuracies. Integration tests verify “only one succeeds” under concurrent load.

### Trade‑offs
- Demand rule uses a simple “bookings in the last hour” count. It’s easy to reason about but may need indexing/caching at scale.
- We clamp price with global bounds; per‑event bounds could be more flexible.
- We selected row‑level locks for simplicity and strong correctness; pessimistic locking can limit throughput under extreme contention. Alternative: optimistic locking with version checks or an outbox‑pattern queue.
- Frontend calls the API for pricing; we do not cache client‑side to keep correctness, at the cost of extra requests.

### Improvements with More Time
- Add per‑event pricing configuration (custom weights, bounds, thresholds).
- Introduce caching for demand metrics (Redis) and pre‑computed aggregates.
- Improve observability: traces for price calculation, booking latency, and contention metrics.
- Add rate limiting and idempotency keys to `POST /booking` to protect against retries.
- Build richer analytics endpoints and dashboards (revenue, average price, sell‑through curves).
- Expand tests: property‑based tests for pricing, fuzz tests for concurrency, and contract tests for the frontend/API boundary.


