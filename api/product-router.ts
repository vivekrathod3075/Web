import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, like, and, gte, lte, sql, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          size: z.string().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.category) {
        conditions.push(eq(products.category, input.category));
      }
      if (input?.minPrice !== undefined) {
        conditions.push(gte(products.price, input.minPrice.toString()));
      }
      if (input?.maxPrice !== undefined) {
        conditions.push(lte(products.price, input.maxPrice.toString()));
      }
      if (input?.search) {
        conditions.push(like(products.name, `%${input.search}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.createdAt));

      // Filter by size in memory since sizes is JSON
      let filtered = result;
      if (input?.size) {
        filtered = result.filter((p) => {
          const sizes = p.sizes as string[];
          return sizes.includes(input.size!);
        });
      }

      return filtered;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);
      return product[0] || null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.createdAt));
  }),

  trending: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.trending, true))
      .orderBy(desc(products.createdAt));
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().positive(),
        discountPrice: z.number().positive().optional(),
        category: z.string().min(1),
        sizes: z.array(z.string()),
        images: z.array(z.string()),
        stock: z.number().int().min(0).default(50),
        featured: z.boolean().default(false),
        trending: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        ...input,
        price: input.price.toString(),
        discountPrice: input.discountPrice?.toString(),
        sizes: JSON.stringify(input.sizes),
        images: JSON.stringify(input.images),
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        discountPrice: z.number().positive().optional().nullable(),
        category: z.string().min(1).optional(),
        sizes: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
        stock: z.number().int().min(0).optional(),
        featured: z.boolean().optional(),
        trending: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price.toString();
      if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice === null ? null : data.discountPrice.toString();
      if (data.category !== undefined) updateData.category = data.category;
      if (data.sizes !== undefined) updateData.sizes = JSON.stringify(data.sizes);
      if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
      if (data.stock !== undefined) updateData.stock = data.stock;
      if (data.featured !== undefined) updateData.featured = data.featured;
      if (data.trending !== undefined) updateData.trending = data.trending;

      await db.update(products).set(updateData).where(eq(products.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
