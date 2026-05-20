import type { HiddenCost, ChannelConfig } from './types/index.ts';

export const DEFAULTS = {
  hiddenCosts: [
    { name: 'ค่าแรง',    amount: 0 },
    { name: 'ค่าเช่า',   amount: 0 },
    { name: 'ค่าน้ำ ไฟ', amount: 0 },
    { name: 'การตลาด',   amount: 0 },
  ] satisfies HiddenCost[],
  vat: 30,
  packagingWaste: 5,
  company1GP: 1.5,
  company2GP: 1.25,
};

export const CHANNELS: Record<string, ChannelConfig> = {
  instore:   { label: 'หน้าร้าน', logo: null },
  delivery1: { label: 'Grab',     logo: 'assets/grab-logo.svg' },
  delivery2: { label: 'LINE MAN', logo: 'assets/lineman-logo.svg' },
};

export const STORAGE_KEYS = {
  menus:           'coffee_menus',
  sales:           'coffee_sales',
  purchases:       'coffee_purchases',
  monthlyOverhead: 'coffee_monthly_overhead',
} as const;

export const MENU_ICONS = ['☕', '🧋', '🍵', '🥤', '🍫', '🍹', '🧃', '🌿', '🫖', '🍶'];

export const ASSET_BASE = import.meta.env.BASE_URL;
