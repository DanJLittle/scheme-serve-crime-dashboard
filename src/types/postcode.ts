export type PostcodeLocation = {
  postcode: string
  latitude: number
  longitude: number
}

export type PostcodeLookupResult = {
  locations: PostcodeLocation[]
  invalidPostcodes: string[]
}

type PostcodeApiResponse = {
  status: string
  data?: {
    postcode: string
    latitude: string
    longitude: string
  }
}

export type { PostcodeApiResponse }
