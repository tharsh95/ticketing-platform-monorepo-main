'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export interface Event {
  id: number
  title: string
  description?: string
  date: string
  location?: string
  category?: string
  totalTickets?: number
  availableTickets?: number
  currentPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/events`)
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const seedDatabase = async () => {
    try {
      setSeeding(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/events/seed`)
      if (!res.ok) {
        throw new Error('Failed to seed database')
      }
      await fetchEvents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred while seeding')
    } finally {
      setSeeding(false)
    }
  }

  const formatDate = (dateString: string) => {
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

  const getSoldOutPercentage = (total?: number, available?: number) => {
    if (!total || !available) return 0
    return ((total - available) / total) * 100
  }

  const getStatusBadge = (event: Event) => {
    const soldOutPercentage = getSoldOutPercentage(
      event.totalTickets,
      event.availableTickets
    )

    if (!event.availableTickets || event.availableTickets === 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
          Sold Out
        </span>
      )
    }

    if (soldOutPercentage >= 80) {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
          Few Left
        </span>
      )
    }

    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
        Available
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Error Loading Events
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Upcoming Events
            </h1>
            <Link href="/my-bookings" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-semibold text-white hover:shadow-lg">
              My Bookings
            </Link>
          </div>
          <p className="text-lg text-gray-600">
            Discover amazing events happening near you
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg bg-white py-24 shadow-sm">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-900">
                No events found
              </p>
              <p className="mt-2 text-gray-600">Check back later for updates</p>
              <button
                onClick={seedDatabase}
                disabled={seeding}
                className="mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-semibold text-white disabled:opacity-60 hover:shadow-lg"
              >
                {seeding ? 'Seeding…' : 'Seed sample data'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block">
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.01] group-hover:shadow-2xl">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100"></div>

                  <div className="relative p-6">
                    {/* Status Badge */}
                    <div className="mb-4 flex items-start justify-between">
                      {getStatusBadge(event)}
                      {event.category && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {event.category}
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h2 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2">
                      {event.title}
                    </h2>

                    {/* Description */}
                    {event.description && (
                      <p className="mb-4 text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Date */}
                    <div className="mb-4 flex items-center text-gray-700">
                      <svg
                        className="mr-2 h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {formatDate(event.date)}
                      </span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="mb-4 flex items-center text-gray-700">
                        <svg
                          className="mr-2 h-5 w-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}

                    {/* Tickets Info */}
                    {event.totalTickets && (
                      <div className="mb-4">
                        <div className="mb-2 flex justify-between text-sm text-gray-600">
                          <span>Tickets</span>
                          <span>
                            {event.availableTickets || 0} of {event.totalTickets}{' '}
                            available
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{
                              width: `${getSoldOutPercentage(
                                event.totalTickets,
                                event.availableTickets
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-sm text-gray-600">Starting at</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${event.currentPrice.toFixed(2)}
                        </p>
                      </div>
                      <span className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/50">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

