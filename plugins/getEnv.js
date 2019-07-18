// https://github.com/motdotla/dotenv/blob/master/lib/main.js
const fs = require('fs');
const path = require('path');

const getEnv = pathFile => {
  const getPath = path.resolve(__dirname, pathFile);
  if (!fs.existsSync(getPath)) {
    return {};
  }
  let gEnv = fs.readFileSync(getPath, 'utf-8');
  gEnv = gEnv.replace(/=/g, '":');
  gEnv = gEnv.replace(/\n/g, ', "');
  gEnv = '{"' + gEnv + '}';
  Object.assign(process.env, JSON.parse(gEnv));
  return gEnv;
};

module.exports = getEnv;
