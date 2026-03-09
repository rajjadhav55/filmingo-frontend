// Mock data for the Sports & Cricket Match Booking page
// Extracted from the Stitch design system

export const SPORTS_FILTERS = [
  { id: 'all', label: 'All Sports', icon: '🏆' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
]

export const FEATURED_MATCH = {
  id: 'featured-1',
  team1: 'Mumbai Indians',
  team2: 'Chennai Super Kings',
  team1Logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Medium/MI.png',
  team2Logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/Logos/Medium/CSK.png',
  date: '2026-03-22T19:30:00',
  venue: 'Wankhede Stadium, Mumbai',
  league: 'IPL T20',
  sport: 'cricket',
  priceFrom: 499,
}

export const UPCOMING_MATCHES = [
  {
    id: 'match-1',
    team1: 'India',
    team2: 'Australia',
    date: '2026-03-25T14:00:00',
    venue: 'Eden Gardens, Kolkata',
    sport: 'cricket',
    league: 'Test Series',
    priceFrom: 799,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
  },
  {
    id: 'match-2',
    team1: 'Royal Challengers',
    team2: 'Delhi Capitals',
    date: '2026-03-28T19:30:00',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    sport: 'cricket',
    league: 'IPL T20',
    priceFrom: 599,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop',
  },
  {
    id: 'match-3',
    team1: 'Real Madrid',
    team2: 'Barcelona',
    date: '2026-04-02T00:30:00',
    venue: 'Santiago Bernabéu, Madrid',
    sport: 'football',
    league: 'La Liga',
    priceFrom: 2499,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
  },
  {
    id: 'match-4',
    team1: 'Manchester City',
    team2: 'Arsenal',
    date: '2026-04-05T22:00:00',
    venue: 'Etihad Stadium, Manchester',
    sport: 'football',
    league: 'Premier League',
    priceFrom: 1999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=400&fit=crop',
  },
  {
    id: 'match-5',
    team1: 'Novak Djokovic',
    team2: 'Carlos Alcaraz',
    date: '2026-04-10T18:00:00',
    venue: 'Centre Court, Wimbledon',
    sport: 'tennis',
    league: 'Wimbledon',
    priceFrom: 3999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop',
  },
  {
    id: 'match-6',
    team1: 'Kolkata Knight Riders',
    team2: 'Rajasthan Royals',
    date: '2026-04-12T19:30:00',
    venue: 'Eden Gardens, Kolkata',
    sport: 'cricket',
    league: 'IPL T20',
    priceFrom: 499,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop',
  },
]

export const STADIUM_SECTIONS = {
  vip: [
    { id: 'vip-a', label: 'VIP Box A', tier: 'VIP', price: 4999, seats: 50, available: 12 },
    { id: 'vip-b', label: 'VIP Box B', tier: 'VIP', price: 4999, seats: 50, available: 8 },
    { id: 'vip-c', label: 'VIP Box C', tier: 'VIP', price: 4999, seats: 50, available: 0 },
    { id: 'vip-d', label: 'VIP Box D', tier: 'VIP', price: 4999, seats: 50, available: 20 },
  ],
  premium: [
    { id: 'prem-a', label: 'Premium Stand A', tier: 'Premium', price: 1999, seats: 200, available: 85 },
    { id: 'prem-b', label: 'Premium Stand B', tier: 'Premium', price: 1999, seats: 200, available: 42 },
    { id: 'prem-c', label: 'Premium Stand C', tier: 'Premium', price: 1999, seats: 200, available: 0 },
    { id: 'prem-d', label: 'Premium Stand D', tier: 'Premium', price: 1999, seats: 200, available: 120 },
    { id: 'prem-e', label: 'Premium Stand E', tier: 'Premium', price: 1999, seats: 200, available: 67 },
    { id: 'prem-f', label: 'Premium Stand F', tier: 'Premium', price: 1999, seats: 200, available: 150 },
  ],
  general: [
    { id: 'gen-a', label: 'General Stand A', tier: 'General', price: 499, seats: 500, available: 320 },
    { id: 'gen-b', label: 'General Stand B', tier: 'General', price: 499, seats: 500, available: 210 },
    { id: 'gen-c', label: 'General Stand C', tier: 'General', price: 499, seats: 500, available: 0 },
    { id: 'gen-d', label: 'General Stand D', tier: 'General', price: 499, seats: 500, available: 450 },
    { id: 'gen-e', label: 'General Stand E', tier: 'General', price: 499, seats: 500, available: 180 },
    { id: 'gen-f', label: 'General Stand F', tier: 'General', price: 499, seats: 500, available: 375 },
    { id: 'gen-g', label: 'General Stand G', tier: 'General', price: 499, seats: 500, available: 0 },
    { id: 'gen-h', label: 'General Stand H', tier: 'General', price: 499, seats: 500, available: 290 },
  ],
}

export const TIER_COLORS = {
  VIP: { bg: 'bg-yellow-400/10', text: 'text-yellow-400', border: 'border-yellow-400/30', fill: '#facc15', label: '₹4,999' },
  Premium: { bg: 'bg-sky-400/10', text: 'text-sky-400', border: 'border-sky-400/30', fill: '#38bdf8', label: '₹1,999' },
  General: { bg: 'bg-green-400/10', text: 'text-green-400', border: 'border-green-400/30', fill: '#22c55e', label: '₹499' },
  'Sold Out': { bg: 'bg-gray-600/10', text: 'text-gray-500', border: 'border-gray-500/30', fill: '#52525b', label: 'Sold Out' },
}

/**
 * Generate a grid of seat objects for a given section ID.
 * Returns: [{ seat_id, row, col, status, price }]
 */
export const generateSeatsForSection = (sectionId) => {
  const allSections = [
    ...STADIUM_SECTIONS.vip,
    ...STADIUM_SECTIONS.premium,
    ...STADIUM_SECTIONS.general,
  ]
  const section = allSections.find((s) => s.id === sectionId)
  if (!section) return []

  const totalSeats = section.seats
  const available = section.available
  const price = section.price

  // Determine grid dimensions (wider rows for general, narrower for VIP)
  const cols = section.tier === 'VIP' ? 10 : section.tier === 'Premium' ? 15 : 20
  const rows = Math.ceil(totalSeats / cols)
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  // Generate a set of sold-out seat indices
  const soldOutCount = totalSeats - available
  const soldOutSet = new Set()
  // Use a seeded-like approach for consistent results per section
  let seed = sectionId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pseudoRandom = () => {
    seed = (seed * 16807 + 7) % 2147483647
    return seed / 2147483647
  }
  while (soldOutSet.size < soldOutCount) {
    soldOutSet.add(Math.floor(pseudoRandom() * totalSeats))
  }

  const seats = []
  let idx = 0
  for (let r = 0; r < rows; r++) {
    const rowLabel = rowLabels[r % 26]
    for (let c = 1; c <= cols; c++) {
      if (idx >= totalSeats) break
      seats.push({
        seat_id: `${rowLabel}-${c}`,
        row: rowLabel,
        col: c,
        status: soldOutSet.has(idx) ? 'sold' : 'available',
        price,
      })
      idx++
    }
  }
  return seats
}
