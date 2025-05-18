-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'KEEPER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'KEEPER';
