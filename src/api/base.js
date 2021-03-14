
export class BaseApi {
  constructor(baseUrl='') {
    this._baseUrl = baseUrl
  }

  setToken(token) {
    this._token = token
  }

  /**
   * @param {{
   *   method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'
   *   path: string
   *   body?: any
   *   needToken?: boolean
   *   query: {[k: string]: string|number}
   * }} param0
   * @returns {Promise<any>}
   */
  async _callApi({ method, path, body, needToken, query }) {
    const headers = {
      'Content-Type': 'application/json',
    }
    const url = new URL(this._baseUrl + path)
    if (query) {
      for (const key in query) {
        url.searchParams.set(key, query[key])
      }
    }

    if (needToken)
      // url.searchParams.set('access_token', this._token)
      headers['authorization'] = this._token

    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers,
    })

    if (!res.ok) {
      throw new Error(`${res.status}`)
    }

    if (res.status === 204)
      return

    if (res.headers.get('content-type').indexOf('application/json') !== -1)
      return res.json()
    else
      return res.body
  }

}
