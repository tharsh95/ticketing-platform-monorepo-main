'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Booking {
  id: number
  eventId: number
  userEmail: string
  quantity: number
  pricePaid: number | null
  createdAt: string
  updatedAt: string
  event: {
    id: number
    title: string
    description?: string
    date: string
    location?: string
    category?: string
    totalTickets?: number
    availableTickets?: number
    price: any
    isActive: boolean
  }
  eventCurrentPrice?: number
}

export default function MyBookingsPage() {
  const [inputEmail, setInputEmail] = useState('')
  const [queryEmail, setQueryEmail] = useState<string>('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (queryEmail) {
      fetchBookings(queryEmail)
    } else {
      setBookings([])
    }
  }, [queryEmail])

  async function fetchBookings(email: string) {
    try {
      setLoading(true)
      setError(null)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/booking/user/${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('Failed to fetch bookings')
      const data = await res.json()
      setBookings(data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getPriceComparison(booking: Booking) {
    const pricePaid = booking.pricePaid ? booking.pricePaid / booking.quantity : 0
    const currentPrice = typeof booking.eventCurrentPrice === 'number'
      ? booking.eventCurrentPrice
      : (typeof booking.event.price === 'number' ? booking.event.price : 0)
    const difference = currentPrice - pricePaid
    const percentageChange = pricePaid > 0 ? (difference / pricePaid) * 100 : 0

    return { pricePaid, currentPrice, difference, percentageChange }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            My Bookings
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setQueryEmail(inputEmail.trim())
              }}
              className="flex flex-col gap-2 sm:flex-row sm:items-end"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View bookings for email:</label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-semibold text-white hover:shadow-lg sm:mt-0 sm:ml-3"
              >
                Load bookings
              </button>
            </form>
            <Link href="/events" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:shadow-lg">
              Browse Events
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-24 shadow-sm">
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-2 text-gray-600">Start browsing events to make your first booking!</p>
            <Link href="/events" className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const { pricePaid, currentPrice, difference, percentageChange } = getPriceComparison(booking)
              const saved = difference > 0
              const priceIncreased = difference < 0

              return (
                <div key={booking.id} className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl">
                  <div className="p-6">
                    {/* Header with event title */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/events/${booking.eventId}`}>
                          <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600">
                            {booking.event.title}
                          </h2>
                        </Link>
                        {booking.event.location && (
                          <p className="mt-1 flex items-center text-sm text-gray-600">
                            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.event.location}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-xs text-gray-500">Booking ID</p>
                        <p className="text-sm font-semibold text-blue-600">#{booking.id}</p>
                      </div>
                    </div>

                    {/* Event details grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* Tickets */}
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          <span className="text-sm font-medium">Quantity</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                          {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                        </p>
                      </div>

                      {/* Price Paid */}
                      <div className="rounded-lg border border-gray-200 bg-green-50 p-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="mr-2 h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-medium">Price Paid</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-green-700">
                          ${booking.pricePaid?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-xs text-gray-600">${pricePaid.toFixed(2)} per ticket</p>
                      </div>

                      {/* Current Price */}
                      <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
                        <div className="flex items-center text-gray-600">
                          <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-sm font-medium">Current Price</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-blue-700">
                          ${currentPrice.toFixed(2)}
                        </p>
                        {pricePaid > 0 && (
                          <p className="text-xs font-medium">
                            {saved && (
                              <span className="text-green-700">
                                You saved ${Math.abs(difference * booking.quantity).toFixed(2)}! 🎉
                              </span>
                            )}
                            {priceIncreased && (
                              <span className="text-red-700">
                                Price increased by {Math.abs(percentageChange).toFixed(0)}%
                              </span>
                            )}
                            {!saved && !priceIncreased && (
                              <span className="text-gray-600">No change</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional info */}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      {booking.event.date && (
                        <div className="flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(booking.event.date)}
                        </div>
                      )}
                      <div className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Booked: {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

