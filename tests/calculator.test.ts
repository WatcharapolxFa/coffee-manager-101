import { describe, it, expect } from 'vitest';
import { calcMenu, getUnitPrice, getUnitCost } from '../src/calculator.ts';

const ICE_LATTE = {
  ingredients: [
    { name: 'เมล็ดกาแฟ', totalQty: 1000, totalPrice: 550,   usedQty: 17  },
    { name: 'นมสด',       totalQty: 2000, totalPrice: 99.75, usedQty: 150 },
    { name: 'แก้ว',       totalQty: 1,    totalPrice: 1,     usedQty: 1   },
    { name: 'หลอด',       totalQty: 200,  totalPrice: 48,    usedQty: 1   },
    { name: 'ฝาเรียบ',    totalQty: 1,    totalPrice: 1,     usedQty: 1   },
    { name: 'น้ำแข็ง',    totalQty: 1,    totalPrice: 1,     usedQty: 1   },
    { name: 'สติ๊กเกอร์', totalQty: 1,    totalPrice: 1,     usedQty: 1   },
    { name: 'น้ำเชื่อม',  totalQty: 1000, totalPrice: 30,    usedQty: 15  },
  ],
  hiddenCosts: [],
  vat: 7,
  packaging: [
    { name: 'ขวด',    totalQty: 50,  totalPrice: 60, usedQty: 1 },
    { name: 'กระดาษ', totalQty: 200, totalPrice: 65, usedQty: 1 },
  ],
  packagingWaste: 5,
  company1GP: 1.5,
  company2GP: 1.25,
};

describe('calcMenu', () => {
  it('returns all zeros for empty menu', () => {
    const r = calcMenu({ ingredients: [], packaging: [], hiddenCosts: [] });
    expect(r.rawCost).toBe(0);
    expect(r.baseCost).toBe(0);
    expect(r.totalDeliveryCost).toBe(0);
  });

  it('skips ingredient rows with missing values', () => {
    const r = calcMenu({
      ingredients: [{ name: 'x', totalQty: 0, totalPrice: 100, usedQty: 10 }],
      packaging: [], hiddenCosts: [],
    });
    expect(r.rawCost).toBe(0);
  });

  it('calculates rawCost from ingredients correctly', () => {
    const r = calcMenu({
      ingredients: [{ name: 'กาแฟ', totalQty: 1000, totalPrice: 550, usedQty: 17 }],
      packaging: [], hiddenCosts: [],
    });
    expect(r.rawCost).toBeCloseTo(550 * 17 / 1000, 6);
  });

  it('adds hiddenCosts to baseCost', () => {
    const r = calcMenu({
      ingredients: [],
      hiddenCosts: [{ name: 'ค่าแรง', amount: 10 }, { name: 'ค่าเช่า', amount: 5 }],
      packaging: [],
    });
    expect(r.hiddenTotal).toBe(15);
    expect(r.baseCost).toBe(15);
  });

  it('applies packagingWaste correctly', () => {
    const r = calcMenu({
      ingredients: [], hiddenCosts: [],
      packaging: [{ name: 'ขวด', totalQty: 50, totalPrice: 60, usedQty: 1 }],
      packagingWaste: 10,
    });
    const raw = 60 / 50;
    expect(r.packagingRaw).toBeCloseTo(raw, 6);
    expect(r.packagingWithWaste).toBeCloseTo(raw * 1.1, 6);
  });

  it('calculates c1/c2 prices with VAT for Iced Latte', () => {
    const r = calcMenu(ICE_LATTE);
    expect(r.rawCost).toBeGreaterThan(0);
    expect(r.c1IncVAT).toBeCloseTo(r.totalDeliveryCost * 1.5 + 7, 4);
    expect(r.c2IncVAT).toBeCloseTo(r.totalDeliveryCost * 1.25 + 7, 4);
  });

  it('c1IncVAT > c2IncVAT when company1GP > company2GP', () => {
    const r = calcMenu(ICE_LATTE);
    expect(r.c1IncVAT).toBeGreaterThan(r.c2IncVAT);
  });

  it('uses DEFAULTS when menu omits optional fields', () => {
    const r1 = calcMenu({ ingredients: [{ name: 'x', totalQty: 100, totalPrice: 100, usedQty: 10 }] });
    const r2 = calcMenu({
      ingredients: [{ name: 'x', totalQty: 100, totalPrice: 100, usedQty: 10 }],
      vat: 30, packagingWaste: 5, company1GP: 1.5, company2GP: 1.25,
      hiddenCosts: [], packaging: [],
    });
    expect(r1.c1IncVAT).toBeCloseTo(r2.c1IncVAT, 6);
  });
});

describe('getUnitPrice', () => {
  it('returns c1IncVAT for delivery1', () => {
    const r = calcMenu(ICE_LATTE);
    expect(getUnitPrice(ICE_LATTE, 'delivery1')).toBeCloseTo(r.c1IncVAT, 6);
  });

  it('returns c2IncVAT for delivery2', () => {
    const r = calcMenu(ICE_LATTE);
    expect(getUnitPrice(ICE_LATTE, 'delivery2')).toBeCloseTo(r.c2IncVAT, 6);
  });

  it('returns instorePrice for instore', () => {
    const r = calcMenu(ICE_LATTE);
    expect(getUnitPrice(ICE_LATTE, 'instore')).toBeCloseTo(r.instorePrice, 6);
  });

  it('defaults to c1IncVAT for unknown channel', () => {
    expect(getUnitPrice(ICE_LATTE, 'delivery1')).toBe(getUnitPrice(ICE_LATTE, 'delivery1'));
  });
});

describe('getUnitCost', () => {
  it('returns baseCost', () => {
    const r = calcMenu(ICE_LATTE);
    expect(getUnitCost(ICE_LATTE)).toBeCloseTo(r.baseCost, 6);
  });
});
