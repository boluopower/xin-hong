import * as dotenv from 'dotenv';

(() => {
  if (!process.env.ENV_FILE) {
    console.error('No ENV_FILE')
    exit()
  }
  dotenv.config({path: process.env.ENV_FILE});
})()

import fs from 'fs';
import path from 'path';

import ExcelJS from 'exceljs'

import {logger} from "./logger.js";
import {AchievementByUserID, SearchUserByRedID} from "./requests.js";
import {WAIT_BETWEEN_REQUEST, SAVE_EVERY_RECORDS} from "./configs.js";

const RedIDKey = '小红书id'
const RedNameKey = '小红书账号昵称'
const RegTimeKey = '账号注册时间'

async function throttleExecuteTasks(tasks) {
  for (const task of tasks) {
    await new Promise(resolve => setTimeout(async () => {
      await task.execute();
      resolve();
    }, WAIT_BETWEEN_REQUEST * 1000));

    logger.debug(`⏳delay ${WAIT_BETWEEN_REQUEST} seconds`)
  }
}

let Counter = 0

class Task {
  constructor(row, saveFunc) {
    this.row = row
    this.redId = row.getCell(RedIDKey).value
    this.redName = row.getCell(RedNameKey).value
    this.regTimeCell = row.getCell(RegTimeKey)
    this.saveFunc = saveFunc
  }

  async execute() {
    logger.info(`🎬Task:(${this.row.getCell('序号').value}) ${this.redId} ${this.redName}`)

    const user = await SearchUserByRedID(this.redId)
    if (user == null) return

    const achievement = await AchievementByUserID({userid: user.userid, username: user.nickname})
    if (achievement == null) return

    // TODO mock
    // const achievement = {registerTime: 'mock ' + Counter + ' ' + (new Date())}

    logger.info(`${this.redId}[${this.redName}]的注册时间: ${achievement.registerTime}`)
    this.regTimeCell.value = achievement.registerTime;

    Counter++;
    if (Counter % SAVE_EVERY_RECORDS === 0) {
      await this.saveFunc()
    }
  }
}


async function processExcel(filepath) {
  const TaskPools = []
  Counter = 0;

  // Step 1: Read the Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filepath);
  // Step 2: Get the first worksheet
  const worksheet = workbook.worksheets[0];
  // Step 3: Add a new column with data

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

  const saveFunc = async () => {
    logger.info(`🗂Save data: ${filepath}`);
    await workbook.xlsx.writeFile(filepath)
  }

  for (let rowNumber = 2; rowNumber <= rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    if (!!row.getCell(RegTimeKey).value) {
      logger.warn(row.getCell(RedNameKey).value + ' 注册时间已经存在: ' + row.getCell(RegTimeKey).value + ' 跳过')
      continue
    }

    TaskPools.push(new Task(row, saveFunc))
  }

  await throttleExecuteTasks(TaskPools);
  await saveFunc();
}

async function main() {
  const inputDir = process.env.INPUT_DIR;

  // Ensure the directory exists
  if (!fs.existsSync(inputDir)) {
    logger.error(`Not Exist ${inputDir}`)
    exit()
  }

  // Get all Excel files in the input directory
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.xlsx'));

  // Process each file one by one
  for (const file of files) {
    const inputFilePath = path.join(inputDir, file);
    logger.info(`📂Processing file: ${inputFilePath}`);
    await processExcel(inputFilePath);
  }
}

main().then(() => {
  logger.info('✅✅✅All files processed.')
}).catch(err => {
  logger.error(JSON.stringify(err))
})
