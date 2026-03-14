const fs = require('fs');

const env = `export const environment = {
  production: true,
  portfolioApiBaseUrl: '${process.env.PORTFOLIO_API_BASE_URL || ''}',
  cvUrl: '${process.env.CV_URL || ''}'
};`;

const appScriptUrl = String(process.env.APPS_SCRIPT_URL || '').trim();
const appScriptTarget = appScriptUrl.startsWith('http://') || appScriptUrl.startsWith('https://')
  ? appScriptUrl
  : `https://${appScriptUrl}`;
const redirects = `/gsheets ${appScriptTarget} 200!\n/* /index.html 200\n`;

fs.writeFileSync('./src/environments/environment.ts', env);
fs.mkdirSync('./public', { recursive: true });
fs.writeFileSync('./public/_redirects', redirects);
console.log('environment.ts generado');
console.log('_redirects generado');
