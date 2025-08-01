import { v } from "convex/values";
import { query, mutation} from "./_generated/server";
import { api } from "./_generated/api";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.


// TODO: usernames should maybe be unique?. Should we allow two usernames of the same value in the system?
export const upsertUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").filter(q => q.eq(args.email, q.field('email'))).unique();

    if (!existing) {
      await ctx.db.insert("users", {
        email: args.email,
        username: args.username,
        challenge1: false,
        challenge2:  false,
        challenge3: false
      });
      return;
    }

    // if username matches
    if (existing.username !== args.username) {
      throw new Error("Not the right username");
    }

  }
})


export const getUser = query({
  args: {
    username: v.string(),
    email: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).unique();
    if (!user) throw new Error("User not found");
    if (user.username !== args.username) throw new Error("Username is not associated with specified email address.");
    return user;
  }
})


export const completeChallenge = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    flagNumber: v.number(),
    flag: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.myFunctions.getUser, {
      email: args.email,
      username: args.username
    });
    const flag = await ctx.db.query("flags").filter(q => q.eq(q.field("challengeNumber"), args.flagNumber)).unique();
    if (!flag) throw new Error("Invalid flag number");
    if (flag.flag !== args.flag) return null;
    // at this point, the flag is correct
    await ctx.db.patch(user._id, {
      challenge1: user.challenge1 ||flag.challengeNumber === 1,
      challenge2: user.challenge2 || flag.challengeNumber === 2,
      challenge3: user.challenge3 || flag.challengeNumber === 3
    });
    return flag.completeMessage;
  }
})