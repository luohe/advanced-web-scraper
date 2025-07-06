import { ScraperNames } from '../config/scraper';
import prisma from '../lib/prisma'
import { EnglishWord } from '@prisma/client'

// 插入数据
export const insert = async (info: EnglishWord) => {
  const { word, url, ...other } = info;

  await prisma.englishWord.upsert({
    where: { word: info.word },
    create: {
      word: info.word,
      url: info.url,
      wordTags: ['sd'],
      data: JSON.stringify(other)
    },
    update: {}
  });
}

export default {
  insert,
  scraperName: ScraperNames.ENGLISH_WORD,
}