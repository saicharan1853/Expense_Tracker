import api from '../api/axios'

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export const registerUser = async (
  userData: RegisterPayload,
) => {
  const response = await api.post(
    '/auth/register',
    userData,
  )
  return response.data
}

export const loginUser = async (
  userData: LoginPayload,
) => {
  const response = await api.post('/auth/login', userData)
  return response.data as { accessToken: string }
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile')
  return response.data
}