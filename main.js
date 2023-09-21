const ExcelJS = require('exceljs');
const fs = require("fs");
const path = require("path");

function sleep(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const errors = {
  UserByRedID: [],
  AchievementByUserID: [],
};

async function SearchUserByRedID(redid) {
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

  try {
    const response = await fetch('https://gw.newrank.cn/api/xh/xdnphb/nr/app/xhs/red/user/search', {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'n-token': '35c430ef650b459ba2b9c1409148d929',
        request_id: 'edb5d7d59f0143368cd453fbbec692d1',
        'sec-ch-ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        cookie:
          'Hm_lvt_a19fd7224d30e3c8a6558dcb38c4beed=1695106981; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22nr_tvd9f2f40%22%2C%22first_id%22%3A%2218aac3eab41167-039239bb4fdaeac-19525634-2732424-18aac3eab4218d1%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218aac3eab41167-039239bb4fdaeac-19525634-2732424-18aac3eab4218d1%22%7D; Hm_lpvt_a19fd7224d30e3c8a6558dcb38c4beed=1695131393; token=29BCD8D0B86048DE8A9F40CF12CF53A0; NR_MAIN_SOURCE_RECORD={"locationSearch":"","locationHref":"https://xh.newrank.cn/d/account/accountOverview/626b40210000000021023d7c","referrer":"https://xh.newrank.cn/account/search"}; acw_tc=76b20f6616952686694862561e21b7091b60318e8b8868b4f7428d8d35d894',
        Referer: 'https://xh.newrank.cn/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify(reqPayload),
      method: 'POST',
    });
    const {code, data, msg} = await response.json();
    if (code !== 2000) {
      errors.UserByRedID.push({redid, msg});
      return;
    }

    if (data?.list?.length === 1) {
      // const targetUser = data.list.find(
      //   (ele) => username === ele?.nickname.replace('<span class="xr_highlight">', '').replace('</span>', ''),
      // );
      const targetUser = data.list[0];
      return targetUser;
    } else {
      errors.UserByRedID.push({redid, msg: 'SEARCH_LIST_EMPTY'});
    }
  } catch (e) {
    errors.UserByRedID.push({redid, msg: e});
  }
}

const AchievementByUserID = async ({userid, username}) => {
  try {
    const response = await fetch('https://gw.newrank.cn/api/xh/xdnphb/nr/app/xhs/red/user/detail/honor/achievement', {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'n-token': '35c430ef650b459ba2b9c1409148d929',
        request_id: '230a015860d64aa0ad9418a1bb522320',
        'sec-ch-ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        cookie:
          'Hm_lvt_a19fd7224d30e3c8a6558dcb38c4beed=1695106981; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22nr_tvd9f2f40%22%2C%22first_id%22%3A%2218aac3eab41167-039239bb4fdaeac-19525634-2732424-18aac3eab4218d1%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218aac3eab41167-039239bb4fdaeac-19525634-2732424-18aac3eab4218d1%22%7D; Hm_lpvt_a19fd7224d30e3c8a6558dcb38c4beed=1695131393; acw_tc=781bad2516952668632834640e6af6cb5a68c9cccfc2dfb80b1de83419f701; token=29BCD8D0B86048DE8A9F40CF12CF53A0; NR_MAIN_SOURCE_RECORD={"locationSearch":"","locationHref":"https://xh.newrank.cn/d/account/accountOverview/626b40210000000021023d7c","referrer":"https://xh.newrank.cn/account/search"}',
        Referer: 'https://xh.newrank.cn/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: JSON.stringify({userid}),
      method: 'POST',
    });

    const {data, code, msg} = await response.json();
    if (code === 2000 && data) {
      return data;
    }

    errors.AchievementByUserID.push({username, msg});
  } catch (e) {
    errors.AchievementByUserID.push({username, e});
  }
};


async function processExcel(filepath) {
  // Step 1: Read the Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filepath);

  // Step 2: Get the first worksheet
  const worksheet = workbook.worksheets[0];

  // Step 3: Add a new column with data
  const RedIDKey = '小红书id'
  const RegTimeKey = '账号注册时间'
  worksheet.columns = [
    {key: '序号'},
    {key: '小红书账号昵称'},
    {key: '小红书账号头像'},
    {key: '小红书账号主页'},
    {key: '性别'},
    {key: RedIDKey},
    {key: '简介内容'},
    {key: '账号类别'},
    {key: '认证信息'},
    {key: '账号一级分类'},
    {key: '账号二级分类'},
    {key: '账号属性'},
    {key: '联系方式'},
    {key: '属地'},
    {key: '定位'},
    {key: 'mcn机构信息'},
    {key: '上周新榜指数'},
    {key: '笔记数'},
    {key: '新增作品'},
    {key: '粉丝数'},
    {key: '最近发文时间'},
    {key: '爆文数'},
    {key: '删文数'},
    {key: '平均点赞'},
    {key: '平均收藏'},
    {key: '数据周期'},
    {key: RegTimeKey},
  ];

  const rowCount = worksheet.rowCount;
  worksheet.getRow(1).getCell(RegTimeKey).value = RegTimeKey

  for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    console.log(row.getCell('序号').value, row.getCell('小红书账号昵称').value, row.getCell(RedIDKey).value, row.getCell(RegTimeKey).value)
    if (!!row.getCell(RegTimeKey).value) {
      console.log('existing', row.getCell(RegTimeKey).value, 'skip')
      continue
    }

    const user = await SearchUserByRedID(row.getCell(RedIDKey).value)
    if (user == null) continue

    const achievement = await AchievementByUserID({userid: user.userid, username: user.nickname})
    if (achievement == null) continue

    console.log(achievement.registerTime)
    row.getCell(RegTimeKey).value = achievement.registerTime;

    await sleep(1); // Sleep for 1 second each row
  }

  return workbook
}


(async () => {
  const inputDir = '新红网红数据';
  const outputDir = '生成结果';

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Get all Excel files in the input directory
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.xlsx'));

  // Process each file one by one
  for (const file of files) {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    console.log(`Processing file: ${file}`);
    const modifiedWorkbook = await processExcel(inputFilePath, outputFilePath);

    console.log(`File processed and saved to: ${outputFilePath}\r\n`);
    await modifiedWorkbook.xlsx.writeFile(outputFilePath);
  }

  console.log('All files processed. Errors:\r\n', errors);
})()

