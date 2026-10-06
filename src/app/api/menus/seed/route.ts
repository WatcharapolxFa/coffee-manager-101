import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, menuData, toMenu } from '@/lib/api-server';
import { SEED_MENUS } from '@/data/menus-seed';

// Load the template menus: overwrite menus with the same name, create the rest.
export function POST() {
  return handle(async () => {
    const existing = await prisma.menu.findMany({ select: { id: true, name: true } });
    const idByName = new Map(existing.map(m => [m.name, m.id]));
    await prisma.$transaction(SEED_MENUS.map(seed => {
      const id = idByName.get(seed.name);
      return id
        ? prisma.menu.update({ where: { id }, data: menuData(seed) })
        : prisma.menu.create({ data: menuData(seed) });
    }));
    const rows = await prisma.menu.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(rows.map(toMenu));
  });
}
