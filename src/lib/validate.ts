import type { Channel, HiddenCost, Ingredient, MenuInput, OverheadItem, Purchase } from './types';

// Request-body parsers for the API. Each returns the cleaned value or throws ValidationError.

export class ValidationError extends Error {}

const CHANNEL_SET = new Set<Channel>(['instore', 'delivery1', 'delivery2']);
const DATE_RE  = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

function obj(v: unknown, what: string): Record<string, unknown> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new ValidationError(`${what} must be an object`);
  return v as Record<string, unknown>;
}

function str(v: unknown, what: string): string {
  if (typeof v !== 'string') throw new ValidationError(`${what} must be a string`);
  return v.trim();
}

function num(v: unknown, what: string): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) throw new ValidationError(`${what} must be a number`);
  return n;
}

function arr(v: unknown, what: string): unknown[] {
  if (!Array.isArray(v)) throw new ValidationError(`${what} must be an array`);
  return v;
}

export function parseDate(v: unknown, what = 'date'): string {
  const s = str(v, what);
  if (!DATE_RE.test(s)) throw new ValidationError(`${what} must be YYYY-MM-DD`);
  return s;
}

export function parseMonth(v: unknown, what = 'month'): string {
  const s = str(v, what);
  if (!MONTH_RE.test(s)) throw new ValidationError(`${what} must be YYYY-MM`);
  return s;
}

function parseIngredient(v: unknown, what: string): Ingredient {
  const o = obj(v, what);
  return {
    name:       str(o.name ?? '', `${what}.name`),
    totalQty:   num(o.totalQty ?? 0, `${what}.totalQty`),
    totalPrice: num(o.totalPrice ?? 0, `${what}.totalPrice`),
    usedQty:    num(o.usedQty ?? 0, `${what}.usedQty`),
  };
}

function parseHiddenCost(v: unknown, what: string): HiddenCost {
  const o = obj(v, what);
  return { name: str(o.name ?? '', `${what}.name`), amount: num(o.amount ?? 0, `${what}.amount`) };
}

export function parseMenuInput(body: unknown): Omit<MenuInput, 'id'> {
  const o = obj(body, 'menu');
  const name = str(o.name, 'name');
  if (!name) throw new ValidationError('name is required');

  let sellPrice: MenuInput['sellPrice'];
  if (o.sellPrice != null) {
    const sp = obj(o.sellPrice, 'sellPrice');
    sellPrice = {};
    for (const ch of CHANNEL_SET) {
      if (sp[ch] == null) continue;
      const p = num(sp[ch], `sellPrice.${ch}`);
      if (p > 0) sellPrice[ch] = p;
    }
    if (Object.keys(sellPrice).length === 0) sellPrice = undefined;
  }

  return {
    name,
    category:       str(o.category ?? '', 'category'),
    description:    str(o.description ?? '', 'description'),
    featured:       o.featured === true,
    visible:        o.visible !== false,
    ingredients:    arr(o.ingredients ?? [], 'ingredients').map((v, i) => parseIngredient(v, `ingredients[${i}]`)),
    hiddenCosts:    arr(o.hiddenCosts ?? [], 'hiddenCosts').map((v, i) => parseHiddenCost(v, `hiddenCosts[${i}]`)),
    vat:            num(o.vat, 'vat'),
    packaging:      arr(o.packaging ?? [], 'packaging').map((v, i) => parseIngredient(v, `packaging[${i}]`)),
    packagingWaste: num(o.packagingWaste, 'packagingWaste'),
    company1GP:     num(o.company1GP, 'company1GP'),
    company2GP:     num(o.company2GP, 'company2GP'),
    sellPrice,
  };
}

export interface OrderInput {
  date: string;
  channel: Channel;
  items: { menuId: string; qty: number; unitPrice: number }[];
}

export function parseOrderInput(body: unknown): OrderInput {
  const o = obj(body, 'order');
  const channel = str(o.channel, 'channel') as Channel;
  if (!CHANNEL_SET.has(channel)) throw new ValidationError('channel is invalid');
  const items = arr(o.items, 'items').map((v, i) => {
    const it = obj(v, `items[${i}]`);
    const qty = num(it.qty, `items[${i}].qty`);
    const unitPrice = num(it.unitPrice, `items[${i}].unitPrice`);
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationError(`items[${i}].qty must be a positive integer`);
    if (unitPrice < 0) throw new ValidationError(`items[${i}].unitPrice must be >= 0`);
    return { menuId: str(it.menuId, `items[${i}].menuId`), qty, unitPrice };
  });
  if (items.length === 0) throw new ValidationError('items is empty');
  return { date: parseDate(o.date), channel, items };
}

export function parsePurchaseInput(body: unknown): Omit<Purchase, 'id'> {
  const o = obj(body, 'purchase');
  const name = str(o.name, 'name');
  const qty = num(o.qty, 'qty');
  const totalPrice = num(o.totalPrice, 'totalPrice');
  if (!name) throw new ValidationError('name is required');
  if (qty <= 0) throw new ValidationError('qty must be > 0');
  if (totalPrice <= 0) throw new ValidationError('totalPrice must be > 0');
  return {
    date: parseDate(o.date),
    name,
    qty,
    unit: str(o.unit, 'unit'),
    totalPrice,
    note: str(o.note ?? '', 'note'),
  };
}

export function parseOverheadInput(body: unknown): { month: string; items: OverheadItem[] } {
  const o = obj(body, 'overhead');
  return {
    month: parseMonth(o.month),
    items: arr(o.items, 'items').map((v, i) => parseHiddenCost(v, `items[${i}]`)),
  };
}
