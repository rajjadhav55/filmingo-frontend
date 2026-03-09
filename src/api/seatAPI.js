import axiosClient from './axiosClient'
import { generateSeatsForSection } from '../data/playsData'

/**
 * Fetch seat status for a given section in a match.
 * Currently returns mock data; swap the implementation for a real endpoint later.
 *
 * Expected backend response shape:
 *   [ { seat_id: 'B-12', status: 'available', price: 1999, row: 'B', col: 12 }, ... ]
 */
export const fetchSeatsBySection = async (sectionId, matchId) => {
  // ── Uncomment when Django endpoint is ready ──
  // const { data } = await axiosClient.get(`/api/seats/${matchId}/${sectionId}/`)
  // return data

  // ── Mock implementation ──
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateSeatsForSection(sectionId))
    }, 400) // simulate network latency
  })
}
