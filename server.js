const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const LIVE_RECEIPTS_PATH = path.join(DATA_DIR, 'receipts.json');
const TOKENS_PATH = path.join(DATA_DIR, 'tokens.json');
const EXPORT_SCRIPT_PATH = path.join(ROOT_DIR, 'scripts', 'export-costco-receipts.js');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

/**
 * Normalize any Costco receipt JSON structure into a flat array of receipts.
 */
function extractReceiptsArray(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.receipts)) return input.receipts;
  const rc = input?.data?.receiptsWithCounts || input?.receiptsWithCounts;
  if (rc) {
    if (Array.isArray(rc) && Array.isArray(rc[0]?.receipts)) return rc[0].receipts;
    if (Array.isArray(rc.receipts)) return rc.receipts;
  }
  if (Array.isArray(input?.data?.receipts)) return input.data.receipts;
  return [];
}

/**
 * Deduplicate and sort receipts newest-first.
 */
function deduplicateReceipts(receipts) {
  const byKey = new Map();
  for (const r of receipts) {
    if (!r || typeof r !== 'object') continue;
    const key = r.transactionBarcode || `${r.transactionDateTime || r.transactionDate}-${r.total}`;
    if (!byKey.has(key)) {
      byKey.set(key, r);
    }
  }
  return Array.from(byKey.values()).sort((a, b) => {
    const da = new Date(a.transactionDateTime || a.transactionDate || 0).getTime();
    const db = new Date(b.transactionDateTime || b.transactionDate || 0).getTime();
    return db - da;
  });
}

/**
 * Auto-ingest any `costco_receipts*.json` or `costco-*.json` dropped in the workspace root.
 */
function checkDroppedFiles() {
  try {
    const files = fs.readdirSync(ROOT_DIR);
    const match = files.find(
      (f) => /^costco[_-].*\.json$/i.test(f) && fs.statSync(path.join(ROOT_DIR, f)).isFile()
    );
    if (match) {
      const fullPath = path.join(ROOT_DIR, match);
      const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const incoming = extractReceiptsArray(raw);
      if (incoming.length > 0) {
        let existing = [];
        if (fs.existsSync(LIVE_RECEIPTS_PATH)) {
          try {
            existing = extractReceiptsArray(JSON.parse(fs.readFileSync(LIVE_RECEIPTS_PATH, 'utf8')));
          } catch (_) {}
        }
        const merged = deduplicateReceipts([...incoming, ...existing]);
        fs.writeFileSync(
          LIVE_RECEIPTS_PATH,
          JSON.stringify(
            {
              source: 'live',
              exportedAt: raw.exportedAt || new Date().toISOString(),
              importedFromFile: match,
              receiptCount: merged.length,
              receipts: merged
            },
            null,
            2
          ),
          'utf8'
        );
      }
    }
  } catch (err) {
    console.warn('Dropped file check warning:', err.message);
  }
}

function loadActiveReceipts(forceDemo = false) {
  checkDroppedFiles();
  if (!forceDemo && fs.existsSync(LIVE_RECEIPTS_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(LIVE_RECEIPTS_PATH, 'utf8'));
      const receipts = extractReceiptsArray(data);
      if (receipts.length > 0) {
        return {
          source: 'live',
          exportedAt: data.exportedAt || new Date().toISOString(),
          hasLiveReceipts: true,
          hasStoredToken: fs.existsSync(TOKENS_PATH),
          receiptCount: receipts.length,
          receipts
        };
      }
    } catch (_) {}
  }

  return {
    source: 'none',
    exportedAt: new Date().toISOString(),
    hasLiveReceipts: false,
    hasStoredToken: fs.existsSync(TOKENS_PATH),
    receiptCount: 0,
    receipts: []
  };
}

/**
 * Refresh Costco OAuth token using a refresh_token if available.
 */
async function refreshCostcoToken(refreshToken) {
  const tokenEndpoint =
    'https://signin.costco.com/e0714dd4-784d-46d6-a278-3e29553483eb/b2c_1a_sso_wcs_signup_signin_209/oauth2/v2.0/token';
  const params = new URLSearchParams({
    client_id: 'a3a5186b-7c89-4b4c-93a8-dd604e930757',
    grant_type: 'refresh_token',
    client_info: '1',
    'x-client-SKU': 'msal.js.browser',
    'x-client-VER': '2.32.1',
    'x-ms-lib-capability': 'retry-after, h429',
    'x-client-current-telemetry': '5|61,0,,,|@azure/msal-react,1.5.1',
    'x-client-last-telemetry': '5|0|||0,0',
    'client-request-id': crypto.randomUUID(),
    refresh_token: refreshToken
  });

  const resp = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Accept: '*/*',
      Origin: 'https://www.costco.com',
      Referer: 'https://www.costco.com/',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
    },
    body: params.toString()
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Costco token refresh failed (${resp.status}): ${text.slice(0, 200)}`);
  }

  return await resp.json();
}

const RECEIPT_GRAPHQL_FIELDS = `
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
        ${RECEIPT_GRAPHQL_FIELDS}
      }
    }
  }
`.replace(/\s+/g, ' ');

const QUERY_LEGACY = `
  query receipts($startDate: String!, $endDate: String!) {
    receipts(startDate: $startDate, endDate: $endDate) {
      ${RECEIPT_GRAPHQL_FIELDS}
    }
  }
`.replace(/\s+/g, ' ');

function formatDateUS(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

async function fetchCostcoGraphQLWindow(idToken, clientID, startDateStr, endDateStr) {
  const endpoint = 'https://ecom-api.costco.com/ebusiness/order/v1/orders/graphql';
  const cleanToken = idToken.replace(/^Bearer\s+/i, '').trim();
  const headers = {
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json-patch+json',
    Origin: 'https://www.costco.com',
    Referer: 'https://www.costco.com/',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    'client-identifier': '481b1aec-aa3b-454b-b81b-48187e28f205',
    'costco-x-authorization': `Bearer ${cleanToken}`,
    'costco-x-wcs-clientId': clientID || '4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf',
    'costco.env': 'ecom',
    'costco.service': 'restOrders'
  };

  let res = await fetch(endpoint, {
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
    const list = extractReceiptsArray(json);
    if (Array.isArray(list) && !json.errors) return list;
  }

  // Fallback to legacy receipts query
  res = await fetch(endpoint, {
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

  if (!res.ok) {
    throw new Error(`Costco GraphQL HTTP ${res.status}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message || 'GraphQL error');
  }
  return extractReceiptsArray(json);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 50 * 1024 * 1024) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const str = Buffer.concat(chunks).toString('utf8');
        resolve(str ? JSON.parse(str) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  try {
    if (req.method === 'GET' && pathname === '/api/receipts') {
      const forceDemo = parsedUrl.searchParams.get('mode') === 'demo';
      const data = loadActiveReceipts(forceDemo);
      return sendJson(res, 200, data);
    }

    if (req.method === 'GET' && pathname === '/api/export-script') {
      const script = fs.existsSync(EXPORT_SCRIPT_PATH)
        ? fs.readFileSync(EXPORT_SCRIPT_PATH, 'utf8')
        : '';
      return sendJson(res, 200, { script });
    }

    if (req.method === 'POST' && pathname === '/api/import') {
      const body = await readJsonBody(req);
      const incoming = extractReceiptsArray(body.data || body);
      if (!incoming || incoming.length === 0) {
        return sendJson(res, 400, {
          error: 'No valid Costco receipts found in the provided JSON.'
        });
      }

      let existing = [];
      if (body.merge !== false && fs.existsSync(LIVE_RECEIPTS_PATH)) {
        try {
          existing = extractReceiptsArray(JSON.parse(fs.readFileSync(LIVE_RECEIPTS_PATH, 'utf8')));
        } catch (_) {}
      }

      const merged = deduplicateReceipts([...incoming, ...existing]);
      const savedPayload = {
        source: 'live',
        exportedAt: new Date().toISOString(),
        receiptCount: merged.length,
        receipts: merged
      };
      fs.writeFileSync(LIVE_RECEIPTS_PATH, JSON.stringify(savedPayload, null, 2), 'utf8');

      return sendJson(res, 200, {
        ok: true,
        importedCount: incoming.length,
        totalCount: merged.length,
        ...loadActiveReceipts(false)
      });
    }

    if (req.method === 'POST' && pathname === '/api/sync-costco') {
      const body = await readJsonBody(req);
      let idToken = (body.idToken || '').trim();
      let refreshToken = (body.refreshToken || '').trim();
      const clientID = (body.clientID || '4900eb1f-0c10-4bd9-99c3-c59e6c1ecebf').trim();
      const yearsBack = Math.min(Math.max(Number(body.yearsBack) || 3, 1), 10);

      // Allow pasting the full OAuth2 /token JSON response directly into idToken
      if (idToken.startsWith('{')) {
        try {
          const parsedTokenObj = JSON.parse(idToken);
          idToken = parsedTokenObj.id_token || parsedTokenObj.idToken || '';
          refreshToken = parsedTokenObj.refresh_token || parsedTokenObj.refreshToken || refreshToken;
        } catch (_) {}
      }

      // Check stored tokens on disk if none passed
      if (!idToken && !refreshToken && fs.existsSync(TOKENS_PATH)) {
        try {
          const stored = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
          idToken = stored.idToken || '';
          refreshToken = stored.refreshToken || '';
        } catch (_) {}
      }

      if (!idToken && refreshToken) {
        const refreshed = await refreshCostcoToken(refreshToken);
        idToken = refreshed.id_token || '';
        refreshToken = refreshed.refresh_token || refreshToken;
      }

      if (!idToken) {
        return sendJson(res, 400, {
          error:
            'Please provide your Costco idToken (from localStorage.getItem("idToken")) or OAuth token JSON.'
        });
      }

      // Persist tokens locally for future syncs
      fs.writeFileSync(
        TOKENS_PATH,
        JSON.stringify(
          {
            idToken,
            refreshToken,
            clientID,
            updatedAt: new Date().toISOString()
          },
          null,
          2
        ),
        'utf8'
      );

      const now = new Date();
      const totalMonths = yearsBack * 12;
      const windowMonths = 6;
      const collected = [];
      let lastError = null;

      for (let offset = 0; offset < totalMonths; offset += windowMonths) {
        const end = new Date(now.getFullYear(), now.getMonth() - offset, now.getDate());
        const start = new Date(now.getFullYear(), now.getMonth() - (offset + windowMonths), now.getDate());
        const startStr = formatDateUS(start);
        const endStr = formatDateUS(end);

        try {
          const windowReceipts = await fetchCostcoGraphQLWindow(idToken, clientID, startStr, endStr);
          collected.push(...windowReceipts);
        } catch (err) {
          lastError = err.message;
          // If first window fails with auth error and we have a refresh token, attempt refresh once
          if (offset === 0 && refreshToken) {
            try {
              const refreshed = await refreshCostcoToken(refreshToken);
              idToken = refreshed.id_token || idToken;
              const retryReceipts = await fetchCostcoGraphQLWindow(idToken, clientID, startStr, endStr);
              collected.push(...retryReceipts);
              lastError = null;
            } catch (refreshErr) {
              lastError = refreshErr.message;
              break;
            }
          }
        }
      }

      if (collected.length === 0 && lastError) {
        return sendJson(res, 502, {
          error: `Costco GraphQL API returned an error: ${lastError}. Tip: Use the 10-second Browser Console Script in Option 1 to bypass Akamai/CORS restrictions.`
        });
      }

      let existing = [];
      if (fs.existsSync(LIVE_RECEIPTS_PATH)) {
        try {
          existing = extractReceiptsArray(JSON.parse(fs.readFileSync(LIVE_RECEIPTS_PATH, 'utf8')));
        } catch (_) {}
      }

      const merged = deduplicateReceipts([...collected, ...existing]);
      fs.writeFileSync(
        LIVE_RECEIPTS_PATH,
        JSON.stringify(
          {
            source: 'live',
            exportedAt: new Date().toISOString(),
            receiptCount: merged.length,
            receipts: merged
          },
          null,
          2
        ),
        'utf8'
      );

      return sendJson(res, 200, {
        ok: true,
        fetchedCount: collected.length,
        totalCount: merged.length,
        ...loadActiveReceipts(false)
      });
    }

    // Serve static files from public/
    const safePath = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.join(PUBLIC_DIR, path.normalize(safePath));
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message || 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Inflation server listening on http://localhost:${PORT}`);
});
