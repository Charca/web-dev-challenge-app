import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const place = v.object({
  id: v.string(),
  name: v.string(),
  address: v.string(),
  photo: v.string(),
  icon: v.optional(v.string()),
  url: v.optional(v.string()),
  location: v.object({
    lat: v.number(),
    lng: v.number(),
  }),
})

export const challenge = v.object({
  name: v.string(),
  place: place,
  locations: v.array(place),
})

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    email: v.string(),
    challenges: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        place: place,
        locations: v.array(place),
        completed: v.boolean(),
        completedLocations: v.array(v.string()),
      })
    ),
  }),
  challenges: defineTable(challenge),
})
