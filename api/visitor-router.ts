import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { visitors } from "@db/schema";
import { sql } from "drizzle-orm";

export const visitorRouter = createRouter({
  track: publicQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const ip =
      ctx.req.headers.get("x-forwarded-for") ||
      ctx.req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = ctx.req.headers.get("user-agent") || "unknown";

    await db.insert(visitors).values({ ip, userAgent });
    return { success: true };
  }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors);
    return { total: result[0]?.count || 0 };
  }),

  count: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(visitors);
    return { total: result[0]?.count || 0 };
  }),
});
