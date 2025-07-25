import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.


// TODO: usernames should maybe be unique?. Should we allow two usernames of the same value in the system?
export const upsertUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    challenge1: v.optional(v.boolean()),
    challenge2: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").filter(q => q.eq(args.email, q.field('email'))).unique();

    if (!existing) {
      await ctx.db.insert("users", {
        email: args.email,
        username: args.username,
        challenge1: args.challenge1 || false,
        challenge2: args.challenge2 || false
      });
      return;
    }

    // if username matches
    if (existing.username !== args.username) {
      throw new Error("Not the right username");
    }

    await ctx.db.patch(existing._id, {
      challenge1: args.challenge1 ?? existing.challenge1,
      challenge2: args.challenge2 ?? existing.challenge2
    });
  }
})
