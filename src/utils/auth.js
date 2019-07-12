const USER_KEY = 'user'

// 获取用户信息
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

// 添加用户信息，或修改
export const svaeUser = (data) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

// 删除用户信息
export const removeUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
