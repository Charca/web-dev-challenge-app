import type { WithoutSystemFields } from 'convex/server'
import type { Doc, Id } from '../../convex/_generated/dataModel'

export type Place = {
  id: string
  name: string
  address: string
  location: any
  photo: string
  type?: string
  icon?: string
  url?: string
}

// export type Challenge = {
//   _id: Id<'challenges'>
//   name: string
//   place: Place
//   locations: Place[]
// }

export type Challenge = Doc<'challenges'> & {
  id?: string
  completed?: boolean
  completedLocations?: string[]
}

export type UserChallenge = WithoutSystemFields<Doc<'challenges'>> & {
  id?: string
}
