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

  // Authentic Verified Costco Wholesale Catalog (Exact POS Item # Mappings)
  const VERIFIED_COSTCO_CATALOG = {
    '1726089': 'Kirkland Signature House Blend Whole Bean Coffee, 2.5 lbs',
    '1726068': 'Kirkland Signature Espresso Blend Whole Bean Coffee, 2.5 lbs',
    '1735359': 'Kirkland Signature Italian Roast Whole Bean Coffee',
    '1585601': 'Kirkland Signature Single Origin Mexico Whole Bean Coffee',
    '2': 'Kirkland Signature Whole Milk (1 Gallon)',
    '1': 'Kirkland Signature 2% Reduced Fat Milk (1 Gallon)',
    '1975527': 'Kirkland Signature Ultra-Filtered Milk (64 oz)',
    '1048072': 'Kirkland Signature Organic Nonfat Greek Yogurt',
    '1010598': 'Kirkland Signature Organic Three Berry Blend',
    '60357': 'Sweet Bell Peppers (6-Pack)',
    '30669': 'Fresh Bananas (3 lbs)',
    '2619': 'Organic Bananas (3 lbs)',
    '694466': 'Kirkland Signature Organic Mixed Vegetables',
    '637598': 'Kirkland Signature Cage-Free Large Eggs (2 Dozen)',
    '1025795': 'Kirkland Signature Grade AA Large Eggs (5 Dozen)',
    '1068080': 'Certified Organic Pasture-Raised Large Eggs (2 Dozen)',
    '647465': 'Hass Avocados (6-Count)',
    '796993': 'Organic Hass Avocados (6-Count)',
    '7947': 'Fuji Apples (4 lb Bag)',
    '7950': 'Cosmic Crisp Apples (4 lb Bag)',
    '6659': 'Honeycrisp Apples (4 lb Bag)',
    '3741': 'Envy Apples (4 lb Bag)',
    '177': 'Organic Fuji Apples (4 lb Bag)',
    '65568': 'Kirkland Signature Cottage Cheese',
    '57554': 'Fresh Blueberries (18 oz)',
    '519638': 'Fresh Organic Blueberries (18 oz)',
    '56366': 'Fresh Raspberries (12 oz)',
    '27003': 'Fresh Strawberries (2 lbs)',
    '512515': 'Fresh Organic Strawberries (2 lbs)',
    '702669': 'Fresh Blackberries (12 oz)',
    '1335089': 'Costco Bakery Fresh Bagels (2-Pack)',
    '21020': 'Tomatoes on the Vine (2 lbs)',
    '25595': 'Campari Cocktail Tomatoes (2 lbs)',
    '77053': 'Grape Tomatoes (2 lbs)',
    '977055': 'Organic Grape Tomatoes (2 lbs)',
    '412': 'Organic Whole Carrots (2 x 2 lbs)',
    '1015237': 'Kirkland Signature Stir-Fry Vegetable Blend',
    '1319419': 'Kirkland Signature Extra Fancy Mixed Nuts',
    '1700458': 'Waterloo Sparkling Water Variety Pack (24-Pack)',
    '1902857': 'Waterloo Sparkling Water Variety Pack (24-Pack)',
    '2251987': 'Kirkland Signature Organic Hummus Single Cups (12-Pack)',
    '5276': 'Red Seedless Grapes (3 lbs)',
    '1059994': 'Organic Red Seedless Grapes (3 lbs)',
    '1059995': 'Organic Green Seedless Grapes (3 lbs)',
    '1073076': 'Candy Snap / Cotton Candy Grapes (3 lbs)',
    '1298989': 'Candy Snap Seedless Grapes (3 lbs)',
    '1195303': 'Kirkland Signature Dry Roasted Macadamia Nuts',
    '1304236': 'Kirkland Signature 100% Grass-Fed Beef Patties (1/3 lb, 5 lbs)',
    '15390': 'Kirkland Signature Organic Boneless Skinless Chicken Breast',
    '30471': 'Kirkland Signature Organic Boneless Skinless Chicken Breast',
    '33841': 'Kirkland Signature Boneless Skinless Chicken Breast',
    '36285': 'Kirkland Signature Walnut Halves (3 lbs)',
    '4032': 'Whole Seedless Watermelon',
    '26281': 'Mini Seedless Watermelons',
    '7070': 'Kirkland Signature Fresh Farmed Atlantic Salmon',
    '10579': 'Fresh Farm-Raised Salmon Fillet',
    '10454': 'Fresh Farm-Raised Salmon Fillet',
    '47292': 'Wild Sockeye Salmon Fillet',
    '664511': 'Kirkland Signature Organic Black Beans (8-Pack)',
    '2222019': 'Kirkland Signature Organic Ancient Grain Granola with Probiotics',
    '131': 'Organic Brussels Sprouts (2 lbs)',
    '684779': 'Wawona Daybreak Blend Frozen Fruit',
    '1761722': 'RXBAR High Protein Bars Variety Pack',
    '1802191': 'Siete Grain Free Sea Salt Tortilla Chips',
    '9440': 'Thai Kitchen Organic Unsweetened Coconut Milk',
    '48757': 'Organic Spring Mix Salad Greens (1 lb)',
    '96716': 'Organic Baby Spinach (1 lb)',
    '782294': 'Organic Power Greens Salad Blend (1.5 lbs)',
    '94676': 'Fresh Asparagus (2.25 lbs)',
    '598881': 'Kirkland Signature Organic 85/15 Ground Beef (4 lbs)',
    '800599': 'Costco Wholesale Regular Unleaded Gasoline',
    '1294528': 'Quaker / Kirkland Organic Rolled Oats (72 oz)',
    '6262016': 'Kirkland Signature Bath Tissue (30 Rolls)',
    '512599': 'Kirkland Signature Create-a-Size Paper Towels (12 Rolls)',
    '555000': 'Kirkland Signature Organic Creamy Peanut Butter (2-Pack)',
    '859695': 'Kirkland Signature Creamy Almond Butter (27 oz)',
    '1109404': 'Kirkland Signature Creamy Almond Butter (27 oz)',
    '939542': 'Fresh French Green Beans (2 lbs)',
    '1001368': 'Kirkland Signature Organic Quinoa (4.5 lbs)',
    '1038672': 'Love Beets Organic Cooked Beets',
    '1060699': 'Kirkland Signature Organic Chia Seeds (64 oz)',
    '1143330': 'Ocean Spray Craisins Whole Dried Cranberries (64 oz)',
    '1184753': 'Costco Food Court Hot Chicken Bake',
    '1184748': 'Costco Food Court Pepperoni Pizza Slice',
    '1816542': 'Costco Food Court Chocolate & Vanilla Twist Ice Cream',
    '1285362': 'Kirkland Signature Organic Guacamole Single Cups (16-Pack)',
    '1462714': 'Kirkland Signature Organic A2 Protein Whole Milk (3 x 64 oz)',
    '1644223': "Nature's Bounty Magnesium Glycinate (180 Capsules)",
    '19927': 'Costco Deli Rotisserie Chicken Caesar Salad',
    '23086': 'Costco Deli Chicken Noodle Soup',
    '20397': 'USDA Choice New York Strip Steak Thin Cut (Shabu Shabu)',
    '33593': 'USDA Choice Boneless New York Strip Steak',
    '43099': 'Costco Service Deli St. Louis Style Dry Rub Ribs',
    '25107': 'Costco Service Deli Garlic Pepper Chicken Wings',
    '36954': 'Costco Bakery Artisan Sourdough Bread (2-Pack)',
    '44004': 'Kirkland Signature Flour Tortillas',
    '51070': 'Kirkland Signature Premium Chunk Canned Chicken Breast (6-Pack)',
    '301860': 'Tillamook Medium Cheddar Cheese (2 lbs)',
    '456868': 'Frigo Cheese Heads String Cheese (60-Pack)',
    '1189000': 'BelGioioso Fresh Mozzarella Snacking Cheese',
    '362996': 'Terra Delyssa Organic Extra Virgin Olive Oil',
    '692731': 'Kirkland Signature Organic Extra Virgin Olive Oil (2L)',
    '1678104': 'Chosen Foods 100% Pure Avocado Oil (1L)',
    '720650': 'Fresh Mini Persian Cucumbers (1.5 lbs)',
    '568915': 'Organic English Cucumbers (3-Pack)',
    '993449': 'Garofalo Organic Variety Pasta (6-Pack)',
    '1062201': 'Seapoint Farms Organic Edamame (8-Pack)',
    '1164891': 'Silk Organic Unsweetened Almond Milk (3-Pack)',
    '1388341': 'Manitoba Harvest Organic Hemp Hearts (32 oz)',
    '1424237': 'Kirkland Signature New Zealand Grass-Fed Butter (4-Pack)',
    '1493488': 'Kirkland Signature Baby Wipes (Fragrance Free, 900 ct)',
    '1497301': 'Summers Peak Organic Roasted Vegetable Blend (4 lbs)',
    '1553261': 'Good Foods Chunky Guacamole Bowl',
    '1793017': 'Jongga Authentic Korean Kimchi (42.3 oz)',
    '1843250': 'TRUBAR Plant-Based Protein Bars Variety Pack (16-Pack)',
    '1856360': 'Rain-X Windshield Washer Fluid (-32°F 2-Pack)',
    '1904637': 'Spindrift Sparkling Water Variety Pack (30-Pack)',
    '1993061': 'Spindrift Sparkling Water Variety Pack (30-Pack)',
    '2038687': 'LaCroix Sparkling Water Curate Variety Pack (24-Pack)',
    '1346763': 'LaCroix Sparkling Water Variety Pack (24-Pack)',
    '4164501': 'Kirkland Signature Italian Sparkling Flavored Water (35-Pack)',
    '997895': 'Kirkland Signature Full Synthetic Motor Oil 0W-20 (2 x 5 Qt)'
  };

  function getItemAliases() {
    try {
      const raw =
        localStorage.getItem('inflation_item_aliases') ||
        localStorage.getItem('pinflation_item_aliases');
      return JSON.parse(raw || '{}');
    } catch (_) {
      return {};
    }
  }

  function setItemAlias(itemNumber, alias) {
    const aliases = getItemAliases();
    if (alias && alias.trim()) {
      aliases[itemNumber] = alias.trim();
    } else {
      delete aliases[itemNumber];
    }
    const val = JSON.stringify(aliases);
    try {
      localStorage.setItem('inflation_item_aliases', val);
      localStorage.setItem('pinflation_item_aliases', val);
    } catch (_) {}
  }

  function resolveItemDisplay(item) {
    const aliases = getItemAliases();
    const customName = aliases[item.itemNumber];
    const verifiedName = VERIFIED_COSTCO_CATALOG[item.itemNumber];

    let primaryName = '';
    let nameSource = 'receipt';

    if (customName) {
      primaryName = customName;
      nameSource = 'custom';
    } else if (verifiedName) {
      primaryName = verifiedName;
      nameSource = 'verified';
    } else {
      let expanded = item.name || `Item #${item.itemNumber}`;
      if (expanded.startsWith('KS ')) {
        expanded = 'Kirkland Signature ' + expanded.slice(3).trim();
      } else if (expanded.startsWith('ORGNC ') || expanded.startsWith('ORG ')) {
        expanded = 'Organic ' + expanded.replace(/^ORG(NC)?\s+/, '').trim();
      } else if (expanded.startsWith('GRS FED ')) {
        expanded = 'Grass-Fed ' + expanded.slice(8).trim();
      }
      primaryName = expanded;
      nameSource = 'receipt';
    }

    let rawSub = item.subName || '';
    let cleanSub = rawSub
      .replace(/\b[PT]\d+H?\d*\b/gi, '')
      .replace(/\bSL\s*\d+\w*\b/gi, '')
      .replace(/\b\d+X\d+\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (!cleanSub && verifiedName) {
      cleanSub = item.name;
    }

    return {
      primaryName,
      nameSource,
      cleanSub: cleanSub || item.deptName,
      rawName: item.name,
      rawSub: item.subName,
      costcoUrl: `https://www.costco.com/CatalogSearch?dept=All&keyword=${item.itemNumber}`,
      googleUrl: `https://www.google.com/search?q=Costco+${item.itemNumber}`
    };
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

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Application Version & State
  const APP_VERSION = '2.7.6';
  const state = {
    source: 'live',
    receipts: [],
    priceMode: 'list', // 'list' | 'net'
    currentView: 'view-attribution',
    selectedSku: null,
    searchQuery: '',
    deptFilter: 'all',
    sortCol: 'spend',
    sortDir: 'desc',
    repeatOnly: true,
    receiptQuery: '',
    exportScriptText: '',
    analytics: null,
    chartPoints: [],
    // SKU Price Trends Explorer State
    trajMode: 'pct', // 'pct' | 'price'
    trajPreset: 'top_spend',
    trajDept: 'all',
    trajQuery: '',
    trajActiveSkus: null,
    trajHoveredSku: null,
    trajHoveredPoint: null,
    trajDataPoints: []
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
          warehouse: receipt.warehouseName || receipt.warehouseShortName || 'Warehouse',
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

    // Effective discount rate on total spend
    const effectiveDiscountRatePct =
      totalGrossSpend > 0 ? (totalInstantSavings / totalGrossSpend) * 100 : 0;

    // Inflation Offset Multiple: How many times promo savings covered price inflation
    const inflationOffsetMultiple =
      grossPriceIncreaseDollars > 0
        ? totalInstantSavings / grossPriceIncreaseDollars
        : totalInstantSavings > 0 ? Infinity : 0;

    // Savings Shield Ratio: What percentage of gross price inflation was absorbed by promo rebates?
    const savingsShieldRatio =
      grossPriceIncreaseDollars > 0
        ? (totalInstantSavings / grossPriceIncreaseDollars) * 100
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
        warehouse: r.warehouseName || 'Warehouse',
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
      grossPriceIncreaseDollars,
      totalInstantSavings,
      effectiveDiscountRatePct,
      inflationOffsetMultiple,
      savingsShieldRatio,
      cpiSeries,
      deptBreakdown
    };
  }

  // UI Renderers
  function renderTerminal() {
    const dot = document.getElementById('statusDot');
    const sourceText = document.getElementById('dataSourceText');
    const ledgerTabCount = document.getElementById('ledgerTabCount');
    const navDateHorizon = document.getElementById('navDateHorizon');
    const navWarehouseName = document.getElementById('navWarehouseName');
    const activeCountLabel = document.getElementById('activeReceiptsCountLabel');
    const emptyPane = document.getElementById('emptyTerminalPane');

    if (activeCountLabel) {
      activeCountLabel.textContent = `${state.receipts ? state.receipts.length : 0} Receipts`;
    }

    // Zero-receipt empty state handling
    if (!state.receipts || state.receipts.length === 0) {
      if (dot) dot.className = 'status-indicator';
      if (sourceText) sourceText.textContent = 'No Receipts Connected';
      if (ledgerTabCount) ledgerTabCount.textContent = '(0 Receipts)';
      if (navDateHorizon) navDateHorizon.innerHTML = '<strong>Date Horizon:</strong> Awaiting data';
      if (navWarehouseName) navWarehouseName.innerHTML = '<strong>Warehouse:</strong> Connect account';

      document.getElementById('kpiAnnualizedInflation').textContent = '--';
      const cumEl = document.getElementById('kpiCumulativeInflation');
      cumEl.textContent = '-- cumulative';
      cumEl.className = 'metric-secondary-badge badge-neutral';

      document.getElementById('kpiPersonalCpiIndex').textContent = '--';
      const spreadEl = document.getElementById('kpiCpiSpread');
      spreadEl.textContent = '-- vs. BLS';
      spreadEl.className = 'metric-secondary-badge badge-neutral';

      document.getElementById('kpiBasketCountPill').textContent = '0 Repeat SKUs';
      document.getElementById('kpiExtraSpend').textContent = '--';
      document.getElementById('kpiBasketTotals').textContent = '$0.00 → $0.00';

      document.getElementById('kpiShieldRatio').textContent = '--';
      document.getElementById('kpiTotalSavingsCaptured').textContent = '$0.00 Saved';
      const basisTag = document.getElementById('kpiBasisTag');
      if (basisTag) {
        basisTag.textContent = state.priceMode === 'net' ? 'Net Paid' : 'Shelf Price';
      }
      const shieldSub = document.getElementById('kpiShieldSubtext');
      if (shieldSub) {
        shieldSub.textContent = 'Percentage saved off total shelf spending through promotions';
      }

      if (emptyPane) {
        emptyPane.hidden = false;
        emptyPane.style.display = '';
      }
      document.querySelectorAll('.terminal-view-pane').forEach((pane) => {
        pane.hidden = true;
        pane.classList.remove('active');
      });
      return;
    }

    // Active receipts populated
    if (emptyPane) {
      emptyPane.hidden = true;
      emptyPane.style.display = 'none';
    }
    document.querySelectorAll('.terminal-view-pane').forEach((pane) => {
      const isTarget = pane.id === state.currentView;
      pane.hidden = !isTarget;
      pane.classList.toggle('active', isTarget);
    });

    const analytics = analyzeReceipts(state.receipts, state.priceMode);
    state.analytics = analytics;

    // Header badge
    if (dot) dot.className = 'status-indicator live';
    if (sourceText) sourceText.textContent = `${state.receipts.length} Active Receipts`;
    if (ledgerTabCount) ledgerTabCount.textContent = `(${state.receipts.length} Receipts)`;

    // Date Horizon & Warehouse Name
    const dates = state.receipts
      .map((r) => new Date(r.transactionDateTime || r.transactionDate).getTime())
      .filter((t) => !Number.isNaN(t))
      .sort((a, b) => a - b);
    if (dates.length > 0 && navDateHorizon) {
      const minD = new Date(dates[0]);
      const maxD = new Date(dates[dates.length - 1]);
      const spanY = Math.max((maxD - minD) / (1000 * 60 * 60 * 24 * 365.25), 0.1).toFixed(1);
      navDateHorizon.innerHTML = `<strong>Date Horizon:</strong> ${formatDateShort(minD)} &ndash; ${formatDateShort(maxD)} (${spanY} yrs)`;
    }
    const whList = state.receipts.map((r) => r.warehouseName).filter(Boolean);
    const primaryWh = whList[0] || 'Wholesale';
    if (navWarehouseName) {
      navWarehouseName.innerHTML = `<strong>Warehouse:</strong> ${primaryWh}`;
    }

    // Executive KPI Strip
    const basisTag = document.getElementById('kpiBasisTag');
    if (basisTag) {
      basisTag.textContent = state.priceMode === 'net' ? 'Net Paid' : 'Shelf Price';
    }
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

    document.getElementById('kpiShieldRatio').textContent = `${analytics.effectiveDiscountRatePct.toFixed(1)}%`;
    document.getElementById('kpiTotalSavingsCaptured').textContent = `${formatCurrency(analytics.totalInstantSavings)} Saved`;
    const shieldSub = document.getElementById('kpiShieldSubtext');
    if (shieldSub) {
      if (analytics.grossPriceIncreaseDollars > 0) {
        const multipleStr =
          analytics.inflationOffsetMultiple >= 10
            ? `${analytics.inflationOffsetMultiple.toFixed(0)}x`
            : `${analytics.inflationOffsetMultiple.toFixed(1)}x`;
        shieldSub.textContent = `Saved ${analytics.effectiveDiscountRatePct.toFixed(1)}% off total spend • Offsets ${multipleStr} of price increases`;
      } else {
        shieldSub.textContent = `Saved ${analytics.effectiveDiscountRatePct.toFixed(1)}% off total spend via instant warehouse coupons`;
      }
    }

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
    populateTrajectoriesDeptSelect(analytics.skuList);
    renderSkuTable();
    if (state.currentView === 'view-trajectories') {
      renderSkuTrajectoriesChart();
    }
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

  function updateTableHeaderSortIndicators() {
    document.querySelectorAll('.terminal-table th.sortable').forEach((th) => {
      const col = th.getAttribute('data-sort');
      if (col === state.sortCol) {
        th.setAttribute('aria-sort', state.sortDir === 'asc' ? 'ascending' : 'descending');
      } else {
        th.setAttribute('aria-sort', 'none');
      }
    });

    const sortSelect = document.getElementById('sortFilterSelect');
    if (sortSelect) {
      if (state.sortCol === 'spend' && state.sortDir === 'desc') sortSelect.value = 'spend_desc';
      else if (state.sortCol === 'inflation' && state.sortDir === 'desc') sortSelect.value = 'pct_desc';
      else if (state.sortCol === 'cagr' && state.sortDir === 'desc') sortSelect.value = 'cagr_desc';
      else if (state.sortCol === 'inflation' && state.sortDir === 'asc') sortSelect.value = 'pct_asc';
      else if (state.sortCol === 'addedCost' && state.sortDir === 'desc') sortSelect.value = 'abs_desc';
      else if (state.sortCol === 'orders' && state.sortDir === 'desc') sortSelect.value = 'count_desc';
    }
  }

  function renderSkuTable() {
    const tbody = document.getElementById('skuTableBody');
    const q = state.searchQuery.toLowerCase().trim();

    let filtered = state.analytics.skuList.filter((item) => {
      if (state.repeatOnly && item.purchaseCount < 2) return false;
      if (state.deptFilter !== 'all' && item.deptName !== state.deptFilter) return false;
      if (q) {
        const info = resolveItemDisplay(item);
        const hay = `${item.itemNumber} ${item.name} ${info.primaryName} ${item.subName} ${item.deptName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      let res = 0;
      switch (state.sortCol) {
        case 'sku': {
          const numA = parseInt(a.itemNumber, 10) || 0;
          const numB = parseInt(b.itemNumber, 10) || 0;
          res = numA !== numB ? numA - numB : (a.itemNumber || '').localeCompare(b.itemNumber || '');
          break;
        }
        case 'name': {
          const nameA = resolveItemDisplay(a).primaryName;
          const nameB = resolveItemDisplay(b).primaryName;
          res = nameA.localeCompare(nameB);
          break;
        }
        case 'dept':
          res = (a.deptName || '').localeCompare(b.deptName || '');
          break;
        case 'spend':
          res = a.totalSpend - b.totalSpend;
          break;
        case 'orders':
          res = (a.purchaseCount - b.purchaseCount) || (a.totalUnits - b.totalUnits);
          break;
        case 'firstPrice':
          res = a.firstPrice - b.firstPrice;
          break;
        case 'latestPrice':
          res = a.latestPrice - b.latestPrice;
          break;
        case 'addedCost':
          res = a.absChange - b.absChange;
          break;
        case 'inflation':
          res = a.pctChange - b.pctChange;
          break;
        case 'cagr':
          res = a.annualizedPct - b.annualizedPct;
          break;
        default:
          res = a.totalSpend - b.totalSpend;
      }
      return state.sortDir === 'desc' ? -res : res;
    });

    updateTableHeaderSortIndicators();

    if (
      (!state.selectedSku || !filtered.some((s) => s.itemNumber === state.selectedSku)) &&
      filtered.length > 0
    ) {
      state.selectedSku = filtered[0].itemNumber;
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);font-style:italic">No items match your filter criteria</td></tr>';
      return;
    }

    for (const item of filtered) {
      const info = resolveItemDisplay(item);
      const tr = document.createElement('tr');
      tr.setAttribute('tabindex', '0');
      tr.setAttribute('role', 'button');
      tr.setAttribute('aria-label', `Inspect ${info.primaryName}, Item #${item.itemNumber}`);
      if (item.itemNumber === state.selectedSku) tr.classList.add('selected');

      const pillClass =
        Math.abs(item.pctChange) < 0.05 ? 'flat' : item.pctChange > 0 ? 'up' : 'down';
      const cagrClass =
        Math.abs(item.annualizedPct) < 0.05 ? 'flat' : item.annualizedPct > 0 ? 'up' : 'down';

      const cagrCellHtml =
        item.purchaseCount < 2
          ? '<span style="color:var(--text-muted)">&ndash;</span>'
          : `<span class="inflation-cell-badge ${cagrClass}" title="Compound Annual Growth Rate: ${formatPct(item.annualizedPct, 1)}/year">${formatPct(item.annualizedPct, 1)}/yr</span>`;

      const badgeHtml =
        info.nameSource === 'custom'
          ? '<span class="custom-sku-pill" title="Custom user nickname">Custom</span>'
          : '';

      tr.innerHTML = `
        <td><span class="sku-badge">#${item.itemNumber}</span></td>
        <td>
          <div class="item-desc-primary">
            <span>${escapeHtml(info.primaryName)}</span>
            ${badgeHtml}
          </div>
          <div class="item-desc-sub">
            <span>${escapeHtml(info.cleanSub)}</span>
            <span class="sub-sep">&bull;</span>
            <a href="${info.costcoUrl}" target="_blank" rel="noopener noreferrer" class="sku-ext-link" onclick="event.stopPropagation()" title="Open official product search on Costco.com">Costco.com ↗</a>
          </div>
        </td>
        <td><span class="dept-tag">${escapeHtml(item.deptName.split('&')[0].trim())}</span></td>
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
          <span class="inflation-cell-badge ${pillClass}" title="Cumulative inflation: ${formatPct(item.pctChange, 1)}">${formatPct(item.pctChange, 1)}</span>
        </td>
        <td class="num-col">
          ${cagrCellHtml}
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
    const info = resolveItemDisplay(item);

    document.getElementById('inspectorSku').textContent = `COSTCO SKU #${item.itemNumber}`;

    const badgeHtml =
      info.nameSource === 'custom'
        ? '<span class="custom-sku-pill" title="Custom user nickname">Custom</span>'
        : '';

    document.getElementById('inspectorTitle').innerHTML = `${escapeHtml(info.primaryName)} ${badgeHtml}`;
    document.getElementById('inspectorSubtitle').textContent = `${info.cleanSub} • ${item.deptName}`;

    // Lookup & Action Bar
    const lookupBar = document.getElementById('inspectorLookupBar');
    if (lookupBar) {
      lookupBar.hidden = false;
      const rawCode = document.getElementById('inspectorRawCode');
      if (rawCode) {
        rawCode.textContent = `${item.name}${item.subName ? ' / ' + item.subName : ''}`;
      }

      const costcoLink = document.getElementById('inspectorCostcoLink');
      if (costcoLink) costcoLink.href = info.costcoUrl;

      const googleLink = document.getElementById('inspectorGoogleLink');
      if (googleLink) googleLink.href = info.googleUrl;

      const btnReset = document.getElementById('btnResetItemName');
      const btnRename = document.getElementById('btnRenameItem');
      const renameLabel = document.getElementById('btnRenameLabel');

      if (info.nameSource === 'custom') {
        if (btnReset) btnReset.hidden = false;
        if (renameLabel) renameLabel.textContent = 'Edit Nickname';
      } else {
        if (btnReset) btnReset.hidden = true;
        if (renameLabel) renameLabel.textContent = 'Set Custom Name';
      }

      if (btnRename) {
        btnRename.onclick = () => {
          const current = info.nameSource === 'custom' ? info.primaryName : '';
          const newName = window.prompt(
            `Enter a custom friendly nickname for SKU #${item.itemNumber} (currently "${info.primaryName}"):`,
            current
          );
          if (newName !== null) {
            setItemAlias(item.itemNumber, newName);
            renderSkuTable();
            renderItemInspector(item);
          }
        };
      }

      if (btnReset) {
        btnReset.onclick = () => {
          if (window.confirm(`Reset custom nickname for SKU #${item.itemNumber}?`)) {
            setItemAlias(item.itemNumber, null);
            renderSkuTable();
            renderItemInspector(item);
          }
        };
      }
    }

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
          <div style="font-weight:600">${formatDateShort(h.date)} &bull; <span style="color:var(--text-muted)">${escapeHtml(h.warehouse)}</span></div>
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
    const stride = Math.max(Math.floor(series.length / 8), 1);
    for (let i = 0; i < series.length; i += stride) {
      const x = xFor(i);
      const d = new Date(series[i].date);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      ctx.fillStyle = textColor;
      if (i === 0) {
        ctx.textAlign = 'left';
      } else if (i + stride >= series.length) {
        ctx.textAlign = 'right';
      } else {
        ctx.textAlign = 'center';
      }
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

    const pad = { top: 16, right: 20, bottom: 26, left: 46 };
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
    ctx.font = '11px "JetBrains Mono", monospace';
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
    hist.forEach((h, idx) => {
      if (idx === 0 || idx === hist.length - 1 || hist.length <= 4) {
        const x = xFor(idx);
        const d = new Date(h.date);
        ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
        if (idx === 0) {
          ctx.textAlign = 'left';
        } else if (idx === hist.length - 1) {
          ctx.textAlign = 'right';
        } else {
          ctx.textAlign = 'center';
        }
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
            <div class="ledger-warehouse-name">${(r.warehouseName || 'COSTCO').toUpperCase()} WAREHOUSE</div>
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

  const TRAJECTORY_COLORS = [
    '#f43f5e', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#a855f7',
    '#84cc16', '#3b82f6', '#e11d48', '#22c55e', '#eab308',
    '#6366f1', '#d946ef', '#0284c7', '#059669', '#d97706'
  ];

  function populateTrajectoriesDeptSelect(skuList) {
    const select = document.getElementById('trajDeptSelect');
    if (!select) return;
    const current = state.trajDept;
    const depts = Array.from(new Set(skuList.map((s) => s.deptName))).sort();
    select.innerHTML = '<option value="all">All Departments</option>';
    for (const d of depts) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      if (d === current) opt.selected = true;
      select.appendChild(opt);
    }
  }

  function updateTrajectoriesActiveSkusFromPreset(preset) {
    if (!state.analytics || !state.analytics.trackedSkus) return;
    const tracked = state.analytics.trackedSkus;
    state.trajActiveSkus = new Set();

    if (preset === 'top_spend') {
      [...tracked]
        .sort((a, b) => b.totalSpend - a.totalSpend)
        .slice(0, 10)
        .forEach((s) => state.trajActiveSkus.add(s.itemNumber));
    } else if (preset === 'top_inflation') {
      [...tracked]
        .sort((a, b) => b.pctChange - a.pctChange)
        .slice(0, 10)
        .forEach((s) => state.trajActiveSkus.add(s.itemNumber));
    } else if (preset === 'top_deflation') {
      [...tracked]
        .sort((a, b) => a.pctChange - b.pctChange)
        .slice(0, 10)
        .forEach((s) => state.trajActiveSkus.add(s.itemNumber));
    } else if (preset === 'most_frequent') {
      [...tracked]
        .sort((a, b) => (b.purchaseCount - a.purchaseCount) || (b.totalUnits - a.totalUnits))
        .slice(0, 20)
        .forEach((s) => state.trajActiveSkus.add(s.itemNumber));
    } else if (preset === 'all_repeat') {
      tracked.forEach((s) => state.trajActiveSkus.add(s.itemNumber));
    }
  }

  function getTrajectoryCandidateSkus() {
    if (!state.analytics || !state.analytics.trackedSkus) return [];
    if (state.trajActiveSkus === null) {
      updateTrajectoriesActiveSkusFromPreset(state.trajPreset);
    }
    const q = state.trajQuery.toLowerCase().trim();
    const tracked = state.analytics.trackedSkus;

    let filtered = tracked.filter((item) => {
      if (state.trajDept !== 'all' && item.deptName !== state.trajDept) return false;
      if (q) {
        const info = resolveItemDisplay(item);
        const hay = `${item.itemNumber} ${item.name} ${info.primaryName} ${item.deptName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (!q) {
      if (state.trajPreset === 'top_spend') {
        const topSet = new Set(
          [...filtered]
            .sort((a, b) => b.totalSpend - a.totalSpend)
            .slice(0, 15)
            .map((s) => s.itemNumber)
        );
        filtered = filtered.filter(
          (s) => (state.trajActiveSkus && state.trajActiveSkus.has(s.itemNumber)) || topSet.has(s.itemNumber)
        );
        filtered.sort((a, b) => b.totalSpend - a.totalSpend);
      } else if (state.trajPreset === 'top_inflation') {
        const topSet = new Set(
          [...filtered]
            .sort((a, b) => b.pctChange - a.pctChange)
            .slice(0, 15)
            .map((s) => s.itemNumber)
        );
        filtered = filtered.filter(
          (s) => (state.trajActiveSkus && state.trajActiveSkus.has(s.itemNumber)) || topSet.has(s.itemNumber)
        );
        filtered.sort((a, b) => b.pctChange - a.pctChange);
      } else if (state.trajPreset === 'top_deflation') {
        const topSet = new Set(
          [...filtered]
            .sort((a, b) => a.pctChange - b.pctChange)
            .slice(0, 15)
            .map((s) => s.itemNumber)
        );
        filtered = filtered.filter(
          (s) => (state.trajActiveSkus && state.trajActiveSkus.has(s.itemNumber)) || topSet.has(s.itemNumber)
        );
        filtered.sort((a, b) => a.pctChange - b.pctChange);
      } else if (state.trajPreset === 'most_frequent') {
        const topSet = new Set(
          [...filtered]
            .sort((a, b) => (b.purchaseCount - a.purchaseCount) || (b.totalUnits - a.totalUnits))
            .slice(0, 20)
            .map((s) => s.itemNumber)
        );
        filtered = filtered.filter(
          (s) => (state.trajActiveSkus && state.trajActiveSkus.has(s.itemNumber)) || topSet.has(s.itemNumber)
        );
        filtered.sort((a, b) => (b.purchaseCount - a.purchaseCount) || (b.totalUnits - a.totalUnits));
      }
    }
    return filtered;
  }

  function getPlottedTrajectorySkus() {
    if (!state.analytics || !state.analytics.trackedSkus) return [];
    if (state.trajActiveSkus === null) {
      updateTrajectoriesActiveSkusFromPreset(state.trajPreset);
    }

    const q = state.trajQuery.toLowerCase().trim();
    return state.analytics.trackedSkus.filter((item) => {
      if (!state.trajActiveSkus.has(item.itemNumber)) return false;
      if (state.trajDept !== 'all' && item.deptName !== state.trajDept) return false;
      if (q) {
        const info = resolveItemDisplay(item);
        const hay = `${item.itemNumber} ${item.name} ${info.primaryName} ${item.deptName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderSkuTrajectoriesChart() {
    const canvas = document.getElementById('trajectoriesCanvas');
    if (!canvas || !state.analytics) return;

    const plotted = getPlottedTrajectorySkus();
    const candidates = getTrajectoryCandidateSkus();

    const skuColorMap = new Map();
    plotted.forEach((item, idx) => {
      skuColorMap.set(item.itemNumber, TRAJECTORY_COLORS[idx % TRAJECTORY_COLORS.length]);
    });

    // Summary stats
    const countEl = document.getElementById('trajStatCount');
    if (countEl) countEl.textContent = `${plotted.length} SKUs`;

    const topMoverEl = document.getElementById('trajStatTopMover');
    const topDropEl = document.getElementById('trajStatTopDrop');
    const avgEl = document.getElementById('trajStatAvg');

    if (plotted.length > 0) {
      const sortedByPct = [...plotted].sort((a, b) => b.pctChange - a.pctChange);
      const topMover = sortedByPct[0];
      const topDrop = sortedByPct[sortedByPct.length - 1];
      const avgPct = plotted.reduce((acc, s) => acc + s.pctChange, 0) / plotted.length;

      if (topMoverEl) {
        const mInfo = resolveItemDisplay(topMover);
        topMoverEl.textContent = `${mInfo.primaryName.slice(0, 18)}... (${formatPct(topMover.pctChange, 1)})`;
        topMoverEl.title = `${mInfo.primaryName}: ${formatPct(topMover.pctChange, 1)}`;
      }
      if (topDropEl) {
        const dInfo = resolveItemDisplay(topDrop);
        topDropEl.textContent = `${dInfo.primaryName.slice(0, 18)}... (${formatPct(topDrop.pctChange, 1)})`;
        topDropEl.title = `${dInfo.primaryName}: ${formatPct(topDrop.pctChange, 1)}`;
      }
      if (avgEl) {
        avgEl.textContent = formatPct(avgPct, 1);
        avgEl.className = `traj-stat-val ${avgPct > 0 ? 'text-crimson' : avgPct < 0 ? 'text-emerald' : ''}`;
      }
    } else {
      if (topMoverEl) topMoverEl.textContent = '--';
      if (topDropEl) topDropEl.textContent = '--';
      if (avgEl) avgEl.textContent = '--';
    }

    renderTrajectoriesLegend(candidates, skuColorMap);

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    const height = 420;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const pad = { top: 24, right: 35, bottom: 42, left: 58 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    if (plotted.length === 0) {
      ctx.font = '14px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('No SKUs selected. Choose a preset above or click SKUs below to plot.', width / 2, height / 2);
      state.trajDataPoints = [];
      return;
    }

    let minTs = Infinity;
    let maxTs = -Infinity;
    for (const item of plotted) {
      for (const h of item.history) {
        if (h.timestamp < minTs) minTs = h.timestamp;
        if (h.timestamp > maxTs) maxTs = h.timestamp;
      }
    }
    if (minTs === Infinity || maxTs === -Infinity || minTs === maxTs) {
      minTs = Date.now() - 365 * 24 * 3600 * 1000;
      maxTs = Date.now();
    }
    const timeSpan = maxTs - minTs || 1;

    let minYVal = Infinity;
    let maxYVal = -Infinity;

    for (const item of plotted) {
      const basePrice = item.history[0]?.activePrice || 1;
      for (const h of item.history) {
        let v = 0;
        if (state.trajMode === 'pct') {
          v = basePrice > 0 ? ((h.activePrice - basePrice) / basePrice) * 100 : 0;
        } else {
          v = h.activePrice;
        }
        if (v < minYVal) minYVal = v;
        if (v > maxYVal) maxYVal = v;
      }
    }

    let yMin, yMax;
    if (state.trajMode === 'pct') {
      yMin = Math.floor(Math.min(minYVal - 4, -5) / 10) * 10;
      yMax = Math.ceil(Math.max(maxYVal + 4, 10) / 10) * 10;
    } else {
      yMin = 0;
      yMax = Math.ceil((maxYVal * 1.1) / 5) * 5 || 10;
    }
    const ySpan = yMax - yMin || 1;

    const xFor = (ts) => pad.left + ((ts - minTs) / timeSpan) * plotW;
    const yFor = (val) => pad.top + plotH - ((val - yMin) / ySpan) * plotH;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : '#e2e8f0';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const ySteps = 5;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';

    for (let i = 0; i <= ySteps; i++) {
      const val = yMin + (ySpan * i) / ySteps;
      const y = yFor(val);

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();

      const label = state.trajMode === 'pct' ? formatPct(val, 0) : formatCurrency(val);
      ctx.fillText(label, pad.left - 8, y + 4);
    }

    if (state.trajMode === 'pct' && yMin <= 0 && yMax >= 0) {
      const zeroY = yFor(0);
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.45)' : '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, zeroY);
      ctx.lineTo(width - pad.right, zeroY);
      ctx.stroke();
      ctx.restore();
    }

    const tickIntervals = 6;
    ctx.fillStyle = textColor;
    for (let i = 0; i <= tickIntervals; i++) {
      const ts = minTs + (timeSpan * i) / tickIntervals;
      const x = xFor(ts);
      const d = new Date(ts);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (i === 0) ctx.textAlign = 'left';
      else if (i === tickIntervals) ctx.textAlign = 'right';
      else ctx.textAlign = 'center';

      ctx.fillText(label, x, height - 14);
    }

    // Hover vertical crosshair
    if (state.trajHoveredPoint) {
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(state.trajHoveredPoint.x, pad.top);
      ctx.lineTo(state.trajHoveredPoint.x, height - pad.bottom);
      ctx.stroke();
      ctx.restore();
    }

    const collectedPoints = [];
    const sortedDrawList = [...plotted].sort((a, b) => {
      if (a.itemNumber === state.trajHoveredSku) return 1;
      if (b.itemNumber === state.trajHoveredSku) return -1;
      return 0;
    });

    sortedDrawList.forEach((item) => {
      const color = skuColorMap.get(item.itemNumber) || '#2563eb';
      const isHovered = item.itemNumber === state.trajHoveredSku;
      const hasAnyHover = !!state.trajHoveredSku;

      const basePrice = item.history[0]?.activePrice || 1;
      const linePoints = item.history.map((h) => {
        let v = 0;
        if (state.trajMode === 'pct') {
          v = basePrice > 0 ? ((h.activePrice - basePrice) / basePrice) * 100 : 0;
        } else {
          v = h.activePrice;
        }
        const x = xFor(h.timestamp);
        const y = yFor(v);
        return {
          x,
          y,
          val: v,
          pctChange: basePrice > 0 ? ((h.activePrice - basePrice) / basePrice) * 100 : 0,
          price: h.activePrice,
          basePrice: basePrice,
          date: h.date,
          units: h.units,
          warehouse: h.warehouse,
          sku: item.itemNumber,
          name: resolveItemDisplay(item).primaryName,
          deptName: item.deptName,
          color
        };
      });

      collectedPoints.push(...linePoints);

      ctx.save();
      if (hasAnyHover && !isHovered) {
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 1.2;
      } else if (isHovered) {
        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 3.6;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
      } else {
        ctx.globalAlpha = plotted.length > 20 ? 0.45 : 0.85;
        ctx.lineWidth = plotted.length > 20 ? 1.5 : 2.2;
      }

      ctx.strokeStyle = color;
      ctx.beginPath();
      linePoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();

      if (!hasAnyHover || isHovered) {
        const radius = isHovered ? 4.5 : plotted.length > 20 ? 2 : 3;
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = isHovered ? 1.0 : plotted.length > 20 ? 0.6 : 0.9;
        for (const pt of linePoints) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // Highlight hovered point with luminous ring
    if (state.trajHoveredPoint) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(state.trajHoveredPoint.x, state.trajHoveredPoint.y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = state.trajHoveredPoint.color || '#2563eb';
      ctx.stroke();
      ctx.restore();
    }

    state.trajDataPoints = collectedPoints;
  }

  function renderTrajectoriesLegend(candidates, skuColorMap) {
    const listEl = document.getElementById('trajectoriesLegendList');
    if (!listEl) return;

    listEl.innerHTML = '';
    if (!candidates || candidates.length === 0) {
      listEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:1rem;color:var(--text-muted);font-size:0.82rem">No repeat SKUs match the current trajectory criteria.</div>';
      return;
    }

    candidates.forEach((item) => {
      const isActive = state.trajActiveSkus ? state.trajActiveSkus.has(item.itemNumber) : false;
      const color = skuColorMap.get(item.itemNumber) || 'var(--text-muted)';
      const isHovered = item.itemNumber === state.trajHoveredSku;
      const info = resolveItemDisplay(item);

      const chip = document.createElement('div');
      chip.className = `traj-legend-chip ${isActive ? '' : 'dimmed'} ${isHovered ? 'active-highlight' : ''}`;
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('role', 'button');
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      chip.setAttribute('aria-label', `${isActive ? 'Hide' : 'Show'} ${info.primaryName}`);

      const pillClass =
        Math.abs(item.pctChange) < 0.05 ? 'flat' : item.pctChange > 0 ? 'up' : 'down';

      chip.innerHTML = `
        <div class="traj-chip-left">
          <span class="traj-chip-dot" style="background:${isActive ? color : 'var(--text-muted)'}"></span>
          <span class="traj-chip-name" title="${escapeHtml(info.primaryName)}">${escapeHtml(info.primaryName)}</span>
          <span class="traj-chip-sku">#${item.itemNumber}</span>
        </div>
        <div class="traj-chip-right">
          <span class="traj-chip-price">${formatCurrency(item.latestPrice)}</span>
          <span class="traj-chip-badge ${pillClass}">${formatPct(item.pctChange, 1)}</span>
        </div>
      `;

      chip.addEventListener('mouseenter', () => {
        if (isActive) {
          state.trajHoveredSku = item.itemNumber;
          renderSkuTrajectoriesChart();
        }
      });

      chip.addEventListener('mouseleave', () => {
        if (state.trajHoveredSku === item.itemNumber) {
          state.trajHoveredSku = null;
          state.trajHoveredPoint = null;
          renderSkuTrajectoriesChart();
        }
      });

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!state.trajActiveSkus) state.trajActiveSkus = new Set();
        if (state.trajActiveSkus.has(item.itemNumber)) {
          state.trajActiveSkus.delete(item.itemNumber);
        } else {
          state.trajActiveSkus.add(item.itemNumber);
        }
        renderSkuTrajectoriesChart();
      });

      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
        }
      });

      listEl.appendChild(chip);
    });
  }

  function setupTrajectoriesInteractions() {
    document.getElementById('trajPresetSelect')?.addEventListener('change', (e) => {
      state.trajPreset = e.target.value;
      updateTrajectoriesActiveSkusFromPreset(e.target.value);
      renderSkuTrajectoriesChart();
    });

    document.getElementById('trajDeptSelect')?.addEventListener('change', (e) => {
      state.trajDept = e.target.value;
      renderSkuTrajectoriesChart();
    });

    document.getElementById('trajSearchInput')?.addEventListener('input', (e) => {
      state.trajQuery = e.target.value;
      renderSkuTrajectoriesChart();
    });

    document.getElementById('btnTrajModePct')?.addEventListener('click', () => {
      state.trajMode = 'pct';
      document.getElementById('btnTrajModePct')?.classList.add('active');
      document.getElementById('btnTrajModePrice')?.classList.remove('active');
      renderSkuTrajectoriesChart();
    });

    document.getElementById('btnTrajModePrice')?.addEventListener('click', () => {
      state.trajMode = 'price';
      document.getElementById('btnTrajModePrice')?.classList.add('active');
      document.getElementById('btnTrajModePct')?.classList.remove('active');
      renderSkuTrajectoriesChart();
    });

    document.getElementById('btnTrajShowAll')?.addEventListener('click', () => {
      state.trajPreset = 'all_repeat';
      const presetSelect = document.getElementById('trajPresetSelect');
      if (presetSelect) presetSelect.value = 'all_repeat';
      updateTrajectoriesActiveSkusFromPreset('all_repeat');
      renderSkuTrajectoriesChart();
    });

    document.getElementById('btnTrajClearAll')?.addEventListener('click', () => {
      state.trajActiveSkus = new Set();
      renderSkuTrajectoriesChart();
    });

    document.getElementById('btnTrajResetTop10')?.addEventListener('click', () => {
      state.trajPreset = 'top_spend';
      const presetSelect = document.getElementById('trajPresetSelect');
      if (presetSelect) presetSelect.value = 'top_spend';
      updateTrajectoriesActiveSkusFromPreset('top_spend');
      renderSkuTrajectoriesChart();
    });

    const canvas = document.getElementById('trajectoriesCanvas');
    const tooltip = document.getElementById('trajectoriesTooltip');

    if (canvas && tooltip) {
      canvas.addEventListener('mousemove', (e) => {
        if (!state.trajDataPoints || state.trajDataPoints.length === 0) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let closest = null;
        let minDist = 35;

        for (const pt of state.trajDataPoints) {
          const dist = Math.hypot(mouseX - pt.x, mouseY - pt.y);
          if (dist < minDist) {
            minDist = dist;
            closest = pt;
          }
        }

        if (closest) {
          const skuChanged = state.trajHoveredSku !== closest.sku;
          const ptChanged = !state.trajHoveredPoint || state.trajHoveredPoint.x !== closest.x || state.trajHoveredPoint.y !== closest.y;
          if (skuChanged || ptChanged) {
            state.trajHoveredSku = closest.sku;
            state.trajHoveredPoint = closest;
            renderSkuTrajectoriesChart();
          }

          tooltip.hidden = false;
          const tipLeft = Math.min(Math.max(closest.x - 110, 10), rect.width - 240);
          const tipTop = Math.max(closest.y - 85, 10);
          tooltip.style.left = `${tipLeft}px`;
          tooltip.style.top = `${tipTop}px`;

          const pctVal = closest.pctChange !== undefined ? closest.pctChange : closest.val;
          const pillClass =
            Math.abs(pctVal) < 0.05 ? 'flat' : pctVal > 0 ? 'up' : 'down';

          const deltaDollar = closest.price - (closest.basePrice || closest.price);
          const dollarDetail = state.trajMode === 'price' && Math.abs(deltaDollar) >= 0.01
            ? `<span style="font-size:0.75rem;color:var(--text-muted);margin-left:4px">(${formatSignedCurrency(deltaDollar)})</span>`
            : '';

          tooltip.innerHTML = `
            <div style="font-weight:700;color:var(--text-primary);margin-bottom:2px">${escapeHtml(closest.name)}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px">SKU #${closest.sku} &bull; ${formatDateShort(closest.date)} (${escapeHtml(closest.warehouse || 'Wholesale')})</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
              <span>Unit Price: <strong>${formatCurrency(closest.price)}</strong>${dollarDetail}</span>
              <span class="traj-chip-badge ${pillClass}">${formatPct(pctVal, 1)}</span>
            </div>
          `;
        } else {
          if (state.trajHoveredSku !== null || state.trajHoveredPoint !== null) {
            state.trajHoveredSku = null;
            state.trajHoveredPoint = null;
            renderSkuTrajectoriesChart();
          }
          tooltip.hidden = true;
        }
      });

      canvas.addEventListener('mouseleave', () => {
        if (state.trajHoveredSku !== null || state.trajHoveredPoint !== null) {
          state.trajHoveredSku = null;
          state.trajHoveredPoint = null;
          renderSkuTrajectoriesChart();
        }
        tooltip.hidden = true;
      });
    }
  }

  function exportSkuCsv() {
    if (!state.analytics || !state.analytics.skuList) return;
    const rows = [
      ['Item #', 'Description', 'Raw POS Description', 'Department', 'Spend Weight (%)', 'Purchases', 'Total Units', 'First Price', 'First Date', 'Latest Price', 'Latest Date', 'Added Cost ($)', 'Inflation (%)', 'Annualized YoY (%)']
    ];
    for (const item of state.analytics.skuList) {
      const info = resolveItemDisplay(item);
      rows.push([
        item.itemNumber,
        `"${(info.primaryName || item.name || '').replace(/"/g, '""')}"`,
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

        if (viewId === 'view-trajectories' && state.analytics) {
          setTimeout(() => renderSkuTrajectoriesChart(), 50);
        }
        if (viewId === 'view-macro' && state.analytics) {
          setTimeout(() => renderMacroCpiChart(state.analytics.cpiSeries), 50);
        }
      });
    });

    // Theme toggle & state persistence (discrete icon)
    const themeBtn = document.getElementById('themeToggleBtn');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (themeBtn) {
        const nextMode = theme === 'dark' ? 'light' : 'dark';
        themeBtn.setAttribute('title', `Switch to ${nextMode} mode`);
        themeBtn.setAttribute('aria-label', `Switch to ${nextMode} mode`);
      }
      try {
        localStorage.setItem('inflation_theme', theme);
        localStorage.setItem('pinflation_theme', theme);
      } catch (_) {}
    }

    const currentTheme =
      document.documentElement.getAttribute('data-theme') ||
      localStorage.getItem('inflation_theme') ||
      localStorage.getItem('pinflation_theme') ||
      'light';
    applyTheme(currentTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        renderTerminal();
      });
    }
  }

  function setupDialog() {
    const dialog = document.getElementById('syncModal');
    if (!dialog) return;

    function openModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      try {
        if (dialog.open) {
          dialog.close();
        }
        dialog.showModal();
      } catch (err) {
        dialog.setAttribute('open', '');
      }
    }

    // Direct element listeners
    document.getElementById('openSyncModalBtn')?.addEventListener('click', openModal);
    document.getElementById('emptyStateOpenSyncBtn')?.addEventListener('click', openModal);

    // Global delegated listener for any [data-action="open-connector"]
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#openSyncModalBtn, #emptyStateOpenSyncBtn, [data-action="open-connector"]');
      if (btn) {
        openModal(e);
      }
    });

    // Close on backdrop click (click on dialog itself, outside .modal-content)
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    // Close button inside form
    dialog.querySelector('.icon-close-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.close();
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

  function getStoredReceipts() {
    try {
      const raw =
        localStorage.getItem('inflation_user_receipts') ||
        localStorage.getItem('pinflation_user_receipts');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setStoredReceipts(receipts) {
    try {
      const str = typeof receipts === 'string' ? receipts : JSON.stringify(receipts);
      localStorage.setItem('inflation_user_receipts', str);
      localStorage.setItem('pinflation_user_receipts', str);
    } catch (_) {}
  }

  function clearStoredReceipts() {
    try {
      localStorage.removeItem('inflation_user_receipts');
      localStorage.removeItem('pinflation_user_receipts');
    } catch (_) {}
  }

  async function loadDataset() {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // 1. Try local Node server if running on localhost
    if (isLocalhost) {
      try {
        const res = await fetch('/api/receipts');
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.receipts && data.receipts.length > 0) {
            state.source = data.source || 'live';
            state.receipts = data.receipts;
            renderTerminal();
            return;
          }
        }
      } catch (_) {}
    }

    // 2. Client-side static fallback for GitHub Pages (localStorage)
    const stored = getStoredReceipts();
    if (stored && Array.isArray(stored) && stored.length > 0) {
      state.source = 'live';
      state.receipts = stored;
      renderTerminal();
      return;
    }

    // 3. Start with zero data and direct user to Costco Connector
    state.source = 'none';
    state.receipts = [];
    renderTerminal();
  }

  async function importJsonPayload(parsed) {
    try {
      showStatus('Ingesting receipts into terminal repository...', false);
      let incoming = Array.isArray(parsed)
        ? parsed
        : (parsed.receipts || parsed?.data?.receiptsWithCounts?.receipts || []);

      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      // Try local server only if running on localhost
      if (isLocalhost) {
        try {
          const res = await fetch('/api/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: parsed, merge: true })
          });
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            const result = await res.json();
            state.source = result.source;
            state.receipts = result.receipts;
            setStoredReceipts(result.receipts);
            renderTerminal();
            showStatus(
              `✅ Imported ${result.importedCount} receipts (${result.totalCount} total active).`,
              false
            );
            return;
          }
        } catch (_) {}
      }

      // In-browser client fallback for GitHub Pages
      if (incoming.length > 0) {
        let existing = getStoredReceipts() || [];
        const byKey = new Map();
        for (const r of [...incoming, ...existing]) {
          const k = r.transactionBarcode || `${r.transactionDateTime || r.transactionDate}-${r.total}`;
          if (!byKey.has(k)) byKey.set(k, r);
        }
        const merged = Array.from(byKey.values()).sort(
          (a, b) => new Date(b.transactionDateTime || 0) - new Date(a.transactionDateTime || 0)
        );
        setStoredReceipts(merged);
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

    // Modal Tab 3: Export Backup & Clear Data
    document.getElementById('exportBackupJsonBtn')?.addEventListener('click', () => {
      if (!state.receipts || state.receipts.length === 0) {
        showStatus('⚠️ No receipts to export yet. Please sync your account first.', true);
        return;
      }
      const payload = {
        exportedAt: new Date().toISOString(),
        receiptCount: state.receipts.length,
        receipts: state.receipts
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `costco_receipts_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus(`✓ Exported backup with ${state.receipts.length} receipts.`, false);
    });

    document.getElementById('clearDataBtn')?.addEventListener('click', () => {
      if (confirm('Clear all stored Costco receipts from browser storage?')) {
        clearStoredReceipts();
        state.receipts = [];
        state.source = 'none';
        renderTerminal();
        showStatus('✓ Cleared all receipts from browser storage.', false);
      }
    });

    // Empty state call-to-actions
    const syncModal = document.getElementById('syncModal');
    document.getElementById('emptyStateOpenSyncBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (syncModal.open) syncModal.close();
        syncModal.showModal();
      } catch (_) {
        syncModal.setAttribute('open', '');
      }
    });

    document.getElementById('emptyStateCopyScriptBtn')?.addEventListener('click', (e) => {
      copyConsoleScript(e.currentTarget);
    });

    const emptyDropzone = document.getElementById('emptyDropzone');
    if (emptyDropzone) {
      emptyDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        emptyDropzone.classList.add('dragover');
      });
      emptyDropzone.addEventListener('dragleave', () => emptyDropzone.classList.remove('dragover'));
      emptyDropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        emptyDropzone.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) {
          try {
            const text = await file.text();
            await importJsonPayload(JSON.parse(text));
          } catch (err) {
            alert('Could not read JSON file: ' + err.message);
          }
        }
      });
      emptyDropzone.addEventListener('click', () => {
        document.getElementById('jsonFileInput')?.click();
      });
    }

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
      let idToken = document.getElementById('costcoIdTokenInput').value.trim();
      const refreshToken = document.getElementById('costcoRefreshTokenInput').value.trim();
      const yearsBack = Number(document.getElementById('costcoYearsBackSelect').value) || 3;

      if (!idToken) {
        showStatus('⚠️ Please paste your Costco Bearer idToken first.', true);
        return;
      }

      // Sanitize token: remove 'Bearer ', wrapping quotes, whitespace
      idToken = idToken.replace(/^Bearer\s+/i, '').replace(/^["']|["']$/g, '').trim();

      // Check token expiration if possible
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          if (payload.exp && Date.now() >= payload.exp * 1000) {
            const expDate = new Date(payload.exp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            showStatus(
              `⚠️ This Costco idToken expired at ${expDate} (Costco tokens expire after ~1 hour). Please run copy(localStorage.getItem('idToken')) in your Costco console for a fresh token.`,
              true
            );
            return;
          }
        }
      } catch (_) {}

      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      // 1. If running locally with Node daemon, try server endpoint first
      if (isLocalhost) {
        try {
          showStatus('⏳ Querying Costco GraphQL API via local Node daemon...', false);
          const res = await fetch('/api/sync-costco', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken, refreshToken, yearsBack })
          });
          const ct = res.headers.get('content-type') || '';
          if (res.ok && ct.includes('application/json')) {
            const result = await res.json();
            state.source = result.source;
            state.receipts = result.receipts;
            setStoredReceipts(result.receipts);
            renderTerminal();
            showStatus(
              `✅ Successfully synced ${result.fetchedCount} receipts from Costco.com (${result.totalCount} active receipts)!`,
              false
            );
            return;
          }
        } catch (serverErr) {
          console.warn('Local API sync fallback to browser direct fetch:', serverErr.message);
        }
      }

      // 2. Direct In-Browser GraphQL Sync (Client-Side for GitHub Pages & static hosting)
      try {
        showStatus(`⏳ Initializing direct in-browser Costco GraphQL sync (${yearsBack} years)...`, false);

        const RECEIPT_FIELDS = `
          warehouseName
          warehouseShortName
          warehouseNumber
          companyNumber
          receiptType
          documentType
          transactionDateTime
          transactionDate
          transactionBarcode
          transactionNumber
          registerNumber
          operatorNumber
          transactionType
          total
          subTotal
          taxes
          instantSavings
          totalItemCount
          membershipNumber
          warehouseAddress1
          warehouseCity
          warehouseState
          warehousePostalCode
          itemArray {
            itemNumber
            itemDescription01
            itemDescription02
            itemIdentifier
            itemDepartmentNumber
            unit
            amount
            itemUnitPriceAmount
            taxFlag
            entryMethod
            transDepartmentNumber
            fuelUnitQuantity
            fuelGradeDescription
          }
          couponArray {
            upcnumberCoupon
            voidflagCoupon
            refundflagCoupon
            taxflagCoupon
            amountCoupon
          }
          tenderArray {
            tenderTypeCode
            tenderDescription
            amountTender
            displayAccountNumber
          }
        `;

        const QUERY_WITH_COUNTS = `
          query receiptsWithCounts($startDate: String!, $endDate: String!, $documentType: String!, $documentSubType: String!) {
            receiptsWithCounts(startDate: $startDate, endDate: $endDate, documentType: $documentType, documentSubType: $documentSubType) {
              inWarehouse
              gasStation
              carWash
              gasAndCarWash
              receipts {
                ${RECEIPT_FIELDS}
              }
            }
          }
        `.replace(/\s+/g, ' ');

        const QUERY_LEGACY = `
          query receipts($startDate: String!, $endDate: String!) {
            receipts(startDate: $startDate, endDate: $endDate) {
              ${RECEIPT_FIELDS}
            }
          }
        `.replace(/\s+/g, ' ');

        function formatMmDdYyyy(date) {
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const yyyy = date.getFullYear();
          return `${mm}/${dd}/${yyyy}`;
        }

        let clientID = '4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf';
        try {
          const parts = idToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload.clientId) clientID = payload.clientId;
          }
        } catch (_) {}

        async function fetchWindowDirect(startDateStr, endDateStr) {
          const headers = {
            'Accept': '*/*',
            'Content-Type': 'application/json-patch+json',
            'Costco.Env': 'ecom',
            'Costco.Service': 'restOrders',
            'Costco-X-Wcs-Clientid': clientID,
            'Client-Identifier': '481b1aec-aa3b-454b-b81b-48187e28f205',
            'Costco-X-Authorization': `Bearer ${idToken}`
          };

          // 1. Try modern query
          let res = await fetch('https://ecom-api.costco.com/ebusiness/order/v1/orders/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: QUERY_WITH_COUNTS,
              variables: {
                startDate: startDateStr,
                endDate: endDateStr,
                documentType: 'all',
                documentSubType: 'all'
              }
            })
          });

          if (res.ok) {
            const json = await res.json();
            const rc = json?.data?.receiptsWithCounts;
            if (rc) {
              const list = Array.isArray(rc) ? rc[0]?.receipts : rc.receipts;
              if (Array.isArray(list)) return list;
            }
          }

          // 2. Fallback to legacy query
          res = await fetch('https://ecom-api.costco.com/ebusiness/order/v1/orders/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: QUERY_LEGACY,
              variables: {
                startDate: startDateStr,
                endDate: endDateStr
              }
            })
          });

          if (res.ok) {
            const json = await res.json();
            const list = json?.data?.receipts;
            if (Array.isArray(list)) return list;
          }

          let errDetail = '';
          try {
            const errJson = await res.json();
            errDetail = errJson?.errors?.[0]?.message || errJson?.message || '';
          } catch (_) {}
          throw new Error(errDetail || `HTTP ${res.status} (${res.statusText || 'GraphQL Error'})`);
        }

        const now = new Date();
        const totalMonths = yearsBack * 12;
        const windowMonths = 6;
        const allFetched = [];
        let failureCount = 0;
        let lastErr = '';

        for (let offset = 0; offset < totalMonths; offset += windowMonths) {
          const end = new Date(now.getFullYear(), now.getMonth() - offset, now.getDate());
          const start = new Date(now.getFullYear(), now.getMonth() - (offset + windowMonths), now.getDate());
          const startStr = formatMmDdYyyy(start);
          const endStr = formatMmDdYyyy(end);

          showStatus(
            `⏳ Fetching window ${startStr} – ${endStr}... (${allFetched.length} receipts collected so far)`,
            false
          );

          try {
            const windowReceipts = await fetchWindowDirect(startStr, endStr);
            if (Array.isArray(windowReceipts)) {
              allFetched.push(...windowReceipts);
            }
          } catch (wErr) {
            failureCount++;
            lastErr = wErr.message;
            console.warn(`Window ${startStr} - ${endStr} error:`, wErr.message);
          }
        }

        if (allFetched.length === 0 && failureCount > 0) {
          throw new Error(
            `Costco API returned: ${lastErr}. Check that your idToken is fresh (tokens expire after ~1 hour). If needed, run the Option 2 console script in your Costco tab.`
          );
        }

        // Deduplicate and merge with existing localStorage receipts
        const byKey = new Map();
        for (const r of allFetched) {
          const k = r.transactionBarcode || `${r.transactionDateTime || r.transactionDate}-${r.total}`;
          if (!byKey.has(k)) byKey.set(k, r);
        }
        const incoming = Array.from(byKey.values());

        let existing = getStoredReceipts() || [];
        for (const r of existing) {
          const k = r.transactionBarcode || `${r.transactionDateTime || r.transactionDate}-${r.total}`;
          if (!byKey.has(k)) byKey.set(k, r);
        }

        const merged = Array.from(byKey.values()).sort(
          (a, b) => new Date(b.transactionDateTime || 0) - new Date(a.transactionDateTime || 0)
        );

        setStoredReceipts(merged);
        state.source = 'live';
        state.receipts = merged;
        renderTerminal();

        showStatus(
          `✅ Successfully synced ${incoming.length} receipts directly from Costco.com (${merged.length} active in browser)!`,
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
      const val = e.target.value;
      if (val === 'spend_desc') { state.sortCol = 'spend'; state.sortDir = 'desc'; }
      else if (val === 'pct_desc') { state.sortCol = 'inflation'; state.sortDir = 'desc'; }
      else if (val === 'cagr_desc') { state.sortCol = 'cagr'; state.sortDir = 'desc'; }
      else if (val === 'abs_desc') { state.sortCol = 'addedCost'; state.sortDir = 'desc'; }
      else if (val === 'pct_asc') { state.sortCol = 'inflation'; state.sortDir = 'asc'; }
      else if (val === 'count_desc') { state.sortCol = 'orders'; state.sortDir = 'desc'; }
      renderSkuTable();
    });

    document.querySelectorAll('.terminal-table th.sortable').forEach((th) => {
      function triggerHeaderSort() {
        const col = th.getAttribute('data-sort');
        if (!col) return;
        if (state.sortCol === col) {
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortCol = col;
          state.sortDir = (col === 'name' || col === 'dept') ? 'asc' : 'desc';
        }
        renderSkuTable();
      }

      th.addEventListener('click', triggerHeaderSort);
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerHeaderSort();
        }
      });
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
        if (state.currentView === 'view-trajectories') {
          renderSkuTrajectoriesChart();
        }
        const activeItem = state.analytics.skuList.find((s) => s.itemNumber === state.selectedSku);
        if (activeItem) renderItemDetailChart(activeItem);
      }
    });
  }

  function setupInfoTooltips() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.metric-info-btn');
      const allWraps = document.querySelectorAll('.info-tooltip-wrap');
      if (btn) {
        e.stopPropagation();
        const wrap = btn.closest('.info-tooltip-wrap');
        const wasOpen = wrap.classList.contains('is-open');
        allWraps.forEach((w) => w.classList.remove('is-open'));
        if (!wasOpen) wrap.classList.add('is-open');
      } else if (!e.target.closest('.info-tooltip-popover')) {
        allWraps.forEach((w) => w.classList.remove('is-open'));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.info-tooltip-wrap').forEach((w) => w.classList.remove('is-open'));
      }
    });
  }

  async function init() {
    setupDialog();
    setupNavigation();
    setupFilters();
    setupSyncAndImportControls();
    setupMainChartHover();
    setupInfoTooltips();
    setupTrajectoriesInteractions();

    const verEl = document.getElementById('footerAppVersion');
    if (verEl) verEl.textContent = `v${APP_VERSION}`;

    // 1. Load export script text
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      try {
        const scriptRes = await fetch('/api/export-script');
        if (scriptRes.ok && scriptRes.headers.get('content-type')?.includes('application/json')) {
          const scriptData = await scriptRes.json();
          state.exportScriptText = scriptData.script || '';
        }
      } catch (_) {}
    }

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
    await loadDataset();
  }

  init();
})();
