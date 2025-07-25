import { components, internal } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendEmail = internalMutation({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    html: v.string()
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    });
  },
});

export const sendChallenge1 = mutation({
  args: {
    email: v.string(),
    username: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).unique(); 
    if (!user) throw new Error("User does not exist");

    if (user.username !== args.username) throw new Error("Email is not tied to that username");

    await ctx.runMutation(internal.sendEmails.sendEmail, {
      from: "Me <urmom@skelsemporium.com>",
      to: `${user.username} <${user.email}>`, // TODO no bueno
      subject: "Foo",
      html: "Bar"
    });
  }
}) 