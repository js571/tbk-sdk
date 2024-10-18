import axios from 'axios';

import { YYYYMMDDHHmmss, sign, getApiResponseName } from './utils';

// 防止主应用修改axios默认配置
const axiosInstance = axios.create({
});

class TbkService {
  private appKey: string;
  private secret: string;
  private restUrl: string;
  constructor(appKey: string, secret: string, restUrl = 'https://gw.api.taobao.com/router/rest') {
    this.appKey = appKey;
    this.secret = secret;
    this.restUrl = restUrl;
  }
  async request<T = any>(apiName: string, params: Record<string, any>) {
    const args: any = {
      timestamp: YYYYMMDDHHmmss(),
      format: 'json',
      app_key: this.appKey,
      v: '2.0',
      sign_method: 'md5',
      method: apiName,
    };
    for (const key in params) {
      if (typeof params[key] === 'object') {
        args[key] = JSON.stringify(params[key]);
      } else {
        args[key] = params[key];
      }
    }
    args.sign = sign(args, this.secret);
    try {
      const res = await axiosInstance({
        method: 'get',
        url: this.restUrl,
        params: args,
      });
      if (res.status !== 200) {
        const err: any = new Error('NetWork-Error');
        err.name = 'NetWork-Error';
        err.code = 15;
        err.sub_code = '0';
        err.sub_msg = '网络错误';
        return Promise.reject(err);
      }
      if (res.data.error_response) {
        const errData = res.data.error_response;
        return Promise.reject(errData);
      }
      const respData: T = res.data[getApiResponseName(apiName)];
      return respData;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
export default TbkService;
