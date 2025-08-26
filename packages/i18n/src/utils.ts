type DeepObject = {
  [key: string]: string | DeepObject
}

export const loadMessages = async (locale: string) => {
  const { default: messages } = (await import(`./messages/${locale}.json`)) as {
    default: DeepObject
  }

  return messages
}

export const flattenKeys = (object: DeepObject, prefix = ''): string[] => {
  const keys: string[] = []

  for (const [key, value] of Object.entries(object)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      keys.push(fullKey)
    } else {
      keys.push(...flattenKeys(value, fullKey))
    }
  }

  return keys
}
