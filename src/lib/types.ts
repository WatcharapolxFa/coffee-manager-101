export interface Ingredient {
  name: string;
  totalQty: number;
  totalPrice: number;
  usedQty: number;
}

export interface HiddenCost {
  name: string;
  amount: number;
}

export interface Menu {
  id: string;
  name: string;
  icon?: string;
  category: string;
  description: string;
  featured: boolean;   // shown under "เมนูแนะนำ" on the customer menu
  visible: boolean;    // shown on the customer menu at all
  ingredients: Ingredient[];
  hiddenCosts: HiddenCost[];
  vat: number;
  packaging: Ingredient[];
  packagingWaste: number;
  company1GP: number;
  company2GP: number;
  sellPrice?: Partial<Record<Channel, number>>;
}

export type MenuInput = Omit<Menu, 'id' | 'category' | 'description' | 'featured' | 'visible'>
  & Partial<Pick<Menu, 'category' | 'description' | 'featured' | 'visible'>>
  & { id?: string };

export interface Sale {
  id: string;
  date: string;
  menuId: string;
  menuName: string;
  qty: number;
  channel: Channel;
  unitPrice: number;
  unitCost: number;
  revenue: number;
}

export interface Purchase {
  id: string;
  date: string;
  name: string;
  qty: number;
  unit: string;
  totalPrice: number;
  note: string;
}

export interface OverheadItem {
  name: string;
  amount: number;
}

export type Channel = 'instore' | 'delivery1' | 'delivery2';
export type Lang = 'th' | 'en';

export interface CalcResult {
  rawCost: number;
  hiddenTotal: number;
  baseCost: number;
  packagingRaw: number;
  packagingWithWaste: number;
  totalDeliveryCost: number;
  c1ExVAT: number;
  c1IncVAT: number;
  c2ExVAT: number;
  c2IncVAT: number;
  instorePrice: number;
}

export interface ChannelConfig {
  label: string;
  logo: string | null;
}
