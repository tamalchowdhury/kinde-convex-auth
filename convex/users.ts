import { v } from "convex/values"
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server"

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx)
  },
})

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Called storeUser without authentication present")
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", identity.subject))
      .unique()

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      return user._id
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      kindeId: identity.subject,
    })
  },
})

export const upsertFromKinde = internalMutation({
  args: { data: v.any() },
  async handler(ctx, { data }) {
    const user = await userByKindeId(ctx, data.user.id)
    if (user === null) {
      await ctx.db.insert("users", { kindeId: data.user.id })
    } else {
      await ctx.db.patch(user._id, { kindeId: data.user.id })
    }
  },
})

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new Error("Can't get current user")
  return userRecord
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    return null
  }
  return await userByKindeId(ctx, identity.subject)
}

async function userByKindeId(ctx: QueryCtx, kindeIde: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_kinde_id", (q) => q.eq("kindeId", kindeIde))
    .unique()
}
