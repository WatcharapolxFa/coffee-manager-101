import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, toPurchase } from '@/lib/api-server';
import { parseDate, parsePurchaseInput } from '@/lib/validate';

// GET /api/purchases?date=YYYY-MM-DD
export function GET(request: NextRequest) {
  return handle(async () => {
    const date = parseDate(request.nextUrl.searchParams.get('date'));
    const rows = await prisma.purchase.findMany({ where: { date }, orderBy: { createdAt: 'asc' } });
    return NextResponse.json(rows.map(toPurchase));
  });
}

export function POST(request: Request) {
  return handle(async () => {
    const input = parsePurchaseInput(await request.json());
    const row = await prisma.purchase.create({ data: input });
    return NextResponse.json(toPurchase(row), { status: 201 });
  });
}
