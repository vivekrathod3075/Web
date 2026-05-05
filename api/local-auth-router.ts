import { z } from "zod";
import bcrypt from "bcryptjs";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { signLocalToken } from "./local-auth";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(6),
        displayName: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if username already exists
      const existing = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Username already taken");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const result = await db.insert(localUsers).values({
        username: input.username,
        password: hashedPassword,
        displayName: input.displayName || input.username,
      });

      const userId = Number(result[0].insertId);
      const token = signLocalToken(userId);

      return {
        success: true,
        token,
        user: {
          id: userId,
          username: input.username,
          name: input.displayName || input.username,
          role: "user",
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      if (user.length === 0) {
        throw new Error("Invalid username or password");
      }

      const valid = await bcrypt.compare(input.password, user[0].password);
      if (!valid) {
        throw new Error("Invalid username or password");
      }

      const token = signLocalToken(user[0].id);

      return {
        success: true,
        token,
        user: {
          id: user[0].id,
          username: user[0].username,
          name: user[0].displayName || user[0].username,
          role: user[0].role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.localUser) {
      return null;
    }
    return {
      id: ctx.localUser.id,
      username: ctx.localUser.username,
      name: ctx.localUser.displayName || ctx.localUser.username,
      role: ctx.localUser.role,
    };
  }),
});
