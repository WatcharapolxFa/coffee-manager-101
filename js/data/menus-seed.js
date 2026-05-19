// ============================================================
//  menus-seed.js — รายการเมนูทั้งหมดของร้าน
//
//  วิธีเพิ่มเมนูใหม่: copy block ด้านล่างแล้ว paste ต่อท้าย array
//  วิธี reload: กดปุ่ม "🔄 โหลดเมนูจาก template" ในหน้าเมนู
// ============================================================

export const SEED_MENUS = [

  // ── 1. Iced Cafe Latte ──────────────────────────────────────
  {
    name: 'Iced Cafe Latte',
    ingredients: [
      { name: 'เมล็ดกาแฟคั่วเข้ม (Dark Roasted)', totalQty: 1000, totalPrice: 550,   usedQty: 17 },
      { name: 'นมสด',                              totalQty: 2000, totalPrice: 99.75, usedQty: 50 },
      { name: 'นมจืดสด',                           totalQty: 1000, totalPrice: 58,    usedQty: 35 },
      { name: 'นมข้นหวาน',                         totalQty: 2000, totalPrice: 115,   usedQty: 35 },
      { name: 'น้ำ',                               totalQty: 6000, totalPrice: 41,    usedQty: 75 },
    ],
    packaging: [
      { name: 'หลอด',              totalQty: 200, totalPrice: 50, usedQty: 1 },
      { name: 'กระดาษปิดปากแก้ว', totalQty: 200, totalPrice: 20, usedQty: 1 },
      { name: 'ฝาเรียบ',           totalQty: 50,  totalPrice: 50, usedQty: 1 },
      { name: 'แก้ว',              totalQty: 50,  totalPrice: 50, usedQty: 1 },
    ],
    hiddenCosts:    [],
    vat:            30,
    packagingWaste: 5,
    company1GP:     1.7,
    company2GP:     1.5,
  },

  // ── เพิ่มเมนูใหม่ตรงนี้ ──────────────────────────────────────
  // {
  //   name: 'ชื่อเมนู',
  //   ingredients: [
  //     { name: 'วัตถุดิบ', totalQty: 0, totalPrice: 0, usedQty: 0 },
  //   ],
  //   packaging: [
  //     { name: 'แก้ว', totalQty: 50, totalPrice: 50, usedQty: 1 },
  //   ],
  //   hiddenCosts:    [],
  //   vat:            30,
  //   packagingWaste: 5,
  //   company1GP:     1.7,
  //   company2GP:     1.5,
  // },

];
