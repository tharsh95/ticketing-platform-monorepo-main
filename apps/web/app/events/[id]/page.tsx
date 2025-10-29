'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBooking } from '../../actions'

type PriceBreakdown = {
  basePrice: number
  adjustments: {
    timeBased: number
    demandBased: number
    inventoryBased: number
  }
  weights: {
    timeBased: number
    demandBased: number
    inventoryBased: number
  }
  weightedSum: number
  unclampedPrice: number
  floor?: number
  ceiling?: number
  finalPrice: number
}

type EventDetail = {
  id: number
  title: string
  description?: string
  date: string
  location?: string
  category?: string
  totalTickets?: number
  availableTickets?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  pricing: PriceBreakdown
}

function formatPercent(v: number) {
  return `${(v * 100).toFixed(0)}%`
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      if (!params?.id) return
      try {
        setLoading(true)
        setError(null)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const res = await fetch(`${apiUrl}/events/${params.id}`)
        if (!res.ok) throw new Error(`Failed to load event: ${res.statusText}`)
        const data = await res.json()
        setEvent(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params?.id])

  const rows = useMemo(() => {
    if (!event) return [] as { label: string; adj: number; weight: number }[]
    return [
      { label: 'Time-Based', adj: event.pricing.adjustments.timeBased, weight: event.pricing.weights.timeBased },
      { label: 'Demand-Based', adj: event.pricing.adjustments.demandBased, weight: event.pricing.weights.demandBased },
      { label: 'Inventory-Based', adj: event.pricing.adjustments.inventoryBased, weight: event.pricing.weights.inventoryBased },
    ]
  }, [event])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Unable to load event</h2>
          <p className="mt-2 text-gray-600">{error ?? 'Event not found'}</p>
          <button onClick={() => router.back()} className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-white">Go Back</button>
        </div>
      </div>
    )
  }

  const soldOutPct = event.totalTickets && event.availableTickets != null
    ? ((event.totalTickets - (event.availableTickets || 0)) / event.totalTickets) * 100
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center text-sm font-medium text-blue-700 hover:underline">
          ← Back to events
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold sm:text-3xl">{event.title}</h1>
            <p className="mt-1 text-blue-100">{event.location ? `${event.location} • ` : ''}{formatDate(event.date)}</p>
          </div>

          <div className="grid gap-8 p-6 md:grid-cols-5">
            <div className="md:col-span-3">
              {event.description && (
                <p className="mb-6 text-gray-700">{event.description}</p>
              )}

              <div className="rounded-xl border bg-white p-4">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Pricing Breakdown</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-2xl font-bold text-gray-900">${event.pricing.basePrice.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Final Price</p>
                    <p className="text-2xl font-bold text-blue-600">${event.pricing.finalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Adjustment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Weight</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {rows.map((r) => (
                        <tr key={r.label} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.label}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatPercent(r.adj)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.weight.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{(r.adj * r.weight * 100).toFixed(0)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Weighted Sum:</span> {(event.pricing.weightedSum * 100).toFixed(0)}%
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Unclamped Price:</span> ${event.pricing.unclampedPrice.toFixed(2)}
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Bounds:</span> {event.pricing.floor ? `$${event.pricing.floor.toFixed(2)}` : '—'} to {event.pricing.ceiling ? `$${event.pricing.ceiling.toFixed(2)}` : '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-xl border p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-3xl font-bold text-blue-600">${event.pricing.finalPrice.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50"
                  >
                    Book Now
                  </button>
                </div>

                {typeof event.totalTickets === 'number' && (
                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm text-gray-600">
                      <span>Availability</span>
                      <span>{event.availableTickets ?? 0} / {event.totalTickets}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${soldOutPct}%` }}></div>
                    </div>
                  </div>
                )}

                {event.category && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Category:</span> {event.category}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          eventId={event.id}
          eventTitle={event.title}
          currentPrice={event.pricing.finalPrice}
          onClose={() => setIsBookingOpen(false)}
        />
      )}
    </div>
  )
}

function BookingModal({ eventId, eventTitle, currentPrice, onClose }: { eventId: number; eventTitle: string; currentPrice: number; onClose: () => void }) {
  const [email, setEmail] = useState('harsh@gmail.com')
  const [qty, setQty] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState<{ email: string; quantity: number; pricePaid: number; totalAmount: number; bookingId: number; currentPrice: number } | null>(null)

  async function submit() {
    try {
      setSubmitting(true)
      setError(null)
      
      // Use Server Action instead of direct fetch
      const result = await createBooking({
        eventId,
        userEmail: email,
        quantity: qty,
      })
      
      if (!result.success) {
        throw new Error(result.error || 'Booking failed')
      }
      
      const data = result.data
      // Calculate price paid per ticket
      const pricePaidPerTicket = (data.amount || (currentPrice * qty)) / (data.quantity || qty)
      
      setBookingData({
        email: data.userEmail || email,
        quantity: data.quantity || qty,
        pricePaid: pricePaidPerTicket,
        totalAmount: data.amount || (currentPrice * qty),
        bookingId: data.id,
        currentPrice: currentPrice
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  // If we have booking data, show ticket snapshot instead of form
  if (bookingData) {
    return <TicketSnapshot booking={bookingData} eventTitle={eventTitle} onClose={onClose} />
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white">
          <h3 className="text-lg font-semibold">Complete your booking</h3>
          <p className="text-blue-100">${currentPrice.toFixed(2)} per ticket</p>
        </div>
        <div className="p-5">
          <label className="mb-3 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email||"harsh@gmail.com"}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-4">
            <label className="mb-3 block text-sm font-medium text-gray-700">Quantity</label>
            <div className="inline-flex items-center rounded-lg border">
              <button
                className="px-3 py-2 text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                className="w-16 border-x px-3 py-2 text-center outline-none"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
              <button
                className="px-3 py-2 text-lg"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">Cancel</button>
            <button onClick={submit} disabled={submitting}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60">
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketSnapshot({ booking, eventTitle, onClose }: { booking: { email: string; quantity: number; pricePaid: number; totalAmount: number; bookingId: number; currentPrice: number }; eventTitle: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const ticketText = `Event: ${eventTitle}\nBooking ID: ${booking.bookingId}\nEmail: ${booking.email}\nQuantity: ${booking.quantity}\nPrice Paid (per ticket): $${booking.pricePaid.toFixed(2)}\nTotal Amount: $${booking.totalAmount.toFixed(2)}`
    navigator.clipboard.writeText(ticketText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header with Success Message */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center">
                <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold">Booking Confirmed!</h3>
              </div>
              <p className="text-green-100">Your tickets have been reserved</p>
            </div>
            <button onClick={handleCopy} className="rounded-lg bg-white/20 p-2 hover:bg-white/30">
              {copied ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* Ticket Card Design */}
          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-6">
            {/* Decorative corner elements */}
            <div className="absolute left-0 top-0 h-12 w-12 border-l-2 border-t-2 border-blue-500"></div>
            <div className="absolute right-0 top-0 h-12 w-12 border-r-2 border-t-2 border-blue-500"></div>
            <div className="absolute bottom-0 left-0 h-12 w-12 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 h-12 w-12 border-b-2 border-r-2 border-blue-500"></div>

            {/* Event Title */}
            <div className="mb-3 text-center">
              <p className="text-sm font-medium text-gray-500">{eventTitle}</p>
            </div>

            {/* Booking ID */}
            <div className="mb-4 text-center">
              <p className="text-xs font-medium text-gray-500">Booking ID</p>
              <p className="text-2xl font-bold text-blue-600">#{booking.bookingId}</p>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <svg className="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Email</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{booking.email}</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Quantity</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{booking.quantity} {booking.quantity === 1 ? 'Ticket' : 'Tickets'}</span>
              </div>

              {/* Price Comparison */}
              <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Price Paid (per ticket)</p>
                    <p className="text-xl font-bold text-green-600">${(booking.totalAmount/booking.quantity).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Current Price</p>
                    <p className="text-lg font-semibold text-green-600">${booking.currentPrice.toFixed(2)}</p>
                  </div>
                </div>
                {booking.pricePaid < booking.currentPrice && (
                  <div className="mt-2 rounded bg-green-50 px-3 py-2">
                    <div className="flex items-center text-sm">
                      <svg className="mr-1 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium text-green-800">
                        You saved ${((booking.currentPrice - booking.pricePaid) * booking.quantity).toFixed(2)}!
                      </span>
                    </div>
                  </div>
                )}
                {booking.pricePaid > booking.currentPrice && (
                  <div className="mt-2 rounded bg-red-50 px-3 py-2">
                    <div className="flex items-center text-sm">
                      <svg className="mr-1 h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6" />
                      </svg>
                      <span className="font-medium text-red-800">
                        Current price is ${((booking.pricePaid - booking.currentPrice) * booking.quantity).toFixed(2)} less
                      </span>
                    </div>
                  </div>
                )}
                {booking.pricePaid === booking.currentPrice && (
                  <div className="mt-2 rounded bg-blue-50 px-3 py-2">
                    <span className="text-sm font-medium text-blue-800">Price has remained the same</span>
                  </div>
                )}
              </div>

              {/* Total Amount */}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Total Amount Paid</span>
                </div>
                <span className="text-2xl font-bold text-green-600">${booking.totalAmount.toFixed(2)}</span>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <div className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> A confirmation email has been sent to <strong>{booking.email}</strong>. Please keep this booking ID for your records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              {copied ? 'Copied!' : 'Copy Details'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 font-semibold text-white hover:shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


