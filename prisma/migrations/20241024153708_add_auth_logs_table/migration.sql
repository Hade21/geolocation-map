-- CreateTable
CREATE TABLE "authLogs" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "timeStamp" TIMESTAMP(6) NOT NULL,
    "refreshToken" VARCHAR(100) NOT NULL,
    "refreshTokenExpiry" TIMESTAMP(6) NOT NULL,
    "resetToken" VARCHAR(100) NOT NULL,
    "resetTokenExpiry" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "authLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "authLogs" ADD CONSTRAINT "authLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
