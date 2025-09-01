import { Buffer } from 'node:buffer'

import { env } from '@repo/env'

import { publicProcedure } from '../root'
import { spotifyStatsSchema } from '../schemas/spotify.schema'

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const EMPTY_RESPONSE = {
  isPlaying: false,
  songUrl: null,
  name: null,
  artist: null
} as const

const getAccessToken = async () => {
  if (!REFRESH_TOKEN) return null

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN
    })
  })

  const data = await response.json()

  return data.access_token as string
}

export const spotifyStats = publicProcedure.output(spotifyStatsSchema).handler(async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return EMPTY_RESPONSE
  }

  const accessToken = await getAccessToken()

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response.status === 204) {
    return EMPTY_RESPONSE
  }

  const song: SpotifyApi.CurrentlyPlayingResponse = await response.json()

  // If the song is not playing or is not a track, return an empty response
  if (song.item === null || song.item.type !== 'track') {
    return EMPTY_RESPONSE
  }

  const artists = song.item.artists.map((artist) => artist.name).join(', ')

  return {
    isPlaying: song.is_playing,
    songUrl: song.item.external_urls.spotify,
    name: song.item.name,
    artist: artists
  }
})
