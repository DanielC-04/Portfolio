const fs = require('fs');

const env = `export const environment = {
  production: true,
  portfolioApiBaseUrl: '${process.env.PORTFOLIO_API_BASE_URL || ''}'
};`;

fs.writeFileSync('./src/environments/environment.ts', env);
console.log('environment.ts generado');