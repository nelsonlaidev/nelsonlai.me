export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.APP_ENV === 'test') {
    const { mockServer } = await import('./e2e/setups/mocks/node')

    mockServer.listen({ onUnhandledRequest: 'bypass' })
  }
}
