import type { HiddenCost, ChannelConfig } from './types';

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
  delivery1: { label: 'Grab',     logo: '/assets/grab-logo.svg' },
  delivery2: { label: 'LINE MAN', logo: '/assets/lineman-logo.svg' },
};

export const MENU_ICONS = ['☕', '🧋', '🍵', '🥤', '🍫', '🍹', '🧃', '🌿', '🫖', '🍶'];

export const PURCHASE_UNITS = ['g', 'kg', 'ml', 'L', 'ชิ้น', 'ถุง', 'กล่อง', 'แพ็ค', 'อื่นๆ'];

export const SHOP_NAME = 'Sunshine coffee';

// Store price = LINE MAN price ÷ LINEMAN_TO_INSTORE, rounded up to the next PRICE_STEP baht.
export const LINEMAN_TO_INSTORE = 1.5;
export const PRICE_STEP = 5;

// Customer menu sections, in order. `name` matches Menu.category, `slug` is the anchor (/menu#<slug>)
// and the photo folder (photos/<slug>/ → public/menu-photos/<slug>/).
export const MENU_CATEGORIES = [
  { name: 'Coffee',     slug: 'coffee', title: 'Coffee',  tagline: 'กาแฟหอมเข้ม ปลุกความสดใสทุกวัน' },
  { name: 'Matcha',     slug: 'matcha', title: 'Matcha',  tagline: 'มัทฉะเข้มข้น หอมนัว ไม่ฝาดไม่ขม' },
  { name: 'Tea',        slug: 'tea',    title: 'Tea',     tagline: 'ชาหอมละมุน ดื่มง่ายได้ทุกเวลา' },
  { name: 'Soda',       slug: 'soda',   title: 'Soda',    tagline: 'ซ่าสดชื่น ดับร้อนแบบซ่าๆ' },
  { name: 'Cocoa',      slug: 'cocoa',  title: 'Cocoa',   tagline: 'โกโก้พรีเมียม เข้มข้น หวานกำลังดี' },
  { name: 'Milk',       slug: 'milk',   title: 'Milk',    tagline: 'นมสดหอมนุ่ม เด็กๆ ชอบ' },
];
