import { ScraperNames } from '../config/scraper';
import prisma from '../lib/prisma'
import { Word } from '@prisma/client'

// 插入数据
export const insert = async (info: Word) => {
  // TODO: 需要重写插入英文单词的能力
  // const { word, url, ...other } = info;

  // await prisma.word.upsert({
  //   where: { word: info.word },
  //   create: {
  //     word: info.word,
  //     url: info.url,
  //     wordTags: ['sd'],
  //     data: JSON.stringify(other)
  //   },
  //   update: {}
  // });
}

export default {
  insert,
  scraperName: ScraperNames.ENGLISH_WORD,
}