import crypto from 'crypto';

type NOrS = string | number;

const md5 = function md5(s: string) {
  return crypto.createHash('md5').update(s).digest('hex');
};

const YYYYMMDDHHmmss = function(iptDate?: Date, options: { dateSep: string, timeSep: string } = {
  dateSep: '-',
  timeSep: ':',
}) {
  const { dateSep, timeSep } = options;
  iptDate = iptDate || new Date();
  if (!(iptDate instanceof Date)) {
    iptDate = new Date(iptDate);
  }
  let date: NOrS = iptDate.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  let month: NOrS = iptDate.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let hours: NOrS = iptDate.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  let minutes: NOrS = iptDate.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let seconds: NOrS = iptDate.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return iptDate.getFullYear() + dateSep + month + dateSep + date + ' ' +
      hours + timeSep + minutes + timeSep + seconds;
};

const sign = (params: Record<string, any>, secret: string) => {
  const sorted = Object.keys(params).sort();
  let baseString = secret;
  for (let i = 0, l = sorted.length; i < l; i++) {
    const k = sorted[i];
    baseString += k + params[k];
  }
  baseString += secret;
  return md5(baseString).toUpperCase();
};

const getApiResponseName = function(apiName: string) {
  const reg = /\./g;
  if (apiName.match('^taobao')) { apiName = apiName.substr(7); }
  return apiName.replace(reg, '_') + '_response';
};

export {
  md5,
  YYYYMMDDHHmmss,
  sign,
  getApiResponseName,
};
