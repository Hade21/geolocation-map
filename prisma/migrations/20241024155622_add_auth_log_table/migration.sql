-- AlterTable
ALTER TABLE "authLogs" ALTER COLUMN "refreshToken" DROP NOT NULL,
ALTER COLUMN "refreshTokenExpiry" DROP NOT NULL,
ALTER COLUMN "resetToken" DROP NOT NULL,
ALTER COLUMN "resetTokenExpiry" DROP NOT NULL;
