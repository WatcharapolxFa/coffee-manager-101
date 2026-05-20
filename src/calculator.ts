import { DEFAULTS } from './config.ts';
import type { Menu, CalcResult, Channel } from './types/index.ts';

export function calcMenu(menu: Partial<Menu>): CalcResult {
  const {
    ingredients    = [],
    hiddenCosts    = DEFAULTS.hiddenCosts,
    vat            = DEFAULTS.vat,
    packaging      = [],
    packagingWaste = DEFAULTS.packagingWaste,
    company1GP     = DEFAULTS.company1GP,
    company2GP     = DEFAULTS.company2GP,
  } = menu;

  const rawCost = ingredients.reduce((sum, ing) => {
    const tq = Number(ing.totalQty);
    const tp = Number(ing.totalPrice);
    const uq = Number(ing.usedQty);
    if (!tq || !tp || !uq) return sum;
    return sum + tp * (uq / tq);
  }, 0);

  const hiddenTotal = (hiddenCosts ?? []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const baseCost    = rawCost + hiddenTotal;

  const packagingRaw = packaging.reduce((sum, pkg) => {
    const tq = Number(pkg.totalQty);
    const tp = Number(pkg.totalPrice);
    const uq = Number(pkg.usedQty);
    if (!tq || !tp || !uq) return sum;
    return sum + tp * (uq / tq);
  }, 0);
  const packagingWithWaste = packagingRaw * (1 + packagingWaste / 100);

  const totalDeliveryCost = baseCost + packagingWithWaste;

  const c1ExVAT      = totalDeliveryCost * company1GP;
  const c1IncVAT     = c1ExVAT + vat;
  const c2ExVAT      = totalDeliveryCost * company2GP;
  const c2IncVAT     = c2ExVAT + vat;
  const instorePrice = totalDeliveryCost + vat;

  return {
    rawCost, hiddenTotal, baseCost,
    packagingRaw, packagingWithWaste, totalDeliveryCost,
    c1ExVAT, c1IncVAT,
    c2ExVAT, c2IncVAT,
    instorePrice,
  };
}

export function getUnitPrice(menu: Partial<Menu>, channel: Channel): number {
  const c = calcMenu(menu);
  if (channel === 'delivery2') return c.c2IncVAT;
  if (channel === 'instore')   return c.instorePrice;
  return c.c1IncVAT;
}

export function getUnitCost(menu: Partial<Menu>): number {
  return calcMenu(menu).baseCost;
}
