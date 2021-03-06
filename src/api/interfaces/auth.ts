export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface LoginUserRequest {
  email: string,
  password: string
}

export interface LoginUserResponse {
  two_factor: boolean
}

export interface RegisterUserRequest {
  name: string,
  email: string,
  password: string,
  password_confirmation: string
}

export interface ProfileInformation {
  name: string,
  email: string
}

export interface UserPasswordUpdate {
  current_password: string,
  password: string,
  password_confirmation: string
}
