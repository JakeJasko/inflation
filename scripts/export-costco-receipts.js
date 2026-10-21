/**
 * Costco Warehouse Receipts Bulk Exporter
 *
 * Instructions:
 * 1. Log in to https://www.costco.com and go to Orders & Purchases -> Warehouse tab.
 * 2. Open Developer Tools (F12 or Ctrl+Shift+I) -> Console tab.
 * 3. Paste this entire script and press Enter.
 * 4. It will fetch your historical warehouse receipts (with all line items, item numbers,
 *    unit prices, and instant savings discounts) and download `costco_receipts.json`.
 */
(async function exportCostcoReceipts(yearsBack = 3) {
  function findIdToken() {
    const direct = localStorage.getItem('idToken') || sessionStorage.getItem('idToken');
    if (direct) return direct;

    // Fallback: search MSAL / OIDC storage keys if Costco stores under an MSAL cache entry
    for (const storage of [localStorage, sessionStorage]) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const val = storage.getItem(key);
        if (!val) continue;
        if (key.toLowerCase().includes('idtoken')) {
          try {
            const parsed = JSON.parse(val);
            if (parsed && parsed.secret) return parsed.secret;
          } catch (_) {}
        }
        // Raw JWT check (3 base64url segments starting with eyJ)
        if (val.startsWith('eyJ') && val.split('.').length === 3) {
          return val;
        }
      }
    }
    return null;
  }

  const idToken = findIdToken();
  if (!idToken) {
    console.error('❌ Could not find Costco idToken in localStorage/sessionStorage. Make sure you are logged in on the Orders & Purchases page.');
    return;
  }

  const clientID = localStorage.getItem('clientID') || '4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf';

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

  function formatDateUS(date) {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  async function fetchWindow(startDateStr, endDateStr) {
    const headers = {
      'Accept': '*/*',
      'Content-Type': 'application/json-patch+json',
      'Costco.Env': 'ecom',
      'Costco.Service': 'restOrders',
      'Costco-X-Wcs-Clientid': clientID,
      'Client-Identifier': '481b1aec-aa3b-454b-b81b-48187e28f205',
      'Costco-X-Authorization': `Bearer ${idToken}`
    };

    // Try modern receiptsWithCounts query first
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

    // Fallback to legacy receipts query
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

    throw new Error(`GraphQL request failed for ${startDateStr} - ${endDateStr}`);
  }

  console.log(`🛒 Fetching Costco receipts for the last ${yearsBack} years...`);
  const allReceiptsByBarcode = new Map();
  const now = new Date();

  // Fetch in 6-month windows going back `yearsBack` years
  const totalMonths = yearsBack * 12;
  const windowMonths = 6;

  for (let offset = 0; offset < totalMonths; offset += windowMonths) {
    const end = new Date(now.getFullYear(), now.getMonth() - offset, now.getDate());
    const start = new Date(now.getFullYear(), now.getMonth() - (offset + windowMonths), now.getDate());
    const startStr = formatDateUS(start);
    const endStr = formatDateUS(end);

    try {
      console.log(`  ⏳ Querying ${startStr} to ${endStr}...`);
      const receipts = await fetchWindow(startStr, endStr);
      console.log(`  ✅ Found ${receipts.length} receipts in window.`);
      for (const r of receipts) {
        const key = r.transactionBarcode || `${r.transactionDateTime}-${r.total}`;
        if (!allReceiptsByBarcode.has(key)) {
          allReceiptsByBarcode.set(key, r);
        }
      }
    } catch (err) {
      console.warn(`  ⚠️ Window ${startStr} - ${endStr} error:`, err.message);
    }
  }

  const allReceipts = Array.from(allReceiptsByBarcode.values()).sort(
    (a, b) => new Date(b.transactionDateTime) - new Date(a.transactionDateTime)
  );

  console.log(`🎉 Total unique receipts fetched: ${allReceipts.length}`);

  const payload = {
    exportedAt: new Date().toISOString(),
    receiptCount: allReceipts.length,
    receipts: allReceipts
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'costco_receipts.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
})();
