import type { Locator } from '@playwright/test'

export const getNumberFlow = async (locator: Locator) => {
  // @ts-expect-error -- Internal property
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Internal property
  return locator.evaluate((flow) => flow._internals.ariaLabel) as Promise<string | undefined>
}
