/**
 * Serverless Health Check Endpoint
 * Checks service availability and whether LTA DataMall credentials are configured.
 */

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
  // Handle CORS
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

  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.LTA_DATAMALL_KEY || '';
  const isKeyConfigured = Boolean(accountKey && accountKey.trim().length > 0);

  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PulseNav Singapore LTA DataMall Gateway',
    environment: {
      hasLtaAccountKey: isKeyConfigured,
      nodeVersion: process.version,
    },
    endpoints: {
      incidents: '/api/traffic',
      images: '/api/trafficimages',
      flow: '/api/trafficflow',
      vms: '/api/vms',
    },
    message: isKeyConfigured
      ? 'LTA AccountKey is configured and ready to query DataMall API.'
      : 'Service is active, but LTA_ACCOUNT_KEY environment variable is not set.',
  };

  return sendJson(res, 200, payload);
}

export async function GET(req: any) {
  return handler(req);
}

