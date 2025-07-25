import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.string(),
    challenge1: v.boolean(),
    challenge2: v.boolean()
  }),
  flags: defineTable({
    flag: v.string(),
    challengeNumber: v.number()
  })
});
