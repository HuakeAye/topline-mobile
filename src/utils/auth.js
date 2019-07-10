const USER_KEY = 'user'

export const getUser = () => {
  return window.localStorage.getItem(USER_KEY)
}

export const setUser = (data) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const removeUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
