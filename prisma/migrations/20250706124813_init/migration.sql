-- CreateTable
CREATE TABLE "Etymology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "originLanguage" TEXT NOT NULL,
    "originalForm" TEXT NOT NULL,
    "centuryAttested" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Etymology_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Synonym" (
    "id" INTEGER NOT NULL,
    "senseId" INTEGER NOT NULL,
    "synonymSenseId" INTEGER NOT NULL,
    "similarityScore" REAL,
    CONSTRAINT "Synonym_senseId_fkey" FOREIGN KEY ("senseId") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Synonym_synonymSenseId_fkey" FOREIGN KEY ("synonymSenseId") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Antonym" (
    "id" INTEGER NOT NULL,
    "senseId" INTEGER NOT NULL,
    "antonymSenseId" INTEGER NOT NULL,
    CONSTRAINT "Antonym_senseId_fkey" FOREIGN KEY ("senseId") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Antonym_antonymSenseId_fkey" FOREIGN KEY ("antonymSenseId") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordSense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "frequency_percent" INTEGER,
    "exampleSentence" TEXT,
    "senseNumber" INTEGER NOT NULL,
    "isLiteral" BOOLEAN NOT NULL DEFAULT true,
    "isFigurative" BOOLEAN NOT NULL DEFAULT false,
    "isArchaic" BOOLEAN NOT NULL DEFAULT false,
    "isSlang" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WordSense_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wordId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "word_tag_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "word_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "group_name" TEXT,
    "desc" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "description" TEXT,
    CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SenseTopic" (
    "id" INTEGER NOT NULL,
    "senseId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "relevanceScore" REAL,
    CONSTRAINT "SenseTopic_senseId_fkey" FOREIGN KEY ("senseId") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SenseTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spelling" TEXT NOT NULL,
    "phoneticSymbol" TEXT,
    "pronunciation" TEXT,
    "frequencyRank" INTEGER,
    "isCommon" BOOLEAN NOT NULL DEFAULT false,
    "isInflected" BOOLEAN NOT NULL DEFAULT false,
    "formType" TEXT,
    "baseWordId" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Word_baseWordId_fkey" FOREIGN KEY ("baseWordId") REFERENCES "Word" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Synonym_senseId_synonymSenseId_key" ON "Synonym"("senseId", "synonymSenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Antonym_senseId_antonymSenseId_key" ON "Antonym"("senseId", "antonymSenseId");

-- CreateIndex
CREATE UNIQUE INDEX "word_tag_wordId_tagId_key" ON "word_tag"("wordId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SenseTopic_senseId_topicId_key" ON "SenseTopic"("senseId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Word_spelling_key" ON "Word"("spelling");
