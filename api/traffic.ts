/**
 * Serverless Endpoint: LTA Singapore Traffic Incidents
 * Source: https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
 * Header: AccountKey: <LTA_ACCOUNT_KEY>
 */

const LTA_INCIDENTS_URL = 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents';

function sendJson(res: any, status: number, data: any) {
  if (res && typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  if (res && typeof res.setHeader === 'function') {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify(data));
    return;
  }
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default async function handler(req: any, res?: any) {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    if (res && typeof res.setHeader === 'function') {
      res.statusCode = 200;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');
      res.end();
      return;
    }
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, AccountKey',
      },
    });
  }

  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_DATAMALL_KEY;

  if (!accountKey) {
    return sendJson(res, 401, {
      success: false,
      error: 'Missing LTA_ACCOUNT_KEY environment variable. Please configure LTA_ACCOUNT_KEY.',
      endpoint: LTA_INCIDENTS_URL,
      value: [],
    });
  }

  try {
    let skip = '';
    if (req.query && req.query['$skip']) {
      skip = `?$skip=${encodeURIComponent(req.query['$skip'])}`;
    } else if (typeof req.url === 'string') {
      try {
        const parsedUrl = new URL(req.url, 'http://localhost');
        const skipParam = parsedUrl.searchParams.get('$skip');
        if (skipParam) {
          skip = `?$skip=${encodeURIComponent(skipParam)}`;
        }
      } catch {
        // Ignore fallback
      }
    }

    const response = await fetch(`${LTA_INCIDENTS_URL}${skip}`, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return sendJson(res, response.status, {
        success: false,
        status: response.status,
        statusText: response.statusText,
        error: `LTA DataMall responded with status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return sendJson(res, 200, data);
  } catch (error: any) {
    return sendJson(res, 500, {
      success: false,
      error: error?.message || 'Failed to fetch traffic incidents from LTA DataMall',
    });
  }
}

export async function GET(req: any) {
  return handler(req);
}
