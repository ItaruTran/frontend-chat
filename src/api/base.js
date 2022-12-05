import { stringify } from 'qs';

export class BaseApi {
  constructor(baseUrl='') {
    // this._baseUrl = window.location.protocol + (baseUrl.replace('http:', '').replace('https:'))
    if (baseUrl.length === 0)
      this._baseUrl = window.location.origin
    else
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
   *   query?: {[k: string]: any}
   * }} param0
   * @returns {Promise<any>}
   */
  async _callApi({ method, path, body, needToken, query }) {
    const headers = {
      'Content-Type': 'application/json',
    }

    let queryStr = '';
    if (query) {
      queryStr = '?' + stringify(query)
    }

    const url = new URL(this._baseUrl + path + queryStr)

    if (needToken)
      // url.searchParams.set('access_token', this._token)
      headers['authorization'] = `Bearer ${this._token}`

    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers,
    })

    // if (!res.ok) {
    //   throw new Error(`${res.status}`)
    // }

    if (res.status === 204)
      return

    if (res.headers.get('content-type').indexOf('application/json') !== -1) {
      const data = await res.json()
      if (data.success)
        return data.data

      throw data
    }
    else
      return res.body
  }

}
