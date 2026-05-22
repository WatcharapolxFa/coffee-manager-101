export interface Ingredient {
  name: string;
  totalQty: number | string;
  totalPrice: number | string;
  usedQty: number | string;
}

export interface HiddenCost {
  name: string;
  amount: number;
}

export interface Menu {
  id: string;
  name: string;
  icon?: string;
  ingredients: Ingredient[];
  hiddenCosts: HiddenCost[];
  vat: number;
  packaging: Ingredient[];
  packagingWaste: number;
  company1GP: number;
  company2GP: number;
  sellPrice?: Partial<Record<Channel, number>>;
}

export type MenuInput = Omit<Menu, 'id'> & { id?: string };

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

export interface StorageExport {
  version: number;
  exportedAt: string;
  menus: Menu[];
  sales: Sale[];
  purchases: Purchase[];
  monthlyOverhead: Record<string, OverheadItem[]>;
}

export interface ChannelConfig {
  label: string;
  logo: string | null;
}
