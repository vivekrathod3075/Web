import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);
      return order[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        items: z.array(
          z.object({
            productId: z.number(),
            name: z.string(),
            size: z.string(),
            qty: z.number(),
            price: z.number(),
          }),
        ),
        totalAmount: z.number().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        ...input,
        items: JSON.stringify(input.items),
        totalAmount: input.totalAmount.toString(),
      });
      return result;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "shipped", "delivered"]),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),
});
