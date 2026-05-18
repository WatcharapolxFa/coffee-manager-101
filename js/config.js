export const DEFAULTS = {
  hiddenCosts: [
    { name: 'ค่าแรง',    amount: 0 },
    { name: 'ค่าเช่า',   amount: 0 },
    { name: 'ค่าน้ำ ไฟ', amount: 0 },
    { name: 'การตลาด',   amount: 0 },
  ],
  vat: 7,
  packagingWaste: 5,
  company1GP: 1.5,
  company2GP: 1.25,
};

export const CHANNELS = {
  delivery1: { label: 'Grab',     logo: 'assets/grab-logo.svg' },
  delivery2: { label: 'LINE MAN', logo: 'assets/lineman-logo.svg' },
};

export const STORAGE_KEYS = {
  menus:     'coffee_menus',
  sales:     'coffee_sales',
  purchases: 'coffee_purchases',
};

export const MENU_ICONS = ['☕','🧋','🍵','🥤','🍫','🍹','🧃','🌿','🫖','🍶'];
