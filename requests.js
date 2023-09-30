import fetch from 'node-fetch';
import * as dotenv from "dotenv";

(() => {
  if (!process.env.ENV_FILE) {
    console.error('No ENV_FILE')
    exit()
  }
  dotenv.config({path: process.env.ENV_FILE});
})()


import {logger} from "./logger.js";


export async function fetchAPI(url, dataObj) {
  if (!process.env.COOKIE) {
    logger.error('No Cookie')
    exit()
  }
  logger.info(`${url} ${JSON.stringify(dataObj)}`);
  const response = await fetch(url, {
    headers: {
      cookie: process.env.COOKIE,
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'n-token': '35c430ef650b459ba2b9c1409148d929',
      'request_id': '230a015860d64aa0ad9418a1bb522320',
      'sec-ch-ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'Referer': 'https://xh.newrank.cn/',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(dataObj),
    method: 'POST',
  });
  try {
    const {code, data, msg} = await response.json();
    if (code !== 2000) {
      logger.error(`${code} ${msg}`)
      return null
    }

    return data;
  } catch (e) {
    logger.error(`Network Error: ${e}`)
    return null
  }
}


export async function SearchUserByRedID(redid) {
  const reqPayload = {
    dataReq: {
      videoPrice: {fixedRange: '', customizeRange: ''},
      picturePrice: {fixedRange: '', customizeRange: ''},
      videoCpe: {fixedRange: '', customizeRange: ''},
      pictureCpe: {fixedRange: '', customizeRange: ''},
      videoCpm: {fixedRange: '', customizeRange: ''},
      pictureCpm: {fixedRange: '', customizeRange: ''},
      fans: {fixedRange: '', customizeRange: ''},
      likeCollect: {fixedRange: '', customizeRange: ''},
      index: {fixedRange: '', customizeRange: ''},
      likeCollectPercent: {fixedRange: '', customizeRange: ''},
      boomPercent: {fixedRange: '', customizeRange: ''},
    },
    input: {keyword: String(redid), type: ['name', 'rid']},
    batchId: '',
    batchName: '',
    type: {first: '', second: []},
    isLivedata: '',
    isLive: '',
    isGood: '',
    isRecommend: '',
    isBrand: '',
    isContact: '',
    isInSq: '',
    sort: '',
    activeId: 'B5F3D1C1BF084B508CEBED4543B5F3D1',
    contentTags: [],
    baseReq: {
      isMCN: '',
      gender: '',
      redUserLevelName: '',
      newShowCityInfo: '',
      userAttribute: [],
      mostType: '',
      identifySign: '',
      follow: {fixedRange: '', customizeRange: ''},
      lastCreateTime: '',
    },
    pgyLevel: '',
    xhsRedUserPgyReq: {pgyPersonaltags: []},
    fansReq: {distribute: '', province: '', hobby: [], age: []},
    size: 20,
    start: 1,
    recommendType: '',
    recommendNum: [],
    custom: {must: [], should: [], mustNot: []},
    cycle: '30d',
  };

  const data = await fetchAPI('https://gw.newrank.cn/api/xh/xdnphb/nr/app/xhs/red/user/search', reqPayload);

  const targetUser = data?.list?.find(user => user.redId === redid)
  if (targetUser == null) {
    logger.error(`Target User Empty ${redid}`)
    return null
  }

  logger.info(`👶🏻${JSON.stringify(targetUser)}`);
  return targetUser;
}


export async function AchievementByUserID({userid, username}) {
  const data = await fetchAPI('https://gw.newrank.cn/api/xh/xdnphb/nr/app/xhs/red/user/detail/honor/achievement', {userid});
  if (!data) {
    logger.error(`Achievement Empty ${userid} ${username}`)
    return null;
  }
  return data
}
