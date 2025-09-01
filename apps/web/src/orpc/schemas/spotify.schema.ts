import { z } from 'zod'

const playingSchema = z.object({
  isPlaying: z.literal(true),
  songUrl: z.string(),
  name: z.string(),
  artist: z.string()
})

const notPlayingSchema = z.object({
  isPlaying: z.literal(false),
  songUrl: z.string().nullable(),
  name: z.string().nullable(),
  artist: z.string().nullable()
})

export const spotifyStatsSchema = z.discriminatedUnion('isPlaying', [playingSchema, notPlayingSchema])
