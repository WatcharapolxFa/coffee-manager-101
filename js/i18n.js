const DICT = {
  th: {
    'nav.dashboard': 'ภาพรวม',
    'nav.sales':     'บันทึกขาย',
    'nav.menus':     'เมนู',
    'nav.overhead':  'ต้นทุนแฝง',
    'nav.report':    'รายงาน',

    'dash.monthly_revenue': 'ยอดขายเดือนนี้',
    'dash.cups_sold':       'แก้วที่ขาย',
    'dash.est_profit':      'กำไรโดยประมาณ',
    'dash.daily_sales':     'ยอดขายรายวัน (เดือนนี้)',
    'dash.top_menus':       'เมนูขายดี 🏆',
    'dash.no_sales':        'ยังไม่มีข้อมูลยอดขาย',
    'dash.cups_unit':       'แก้ว',

    'sales.order':         '🛒 ออเดอร์',
    'sales.clear':         'ล้าง',
    'sales.total':         'รวม',
    'sales.confirm_order': '✅ บันทึกออเดอร์',
    'sales.today_records': 'บันทึกวันนี้',
    'sales.no_menus':      'ยังไม่มีเมนู กรุณาเพิ่มเมนูก่อน',
    'sales.no_sales':      'ยังไม่มียอดขาย',
    'sales.per_cup':       '/แก้ว',
    'sales.delete':        'ลบ',
    'sales.confirm_delete':'ลบรายการนี้?',

    'menus.all_menus':      'เมนูทั้งหมด',
    'menus.add':            '+ เพิ่มเมนู',
    'menus.no_menus':       'ยังไม่มีเมนู กด "+ เพิ่มเมนู" เพื่อเริ่มต้น',
    'menus.cost':           'ต้นทุน',
    'menus.add_new':        '+ เพิ่มเมนูใหม่',
    'menus.edit_title':     '✏️ แก้ไขเมนู',
    'menus.name_label':     'ชื่อเมนู',
    'menus.name_ph':        'เช่น Iced Cafe Latte',
    'menus.ingredients':    'วัตถุดิบ',
    'menus.add_ing':        '+ เพิ่มวัตถุดิบ',
    'menus.packaging':      'บรรจุภัณฑ์ Delivery',
    'menus.add_pkg':        '+ เพิ่มบรรจุภัณฑ์',
    'menus.calc_preview':   'ราคาคำนวณ (preview)',
    'menus.cancel':         'ยกเลิก',
    'menus.save':           '💾 บันทึก',
    'menus.close':          'ปิด',
    'menus.edit_btn':       '✏️ แก้ไขเมนู',
    'menus.raw_cost':       'ต้นทุนวัตถุดิบ',
    'menus.hidden_total':   '+ ต้นทุนแฝงรวม',
    'menus.base_cost':      'ต้นทุนรวม/แก้ว',
    'menus.cost_title':     '🧮 ต้นทุน',
    'menus.pkg_waste_label':'บรรจุภัณฑ์ + Waste',
    'menus.delivery_cost':  'ต้นทุนรวม Delivery',
    'menus.pre_vat':        'ก่อน VAT',
    'menus.ing_detail':     'รายละเอียดวัตถุดิบ',
    'menus.col_num':        '#',
    'menus.col_ing':        'วัตถุดิบ',
    'menus.col_pkg':        'บรรจุภัณฑ์',
    'menus.col_total_qty':  'ปริมาณทั้งหมด',
    'menus.col_total_price':'ราคาทั้งหมด (฿)',
    'menus.col_used':       'ที่ใช้',
    'menus.col_used_total': 'ที่ใช้/ทั้งหมด',
    'menus.col_cost':       'ต้นทุน',
    'menus.multiplier':     'ตัวคูณ',
    'menus.required_name':  'กรุณาใส่ชื่อเมนู',
    'menus.confirm_delete': 'ลบเมนู "{name}" ?',
    'menus.ing_ph':         'ชื่อวัตถุดิบ',
    'menus.pkg_ph':         'ชื่อบรรจุภัณฑ์',

    'overhead.no_menus':   'ยังไม่มีเมนู กรุณาเพิ่มเมนูก่อน',
    'overhead.col_item':   'รายการ',
    'overhead.col_cup':    '฿/แก้ว',
    'overhead.add_row':    '+ เพิ่มรายการ',
    'overhead.raw_cost':   'ต้นทุนวัตถุดิบ',
    'overhead.hidden':     '+ ต้นทุนแฝง',
    'overhead.total_cup':  'รวม/แก้ว',
    'overhead.save_all':   '💾 บันทึกทั้งหมด',
    'overhead.saved':      '✅ บันทึกแล้ว',
    'overhead.cost_ph':    'เช่น ค่าแรง',

    'report.no_sales':      'ยังไม่มีข้อมูลยอดขายในเดือนนี้',
    'report.total_revenue': 'รายได้รวม',
    'report.total_cups':    'แก้วรวม',
    'report.est_profit':    'กำไรโดยประมาณ',
    'report.daily_sales':   'ยอดขายรายวัน (฿)',
    'report.by_menu':       'สัดส่วนยอดขายตามเมนู',
    'report.summary':       'สรุปตามเมนู',
    'report.col_menu':      'เมนู',
    'report.col_cups':      'แก้ว',
    'report.col_revenue':   'รายได้',
    'report.col_cost':      'ต้นทุน',
    'report.col_profit':    'กำไร',

    'nav.purchases':   'ซื้อวัตถุดิบ',

    'purchase.add_title':      '+ เพิ่มรายการซื้อ',
    'purchase.today_records':  'รายการวันนี้',
    'purchase.no_items':       'ยังไม่มีรายการซื้อ',
    'purchase.delete':         'ลบ',
    'purchase.confirm_delete': 'ลบรายการนี้?',
    'purchase.required_name':  'กรุณาใส่ชื่อวัตถุดิบ',
    'purchase.required_qty':   'กรุณาใส่จำนวน',
    'purchase.required_price': 'กรุณาใส่ราคา',
    'purchase.add_btn':        '+ เพิ่มรายการ',
    'purchase.name_label':     'ชื่อวัตถุดิบ',
    'purchase.name_ph':        'เช่น เมล็ดกาแฟ, นมสด',
    'purchase.qty_label':      'จำนวน',
    'purchase.unit_label':     'หน่วย',
    'purchase.price_label':    'ราคารวม (฿)',
    'purchase.note_label':     'หมายเหตุ (ไม่บังคับ)',
    'purchase.note_ph':        'เช่น ซื้อจากร้าน X',
    'purchase.cancel':         'ยกเลิก',
    'purchase.save':           '💾 บันทึก',
    'purchase.total_spend':    'รวมค่าใช้จ่าย',

    'month.1':  'มกราคม',    'month.2':  'กุมภาพันธ์', 'month.3':  'มีนาคม',
    'month.4':  'เมษายน',    'month.5':  'พฤษภาคม',    'month.6':  'มิถุนายน',
    'month.7':  'กรกฎาคม',   'month.8':  'สิงหาคม',    'month.9':  'กันยายน',
    'month.10': 'ตุลาคม',    'month.11': 'พฤศจิกายน',  'month.12': 'ธันวาคม',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.sales':     'Sales',
    'nav.menus':     'Menus',
    'nav.overhead':  'Overhead',
    'nav.report':    'Report',

    'dash.monthly_revenue': "This Month's Sales",
    'dash.cups_sold':       'Cups Sold',
    'dash.est_profit':      'Est. Profit',
    'dash.daily_sales':     'Daily Sales (This Month)',
    'dash.top_menus':       'Top Selling 🏆',
    'dash.no_sales':        'No sales data yet',
    'dash.cups_unit':       'cups',

    'sales.order':         '🛒 Order',
    'sales.clear':         'Clear',
    'sales.total':         'Total',
    'sales.confirm_order': '✅ Confirm Order',
    'sales.today_records': "Today's Records",
    'sales.no_menus':      'No menus yet. Please add menus first.',
    'sales.no_sales':      'No sales yet',
    'sales.per_cup':       '/cup',
    'sales.delete':        'Delete',
    'sales.confirm_delete':'Delete this entry?',

    'menus.all_menus':      'All Menus',
    'menus.add':            '+ Add Menu',
    'menus.no_menus':       'No menus yet. Tap "+ Add Menu" to start.',
    'menus.cost':           'Cost',
    'menus.add_new':        '+ Add New Menu',
    'menus.edit_title':     '✏️ Edit Menu',
    'menus.name_label':     'Menu Name',
    'menus.name_ph':        'e.g. Iced Cafe Latte',
    'menus.ingredients':    'Ingredients',
    'menus.add_ing':        '+ Add Ingredient',
    'menus.packaging':      'Delivery Packaging',
    'menus.add_pkg':        '+ Add Packaging',
    'menus.calc_preview':   'Calculated Price (preview)',
    'menus.cancel':         'Cancel',
    'menus.save':           '💾 Save',
    'menus.close':          'Close',
    'menus.edit_btn':       '✏️ Edit Menu',
    'menus.raw_cost':       'Ingredient Cost',
    'menus.hidden_total':   '+ Total Hidden Costs',
    'menus.base_cost':      'Total Cost/Cup',
    'menus.cost_title':     '🧮 Cost Detail',
    'menus.pkg_waste_label':'Packaging + Waste',
    'menus.delivery_cost':  'Total Delivery Cost',
    'menus.pre_vat':        'Pre-VAT',
    'menus.ing_detail':     'Ingredient Detail',
    'menus.col_num':        '#',
    'menus.col_ing':        'Ingredient',
    'menus.col_pkg':        'Packaging',
    'menus.col_total_qty':  'Total Qty',
    'menus.col_total_price':'Total Price (฿)',
    'menus.col_used':       'Used',
    'menus.col_used_total': 'Used/Total',
    'menus.col_cost':       'Cost',
    'menus.multiplier':     'Multiplier',
    'menus.required_name':  'Please enter a menu name',
    'menus.confirm_delete': 'Delete menu "{name}"?',
    'menus.ing_ph':         'Ingredient name',
    'menus.pkg_ph':         'Packaging name',

    'overhead.no_menus':   'No menus yet. Please add menus first.',
    'overhead.col_item':   'Item',
    'overhead.col_cup':    '฿/cup',
    'overhead.add_row':    '+ Add Item',
    'overhead.raw_cost':   'Ingredient Cost',
    'overhead.hidden':     '+ Hidden Costs',
    'overhead.total_cup':  'Total/Cup',
    'overhead.save_all':   '💾 Save All',
    'overhead.saved':      '✅ Saved',
    'overhead.cost_ph':    'e.g. Labor',

    'report.no_sales':      'No sales data for this month',
    'report.total_revenue': 'Total Revenue',
    'report.total_cups':    'Total Cups',
    'report.est_profit':    'Est. Profit',
    'report.daily_sales':   'Daily Sales (฿)',
    'report.by_menu':       'Sales by Menu',
    'report.summary':       'Summary by Menu',
    'report.col_menu':      'Menu',
    'report.col_cups':      'Cups',
    'report.col_revenue':   'Revenue',
    'report.col_cost':      'Cost',
    'report.col_profit':    'Profit',

    'nav.purchases':   'Purchases',

    'purchase.add_title':      '+ Add Purchase',
    'purchase.today_records':  "Today's Purchases",
    'purchase.no_items':       'No purchases yet',
    'purchase.delete':         'Delete',
    'purchase.confirm_delete': 'Delete this entry?',
    'purchase.required_name':  'Please enter ingredient name',
    'purchase.required_qty':   'Please enter quantity',
    'purchase.required_price': 'Please enter price',
    'purchase.add_btn':        '+ Add Item',
    'purchase.name_label':     'Ingredient Name',
    'purchase.name_ph':        'e.g. Coffee Beans, Milk',
    'purchase.qty_label':      'Quantity',
    'purchase.unit_label':     'Unit',
    'purchase.price_label':    'Total Price (฿)',
    'purchase.note_label':     'Note (optional)',
    'purchase.note_ph':        'e.g. From shop X',
    'purchase.cancel':         'Cancel',
    'purchase.save':           '💾 Save',
    'purchase.total_spend':    'Total Spending',

    'month.1':  'January',   'month.2':  'February',  'month.3':  'March',
    'month.4':  'April',     'month.5':  'May',        'month.6':  'June',
    'month.7':  'July',      'month.8':  'August',     'month.9':  'September',
    'month.10': 'October',   'month.11': 'November',   'month.12': 'December',
  },
};

let _lang = localStorage.getItem('app_lang') || 'th';

export function t(key, vars) {
  let str = DICT[_lang]?.[key] ?? DICT.th[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  }
  return str;
}

export function getLang() { return _lang; }

export function setLang(lang) {
  _lang = lang;
  localStorage.setItem('app_lang', lang);
  document.documentElement.lang = lang;
  _applyStatic();
  window.dispatchEvent(new Event('langchange'));
}

export function applyStatic() { _applyStatic(); }

function _applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === _lang);
  });
}
