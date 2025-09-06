import { NextIntlClientProvider } from '@repo/i18n/client'
import messages from '@repo/i18n/messages/en.json'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Hero from '@/components/home/hero'
import { MY_NAME } from '@/lib/constants'

describe('<Hero />', () => {
  it('should have a hero image', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <Hero />
      </NextIntlClientProvider>
    )

    expect(screen.getByAltText(MY_NAME)).toBeInTheDocument()
  })
})
