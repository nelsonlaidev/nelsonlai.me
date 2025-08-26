export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.MOCK_SERVER === 'true') {
    const { setup } = await import('./e2e/mock-server')
    setup()
  }
}
