-- CreateTable
CREATE TABLE "tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "group_name" TEXT,
    "desc" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "english_word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "url" TEXT,
    "data" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "word_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "word_tag_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "english_word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "word_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "english_word_word_key" ON "english_word"("word");

-- CreateIndex
CREATE UNIQUE INDEX "word_tag_wordId_tagId_key" ON "word_tag"("wordId", "tagId");
