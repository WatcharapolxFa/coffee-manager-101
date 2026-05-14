export function thb(n) {
  return '฿' + Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function menuIcon(name, idx) {
  if (/latte|ลาเต/i.test(name))  return '☕';
  if (/matcha|มัทฉะ/i.test(name)) return '🍵';
  if (/choc|โกโก/i.test(name))   return '🍫';
  if (/taro|ชา/i.test(name))     return '🧋';
  if (/fruit|ผล/i.test(name))    return '🍹';
  const icons = ['☕','🧋','🍵','🥤','🍫','🍹','🧃','🌿','🫖','🍶'];
  return icons[idx % icons.length];
}

export function channelLabel(ch) {
  if (ch === 'delivery1') return '<span class="badge badge-delivery1"><img src="assets/grab-logo.svg" style="height:14px;vertical-align:middle"></span>';
  if (ch === 'delivery2') return '<span class="badge badge-delivery2"><img src="assets/lineman-logo.svg" style="height:14px;vertical-align:middle"></span>';
  return '<span class="badge badge-instore">หน้าร้าน</span>';
}
