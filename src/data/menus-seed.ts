import { LINEMAN_TO_INSTORE, PRICE_STEP } from '@/lib/config';
import type { MenuInput } from '@/lib/types';

// Cost recipes for the menus whose ingredients are known. Names match CATALOG below.
const RECIPES: Omit<MenuInput, 'id' | 'category' | 'description' | 'featured' | 'visible'>[] = [
  {
    name: "Latte",
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
    name: "Americano",
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
    name: "Espresso",
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
    name: "Cappuccino",
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
    name: "Mocca",
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
    name: "Matcha Latte",
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
    name: "Earl Grey",
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
    sellPrice: { instore: 35 },
  },
  {
    name: "Premium Cocoa",
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
    name: "Punch Soda",
    // สูตรหัวเชื้อ: น้ำส้ม 500ml + น้ำตาล + น้ำหวาน + มะนาว → รวม ~1,372ml / ใช้ 45ml/cup (~30 cups)
    // โซดา: 7,800ml (24 ขวด) ราคา 178 บาท / ใช้ 90ml/cup
    ingredients: [
      { name: "น้ำส้ม",   totalQty: 700,  totalPrice: 202, usedQty: 16  }, // 202฿/700ml, ใช้ 16ml/cup
      { name: "น้ำตาล",   totalQty: 1000, totalPrice: 30,  usedQty: 33  }, // 30฿/kg, ใช้ 33g/cup
      { name: "น้ำหวาน",  totalQty: 450,  totalPrice: 67,  usedQty: 15  }, // 67฿/450ml, ใช้ 15ml/cup
      { name: "มะนาว",    totalQty: 1000, totalPrice: 150, usedQty: 33  }, // 150฿/kg, ใช้ 33g/cup
      { name: "โซดา",     totalQty: 7800, totalPrice: 178, usedQty: 90  }, // 24 ขวด/7,800ml, ใช้ 90ml/cup
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
  {
    name: "Caramel Macchiato",
    ingredients: [
      { name: "เมล็ดกาแฟคั่วเข้ม (Medium Roasted)", totalQty: 1000, totalPrice: 550,   usedQty: 17 },
      { name: "น้ำ",           totalQty: 6000, totalPrice: 41,    usedQty: 75 },
      { name: "นมสด",          totalQty: 2000, totalPrice: 99.75, usedQty: 50 },
      { name: "นมจืดสด",       totalQty: 1000, totalPrice: 58,    usedQty: 35 },
      { name: "ซอสคาราเมล",    totalQty: 740,  totalPrice: 140,   usedQty: 30 }, // 140฿/740ml, ใช้ 30ml/cup
    ],
    packaging: [
      { name: "หลอด",             totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: "กระดาษปิดปากแก้ว", totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: "ฝาเรียบ",          totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: "แก้ว",             totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts: [], vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
    sellPrice: { instore: 55 },
  },
];

// Customer-facing menu, copied from the shop's LINE MAN page (Sunshine coffee).
// `lineman` is the LINE MAN price (delivery2). The store price is LINE MAN ÷ 1.5 rounded up to 5 baht, unless `instore` sets it.
const CATALOG: { category: string; name: string; description: string; lineman: number; instore?: number; featured?: boolean }[] = [
  { category: "Matcha", name: "Matcha Latte", lineman: 130,
    description: "ทางร้านใช้ matcha taste ที่มีความถั่วชัด เข้มข้น และมีความนัวค่ะ หวานกำลังดี ได้ความหอมของชาเขียวในทุกแก้ว🍵💚" },
  { category: "Matcha", name: "Clear Matcha", lineman: 90, instore: 70,
    description: "ทางร้านใช้ matcha taste ที่มีความถั่วชัด เข้มข้น ดื่มง่ายไม่ฝาดและไม่ขมค่ะ🍵💚" },
  { category: "Matcha", name: "Coconut Matcha", lineman: 120,
    description: "มัทฉะหอมละมุน ผสานกับน้ำมะพร้าวหอมหวานสดชื่น ได้รสชาเขียวที่นุ่มและเบาสบาย ดื่มง่าย ไม่ฝาดไม่ขม 🥥🍵" },
  { category: "Matcha", name: "Matcha Strawberry", lineman: 150,
    description: "มัทฉะหอมละมุน ผสมความสดชื่นจาก strawberry syrup ดื่มง่าย ไม่ฝาดไม่ขม" },
  { category: "Coffee", name: "Americano", lineman: 70, featured: true,
    description: "🔥 กาแฟดำหอม ๆ รสชาติเข้มกำลังดี ดื่มง่าย สดชื่น เหมาะสำหรับวันสบาย ๆ ที่อยากได้กาแฟสักแก้วลองเมนูนี้ได้เลยค่ะะ" },
  { category: "Coffee", name: "Espresso", lineman: 75,
    description: "☕️ กาแฟเอสเพรสโซ่รสเข้ม หอมกาแฟชัดเจน รสชาติกลมกล่อม เหมาะสำหรับคนที่ชอบกาแฟแบบเข้มข้น กาแฟชัด ค่ะ" },
  { category: "Coffee", name: "Latte", lineman: 80,
    description: "กาแฟนมหอมนุ่ม รสชาติละมุน กลมกล่อม ดื่มง่าย ได้ความหอมของกาแฟพอดี ๆ" },
  { category: "Coffee", name: "Caramel Macchiato", lineman: 90,
    description: "กาแฟหอมเข้ม ผสมนมและคาราเมลหวานละมุน หอมกลมกล่อม ดื่มง่าย สายกาแฟแต่ต้องการเติมความหวานตัวนี้แนะนำเลยค่ะ 🤎" },
  { category: "Coffee", name: "Mocca", lineman: 80,
    description: "กาแฟหอมเข้มกับโกโก้ หวานนิด ๆ กลมกล่อมลงตัว ได้ทั้งความหอมของกาแฟและโกโก้ในแก้วเดียว 🤎" },
  { category: "Coffee", name: "Cappuccino", lineman: 75,
    description: "กาแฟหอมเข้ม ผสานกับนมนุ่มละมุนและฟองนมเนียน ๆ รสชาติกลมกล่อม ดื่มง่าย หอมกาแฟกำลังดี ☕️" },
  { category: "Coffee", name: "Americano Coconut", lineman: 85,
    description: "กาแฟอเมริกาโน่หอมเข้มเติมความหวานสดชื่นของน้ำมะพร้าว ได้รสกาแฟที่นุ่มและสดชื่น ดื่มง่ายลงตัว 🥥☕️" },
  { category: "Coffee", name: "Iced Orange Americano", lineman: 85,
    description: "กาแฟอเมริกาโน่ที่เพิ่มความสดชื่นด้วยส้ม ดื่มแล้วสดชื่น ลงตัวแบบพอดี ๆ 🍊☕️" },
  { category: "Coffee", name: "Vanilla Latte", lineman: 90,
    description: "กาแฟลาเต้หอมนุ่ม ผสานความหวานละมุนและกลิ่นหอมของวานิลลา รสชาตินุ่มนวล ดื่มง่าย เหมาะกับวันสบาย ๆ 🤍☕️" },
  { category: "Coffee", name: "Latte Mint", lineman: 75,
    description: "" },
  { category: "Coffee", name: "Americano with Honey & Lime", lineman: 75,
    description: "กาแฟอเมริกาโน่ที่เพิ่มความสดชื่นด้วยมะนาวแท้ๆ ดื่มง่าย สดชื่น" },
  { category: "Cocoa", name: "Premium Cocoa", lineman: 70, instore: 40, featured: true,
    description: "โกโก้รสเข้ม หอมละมุน ผสานกับนมนุ่ม ๆ รสชาติกลมกล่อม หวานกำลังดีค่ะ 🍫🤎" },
  { category: "Cocoa", name: "Premium Cocoa Mint", lineman: 80, instore: 60,
    description: "โกโก้รสเข้ม หอมละมุน เติมความสดชื่นด้วยมิ้นต์เย็น ๆ หวานกำลังดี ได้ทั้งความเข้มของโกโก้และความสดชื่นในแก้วเดียว 🍫🌿" },
  { category: "Cocoa", name: "Premium Cocoa & Strawberry", lineman: 75, instore: 60,
    description: "🔥โกโก้ premium เข้มข้น ผสมกับ strawberry ที่หวาน มีความเปรี้ยวเล็กน้อยเพิ่มความสดชื่น" },
  { category: "Cocoa", name: "Premium Cocoa with Thai Tea", lineman: 90,
    description: "ชาไทยหอมเข้ม ผสานกับโกโก้รสละมุน ได้ทั้งความหอมของชาและความเข้มของโกโก้ในแก้วเดียว หวานมัน กลมกล่อมลงตัว 🧡🍫" },
  { category: "Tea", name: "Thai Tea", lineman: 70,
    description: "ชาไทยหอมเข้ม ผสานกับนมนุ่มละมุน หวานมันกำลังดี ได้รสชาไทยกลมกล่อมแบบคลาสสิก 🧡" },
  { category: "Tea", name: "Earl Grey", lineman: 60,
    description: "ชาเอิร์ลเกรย์หอมละมุน มีกลิ่นซิตรัสอ่อน ๆ เป็นเอกลักษณ์ รสชาติเบาสบาย ดื่มได้ทุกเวลา🫖" },
  { category: "Tea", name: "Earl grey honey lemon", lineman: 65,
    description: "ชาเอิร์ลเกรย์หอมละมุน ผสานน้ำผึ้งหวานนุ่มและเลมอนอมเปรี้ยว สดชื่น หอมเบา ๆ ดื่มง่ายลงตัว 🍯🍋🫖 (ทางร้านใช้แค่น้ำผึ้งไม่ได้เติมความหวานจาก syrup เพิ่มค่ะ)" },
  { category: "Tea", name: "Black Tea", lineman: 50,
    description: "ชาดำหอมเข้ม รสชาชัดเจน หวานกำลังดี ดื่มง่าย สดชื่น เหมาะสำหรับคนที่ชอบชาหอม ๆ แบบเรียบง่าย 🫖✨" },
  { category: "Tea", name: "Thai Tea with Premium Cocoa", lineman: 90,
    description: "ชาไทยหอมเข้ม ผสานกับโกโก้รสละมุน ได้ทั้งความหอมของชาและความเข้มของโกโก้ในแก้วเดียว หวานมัน กลมกล่อมลงตัว 🧡🍫" },
  { category: "Tea", name: "Black Tea Lime", lineman: 55,
    description: "" },
  { category: "Soda", name: "Punch Soda", lineman: 60,
    description: "พันซ์ผลไม้รสหวานอมเปรี้ยว ไม่มีแอลกอฮอล์นะคะแต่จะเติมความซ่าด้วยโซดา หอมสดชื่น ดื่มง่าย เหมาะกับวันร้อน ๆ 🍹✨" },
  { category: "Soda", name: "บ๊วยโซดา", lineman: 60,
    description: "สายบ๊วยแนะนำค่ะ บ๊วยหอม ๆ หวานกำลังดี มีความซ่าของโซดา สดชื่น ดื่มเพลิน ช่วยเติมความสดใสระหว่างวัน 🍑✨" },
  { category: "Milk", name: "Milk Caramel", lineman: 55,
    description: "นมสดหอมนุ่ม ผสานคาราเมลหวานละมุน รสชาติกลมกล่อม หอมหวานกำลังดี ดื่มง่ายได้ทุกเวลา 🥛🤎" },
  { category: "Milk", name: "Pink Milk", lineman: 55,
    description: "นมชมพูหอมหวานละมุน รสนุ่มกลมกล่อม หวานกำลังดี เมนูคลาสสิกที่ดื่มง่ายและสดชื่น 🩷🥛" },
  { category: "Milk", name: "Milk Double Mint", lineman: 60,
    description: "นมสดหอมนุ่ม ผสานความหอมเย็นของมิ้นต์ รสชาติหวานละมุน สดชื่น 🌿🥛" },
  { category: "Milk", name: "Milk Strawberry", lineman: 65,
    description: "" },
];

export function instorePrice(lineman: number): number {
  const raw = lineman / LINEMAN_TO_INSTORE - 1e-9; // epsilon guards float noise like 40.000000001
  return Math.ceil(raw / PRICE_STEP) * PRICE_STEP;
}

const EMPTY_RECIPE = {
  ingredients: [], packaging: [], hiddenCosts: [],
  vat: 30, packagingWaste: 5, company1GP: 1.7, company2GP: 1.5,
};

export const SEED_MENUS: Omit<MenuInput, 'id'>[] = CATALOG.map(item => {
  const recipe = RECIPES.find(r => r.name === item.name);
  return {
    ...EMPTY_RECIPE,
    ...recipe,
    name:        item.name,
    category:    item.category,
    description: item.description,
    featured:    item.featured ?? false,
    visible:     true,
    sellPrice:   { ...recipe?.sellPrice, instore: item.instore ?? instorePrice(item.lineman), delivery2: item.lineman },
  };
});
