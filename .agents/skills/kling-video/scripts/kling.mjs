import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [command, input] = process.argv.slice(2);
const usage = 'Usage: node .agents/skills/kling-video/scripts/kling.mjs check | submit REQUEST.json | status TASK_ID';

async function main() {
  if (!['check', 'submit', 'status'].includes(command)) throw new Error(usage);
  if (command !== 'check' && !input) throw new Error(usage);
  try { process.loadEnvFile(resolve('.env')); } catch (error) {
    if (error.code !== 'ENOENT') throw new Error('Unable to parse .env. Use named KEY=value entries.');
  }
  const key = process.env.KLING_ACCESS_KEY;
  const secret = process.env.KLING_SECRET_KEY;
  let token = process.env.KLING_API_TOKEN;
  if (!token && (!key || !secret)) {
    throw new Error('Missing Kling credentials: configure KLING_ACCESS_KEY and KLING_SECRET_KEY, or KLING_API_TOKEN, in .env. No request sent.');
  }
  if (!token) {
    const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ iss: key, exp: now + 1800, nbf: now - 5 })}`;
    token = `${unsigned}.${createHmac('sha256', secret).update(unsigned).digest('base64url')}`;
  }
  const base = new URL(process.env.KLING_API_BASE_URL || 'https://api-singapore.klingai.com');
  if (base.protocol !== 'https:' || !['api-singapore.klingai.com', 'api.klingai.com', 'api-beijing.klingai.com'].includes(base.hostname) || base.username || base.password) {
    throw new Error('KLING_API_BASE_URL must be an HTTPS Kling API host.');
  }
  let path = '/v1/videos/text2video?pageNum=1&pageSize=1';
  let body;
  if (command === 'status') path = `/v1/videos/text2video/${encodeURIComponent(input)}`;
  if (command === 'submit') {
    const request = JSON.parse(await readFile(resolve(input), 'utf8'));
    if (!request.prompt || !request.model_name || !request.duration) throw new Error('Request requires prompt, model_name and duration.');
    body = JSON.stringify(request);
    path = '/v1/videos/text2video';
  }
  const response = await fetch(new URL(path, base), {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body,
    redirect: 'error',
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Kling returned HTTP ${response.status}. No automatic retry was made.`);
  const result = await response.json();
  if (result.code !== 0) throw new Error(`Kling rejected the request (code ${result.code}). No automatic retry was made.`);
  if (command === 'check') console.log('Kling authentication succeeded. No generation started.');
  else console.log(JSON.stringify(result.data, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Kling request failed.');
  process.exitCode = 1;
});
