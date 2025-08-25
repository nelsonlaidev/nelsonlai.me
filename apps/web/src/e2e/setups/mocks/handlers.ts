import { http, HttpResponse, type RequestHandler, type WebSocketHandler } from 'msw'

import TEST_GITHUB_USER from './data/test-user.json' assert { type: 'json' }
import TEST_GITHUB_USER_ACCESS_TOKEN from './data/test-user-access-token.json' assert { type: 'json' }
import TEST_GITHUB_USER_EMAILS from './data/test-user-emails.json' assert { type: 'json' }

export const handlers: Array<RequestHandler | WebSocketHandler> = [
  http.post('https://github.com/login/oauth/access_token', () => {
    console.log('Intercepted GitHub OAuth access token request')
    return HttpResponse.json(TEST_GITHUB_USER_ACCESS_TOKEN)
  }),
  http.get('https://api.github.com/user', () => {
    console.log('Intercepted GitHub user request')
    return HttpResponse.json(TEST_GITHUB_USER)
  }),
  http.get('https://api.github.com/user/emails', () => {
    console.log('Intercepted GitHub user emails request')
    return HttpResponse.json(TEST_GITHUB_USER_EMAILS)
  })
]
