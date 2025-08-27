// Test admin login API
async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'dendyuz',
        password: 'parolyoq'
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const data = await response.json()
    console.log('Response data:', data)
    
    if (response.ok) {
      console.log('✅ Login successful!')
    } else {
      console.log('❌ Login failed:', data.error)
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

testAdminLogin()