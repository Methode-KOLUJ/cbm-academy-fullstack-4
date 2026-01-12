import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const base = process.env.MAISHAPAY_BASE_URL;
  if (!base) {
    return NextResponse.json({ error: 'MAISHAPAY_BASE_URL not configured' }, { status: 500 });
  }

  const baseClean = base.replace(/\/$/, '');
  const candidateUrls = [baseClean, `${baseClean}/pay`, `${baseClean}/payments`, `${baseClean}/checkout`, `${baseClean}/checkout/pay`];
  const apiKey = process.env.MAISHAPAY_PUBLIC_KEY;
  const apiSecret = process.env.MAISHAPAY_SECRET_KEY;
  const headers: any = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-api-key'] = apiKey;
  if (apiSecret) headers['Authorization'] = `Bearer ${apiSecret}`;

  const results: any[] = [];
  for (const candidateUrl of candidateUrls) {
    try {
      // Try a HEAD first, fallback to GET if server doesn't support HEAD
      let resp;
      try {
        resp = await axios.head(candidateUrl, { headers, timeout: 5000 });
      } catch (headErr) {
        resp = await axios.get(candidateUrl, { headers, timeout: 5000 });
      }
      results.push({ url: candidateUrl, status: resp.status, statusText: resp.statusText });
    } catch (err: any) {
      results.push({ url: candidateUrl, status: err?.response?.status || null, error: err?.response?.data || err.message });
    }
  }

  return NextResponse.json({ probes: results });
}
