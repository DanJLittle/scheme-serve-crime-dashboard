import type { PostcodeLocation } from './postcode'

export type CrimeRecord = {
  id: number
  postcode: string
  category: string
  month: string
  streetName: string
  outcomeStatus: string | null
}

type CrimeApiRecord = {
  category: string
  month: string
  location: {
    street: {
      name: string
    }
  }
  outcome_status: {
    category: string
  } | null
  id: number
}

export type CrimeQuery = PostcodeLocation & {
  month: string
}

export type { CrimeApiRecord }
