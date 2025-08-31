import type { Locator } from '@playwright/test'

export const getNumberFlow = async (locator: Locator) => {
  // @ts-expect-error -- internal property
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- internal property
  return locator.evaluate((flow) => flow._internals.ariaLabel) as Promise<string | undefined>
}
