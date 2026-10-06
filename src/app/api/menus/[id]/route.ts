import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, menuData, notFound, toMenu } from '@/lib/api-server';
import { parseMenuInput } from '@/lib/validate';

export function PUT(request: Request, ctx: RouteContext<'/api/menus/[id]'>) {
  return handle(async () => {
    const { id } = await ctx.params;
    const input = parseMenuInput(await request.json());
    const { count } = await prisma.menu.updateMany({ where: { id }, data: menuData(input) });
    if (count === 0) return notFound();
    const row = await prisma.menu.findUniqueOrThrow({ where: { id } });
    return NextResponse.json(toMenu(row));
  });
}

export function DELETE(_request: Request, ctx: RouteContext<'/api/menus/[id]'>) {
  return handle(async () => {
    const { id } = await ctx.params;
    const { count } = await prisma.menu.deleteMany({ where: { id } });
    if (count === 0) return notFound();
    return new Response(null, { status: 204 });
  });
}
