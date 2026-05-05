import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, LocalUser } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./local-auth";

export type UnifiedUser = {
  id: number;
  name: string;
  email?: string | null;
  avatar?: string | null;
  role: string;
  authType: "oauth" | "local";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  localUser?: LocalUser;
  unifiedUser?: UnifiedUser;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth auth first
  try {
    const user = await authenticateRequest(opts.req.headers);
    if (user) {
      ctx.user = user;
      ctx.unifiedUser = {
        id: user.id,
        name: user.name || "User",
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        authType: "oauth",
      };
    }
  } catch {
    // OAuth auth failed, try local auth
  }

  // Try local auth if OAuth didn't work
  if (!ctx.unifiedUser) {
    try {
      const localUser = await verifyLocalToken(opts.req.headers);
      if (localUser) {
        ctx.localUser = localUser;
        ctx.unifiedUser = {
          id: localUser.id,
          name: localUser.displayName || localUser.username,
          email: null,
          avatar: null,
          role: localUser.role,
          authType: "local",
        };
      }
    } catch {
      // Local auth also failed
    }
  }

  return ctx;
}
