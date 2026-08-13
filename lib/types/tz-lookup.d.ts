/** tz-lookup ships no types — it is a single function. */
declare module 'tz-lookup' {
  export default function tzLookup(latitude: number, longitude: number): string;
}
