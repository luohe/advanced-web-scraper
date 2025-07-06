-- CreateTable
CREATE TABLE "Etymology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word_id" INTEGER NOT NULL,
    "origin_language" TEXT NOT NULL,
    "original_form" TEXT NOT NULL,
    "century_attested" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Etymology_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Synonym" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sense_id" INTEGER NOT NULL,
    "synonym_sense_id" INTEGER NOT NULL,
    "similarity_score" REAL,
    CONSTRAINT "Synonym_sense_id_fkey" FOREIGN KEY ("sense_id") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Synonym_synonym_sense_id_fkey" FOREIGN KEY ("synonym_sense_id") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Antonym" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sense_id" INTEGER NOT NULL,
    "antonym_sense_id" INTEGER NOT NULL,
    CONSTRAINT "Antonym_sense_id_fkey" FOREIGN KEY ("sense_id") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Antonym_antonym_sense_id_fkey" FOREIGN KEY ("antonym_sense_id") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordSense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word_id" INTEGER NOT NULL,
    "part_of_speech" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "frequency_percent" INTEGER,
    "example_sentence" TEXT,
    "sense_number" INTEGER NOT NULL DEFAULT 1,
    "is_literal" BOOLEAN NOT NULL DEFAULT true,
    "is_figurative" BOOLEAN NOT NULL DEFAULT false,
    "is_archaic" BOOLEAN NOT NULL DEFAULT false,
    "is_slang" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "WordSense_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "word_tag_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "word_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "parent_id" INTEGER,
    "description" TEXT,
    CONSTRAINT "Topic_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SenseTopic" (
    "id" INTEGER NOT NULL,
    "sense_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "relevance_score" REAL,
    CONSTRAINT "SenseTopic_sense_id_fkey" FOREIGN KEY ("sense_id") REFERENCES "WordSense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SenseTopic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "spelling" TEXT NOT NULL,
    "phonetic_symbol" TEXT,
    "pronunciation" TEXT,
    "frequency_rank" INTEGER DEFAULT -1,
    "is_common" BOOLEAN NOT NULL DEFAULT false,
    "isInflected" BOOLEAN NOT NULL DEFAULT false,
    "form_type" TEXT,
    "base_word_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Word_base_word_id_fkey" FOREIGN KEY ("base_word_id") REFERENCES "Word" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Synonym_sense_id_synonym_sense_id_key" ON "Synonym"("sense_id", "synonym_sense_id");

-- CreateIndex
CREATE UNIQUE INDEX "Antonym_sense_id_antonym_sense_id_key" ON "Antonym"("sense_id", "antonym_sense_id");

-- CreateIndex
CREATE UNIQUE INDEX "word_tag_word_id_tag_id_key" ON "word_tag"("word_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SenseTopic_sense_id_topic_id_key" ON "SenseTopic"("sense_id", "topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_spelling_key" ON "Word"("spelling");
