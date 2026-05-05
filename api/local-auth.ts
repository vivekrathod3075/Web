import jwt from "jsonwebtoken";
import { getDb } from "./queries/connection";
import { localUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import type { LocalUser } from "@db/schema";

const JWT_SECRET = process.env.LOCAL_AUTH_SECRET || "ep-brand-local-secret-key-2024";

export function signLocalToken(userId: number): string {
  return jwt.sign({ userId, type: "local" }, JWT_SECRET, { expiresIn: "30d" });
}

export async function verifyLocalToken(headers: Headers): Promise<LocalUser | undefined> {
  const authHeader = headers.get("x-local-auth-token");
  if (!authHeader) return undefined;

  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET, { clockTolerance: 60 }) as {
      userId: number;
      type: string;
    };

    if (decoded.type !== "local") return undefined;

    const db = getDb();
    const user = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, decoded.userId),
    });

    return user || undefined;
  } catch {
    return undefined;
  }
}
