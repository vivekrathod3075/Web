import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { productRouter } from "./product-router";
import { orderRouter } from "./order-router";
import { contactRouter } from "./contact-router";
import { messageRouter } from "./message-router";
import { subscriberRouter } from "./subscriber-router";
import { visitorRouter } from "./visitor-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  product: productRouter,
  order: orderRouter,
  contact: contactRouter,
  message: messageRouter,
  subscriber: subscriberRouter,
  visitor: visitorRouter,
});

export type AppRouter = typeof appRouter;
