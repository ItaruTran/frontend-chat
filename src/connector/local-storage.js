export function getAccessToken() {
  return localStorage.getItem('access_token')
}
/**
 * @returns {import('@t/chat').User}
 */
export function getUserInfo() {
  return JSON.parse(localStorage.getItem('user_info'))
}
export function setInfo(token, info) {
  localStorage.setItem('access_token', token)
  localStorage.setItem('user_info', JSON.stringify(info))
}
export function resetInfo() {
  localStorage.clear()
}
