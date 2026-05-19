import { DEFAULTS } from './config.js';

export function calcMenu(menu) {
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
    if (!ing.totalQty || !ing.totalPrice || !ing.usedQty) return sum;
    return sum + ing.totalPrice * (ing.usedQty / ing.totalQty);
  }, 0);

  const hiddenTotal = (hiddenCosts ?? []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const baseCost    = rawCost + hiddenTotal;

  const packagingRaw      = packaging.reduce((sum, pkg) => {
    if (!pkg.totalQty || !pkg.totalPrice || !pkg.usedQty) return sum;
    return sum + pkg.totalPrice * (pkg.usedQty / pkg.totalQty);
  }, 0);
  const packagingWithWaste = packagingRaw * (1 + packagingWaste / 100);

  const totalDeliveryCost = baseCost + packagingWithWaste;

  const c1ExVAT  = totalDeliveryCost * company1GP;
  const c1IncVAT = c1ExVAT + vat;
  const c2ExVAT  = totalDeliveryCost * company2GP;
  const c2IncVAT = c2ExVAT + vat;

  return {
    rawCost, hiddenTotal, baseCost,
    packagingRaw, packagingWithWaste, totalDeliveryCost,
    c1ExVAT, c1IncVAT,
    c2ExVAT, c2IncVAT,
  };
}

export function getUnitPrice(menu, channel) {
  const c = calcMenu(menu);
  return channel === 'delivery2' ? c.c2IncVAT : c.c1IncVAT;
}

export function getUnitCost(menu) {
  return calcMenu(menu).baseCost;
}
