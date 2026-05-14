import { describe, it, expect, beforeEach } from 'vitest';
import {
  getMenus, addMenu, updateMenu, deleteMenu, getMenuById,
  getSales, addSale, deleteSale, getSalesByDate, getSalesByMonth,
  seedIfEmpty,
} from '../js/storage.js';

const BASE_MENU = {
  name: 'Test Latte',
  ingredients: [{ name: 'กาแฟ', totalQty: 1000, totalPrice: 550, usedQty: 17 }],
  hiddenCosts: [],
  vat: 7, packagingWaste: 5, company1GP: 1.5, company2GP: 1.25,
  packaging: [],
};

beforeEach(() => {
  localStorage.clear();
});

// ─── Menus ────────────────────────────────────────────────────────────────────

describe('getMenus', () => {
  it('returns [] when storage is empty', () => expect(getMenus()).toEqual([]));

  it('returns [] when storage contains invalid JSON', () => {
    localStorage.setItem('coffee_menus', 'not-json');
    expect(getMenus()).toEqual([]);
  });
});

describe('addMenu', () => {
  it('assigns a unique id to the new menu', () => {
    const m = addMenu(BASE_MENU);
    expect(typeof m.id).toBe('string');
    expect(m.id.length).toBeGreaterThan(0);
  });

  it('persists the menu so getMenus returns it', () => {
    const m = addMenu(BASE_MENU);
    expect(getMenus()).toHaveLength(1);
    expect(getMenus()[0].id).toBe(m.id);
  });

  it('accumulates multiple menus', () => {
    addMenu(BASE_MENU);
    addMenu({ ...BASE_MENU, name: 'Matcha' });
    expect(getMenus()).toHaveLength(2);
  });
});

describe('updateMenu', () => {
  it('updates name without touching id', () => {
    const m = addMenu(BASE_MENU);
    updateMenu(m.id, { name: 'Updated' });
    const updated = getMenuById(m.id);
    expect(updated.name).toBe('Updated');
    expect(updated.id).toBe(m.id);
  });

  it('does nothing when id is not found', () => {
    addMenu(BASE_MENU);
    updateMenu('nonexistent', { name: 'Ghost' });
    expect(getMenus()[0].name).toBe(BASE_MENU.name);
  });
});

describe('deleteMenu', () => {
  it('removes the menu with matching id', () => {
    const m = addMenu(BASE_MENU);
    deleteMenu(m.id);
    expect(getMenus()).toHaveLength(0);
  });

  it('leaves other menus intact', () => {
    const m1 = addMenu(BASE_MENU);
    const m2 = addMenu({ ...BASE_MENU, name: 'Other' });
    deleteMenu(m1.id);
    expect(getMenus()).toHaveLength(1);
    expect(getMenus()[0].id).toBe(m2.id);
  });
});

describe('getMenuById', () => {
  it('returns the menu when found', () => {
    const m = addMenu(BASE_MENU);
    expect(getMenuById(m.id)?.id).toBe(m.id);
  });

  it('returns null when not found', () => {
    expect(getMenuById('nope')).toBeNull();
  });
});

// ─── Sales ────────────────────────────────────────────────────────────────────

const BASE_SALE = {
  date: '2026-05-13',
  menuId: 'menu-1',
  menuName: 'Test Latte',
  qty: 2,
  channel: 'delivery1',
  unitPrice: 100,
  unitCost: 50,
  revenue: 200,
};

describe('getSales', () => {
  it('returns [] when storage is empty', () => expect(getSales()).toEqual([]));
});

describe('addSale', () => {
  it('assigns a unique id', () => {
    const s = addSale(BASE_SALE);
    expect(typeof s.id).toBe('string');
  });

  it('persists so getSales returns it', () => {
    addSale(BASE_SALE);
    expect(getSales()).toHaveLength(1);
  });
});

describe('deleteSale', () => {
  it('removes the sale with matching id', () => {
    const s = addSale(BASE_SALE);
    deleteSale(s.id);
    expect(getSales()).toHaveLength(0);
  });
});

describe('getSalesByDate', () => {
  it('returns only sales matching the date', () => {
    addSale({ ...BASE_SALE, date: '2026-05-13' });
    addSale({ ...BASE_SALE, date: '2026-05-14' });
    expect(getSalesByDate('2026-05-13')).toHaveLength(1);
  });
});

describe('getSalesByMonth', () => {
  it('returns all sales within the month', () => {
    addSale({ ...BASE_SALE, date: '2026-05-01' });
    addSale({ ...BASE_SALE, date: '2026-05-31' });
    addSale({ ...BASE_SALE, date: '2026-06-01' });
    expect(getSalesByMonth(2026, 5)).toHaveLength(2);
  });

  it('pads single-digit month', () => {
    addSale({ ...BASE_SALE, date: '2026-01-15' });
    expect(getSalesByMonth(2026, 1)).toHaveLength(1);
  });
});

// ─── Seed ─────────────────────────────────────────────────────────────────────

describe('seedIfEmpty', () => {
  it('seeds one menu when storage is empty', () => {
    seedIfEmpty();
    expect(getMenus()).toHaveLength(1);
    expect(getMenus()[0].name).toBe('Iced Cafe Latte');
  });

  it('does not seed when menus already exist', () => {
    addMenu(BASE_MENU);
    seedIfEmpty();
    expect(getMenus()).toHaveLength(1);
    expect(getMenus()[0].name).toBe(BASE_MENU.name);
  });
});
