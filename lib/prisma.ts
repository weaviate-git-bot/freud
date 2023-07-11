
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

// https://github.com/prisma/blogr-nextjs-prisma/blob/final/lib/prisma.ts

// https://github.com/prisma/prisma/discussions/10037

// Docs about instantiating `PrismaClient` with Next.js:
// https://pris.ly/d/help/next-js-best-practices

import { PrismaClient } from '@prisma/client';
import { env } from '~/env.mjs';

let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
};


let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    console.log("lager production client")
    prisma = new PrismaClient(
        {
            datasources: {
                db: {
                    url: env.DATABASE_URL
                }
            }
        }
    );
} else {
    if (!globalWithPrisma.prisma) {
        console.log("lager local prisma client")
        globalWithPrisma.prisma = new PrismaClient(
            {
                datasources: {
                    db: {
                        url: env.LOCAL_DATABASE_URL
                    }
                }
            }
        );
    }
    prisma = globalWithPrisma.prisma;
}

export default prisma;