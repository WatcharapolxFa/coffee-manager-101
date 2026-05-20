import { getMonthlyOverhead, saveMonthlyOverhead } from '../storage.ts';
import { thb, escapeHtml } from '../utils.ts';
import type { OverheadItem } from '../types/index.ts';

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

let ohYear  = new Date().getFullYear();
let ohMonth = new Date().getMonth() + 1;
let ohItems: OverheadItem[] = [];

export function renderOverhead(): void {
  ohItems = getMonthlyOverhead(ohYear, ohMonth);
  _render();
}

export function setOverheadMonth(year: number | null, month: number | null): void {
  if (year  !== null) ohYear  = year;
  if (month !== null) ohMonth = month;
  ohItems = getMonthlyOverhead(ohYear, ohMonth);
  _render();
}

export function addOverheadRow(): void {
  ohItems.push({ name: '', amount: 0 });
  _renderRows();
  _renderTotal();
}

export function removeOverheadRow(i: number): void {
  ohItems.splice(i, 1);
  _renderRows();
  _renderTotal();
}

export function onOverheadChange(i: number, field: keyof OverheadItem, val: string | number): void {
  ohItems[i] = { ...ohItems[i], [field]: val } as OverheadItem;
  _renderTotal();
}

export function saveAllOverhead(): void {
  saveMonthlyOverhead(ohYear, ohMonth, ohItems.map(h => ({ ...h })));
  const btn = document.getElementById('overhead-save-all-btn') as HTMLButtonElement | null;
  if (!btn) return;
  const orig = btn.textContent ?? '';
  btn.textContent = '✅ บันทึกแล้ว';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
}

function _render(): void {
  const container = document.getElementById('overhead-container');
  if (!container) return;

  const now   = new Date();
  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  container.innerHTML = `
    <div class="card" style="margin-bottom:12px">
      <div class="card-title">เลือกเดือน</div>
      <div class="form-row">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">เดือน</label>
          <select class="form-control" onchange="app.setOverheadMonth(null, +this.value)">
            ${MONTH_NAMES.map((n, i) => `<option value="${i + 1}" ${i + 1 === ohMonth ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">ปี</label>
          <select class="form-control" onchange="app.setOverheadMonth(+this.value, null)">
            ${years.map(y => `<option value="${y}" ${y === ohYear ? 'selected' : ''}>${y}</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">ค่าใช้จ่ายรายเดือน — ${MONTH_NAMES[ohMonth - 1]} ${ohYear}</div>
      <table class="hc-table">
        <thead><tr>
          <th>รายการ</th>
          <th style="text-align:right">จำนวน (฿)</th>
          <th></th>
        </tr></thead>
        <tbody id="oh-items-tbody"></tbody>
      </table>
      <button class="btn btn-secondary btn-sm mt-8" onclick="app.addOverheadRow()">+ เพิ่มรายการ</button>
      <div class="oh-sum-row oh-sum-total" style="margin-top:14px;border-radius:var(--r-sm);padding:12px 14px">
        <span>รวมต้นทุนแฝงเดือนนี้</span>
        <span id="oh-total"></span>
      </div>
    </div>`;

  _renderRows();
  _renderTotal();
}

function _renderRows(): void {
  const tbody = document.getElementById('oh-items-tbody');
  if (!tbody) return;

  if (ohItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:14px;color:var(--ink-mute);font-size:13px">ยังไม่มีรายการ — กดเพิ่มรายการด้านล่าง</td></tr>`;
    return;
  }

  tbody.innerHTML = ohItems.map((h, i) => `
    <tr>
      <td><input class="overhead-name" type="text"
          value="${escapeHtml(h.name || '')}" placeholder="เช่น ค่าไฟ, ค่าน้ำแข็ง, ค่าแรง"
          onchange="app.onOverheadChange(${i}, 'name', this.value)"></td>
      <td><input class="overhead-amt" type="number"
          value="${h.amount > 0 ? h.amount : ''}" placeholder="0" step="1" min="0"
          onchange="app.onOverheadChange(${i}, 'amount', +this.value)"></td>
      <td><button class="del-btn" onclick="app.removeOverheadRow(${i})">✕</button></td>
    </tr>`).join('');
}

function _renderTotal(): void {
  const el = document.getElementById('oh-total');
  if (!el) return;
  const total = ohItems.reduce((s, h) => s + (Number(h.amount) || 0), 0);
  el.textContent = thb(total);
}
