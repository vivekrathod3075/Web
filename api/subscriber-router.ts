import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { subscribers } from "@db/schema";
import { desc } from "drizzle-orm";

export const subscriberRouter = createRouter({
  subscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      try {
        await db.insert(subscribers).values({ email: input.email });
        return { success: true, message: "Subscribed successfully!" };
      } catch {
        return { success: true, message: "Already subscribed!" };
      }
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }),
});
