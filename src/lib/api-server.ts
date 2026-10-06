import 'server-only';
import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import type { Menu as MenuRow, Sale as SaleRow, Purchase as PurchaseRow } from '@/generated/prisma/client';
import type { Channel, HiddenCost, Ingredient, Menu, MenuInput, Purchase, Sale } from './types';
import { ValidationError } from './validate';

// Wraps a route handler body: ValidationError / bad JSON → 400, anything else → 500.
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ValidationError || err instanceof SyntaxError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export function notFound(): Response {
  return NextResponse.json({ error: 'not found' }, { status: 404 });
}

// MenuInput → Prisma create/update data. A missing sellPrice clears the column.
export function menuData(input: Omit<MenuInput, 'id'>) {
  return {
    name:           input.name,
    category:       input.category ?? '',
    description:    input.description ?? '',
    featured:       input.featured ?? false,
    visible:        input.visible ?? true,
    ingredients:    input.ingredients as unknown as Prisma.InputJsonValue,
    hiddenCosts:    input.hiddenCosts as unknown as Prisma.InputJsonValue,
    vat:            input.vat,
    packaging:      input.packaging as unknown as Prisma.InputJsonValue,
    packagingWaste: input.packagingWaste,
    company1GP:     input.company1GP,
    company2GP:     input.company2GP,
    sellPrice:      input.sellPrice ?? Prisma.DbNull,
  };
}

export function toMenu(row: MenuRow): Menu {
  return {
    id:             row.id,
    name:           row.name,
    category:       row.category,
    description:    row.description,
    featured:       row.featured,
    visible:        row.visible,
    ingredients:    row.ingredients as unknown as Ingredient[],
    hiddenCosts:    row.hiddenCosts as unknown as HiddenCost[],
    vat:            row.vat,
    packaging:      row.packaging as unknown as Ingredient[],
    packagingWaste: row.packagingWaste,
    company1GP:     row.company1GP,
    company2GP:     row.company2GP,
    sellPrice:      (row.sellPrice ?? undefined) as Menu['sellPrice'],
  };
}

export function toSale(row: SaleRow): Sale {
  const { createdAt: _createdAt, ...rest } = row;
  return { ...rest, channel: rest.channel as Channel };
}

export function toPurchase(row: PurchaseRow): Purchase {
  const { createdAt: _createdAt, ...rest } = row;
  return rest;
}
