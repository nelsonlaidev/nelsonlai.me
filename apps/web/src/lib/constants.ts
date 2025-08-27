export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
// eslint-disable-next-line unicorn/prefer-global-this -- using `typeof window` to safely detect non-browser environments; `globalThis` is always defined
export const IS_SERVER = typeof window === 'undefined'

export const GITHUB_USERNAME = 'nelsonlaidev'

export const SITE_NAME = 'Nelson Lai'
export const SITE_KEYWORDS = ['Nelson Lai', 'Next.js', 'React', 'TypeScript', 'Node.js']

export const SITE_GITHUB_URL = 'https://github.com/nelsonlaidev'
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/nelsonlaidev'
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/nelsonlaidev'
export const SITE_X_URL = 'https://x.com/nelsonlaidev'
export const SITE_YOUTUBE_URL = 'https://www.youtube.com/@nelsonlaidev'

export const COMMENT_TYPES = ['comment', 'reply'] as const
export const USER_ROLES = ['user', 'admin'] as const
