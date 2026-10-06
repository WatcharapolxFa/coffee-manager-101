-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_Menu" ("company1GP", "company2GP", "createdAt", "hiddenCosts", "id", "ingredients", "name", "packaging", "packagingWaste", "sellPrice", "vat") SELECT "company1GP", "company2GP", "createdAt", "hiddenCosts", "id", "ingredients", "name", "packaging", "packagingWaste", "sellPrice", "vat" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
