import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { handle } from '@/lib/api-server';
import { parseMonth, parseOverheadInput } from '@/lib/validate';

// GET /api/overhead?month=YYYY-MM → [{ name, amount }]
export function GET(request: NextRequest) {
  return handle(async () => {
    const month = parseMonth(request.nextUrl.searchParams.get('month'));
    const rows = await prisma.overheadItem.findMany({ where: { month }, orderBy: { position: 'asc' } });
    return NextResponse.json(rows.map(r => ({ name: r.name, amount: r.amount })));
  });
}

// PUT { month, items } replaces the whole month.
export function PUT(request: Request) {
  return handle(async () => {
    const { month, items } = parseOverheadInput(await request.json());
    await prisma.$transaction([
      prisma.overheadItem.deleteMany({ where: { month } }),
      prisma.overheadItem.createMany({
        data: items.map((item, position) => ({ month, position, name: item.name, amount: item.amount })),
      }),
    ]);
    return NextResponse.json(items);
  });
}
