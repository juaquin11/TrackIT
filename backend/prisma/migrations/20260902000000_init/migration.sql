-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "alturaCm" DOUBLE PRECISION NOT NULL,
    "edad" INTEGER NOT NULL,
    "factorActividad" DOUBLE PRECISION NOT NULL,
    "objetivo" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcionBase" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "calorias" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "carbohidratos" DOUBLE PRECISION NOT NULL,
    "grasas" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRecord" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,

    CONSTRAINT "DailyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumedFood" (
    "id" SERIAL NOT NULL,
    "gramos" DOUBLE PRECISION NOT NULL,
    "foodId" INTEGER NOT NULL,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "ConsumedFood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecord_fecha_key" ON "DailyRecord"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToTag_AB_unique" ON "_FoodToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToTag_B_index" ON "_FoodToTag"("B");

-- AddForeignKey
ALTER TABLE "ConsumedFood" ADD CONSTRAINT "ConsumedFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumedFood" ADD CONSTRAINT "ConsumedFood_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DailyRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToTag" ADD CONSTRAINT "_FoodToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToTag" ADD CONSTRAINT "_FoodToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
