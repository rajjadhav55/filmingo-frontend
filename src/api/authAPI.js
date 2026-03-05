import axiosClient, { setTokens, clearTokens } from './axiosClient.js'

export const authAPI = {
  async register({ name, email, password, contactNo }) {
    // Map fields to your Django /register_user/ view
    const payload = {
      username: email,
      email,
      password,
      first_name: name,
      last_name: '',
      is_staff: false,
      is_admin: false,
    }
    
    // Only include contact_no if it's provided and valid
    if (contactNo && contactNo.trim()) {
      payload.contact_no = contactNo.trim()
    } else {
      // Send a valid 10-digit number as default
      payload.contact_no = '0000000000'
    }
    
    const res = await axiosClient.post('/register_user/', payload)
    return res.data
  },

  async sendOtp(email) {
    const res = await axiosClient.post('/send_otp/', { email })
    return res.data
  },

  async verifyOtp({ email, otp }) {
    const res = await axiosClient.post('/verify_otp/', { email, otp })
    return res.data
  },

  async loginWithPassword({ email, password }) {
    const res = await axiosClient.post('/api/token/', {
      username: email,
      password,
    })
    const data = res.data // { access, refresh }
    setTokens({ access: data.access, refresh: data.refresh })
    return data
  },

  logout() {
    clearTokens()
  },
}

