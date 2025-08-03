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
    challenge2: v.boolean(),
    challenge3: v.optional(v.boolean()),
    challenge1EmailSent: v.optional(v.boolean()),
    challenge2EmailSent: v.optional(v.boolean()),
    challenge3EmailSent: v.optional(v.boolean())
  }),
  flags: defineTable({
    flag: v.string(),
    challengeNumber: v.number(),
    html: v.optional(v.string()),
    subject: v.optional(v.string()),
    completeMessage: v.optional(v.string()),
    from: v.optional(v.string()),
    replyTo: v.optional(v.array(v.string())),
    headers: v.optional(v.array(v.object({
      name: v.string(),
      value: v.string()
    })))
  })
});
