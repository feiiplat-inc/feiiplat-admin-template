#!/usr/bin/env node

const program = require('commander')
const download = require("download-git-repo")
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs = require('fs')

const templates = {
  'basic-templates-ts': {
    url: 'https://gitee.com/feiiplat/feiiplat_mad_template_html',
    downloadUrl: 'https://gitee.com/feiiplat/feiiplat_mad_template_html.git',
    description: '基础版本-ts',
  },
  'umi4-templates-ts': {
    url: 'https://gitee.com/lkj1995/fx-admin-template',
    downloadUrl: 'https://gitee.com/lkj1995/fx-admin-template.git',
    description: 'umi4-ts',
  },
}

// 配置命令
program
    .version('0.1.0') // -V 或 --version
program
    .command('create <app-name>')
    .description('初始化项目模板')
    .option("-f, --force", "如果项目名称已存在，将会强制覆盖")
    .alias("c")
    .action((projectName) => {
      // 取出下载地址
      console.log('### templateName', templateName)
      const { downloadUrl } = templates[templateName]
      console.log('### downloadUrl', downloadUrl)
      download('direct:' + downloadUrl, projectName, { clone: true }, (err) => {
        if (err) {
            console.log('下载失败', err);
        } else {
          console.log('下载成功');
          inquirer.prompt([{
              type: 'input',
              name: 'name',
              message: '请输入项目名称'
          }, {
              type: 'input',
              name: 'description',
              message: '请输入项目介绍'
          }, {
              type: 'input',
              name: 'version',
              message: '请输入项目版本号'
          }, {
              type: 'input',
              name: 'author',
              message: '请输入作者名称'
          }]).then(answers => {
            console.log(answers);
            const packageContent = fs.readFileSync(`${projectName}/package.json`, 'utf-8')
            const packageResult = handlebars.compile(packageContent)(answers)
            // 重写
            fs.writeFileSync(`${projectName}/package.json`,packageResult)
             console.log('初始化模板成功');
          })
        }
      })
    });
program
    .command('list')
    .description('查看可用项目模板列表')
    .action(() => {
        for (const key in templates) {
          console.log(`${key} ${templates[key].description}`)
        }
    });
program.parse(process.argv);
