const LOGIN_TOKEN = "hkzf_token"

const setLocalToken = (token: string) => {
  window.localStorage.setItem(LOGIN_TOKEN, token)
}

const getLocalToken = () => {
  return window.localStorage.getItem(LOGIN_TOKEN)
}

const removeToken = () => {
  window.localStorage.removeItem(LOGIN_TOKEN)
}

export { setLocalToken, getLocalToken, removeToken }
