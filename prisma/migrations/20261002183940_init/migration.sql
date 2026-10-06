-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "hiddenCosts" JSONB NOT NULL,
    "vat" REAL NOT NULL,
    "packaging" JSONB NOT NULL,
    "packagingWaste" REAL NOT NULL,
    "company1GP" REAL NOT NULL,
    "company2GP" REAL NOT NULL,
    "sellPrice" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "menuName" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "unitCost" REAL NOT NULL,
    "revenue" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OverheadItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" REAL NOT NULL
);

-- CreateIndex
CREATE INDEX "Sale_date_idx" ON "Sale"("date");

-- CreateIndex
CREATE INDEX "Purchase_date_idx" ON "Purchase"("date");

-- CreateIndex
CREATE INDEX "OverheadItem_month_idx" ON "OverheadItem"("month");
