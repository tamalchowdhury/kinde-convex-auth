import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    kindeId: v.string(),
  }).index("by_kinde_id", ["kindeId"]),
})
