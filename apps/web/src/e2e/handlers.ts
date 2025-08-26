import type { MockAgent } from 'undici'

import { TEST_USER } from './data/test-user'
import { TEST_USER_ACCESS_TOKEN } from './data/test-user-access-token'
import { TEST_USER_EMAILS } from './data/test-user-emails'

export const authHandlers = (mockAgent: MockAgent) => {
  const github = mockAgent.get('https://github.com')
  const githubApi = mockAgent.get('https://api.github.com')

  github
    .intercept({
      path: '/login/oauth/access_token',
      method: 'POST'
    })
    .reply(200, TEST_USER_ACCESS_TOKEN)
    .persist()

  githubApi
    .intercept({
      path: '/user',
      method: 'GET'
    })
    .reply(200, TEST_USER)
    .persist()

  githubApi
    .intercept({
      path: '/user/emails',
      method: 'GET'
    })
    .reply(200, TEST_USER_EMAILS)
    .persist()
}
