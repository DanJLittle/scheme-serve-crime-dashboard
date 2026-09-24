export function parsePostcodes(input: string) {
  return [...new Set(
    input
      .split(',')
      .map((postcode) => postcode.trim().toUpperCase())
      .filter(Boolean),
  )]
}
