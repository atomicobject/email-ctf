import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});


export const sendChallenge = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    challengeNumber: v.number()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).unique(); 
    if (!user) throw new Error("User does not exist");

    if (user.username !== args.username) throw new Error("Email is not tied to that username");

    const challenge = await ctx.db.query("flags").filter(q => q.eq(q.field("challengeNumber"), args.challengeNumber)).unique(); 
    if (!challenge) throw new Error("Flag does not exist");

    await resend.sendEmail(ctx, {
      from: challenge.from || "",
      to: `${user.username} <${user.email}>`, // TODO no bueno
      subject: challenge.subject || "",
      html: challenge.html || "",
      replyTo: challenge.replyTo || [],
      headers: challenge.headers || [],
    });

    // Track that email has been sent for this challenge
    const updateData: Record<string, boolean> = {};
    if (args.challengeNumber === 1) updateData.challenge1EmailSent = true;
    if (args.challengeNumber === 2) updateData.challenge2EmailSent = true;
    if (args.challengeNumber === 3) updateData.challenge3EmailSent = true;
    
    await ctx.db.patch(user._id, updateData);
  }
}) 