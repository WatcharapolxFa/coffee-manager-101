import { prisma } from '@/lib/db';
import { handle, notFound } from '@/lib/api-server';

export function DELETE(_request: Request, ctx: RouteContext<'/api/sales/[id]'>) {
  return handle(async () => {
    const { id } = await ctx.params;
    const { count } = await prisma.sale.deleteMany({ where: { id } });
    if (count === 0) return notFound();
    return new Response(null, { status: 204 });
  });
}
