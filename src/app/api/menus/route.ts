import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, menuData, toMenu } from '@/lib/api-server';
import { parseMenuInput } from '@/lib/validate';

export function GET() {
  return handle(async () => {
    const rows = await prisma.menu.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(rows.map(toMenu));
  });
}

export function POST(request: Request) {
  return handle(async () => {
    const input = parseMenuInput(await request.json());
    const row = await prisma.menu.create({ data: menuData(input) });
    return NextResponse.json(toMenu(row), { status: 201 });
  });
}
