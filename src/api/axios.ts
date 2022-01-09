import axios from "axios";

const getCookie = (name: string) => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

const instance = axios.create({
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true
})

axios.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.BASE_URL
  config.withCredentials = true
  if(config.headers?.common) {
    config.headers['X-CSRFToken'] = getCookie('csrftoken')
  }
  return config
});

export default axios