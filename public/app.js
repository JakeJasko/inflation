(() => {
  'use strict';

  const DEPT_NAMES = {
    11: 'Apparel & Luggage',
    12: 'Bakery & Fresh Bread',
    13: 'Pantry, Dry & Packaged Foods',
    14: 'Household & Paper Goods',
    17: 'Snacks, Candy & Beverages',
    19: 'Frozen & Prepared Foods',
    20: 'Health, Beauty & Pharmacy',
    28: 'Electronics & Media',
    61: 'Meat, Poultry & Seafood',
    62: 'Fresh Produce & Floral',
    63: 'Service Deli & Rotisserie',
    65: 'Dairy, Cheese & Eggs',
    75: 'Automotive & Fuel'
  };

  function getDeptName(deptNum) {
    if (!deptNum) return 'General Warehouse';
    return DEPT_NAMES[deptNum] || `Warehouse Dept #${deptNum}`;
  }

  function formatCurrency(val) {
    const num = Number(val) || 0;
    const sign = num < 0 ? '-' : '';
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  }

  function formatSignedCurrency(val) {
    const num = Number(val) || 0;
    const sign = num > 0 ? '+' : num < 0 ? '-' : '';
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  }

  function formatPct(val, decimals = 1) {
    const num = Number(val) || 0;
    const sign = num > 0.0001 ? '+' : '';
    return `${sign}${num.toFixed(decimals)}%`;
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  }

  // Application State
  const state = {
    source: 'live',
    receipts: [],
    priceMode: 'list', // 'list' | 'net'
    currentView: 'view-attribution',
    selectedSku: null,
    searchQuery: '',
    deptFilter: 'all',
    sortBy: 'spend_desc',
    repeatOnly: true,
    receiptQuery: '',
    exportScriptText: '',
    analytics: null,
    chartPoints: []
  };

  /**
   * Institutional Financial Analysis Engine
   */
  function analyzeReceipts(rawReceipts, priceMode) {
    // Sort chronologically oldest -> newest
    const receiptsChrono = [...rawReceipts].sort((a, b) => {
      const da = new Date(a.transactionDateTime || a.transactionDate || 0).getTime();
      const db = new Date(b.transactionDateTime || b.transactionDate || 0).getTime();
      return da - db;
    });

    const skuMap = new Map();
    let totalInstantSavings = 0;
    let totalGrossSpend = 0;

    for (const receipt of receiptsChrono) {
      const rDateStr = receipt.transactionDateTime || receipt.transactionDate;
      const rDate = new Date(rDateStr);
      const items = Array.isArray(receipt.itemArray) ? receipt.itemArray : [];

      // Pass 1: Extract promo discount rows (e.g., "/1482910")
      const discountsByParent = new Map();
      for (const line of items) {
        const desc1 = String(line.itemDescription01 || '').trim();
        if (line.amount < 0 && desc1.startsWith('/')) {
          const parentSku = desc1.replace(/^\/\s*/, '').trim();
          const prev = discountsByParent.get(parentSku) || 0;
          discountsByParent.set(parentSku, prev + Number(line.amount));
          totalInstantSavings += Math.abs(Number(line.amount) || 0);
        }
      }

      // Pass 2: Regular line items
      for (const line of items) {
        const desc1 = String(line.itemDescription01 || '').trim();
        if (line.amount < 0 && desc1.startsWith('/')) continue;
        if (Number(line.amount) <= 0) continue;

        const sku = String(line.itemNumber || '').trim();
        if (!sku) continue;

        const units = Math.max(Number(line.unit) || 1, 1);
        const grossAmount = Number(line.amount) || 0;
        totalGrossSpend += grossAmount;

        const listUnitPrice =
          Number(line.itemUnitPriceAmount) > 0
            ? Number(line.itemUnitPriceAmount)
            : grossAmount / units;

        const discountForLine = discountsByParent.get(sku) || 0;
        if (discountForLine !== 0) discountsByParent.delete(sku);

        const netAmount = Math.max(grossAmount + discountForLine, 0);
        const netUnitPrice = netAmount / units;

        if (!skuMap.has(sku)) {
          skuMap.set(sku, {
            itemNumber: sku,
            name: desc1 || `Item #${sku}`,
            subName: String(line.itemDescription02 || '').trim(),
            deptNumber: line.itemDepartmentNumber || line.transDepartmentNumber || 0,
            deptName: getDeptName(line.itemDepartmentNumber || line.transDepartmentNumber),
            taxFlag: line.taxFlag || 'N',
            history: []
          });
        }

        const entry = skuMap.get(sku);
        if (!entry.subName && line.itemDescription02) {
          entry.subName = String(line.itemDescription02).trim();
        }

        entry.history.push({
          date: rDateStr,
          timestamp: rDate.getTime(),
          warehouse: receipt.warehouseName || receipt.warehouseShortName || 'CARLSBAD #462',
          barcode: receipt.transactionBarcode || '',
          units,
          grossAmount,
          discountAmount: discountForLine,
          netAmount,
          listUnitPrice,
          netUnitPrice,
          activePrice: priceMode === 'net' ? netUnitPrice : listUnitPrice
        });
      }
    }

    // SKU-Level Metrics & Weighting
    const skuList = [];
    for (const item of skuMap.values()) {
      item.history.sort((a, b) => a.timestamp - b.timestamp);
      const first = item.history[0];
      const latest = item.history[item.history.length - 1];
      const purchaseCount = item.history.length;
      const totalUnits = item.history.reduce((s, h) => s + h.units, 0);
      const totalSpend = item.history.reduce(
        (s, h) => s + (priceMode === 'net' ? h.netAmount : h.grossAmount),
        0
      );

      const firstPrice = first.activePrice;
      const latestPrice = latest.activePrice;
      const absChange = latestPrice - firstPrice;
      const pctChange = firstPrice > 0 ? ((latestPrice - firstPrice) / firstPrice) * 100 : 0;

      const daysSpan = Math.max((latest.timestamp - first.timestamp) / (1000 * 60 * 60 * 24), 0);
      const yearsSpan = daysSpan / 365.25;
      let annualizedPct = pctChange;
      if (yearsSpan >= 0.25 && firstPrice > 0 && latestPrice > 0) {
        annualizedPct = (Math.pow(latestPrice / firstPrice, 1 / yearsSpan) - 1) * 100;
      }

      skuList.push({
        ...item,
        purchaseCount,
        totalUnits,
        totalSpend,
        spendWeight: totalGrossSpend > 0 ? (totalSpend / totalGrossSpend) * 100 : 0,
        firstDate: first.date,
        latestDate: latest.date,
        firstPrice,
        latestPrice,
        absChange,
        pctChange,
        annualizedPct,
        daysSpan,
        annualDollarDrag: absChange * (totalUnits / Math.max(yearsSpan, 1))
      });
    }

    // Repeat Purchase Basket (≥ 2 orders)
    const repeatSkus = skuList.filter((s) => s.purchaseCount >= 2);
    const trackedSkus = repeatSkus.length > 0 ? repeatSkus : skuList;

    let singleUnitBaseCost = 0;
    let singleUnitLatestCost = 0;
    let weightedBaseCost = 0;
    let weightedLatestCost = 0;
    let weightedYearsSum = 0;
    let weightSum = 0;

    for (const s of trackedSkus) {
      singleUnitBaseCost += s.firstPrice;
      singleUnitLatestCost += s.latestPrice;

      weightedBaseCost += s.firstPrice * s.totalUnits;
      weightedLatestCost += s.latestPrice * s.totalUnits;

      const spanYears = Math.max(s.daysSpan / 365.25, 0.5);
      weightedYearsSum += spanYears * (s.firstPrice * s.totalUnits);
      weightSum += s.firstPrice * s.totalUnits;
    }

    const cumulativeBasketInflationPct =
      weightedBaseCost > 0
        ? ((weightedLatestCost - weightedBaseCost) / weightedBaseCost) * 100
        : 0;

    const avgBasketYears = weightSum > 0 ? weightedYearsSum / weightSum : 3.0;
    const annualizedBasketInflationPct =
      weightedBaseCost > 0 && avgBasketYears > 0
        ? (Math.pow(weightedLatestCost / weightedBaseCost, 1 / avgBasketYears) - 1) * 100
        : cumulativeBasketInflationPct;

    const personalCpiIndex = 100 * (1 + cumulativeBasketInflationPct / 100);
    const US_CPI_ANNUAL_RATE = 0.029; // BLS benchmark: 2.9%
    const officialCpiCumulativePct = (Math.pow(1 + US_CPI_ANNUAL_RATE, avgBasketYears) - 1) * 100;

    // Annual Dollar Drag on Repeat Staple Basket
    const grossPriceIncreaseDollars = Math.max(weightedLatestCost - weightedBaseCost, 0);
    const annualDollarDrag = grossPriceIncreaseDollars / Math.max(avgBasketYears, 1);

    // Savings Shield Ratio: What percentage of gross price inflation was absorbed by promo rebates?
    const savingsShieldRatio =
      grossPriceIncreaseDollars > 0
        ? Math.min((totalInstantSavings / grossPriceIncreaseDollars) * 100, 100)
        : totalInstantSavings > 0 ? 100 : 0;

    // CPI Trajectory Time-Series
    const firstReceiptTs =
      receiptsChrono.length > 0
        ? new Date(receiptsChrono[0].transactionDateTime || receiptsChrono[0].transactionDate).getTime()
        : Date.now();

    let baseListBasket = 0;
    let baseNetBasket = 0;
    for (const s of trackedSkus) {
      baseListBasket += s.history[0].listUnitPrice * s.totalUnits;
      baseNetBasket += s.history[0].netUnitPrice * s.totalUnits;
    }

    const cpiSeries = [];
    for (const r of receiptsChrono) {
      const rDateStr = r.transactionDateTime || r.transactionDate;
      const rTs = new Date(rDateStr).getTime();
      let currentListBasket = 0;
      let currentNetBasket = 0;

      for (const s of trackedSkus) {
        let obs = s.history[0];
        for (const h of s.history) {
          if (h.timestamp <= rTs) obs = h;
          else break;
        }
        currentListBasket += obs.listUnitPrice * s.totalUnits;
        currentNetBasket += obs.netUnitPrice * s.totalUnits;
      }

      const yearsFromStart = Math.max((rTs - firstReceiptTs) / (1000 * 60 * 60 * 24 * 365.25), 0);
      const blsIndex = 100 * Math.pow(1 + US_CPI_ANNUAL_RATE, yearsFromStart);

      cpiSeries.push({
        date: rDateStr,
        warehouse: r.warehouseName || 'CARLSBAD #462',
        receiptTotal: Number(r.total) || 0,
        listIndex: baseListBasket > 0 ? (currentListBasket / baseListBasket) * 100 : 100,
        netIndex: baseNetBasket > 0 ? (currentNetBasket / baseNetBasket) * 100 : 100,
        blsIndex
      });
    }

    // Department Breakdown
    const deptMap = new Map();
    for (const s of trackedSkus) {
      if (!deptMap.has(s.deptName)) {
        deptMap.set(s.deptName, {
          deptName: s.deptName,
          skuCount: 0,
          baseCost: 0,
          latestCost: 0
        });
      }
      const d = deptMap.get(s.deptName);
      d.skuCount += 1;
      d.baseCost += s.firstPrice * s.totalUnits;
      d.latestCost += s.latestPrice * s.totalUnits;
    }

    const deptBreakdown = Array.from(deptMap.values())
      .map((d) => ({
        ...d,
        pctChange: d.baseCost > 0 ? ((d.latestCost - d.baseCost) / d.baseCost) * 100 : 0
      }))
      .sort((a, b) => b.pctChange - a.pctChange);

    return {
      skuList,
      repeatSkus,
      trackedSkus,
      totalGrossSpend,
      singleUnitBaseCost,
      singleUnitLatestCost,
      singleUnitExtraSpend: singleUnitLatestCost - singleUnitBaseCost,
      cumulativeBasketInflationPct,
      annualizedBasketInflationPct,
      personalCpiIndex,
      officialCpiCumulativePct,
      annualSpreadVsBls: annualizedBasketInflationPct - US_CPI_ANNUAL_RATE * 100,
      annualDollarDrag,
      totalInstantSavings,
      savingsShieldRatio,
      cpiSeries,
      deptBreakdown
    };
  }

  // UI Renderers
  function renderTerminal() {
    const analytics = analyzeReceipts(state.receipts, state.priceMode);
    state.analytics = analytics;

    // Header badge
    const dot = document.getElementById('statusDot');
    const sourceText = document.getElementById('dataSourceText');
    if (state.source === 'live') {
      dot.className = 'status-indicator live';
      sourceText.textContent = `${state.receipts.length} Live Receipts (Carlsbad)`;
    } else {
      dot.className = 'status-indicator';
      sourceText.textContent = `Carlsbad Preview (${state.receipts.length} Receipts)`;
    }

    // Executive KPI Strip
    document.getElementById('kpiBasisTag').textContent =
      state.priceMode === 'net' ? 'Net Paid Basis' : 'Shelf List Basis';
    document.getElementById('kpiAnnualizedInflation').textContent = formatPct(
      analytics.annualizedBasketInflationPct,
      1
    );
    const cumEl = document.getElementById('kpiCumulativeInflation');
    cumEl.textContent = `${formatPct(analytics.cumulativeBasketInflationPct, 1)} cumulative`;
    cumEl.className = `metric-secondary-badge ${analytics.cumulativeBasketInflationPct > 0 ? 'badge-up' : 'badge-down'}`;

    document.getElementById('kpiPersonalCpiIndex').textContent =
      analytics.personalCpiIndex.toFixed(1);
    const spreadEl = document.getElementById('kpiCpiSpread');
    spreadEl.textContent = `${formatPct(analytics.annualSpreadVsBls, 1)}/yr vs. BLS`;
    spreadEl.className = `metric-secondary-badge ${analytics.annualSpreadVsBls > 0 ? 'badge-up' : 'badge-down'}`;

    document.getElementById('kpiBasketCountPill').textContent =
      `${analytics.trackedSkus.length} Repeat SKUs`;
    document.getElementById('kpiExtraSpend').textContent = formatSignedCurrency(
      analytics.annualDollarDrag
    );
    const basketTotalsEl = document.getElementById('kpiBasketTotals');
    basketTotalsEl.textContent = `${formatCurrency(analytics.singleUnitBaseCost)} → ${formatCurrency(analytics.singleUnitLatestCost)}/run`;

    document.getElementById('kpiShieldRatio').textContent = `${analytics.savingsShieldRatio.toFixed(1)}%`;
    document.getElementById('kpiTotalSavingsCaptured').textContent = `${formatCurrency(analytics.totalInstantSavings)} Saved`;

    // Forward Scenario Planner
    const annualBaseEstimate = analytics.totalGrossSpend / 3;
    const forwardProjection = annualBaseEstimate * (1 + analytics.annualizedBasketInflationPct / 100);
    const forwardDelta = forwardProjection - annualBaseEstimate;
    const annualPromoBuffer = (analytics.totalInstantSavings / 3);

    document.getElementById('scenBaseSpend').textContent = `${formatCurrency(annualBaseEstimate)}/yr`;
    document.getElementById('scenProjectedSpend').textContent = `${formatCurrency(forwardProjection)}/yr`;
    document.getElementById('scenDeltaSpend').textContent = formatSignedCurrency(forwardDelta);
    document.getElementById('scenSavingsBuffer').textContent = `-${formatCurrency(annualPromoBuffer)}/yr buffer`;

    populateDeptSelect(analytics.skuList);
    renderSkuTable();
    renderMacroCpiChart(analytics.cpiSeries);
    renderDeptBreakdown(analytics.deptBreakdown);
    renderReceiptsLedger();
  }

  function populateDeptSelect(skuList) {
    const select = document.getElementById('deptFilterSelect');
    const current = state.deptFilter;
    const depts = Array.from(new Set(skuList.map((s) => s.deptName))).sort();
    select.innerHTML = '<option value="all">All Departments (100% Portfolio)</option>';
    for (const d of depts) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      if (d === current) opt.selected = true;
      select.appendChild(opt);
    }
  }

  function createSparklineSvg(history, isUp) {
    if (!history || history.length < 2) {
      return '<span style="color:var(--text-muted);font-size:0.75rem">1 quotation</span>';
    }
    const w = 90;
    const h = 24;
    const pad = 2;
    const prices = history.map((pt) => pt.activePrice);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;

    const coords = prices.map((p, idx) => {
      const x = pad + (idx / (prices.length - 1)) * (w - pad * 2);
      const y = maxP === minP ? h / 2 : h - pad - ((p - minP) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const stroke =
      maxP === minP
        ? (isDark ? '#94a3b8' : '#64748b')
        : isUp
        ? '#f43f5e'
        : '#10b981';

    const lastPt = coords[coords.length - 1].split(',');

    return `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
        <polyline fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${coords.join(' ')}" />
        <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="2.5" fill="${stroke}" />
      </svg>
    `;
  }

  function renderSkuTable() {
    const tbody = document.getElementById('skuTableBody');
    const q = state.searchQuery.toLowerCase().trim();

    let filtered = state.analytics.skuList.filter((item) => {
      if (state.repeatOnly && item.purchaseCount < 2) return false;
      if (state.deptFilter !== 'all' && item.deptName !== state.deptFilter) return false;
      if (q) {
        const hay = `${item.itemNumber} ${item.name} ${item.subName} ${item.deptName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'spend_desc':
          return b.totalSpend - a.totalSpend;
        case 'pct_desc':
          return b.pctChange - a.pctChange;
        case 'abs_desc':
          return b.absChange - a.absChange;
        case 'pct_asc':
          return a.pctChange - b.pctChange;
        case 'count_desc':
          return b.purchaseCount - a.purchaseCount;
        default:
          return b.totalSpend - a.totalSpend;
      }
    });

    if (
      (!state.selectedSku || !filtered.some((s) => s.itemNumber === state.selectedSku)) &&
      filtered.length > 0
    ) {
      state.selectedSku = filtered[0].itemNumber;
    }

    tbody.innerHTML = '';
    for (const item of filtered) {
      const tr = document.createElement('tr');
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('role', 'button');
      tr.setAttribute('aria-label', `Inspect ${item.name}, Item #${item.itemNumber}`);
      if (item.itemNumber === state.selectedSku) tr.classList.add('selected');

      const pillClass =
        Math.abs(item.pctChange) < 0.05 ? 'flat' : item.pctChange > 0 ? 'up' : 'down';

      tr.innerHTML = `
        <td><span class="sku-badge">#${item.itemNumber}</span></td>
        <td>
          <div class="item-desc-primary">${item.name}</div>
          <div class="item-desc-sub">${item.subName || 'Costco Warehouse Staple'}</div>
        </td>
        <td><span class="dept-tag">${item.deptName.split('&')[0].trim()}</span></td>
        <td class="num-col">${item.spendWeight.toFixed(1)}% <span style="color:var(--text-muted);font-size:0.75rem">(${formatCurrency(item.totalSpend)})</span></td>
        <td class="num-col">${item.purchaseCount}x <span style="color:var(--text-muted);font-size:0.75rem">(${item.totalUnits}u)</span></td>
        <td class="num-col">
          <div>${formatCurrency(item.firstPrice)}</div>
          <div class="item-desc-sub">${formatDateShort(item.firstDate)}</div>
        </td>
        <td class="num-col">
          <div>${formatCurrency(item.latestPrice)}</div>
          <div class="item-desc-sub">${formatDateShort(item.latestDate)}</div>
        </td>
        <td>${createSparklineSvg(item.history, item.pctChange > 0)}</td>
        <td class="num-col" style="color:${item.absChange > 0 ? 'var(--fin-crimson)' : item.absChange < 0 ? 'var(--fin-emerald)' : 'var(--text-muted)'}">
          ${formatSignedCurrency(item.absChange)}
        </td>
        <td class="num-col">
          <span class="inflation-cell-badge ${pillClass}">${formatPct(item.pctChange, 1)}</span>
        </td>
      `;

      function selectRow() {
        state.selectedSku = item.itemNumber;
        renderSkuTable();
        renderItemInspector(item);
      }

      tr.addEventListener('click', selectRow);
      tr.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectRow();
        }
      });

      tbody.appendChild(tr);
    }

    const activeItem =
      state.analytics.skuList.find((s) => s.itemNumber === state.selectedSku) || filtered[0];
    if (activeItem) {
      renderItemInspector(activeItem);
    }
  }

  function renderItemInspector(item) {
    document.getElementById('inspectorSku').textContent = `COSTCO SKU #${item.itemNumber}`;
    document.getElementById('inspectorTitle').textContent = item.name;
    document.getElementById('inspectorSubtitle').textContent = `${item.subName || item.deptName} • ${item.deptName}`;

    const badge = document.getElementById('inspectorDeltaBadge');
    badge.textContent = formatPct(item.pctChange, 1);
    if (Math.abs(item.pctChange) < 0.05) {
      badge.style.background = 'var(--bg-surface-elevated)';
      badge.style.color = 'var(--text-muted)';
    } else if (item.pctChange > 0) {
      badge.style.background = 'var(--fin-crimson-bg)';
      badge.style.color = 'var(--fin-crimson)';
    } else {
      badge.style.background = 'var(--fin-emerald-bg)';
      badge.style.color = 'var(--fin-emerald)';
    }

    document.getElementById('inspFirstPrice').textContent = formatCurrency(item.firstPrice);
    document.getElementById('inspFirstDate').textContent = formatDateShort(item.firstDate);
    document.getElementById('inspLatestPrice').textContent = formatCurrency(item.latestPrice);
    document.getElementById('inspLatestDate').textContent = formatDateShort(item.latestDate);
    document.getElementById('inspAnnualized').textContent = `${formatPct(item.annualizedPct, 1)}/yr`;
    document.getElementById('inspTotalUnits').textContent = `${item.totalUnits} units (${formatCurrency(item.totalSpend)})`;

    document.getElementById('inspectorHistoryCount').textContent = `${item.history.length} transactions`;

    const listEl = document.getElementById('inspectorHistoryList');
    listEl.innerHTML = '';
    const revHistory = [...item.history].reverse();

    for (const h of revHistory) {
      const row = document.createElement('div');
      row.className = 'dossier-history-item';
      const couponHtml =
        h.discountAmount < 0
          ? `<span class="coupon-pill">Promo ${formatCurrency(h.discountAmount)}</span>`
          : '';
      row.innerHTML = `
        <div>
          <div style="font-weight:600">${formatDateShort(h.date)} &bull; <span style="color:var(--text-muted)">${h.warehouse}</span></div>
          <div style="font-size:0.75rem;color:var(--text-muted)">
            Qty: ${h.units} &bull; Shelf: ${formatCurrency(h.listUnitPrice)}/ea ${couponHtml}
          </div>
        </div>
        <div style="text-align:right;font-family:var(--font-mono)">
          <div style="font-weight:700">${formatCurrency(h.activePrice)}<span style="font-size:0.72rem;color:var(--text-muted)">/u</span></div>
          <div style="font-size:0.72rem;color:var(--text-muted)">Total: ${formatCurrency(state.priceMode === 'net' ? h.netAmount : h.grossAmount)}</div>
        </div>
      `;
      listEl.appendChild(row);
    }

    renderItemDetailChart(item);
  }

  function renderMacroCpiChart(series) {
    const canvas = document.getElementById('cpiChartCanvas');
    if (!canvas || series.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = 320;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 20, right: 30, bottom: 36, left: 48 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const allVals = [100];
    for (const pt of series) {
      allVals.push(pt.listIndex, pt.netIndex, pt.blsIndex);
    }
    const minVal = Math.floor(Math.min(...allVals) - 2);
    const maxVal = Math.ceil(Math.max(...allVals) + 3);
    const valSpan = Math.max(maxVal - minVal, 5);

    const xFor = (i) =>
      series.length === 1 ? pad.left + plotW / 2 : pad.left + (i / (series.length - 1)) * plotW;
    const yFor = (v) => pad.top + plotH - ((v - minVal) / valSpan) * plotH;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : '#e2e8f0';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Horizontal grid
    const steps = 4;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    for (let i = 0; i <= steps; i++) {
      const val = minVal + (valSpan * i) / steps;
      const y = yFor(val);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(0), pad.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const stride = Math.max(Math.floor(series.length / 8), 1);
    for (let i = 0; i < series.length; i += stride) {
      const x = xFor(i);
      const d = new Date(series[i].date);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      ctx.fillStyle = textColor;
      ctx.fillText(label, x, height - 12);
    }

    // Draw Lines
    function drawLine(getter, color, dashed = false) {
      ctx.save();
      if (dashed) ctx.setLineDash([5, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      series.forEach((pt, idx) => {
        const x = xFor(idx);
        const y = yFor(getter(pt));
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.restore();
    }

    drawLine((p) => p.blsIndex, '#38bdf8', true);
    drawLine((p) => p.netIndex, '#fbbf24', true);
    drawLine((p) => p.listIndex, '#f43f5e', false);

    state.chartPoints = series.map((pt, idx) => ({
      x: xFor(idx),
      yList: yFor(pt.listIndex),
      ...pt
    }));
  }

  function renderItemDetailChart(item) {
    const canvas = document.getElementById('itemDetailCanvas');
    if (!canvas || !item || item.history.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(rect.width, 220);
    const height = 170;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 16, right: 16, bottom: 26, left: 46 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const hist = item.history;
    const allPrices = [];
    for (const h of hist) allPrices.push(h.listUnitPrice, h.netUnitPrice);
    const minP = Math.min(...allPrices) * 0.94;
    const maxP = Math.max(...allPrices) * 1.06;
    const span = Math.max(maxP - minP, 1);

    const xFor = (i) =>
      hist.length === 1 ? pad.left + plotW / 2 : pad.left + (i / (hist.length - 1)) * plotW;
    const yFor = (p) => pad.top + plotH - ((p - minP) / span) * plotH;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.textAlign = 'right';

    for (let i = 0; i <= 2; i++) {
      const val = minP + (span * i) / 2;
      const y = yFor(val);
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.12)' : '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText(`$${val.toFixed(2)}`, pad.left - 6, y + 3);
    }

    // List line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    hist.forEach((h, idx) => {
      const x = xFor(idx);
      const y = yFor(h.listUnitPrice);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Net line
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    hist.forEach((h, idx) => {
      const x = xFor(idx);
      const y = yFor(h.netUnitPrice);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Dates
    ctx.textAlign = 'center';
    hist.forEach((h, idx) => {
      if (idx === 0 || idx === hist.length - 1 || hist.length <= 4) {
        const x = xFor(idx);
        const d = new Date(h.date);
        ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
        ctx.fillText(
          d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          x,
          height - 6
        );
      }
    });
  }

  function renderDeptBreakdown(deptBreakdown) {
    const container = document.getElementById('deptBreakdownList');
    container.innerHTML = '';
    const maxPct = Math.max(...deptBreakdown.map((d) => Math.abs(d.pctChange)), 10);

    for (const d of deptBreakdown) {
      const widthPct = Math.min(Math.max((Math.abs(d.pctChange) / maxPct) * 100, 6), 100);
      const item = document.createElement('div');
      item.className = 'dept-stat-row';
      item.innerHTML = `
        <div class="dept-stat-top">
          <div>
            <span style="font-weight:600">${d.deptName}</span>
            <span style="color:var(--text-muted);font-size:0.75rem">(${d.skuCount} SKUs)</span>
          </div>
          <span style="font-family:var(--font-mono);font-weight:700;color:${d.pctChange > 0 ? 'var(--fin-crimson)' : 'var(--fin-emerald)'}">
            ${formatPct(d.pctChange, 1)}
          </span>
        </div>
        <div class="dept-bar-frame">
          <div class="dept-bar-fill-elem" style="width: ${widthPct.toFixed(1)}%"></div>
        </div>
      `;
      container.appendChild(item);
    }
  }

  function renderReceiptsLedger() {
    const grid = document.getElementById('receiptsGrid');
    const q = state.receiptQuery.toLowerCase().trim();
    grid.innerHTML = '';

    const filtered = state.receipts.filter((r) => {
      if (!q) return true;
      const itemsText = (r.itemArray || [])
        .map((i) => `${i.itemNumber} ${i.itemDescription01} ${i.itemDescription02}`)
        .join(' ');
      const hay = `${r.warehouseName} ${r.transactionDateTime} ${r.transactionBarcode} ${r.total} ${itemsText}`.toLowerCase();
      return hay.includes(q);
    });

    for (const r of filtered) {
      const card = document.createElement('article');
      card.className = 'ledger-card';
      const items = Array.isArray(r.itemArray) ? r.itemArray : [];

      const linesHtml = items
        .map((line) => {
          const desc = String(line.itemDescription01 || '').trim();
          const isDisc = line.amount < 0 && desc.startsWith('/');
          return `
            <div class="ledger-item-line ${isDisc ? 'discount' : ''}">
              <span>#${line.itemNumber} ${desc} ${line.unit > 1 ? `(x${line.unit})` : ''}</span>
              <span>${formatCurrency(line.amount)} ${line.taxFlag || ''}</span>
            </div>
          `;
        })
        .join('');

      card.innerHTML = `
        <div class="ledger-card-top">
          <div>
            <div class="ledger-warehouse-name">${r.warehouseName || 'CARLSBAD #462'} WAREHOUSE</div>
            <div class="ledger-barcode">${formatDateShort(r.transactionDateTime || r.transactionDate)} &bull; ${r.transactionBarcode || 'N/A'}</div>
          </div>
          <div class="ledger-total">${formatCurrency(r.total)}</div>
        </div>
        <div class="ledger-items-list">${linesHtml}</div>
        <div class="ledger-card-foot">
          <span>Subtotal: ${formatCurrency(r.subTotal)}</span>
          <span>Tax: ${formatCurrency(r.taxes)}</span>
          <span>Instant Sav: ${formatCurrency(r.instantSavings || 0)}</span>
        </div>
      `;
      grid.appendChild(card);
    }
  }

  function setupMainChartHover() {
    const canvas = document.getElementById('cpiChartCanvas');
    const tooltip = document.getElementById('cpiChartTooltip');

    canvas.addEventListener('mousemove', (e) => {
      if (!state.chartPoints || state.chartPoints.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      let closest = state.chartPoints[0];
      let minDist = Math.abs(mouseX - closest.x);
      for (const pt of state.chartPoints) {
        const d = Math.abs(mouseX - pt.x);
        if (d < minDist) {
          minDist = d;
          closest = pt;
        }
      }

      tooltip.hidden = false;
      tooltip.style.left = `${Math.min(Math.max(closest.x - 90, 10), rect.width - 220)}px`;
      tooltip.style.top = '14px';
      tooltip.innerHTML = `
        <div style="font-weight:700;margin-bottom:3px">${formatDateShort(closest.date)} (${closest.warehouse})</div>
        <div style="color:var(--fin-crimson)">Personal CPI (Shelf): <strong>${closest.listIndex.toFixed(1)}</strong></div>
        <div style="color:var(--fin-amber)">Personal CPI (Net): <strong>${closest.netIndex.toFixed(1)}</strong></div>
        <div style="color:var(--fin-cyan)">US BLS Food-at-Home: <strong>${closest.blsIndex.toFixed(1)}</strong></div>
      `;
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.hidden = true;
    });
  }

  function exportSkuCsv() {
    if (!state.analytics || !state.analytics.skuList) return;
    const rows = [
      ['Item #', 'Description', 'Department', 'Spend Weight (%)', 'Purchases', 'Total Units', 'First Price', 'First Date', 'Latest Price', 'Latest Date', 'Dollar Drag ($)', 'Inflation (%)', 'Annualized YoY (%)']
    ];
    for (const item of state.analytics.skuList) {
      rows.push([
        item.itemNumber,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${item.deptName}"`,
        item.spendWeight.toFixed(2),
        item.purchaseCount,
        item.totalUnits,
        item.firstPrice.toFixed(2),
        item.firstDate ? item.firstDate.split('T')[0] : '',
        item.latestPrice.toFixed(2),
        item.latestDate ? item.latestDate.split('T')[0] : '',
        item.absChange.toFixed(2),
        item.pctChange.toFixed(1),
        item.annualizedPct.toFixed(1)
      ]);
    }
    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `costco_sku_portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const viewId = tab.getAttribute('data-view');
        state.currentView = viewId;
        document.querySelectorAll('.terminal-view-pane').forEach((pane) => {
          const isTarget = pane.id === viewId;
          pane.classList.toggle('active', isTarget);
          pane.hidden = !isTarget;
        });

        if (viewId === 'view-macro' && state.analytics) {
          setTimeout(() => renderMacroCpiChart(state.analytics.cpiSeries), 50);
        }
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeLabel = document.getElementById('themeLabelText');
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      themeLabel.textContent = next === 'dark' ? 'Dark Terminal' : 'Executive Light';
      renderTerminal();
    });
  }

  function setupDialog() {
    const dialog = document.getElementById('syncModal');

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      });
    }

    document.getElementById('openSyncModalBtn').addEventListener('click', () => {
      dialog.showModal();
    });

    const tabBtns = dialog.querySelectorAll('.modal-tab');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetId = btn.getAttribute('data-tab');
        dialog.querySelectorAll('.modal-tab-pane').forEach((pane) => {
          const isTarget = pane.id === targetId;
          pane.classList.toggle('active', isTarget);
          pane.hidden = !isTarget;
        });
      });
    });
  }

  function showStatus(msg, isError = false) {
    const el = document.getElementById('syncStatusMessage');
    el.hidden = false;
    el.className = `sync-status-msg ${isError ? 'error' : 'success'}`;
    el.textContent = msg;
  }

  async function loadDataset(mode = 'live') {
    // 1. Try local Node server if running
    try {
      const url = mode === 'demo' ? '/api/receipts?mode=demo' : '/api/receipts';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        state.source = data.source;
        state.receipts = data.receipts;
        renderTerminal();
        return;
      }
    } catch (_) {}

    // 2. Client-side static fallback for GitHub Pages
    if (mode === 'live') {
      const stored = localStorage.getItem('pinflation_user_receipts');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            state.source = 'live';
            state.receipts = parsed;
            renderTerminal();
            return;
          }
        } catch (_) {}
      }
    }

    // 3. Fallback to bundled sample_receipts.json
    try {
      const sampleRes = await fetch('sample_receipts.json');
      if (sampleRes.ok) {
        const sampleData = await sampleRes.json();
        state.source = 'demo';
        state.receipts = sampleData.receipts || sampleData;
        renderTerminal();
      }
    } catch (e) {
      console.warn('Could not load sample receipts:', e);
    }
  }

  async function importJsonPayload(parsed) {
    try {
      showStatus('Ingesting receipts into Pinflation terminal repository...', false);
      let incoming = Array.isArray(parsed)
        ? parsed
        : (parsed.receipts || parsed?.data?.receiptsWithCounts?.receipts || []);

      // Try local server first
      try {
        const res = await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: parsed, merge: true })
        });
        if (res.ok) {
          const result = await res.json();
          state.source = result.source;
          state.receipts = result.receipts;
          localStorage.setItem('pinflation_user_receipts', JSON.stringify(result.receipts));
          renderTerminal();
          showStatus(
            `✅ Imported ${result.importedCount} receipts (${result.totalCount} total active).`,
            false
          );
          return;
        }
      } catch (_) {}

      // In-browser client fallback for GitHub Pages
      if (incoming.length > 0) {
        let existing = [];
        const stored = localStorage.getItem('pinflation_user_receipts');
        if (stored) {
          try { existing = JSON.parse(stored); } catch(_) {}
        }
        const byKey = new Map();
        for (const r of [...incoming, ...existing]) {
          const k = r.transactionBarcode || `${r.transactionDateTime || r.transactionDate}-${r.total}`;
          if (!byKey.has(k)) byKey.set(k, r);
        }
        const merged = Array.from(byKey.values()).sort(
          (a, b) => new Date(b.transactionDateTime || 0) - new Date(a.transactionDateTime || 0)
        );
        localStorage.setItem('pinflation_user_receipts', JSON.stringify(merged));
        state.source = 'live';
        state.receipts = merged;
        renderTerminal();
        showStatus(
          `✅ Imported ${incoming.length} receipts directly in-browser (${merged.length} active in local storage).`,
          false
        );
      } else {
        throw new Error('No valid receipts found in payload.');
      }
    } catch (err) {
      showStatus(`❌ ${err.message}`, true);
    }
  }

  function setupSyncAndImportControls() {
    async function copyConsoleScript(btn) {
      if (!state.exportScriptText) return;
      await navigator.clipboard.writeText(state.exportScriptText);
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      setTimeout(() => {
        btn.textContent = orig;
      }, 2000);
    }

    document.getElementById('copyScriptModalBtn')?.addEventListener('click', (e) => {
      copyConsoleScript(e.currentTarget);
    });

    document.getElementById('loadLiveBtn')?.addEventListener('click', () => {
      loadDataset('live');
      showStatus('Switched to live synced Costco receipts.');
    });

    document.getElementById('loadDemoBtn')?.addEventListener('click', () => {
      loadDataset('demo');
      showStatus('Switched to reference demo dataset.');
    });

    document.getElementById('exportCsvBtn').addEventListener('click', exportSkuCsv);

    const dropzone = document.getElementById('jsonDropzone');
    const fileInput = document.getElementById('jsonFileInput');

    document.getElementById('browseFileBtn').addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('click', (e) => {
      if (e.target.id !== 'browseFileBtn') fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        const text = await file.text();
        await importJsonPayload(JSON.parse(text));
      }
    });

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) {
        const text = await file.text();
        await importJsonPayload(JSON.parse(text));
      }
    });

    document.getElementById('importPastedJsonBtn').addEventListener('click', async () => {
      const raw = document.getElementById('rawJsonTextarea').value.trim();
      if (!raw) return;
      try {
        await importJsonPayload(JSON.parse(raw));
      } catch (e) {
        showStatus('❌ Invalid JSON format.', true);
      }
    });

    document.getElementById('runTokenSyncBtn').addEventListener('click', async () => {
      const idToken = document.getElementById('costcoIdTokenInput').value.trim();
      const refreshToken = document.getElementById('costcoRefreshTokenInput').value.trim();
      const yearsBack = Number(document.getElementById('costcoYearsBackSelect').value) || 3;

      try {
        showStatus('⏳ Querying Costco GraphQL API across 6-month windows...', false);
        const res = await fetch('/api/sync-costco', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, refreshToken, yearsBack })
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Sync failed');

        state.source = result.source;
        state.receipts = result.receipts;
        renderTerminal();
        showStatus(
          `✅ Successfully synced ${result.fetchedCount} receipts from Costco.com (${result.totalCount} active receipts)!`,
          false
        );
      } catch (err) {
        showStatus(`❌ ${err.message}`, true);
      }
    });
  }

  function setupFilters() {
    document.getElementById('modeListBtn').addEventListener('click', () => {
      state.priceMode = 'list';
      document.getElementById('modeListBtn').classList.add('active');
      document.getElementById('modeNetBtn').classList.remove('active');
      renderTerminal();
    });

    document.getElementById('modeNetBtn').addEventListener('click', () => {
      state.priceMode = 'net';
      document.getElementById('modeNetBtn').classList.add('active');
      document.getElementById('modeListBtn').classList.remove('active');
      renderTerminal();
    });

    document.getElementById('itemSearchInput').addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderSkuTable();
    });

    document.getElementById('deptFilterSelect').addEventListener('change', (e) => {
      state.deptFilter = e.target.value;
      renderSkuTable();
    });

    document.getElementById('sortFilterSelect').addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderSkuTable();
    });

    document.getElementById('repeatOnlyCheckbox').addEventListener('change', (e) => {
      state.repeatOnly = e.target.checked;
      renderSkuTable();
    });

    document.getElementById('receiptSearchInput').addEventListener('input', (e) => {
      state.receiptQuery = e.target.value;
      renderReceiptsLedger();
    });

    window.addEventListener('resize', () => {
      if (state.analytics) {
        if (state.currentView === 'view-macro') {
          renderMacroCpiChart(state.analytics.cpiSeries);
        }
        const activeItem = state.analytics.skuList.find((s) => s.itemNumber === state.selectedSku);
        if (activeItem) renderItemDetailChart(activeItem);
      }
    });
  }

  async function init() {
    setupDialog();
    setupNavigation();
    setupFilters();
    setupSyncAndImportControls();
    setupMainChartHover();

    // 1. Load export script text
    try {
      const scriptRes = await fetch('/api/export-script');
      if (scriptRes.ok) {
        const scriptData = await scriptRes.json();
        state.exportScriptText = scriptData.script || '';
      }
    } catch (_) {}

    if (!state.exportScriptText) {
      try {
        const scriptFileRes = await fetch('export-costco-receipts.js');
        if (scriptFileRes.ok) {
          state.exportScriptText = await scriptFileRes.text();
        }
      } catch (_) {}
    }

    const codePreview = document.getElementById('scriptPreviewCode');
    if (codePreview && state.exportScriptText) {
      codePreview.textContent = state.exportScriptText;
    }

    // 2. Load dataset
    await loadDataset('live');
  }

  init();
})();
