import type {
  PostcodeApiResponse,
  PostcodeLocation,
  PostcodeLookupResult,
} from '../types/postcode'

const POSTCODE_API_URL = 'https://api.getthedata.com/postcode'

export async function lookupPostcode(postcode: string): Promise<PostcodeLocation> {
  const response = await fetch(`${POSTCODE_API_URL}/${encodeURIComponent(postcode)}`)

  if (!response.ok) {
    throw new Error(`Postcode lookup failed with status ${response.status}`)
  }

  const result = (await response.json()) as PostcodeApiResponse

  if (
    result.status !== 'match' ||
    !result.data ||
    !result.data.latitude ||
    !result.data.longitude
  ) {
    throw new Error(`Could not find postcode ${postcode}`)
  }

  return {
    postcode: result.data.postcode,
    latitude: Number(result.data.latitude),
    longitude: Number(result.data.longitude),
  }
}

export async function lookupPostcodes(
  postcodes: string[],
): Promise<PostcodeLookupResult> {
  const results = await Promise.allSettled(
    postcodes.map((postcode) => lookupPostcode(postcode)),
  )

  return results.reduce<PostcodeLookupResult>(
    (lookupResult, result, index) => {
      if (result.status === 'fulfilled') {
        lookupResult.locations.push(result.value)
      } else {
        lookupResult.invalidPostcodes.push(postcodes[index])
      }

      return lookupResult
    },
    { locations: [], invalidPostcodes: [] },
  )
}
