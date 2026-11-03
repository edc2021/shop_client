const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const TelegramBot = require('node-telegram-bot-api');

// 定义待打包列表
const buildList = [
  'build:TEXM',
];

// 执行打包命令
function runBuildCommand(command) {
  const output = execSync(command, {encoding: 'utf-8'});
}

// 重命名dist目录
function renameDistDir(dirName) {
  const srcPath = path.join(__dirname, 'dist');
  const buildCommandReplace = dirName.replace('build:', '').replace(/[:\s]/g, '_');
  const destPath = path.join(__dirname, `商户PC_${buildCommandReplace}`);

  fs.renameSync(srcPath, destPath);
  console.log(`重命名dist目录完成：商户PC_${buildCommandReplace}`);
}

// 发送打包结果到Telegram群组
function sendResultToTelegramGroup(token, chatId, results) {
  const bot = new TelegramBot(token);

  let message = '打包结果：\n\n';
  results.forEach((result, index) => {
    message += `${index + 1}. ${result}\n`;
  });

  // 获取当前时间往前24小时的Git提交日志
  const gitLog = execSync('git log --oneline --since=-24.hours', {encoding: 'utf-8'});
  const uniqueCommits = [...new Set(gitLog.trim().split('\n'))];
  const updateLog = uniqueCommits.join('\n');

  // 压缩并发送打包文件
  let completedCount = 0; // 记录发送完成的文件数量

  for (const buildCommand of buildList) {

    const buildCommandReplace = buildCommand.replace('build:', '').replace(/[:\s]/g, '_');
    const buildDir = path.join(__dirname, `商户PC_${buildCommandReplace}`);
    const zipFilePath = path.join(__dirname, `商户PC_${buildCommandReplace}.zip`);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: {level: 9},
      password: 'Ab@123456!' // Set your desired password here
    });

    output.on('close', () => {
      console.log(`打包文件完成：商户PC_${buildCommandReplace}.zip`);
      bot.sendDocument(chatId, zipFilePath).then(() => {
        // fs.unlinkSync(zipFilePath); // 删除临时的压缩文件

        completedCount++; // 增加发送完成的文件数量

        // 在所有文件发送完成后发送消息
        if (completedCount === buildList.length) {
          sendMessageAfterFilesSent(bot, chatId, message, updateLog);
        }
      });
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.directory(buildDir, false);
    archive.pipe(output);
    archive.finalize();
  }
}

// 在文件发送完成后发送消息
function sendMessageAfterFilesSent(bot, chatId, message, updateLog) {
  // 发送更新日志到Telegram群组并提醒指定成员
  const mentionMessage = `商户PC（E-Shop为演示环境）\n更新内容：\n${updateLog}`;

  // 延时1秒后发送消息，确保文件发送完成
  setTimeout(() => {
    bot.sendMessage(chatId, message).then(() => {
      bot.sendMessage(chatId, mentionMessage);
    });
  }, 1000);
}

// 删除已存在的商户PC文件夹
function deleteExistingBuildDirs() {
  for (const buildCommand of buildList) {
    const buildCommandReplace = buildCommand.replace('build:', '').replace(/[:\s]/g, '_');
    const buildDir = path.join(__dirname, `商户PC_${buildCommandReplace}`);
    if (fs.existsSync(buildDir)) {
      console.log(`删除已存在的商户PC文件夹：商户PC_${buildCommandReplace}`);
      deleteFolderRecursive(buildDir);
    }
  }
}

// 递归删除文件夹
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

// 执行打包列表
async function executeBuildList() {

  const results = [];

  for (const buildCommand of buildList) {
    runBuildCommand(`npm run ${buildCommand}`);
    renameDistDir(buildCommand);
    results.push(`商户PC:${buildCommand}`);
  }

  console.log('所有打包命令执行完毕');
  console.log('打包结果：', results);

  // 将打包结果发送到Telegram群组
  sendResultToTelegramGroup('6299387194:AAHgERlWFMzV9BD4NhElP8gX_vq2lLajyvw', '-1001981326976', results);
}

// 主程序入口
executeBuildList();

// 监听消息
// const bot = new TelegramBot('6073167563:AAGW3NlutI-yvAoIX_qw0ELc-DtMs0WQg7Q', {polling: true});
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id; // 获取群号
//   const text = msg.text;
//   console.log(`收到来自群号为 ${chatId} 的消息: ${text}`);
// });
