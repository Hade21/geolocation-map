-- CreateTable
CREATE TABLE "units" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "egi" VARCHAR(100) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "long" VARCHAR(100) NOT NULL,
    "lat" VARCHAR(100) NOT NULL,
    "alt" VARCHAR(100) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "dateTime" TIMESTAMP NOT NULL,
    "unitId" VARCHAR(100) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
