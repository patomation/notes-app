import { atomWithStorage } from 'jotai/utils'

export const accessTokenAtom = atomWithStorage<
  string | null
>('access_token', null)
