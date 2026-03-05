// Quick diagnostic script to test API endpoints
// Run this in browser console to check which endpoints are working

const API_BASE = 'http://localhost:8000'

async function testEndpoints() {
  const endpoints = [
    { name: 'Movies List', url: '/movies/' },
    { name: 'Cities', url: '/citys/' },
    { name: 'Genres', url: '/genre/' },
    { name: 'Languages', url: '/language/' },
  ]

  console.log('🔍 Testing API Endpoints...\n')

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE}${endpoint.url}`)
      const status = response.status
      
      if (status === 200) {
        console.log(`✅ ${endpoint.name}: OK (${status})`)
      } else {
        console.log(`⚠️  ${endpoint.name}: ${status}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`)
    }
  }

  console.log('\n📊 Diagnostic Complete')
  console.log('If you see ❌ errors, the Django server might not be running.')
  console.log('Run: python manage.py runserver')
}

testEndpoints()
