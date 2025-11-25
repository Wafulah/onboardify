import { UserRole, Allowed } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

type SeedUser = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  password: string | null;
  role: keyof typeof UserRole;
  allowed: keyof typeof Allowed;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

const users: SeedUser[] = [
  {
    id: "cmhkhlxo50000jp04ds44zewu",
    name: "Victor Wafulah",
    email: "wafulahvictor@gmail.com",
    emailVerified: "2025-11-20 11:05:37.514",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocK7r3TTMaz4-5T4Oeq1SI5vh_XpTD7uPLZx9cNnKk6XJfucvQ=s96-c",
    password: "123456!",
    role: "ADMIN",
    allowed: "YES",
    isTwoFactorEnabled: false,
    createdAt: "2025-11-04 11:30:10.229",
    updatedAt: "2025-11-20 11:05:37.515",
  },
];

/**
 * Seeds the database with initial user data.
 * @returns {Promise<void>}
 */
export async function seedData() { // Renamed and exported as seedData
  try {
    console.log("Seeding users...");
    // ensure DB connection
    await prisma.$connect();
    console.log("DB connected.");

    for (const u of users) {
      let hashedPassword = u.password;
      if (u.password) {
          // Hash the password with a salt round of 10
          hashedPassword = await bcrypt.hash(u.password, 10);
      }
      const emailVerified = u.emailVerified ? new Date(u.emailVerified) : null;
      const createdAt = u.createdAt ? new Date(u.createdAt) : undefined;
      const updatedAt = u.updatedAt ? new Date(u.updatedAt) : undefined;

      try {
        // Upsert by email (your record has email). If you prefer id-based upsert, change where: { id: u.id }
        await prisma.user.upsert({
          where: { email: u.email },
          update: {
            name: u.name,
            emailVerified,
            image: u.image,
            password: hashedPassword,
            role: u.role,
            allowed: u.allowed,
            isTwoFactorEnabled: u.isTwoFactorEnabled,
            updatedAt: updatedAt ?? new Date(),
          },
          create: {
            id: u.id,
            name: u.name,
            email: u.email,
            emailVerified,
            image: u.image,
            password: hashedPassword,
            role: u.role,
            allowed: u.allowed,
            isTwoFactorEnabled: u.isTwoFactorEnabled,
            createdAt: createdAt ?? new Date(),
            updatedAt: updatedAt ?? new Date(),
          },
        });
        console.log(`Upserted user ${u.email} (id=${u.id})`);
      } catch (innerErr) {
        console.error(`Failed to upsert user id=${u.id} email=${u.email}:`, innerErr);
      }
    }

    console.log("Seeding finished.");
  } catch (err) {
    console.error("Seed error:", err);
    throw err; // Re-throw error to signal failure to the caller
  } finally {
    await prisma.$disconnect();
  }
}

// NOTE: The original seed() call at the end has been removed.
// You must now import and call seedData() elsewhere, e.g., seedData().