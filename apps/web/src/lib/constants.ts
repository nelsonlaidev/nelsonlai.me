export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
// eslint-disable-next-line unicorn/prefer-global-this -- using `typeof window` to safely detect non-browser environments; `globalThis` is always defined
export const IS_SERVER = typeof window === 'undefined'

export const GITHUB_USERNAME = 'nelsonlaidev'

export const MY_NAME = 'Nelson Lai'
export const SITE_KEYWORDS = [MY_NAME, 'Next.js', 'React', 'TypeScript', 'Node.js']

export const SITE_GITHUB_URL = 'https://github.com/nelsonlaidev'
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/nelsonlaidev'
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/nelsonlaidev'
export const SITE_X_URL = 'https://x.com/nelsonlaidev'
export const SITE_YOUTUBE_URL = 'https://www.youtube.com/@nelsonlaidev'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
