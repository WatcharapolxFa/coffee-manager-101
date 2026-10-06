import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, toMenu, toSale } from '@/lib/api-server';
import { getUnitCost } from '@/lib/calculator';
import { ValidationError, parseDate, parseOrderInput } from '@/lib/validate';

// GET /api/sales?date=YYYY-MM-DD  or  ?from=YYYY-MM-DD&to=YYYY-MM-DD (inclusive)
export function GET(request: NextRequest) {
  return handle(async () => {
    const q = request.nextUrl.searchParams;
    const date = q.get('date');
    const from = date ?? q.get('from');
    const to   = date ?? q.get('to');
    if (!from || !to) throw new ValidationError('date or from/to is required');
    const rows = await prisma.sale.findMany({
      where: { date: { gte: parseDate(from, 'from'), lte: parseDate(to, 'to') } },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(rows.map(toSale));
  });
}

// POST one order: { date, channel, items: [{ menuId, qty, unitPrice }] }
// menuName and unitCost come from the stored menu, not from the client.
export function POST(request: Request) {
  return handle(async () => {
    const order = parseOrderInput(await request.json());
    const menuIds = [...new Set(order.items.map(i => i.menuId))];
    const menus = new Map(
      (await prisma.menu.findMany({ where: { id: { in: menuIds } } })).map(r => [r.id, toMenu(r)]),
    );
    const missing = menuIds.find(id => !menus.has(id));
    if (missing) throw new ValidationError(`menu ${missing} not found`);

    const rows = await prisma.$transaction(order.items.map(item => {
      const menu = menus.get(item.menuId)!;
      return prisma.sale.create({
        data: {
          date:      order.date,
          menuId:    menu.id,
          menuName:  menu.name,
          qty:       item.qty,
          channel:   order.channel,
          unitPrice: item.unitPrice,
          unitCost:  +getUnitCost(menu).toFixed(2),
          revenue:   item.unitPrice * item.qty,
        },
      });
    }));
    return NextResponse.json(rows.map(toSale), { status: 201 });
  });
}
