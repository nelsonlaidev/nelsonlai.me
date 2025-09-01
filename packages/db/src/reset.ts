import { env } from '@repo/env'
import { consola } from 'consola'
import { sql } from 'drizzle-orm'
import { execa } from 'execa'

import { db } from './db'

const main = async () => {
  const confirmed = await consola.prompt('Are you sure you want to reset the database?', {
    type: 'confirm'
  })

  if (!confirmed) {
    consola.info('Aborting...')

    return
  }

  if (!env.DATABASE_URL.includes('localhost')) {
    const nonLocalConfirmed = await consola.prompt('Non-local database detected. Are you sure you want to continue?', {
      type: 'confirm'
    })

    if (!nonLocalConfirmed) {
      consola.info('Aborting...')

      return
    }
  }
  consola.info('Resetting database...')

  try {
    consola.info('Dropping public schema...')

    await db.execute(sql`
      DROP SCHEMA IF EXISTS public CASCADE;
      DROP SCHEMA IF EXISTS drizzle CASCADE;
    `)

    consola.info('Recreating public schema...')

    await db.execute(sql`
      CREATE SCHEMA public;
    `)

    consola.info('Granting privileges...')

    await db.execute(sql`
      GRANT ALL ON SCHEMA public TO "postgres";
      GRANT ALL ON SCHEMA public TO public;
    `)

    consola.info('Migrating database...')

    await execa('pnpm', ['db:migrate'], { stdio: 'inherit' })

    consola.info('Seeding database...')

    await execa('pnpm', ['db:seed'], { stdio: 'inherit' })

    consola.success('Database reset successfully!')
  } catch (error) {
    consola.error('Error resetting database:', error)
  } finally {
    await db.$client.end()
  }
}

await main()
