import { ScraperNames } from '../config/scraper';
import prisma from '../lib/prisma'
import { Tag } from '@prisma/client/index'
import { Prisma } from '@prisma/client'
import { group } from 'console';

// 插入数据
export const insert = async (infos: Prisma.TagCreateInput[]) => {
  await await prisma.tag.createMany({
    data: infos.map(info => {
      return {
        name: info.name,
        group: info.group,
        desc: info.desc,
      };
    }),
  });
}

export default {
  insert,
  scraperName: ScraperNames.TAG,
}