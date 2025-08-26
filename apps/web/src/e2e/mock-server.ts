import { MockAgent, setGlobalDispatcher } from 'undici'

import { authHandlers } from './handlers'

export const setup = () => {
  const mockAgent = new MockAgent()
  setGlobalDispatcher(mockAgent)

  authHandlers(mockAgent)
  console.log('Mock server is set up')
}
