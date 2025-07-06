import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthenticated call to query")
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", identity.subject))
      .unique()
    if (!user) {
      throw new Error("Unauthenticated call to query")
    }
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("user"), user._id))
      .collect()
  },
})

export const send = mutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthenticated call to mutation")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", identity.subject))
      .unique()
    if (!user) {
      throw new Error("Unauthenticated call to write mutation")
    }

    const task = { text: body, user: user._id }
    await ctx.db.insert("tasks", task)
  },
})
