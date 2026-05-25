import type { MenuInput } from '../types/index.ts';

export const SEED_MENUS: MenuInput[] = [
  {
    name: "Iced Latte",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Dark Roasted)", totalQty: 1000, totalPrice: 550,   usedQty: 17 },
      { name: "นมสด",       totalQty: 2000, totalPrice: 99.75, usedQty: 50 },
      { name: "นมจืดสด",    totalQty: 1000, totalPrice: 58,    usedQty: 35 },
      { name: "นมข้นหวาน",  totalQty: 2000, totalPrice: 115,   usedQty: 35 },
      { name: "น้ำ",        totalQty: 6000, totalPrice: 41,    usedQty: 75 },
    ],
    packaging: [
      { name: "หลอด",                  totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว",      totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",               totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",                  totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 55, delivery1: 80 },
  },
  {
    name: "Iced Americano",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Medium Roasted)", totalQty: 1000, totalPrice: 550, usedQty: 17 },
      { name: "น้ำ",   totalQty: 6000, totalPrice: 41, usedQty: 75 },
      { name: "Syrup", totalQty: 450,  totalPrice: 89, usedQty: 10 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 50, delivery1: 70 },
  },
  {
    name: "Iced Espresso",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Medium Roasted)", totalQty: 1000, totalPrice: 550, usedQty: 17 },
      { name: "น้ำ",        totalQty: 6000, totalPrice: 41,  usedQty: 75 },
      { name: "นมจืดสด",    totalQty: 1000, totalPrice: 58,  usedQty: 40 },
      { name: "นมข้นหวาน",  totalQty: 2000, totalPrice: 115, usedQty: 40 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 50, delivery1: 75 },
  },
  {
    name: "Iced Cappuccino",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Medium Roasted)", totalQty: 1000, totalPrice: 550,   usedQty: 17 },
      { name: "น้ำ",        totalQty: 6000, totalPrice: 41,    usedQty: 75 },
      { name: "นมสด",       totalQty: 2000, totalPrice: 99.75, usedQty: 50 },
      { name: "นมจืดสด",    totalQty: 1000, totalPrice: 58,    usedQty: 40 },
      { name: "นมข้นหวาน",  totalQty: 2000, totalPrice: 115,   usedQty: 40 },
      { name: "ฝองนม",      totalQty: 1000, totalPrice: 98,    usedQty: 10 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 50 },
  },
  {
    name: "Iced Mocha",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Medium Roasted)", totalQty: 1000, totalPrice: 550, usedQty: 17 },
      { name: "ช็อกโกแลต",  totalQty: 500,  totalPrice: 560, usedQty: 1  },
      { name: "น้ำ",        totalQty: 6000, totalPrice: 41,  usedQty: 75 },
      { name: "นมสด",       totalQty: 1000, totalPrice: 98,  usedQty: 10 },
      { name: "นมจืดสด",    totalQty: 1000, totalPrice: 58,  usedQty: 40 },
      { name: "นมข้นหวาน",  totalQty: 2000, totalPrice: 115, usedQty: 40 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 55, delivery1: 80 },
  },
  {
    name: "Iced Matcha Latte",
    ingredients: [
      { name: "ผงมัทฉะ", totalQty: 40,   totalPrice: 350, usedQty: 4   },
      { name: "น้ำ",     totalQty: 6000, totalPrice: 41,  usedQty: 35  },
      { name: "นมสด",    totalQty: 2000, totalPrice: 98,  usedQty: 110 },
      { name: "Syrup",   totalQty: 1000, totalPrice: 560, usedQty: 15  },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 55, delivery1: 135 },
  },
  {
    name: "Thai Tea",
    ingredients: [
      { name: "ผงชาไทย",   totalQty: 900,  totalPrice: 130, usedQty: 19 },
      { name: "นมจืดสด",   totalQty: 1000, totalPrice: 58,  usedQty: 40 },
      { name: "นมข้นหวาน", totalQty: 2000, totalPrice: 115, usedQty: 40 },
      { name: "ฝองนม",     totalQty: 1000, totalPrice: 98,  usedQty: 10 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 50 },
  },
  {
    name: "Earl Grey Tea",
    ingredients: [
      { name: "ผงชาเอิร์ลเกรย์", totalQty: 320,  totalPrice: 318, usedQty: 15  },
      { name: "น้ำ",              totalQty: 6000, totalPrice: 41,  usedQty: 120 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 50 },
  },
  {
    name: "Cocoa",
    ingredients: [
      { name: "ผงโกโก้",   totalQty: 1000, totalPrice: 670, usedQty: 16 },
      { name: "น้ำ",       totalQty: 6000, totalPrice: 41,  usedQty: 75 },
      { name: "นมจืดสด",   totalQty: 1000, totalPrice: 58,  usedQty: 40 },
      { name: "นมข้นหวาน", totalQty: 2000, totalPrice: 115, usedQty: 40 },
      { name: "ฝองนม",     totalQty: 1000, totalPrice: 98,  usedQty: 10 },
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 40, delivery1: 70 },
  },
  {
    name: "Fruit Punch",
    ingredients: [
      // หัวเชื้อ 1372ml (น้ำส้ม 500ml + น้ำตาล+น้ำหวาน+มะนาว + โซดา 162ml) → ใช้ 45ml/แก้ว
      { name: "น้ำส้ม",   totalQty: 700,  totalPrice: 202, usedQty: 16 }, // 500/1372×45≈16ml จากขวด 700ml
      { name: "น้ำตาล",  totalQty: 1372, totalPrice: 30,  usedQty: 45 }, // 30฿/batch → ต่อแก้ว 0.98฿
      { name: "น้ำหวาน", totalQty: 1372, totalPrice: 67,  usedQty: 45 }, // 67฿/batch → ต่อแก้ว 2.20฿
      { name: "มะนาว",   totalQty: 1372, totalPrice: 150, usedQty: 45 }, // 150฿/batch → ต่อแก้ว 4.92฿
      { name: "โซดา",    totalQty: 7800, totalPrice: 178, usedQty: 95 }, // 162ml(หัวเชื้อ)÷1372×45+90ml ≈95ml
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 30 },
  },
];
