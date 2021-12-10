/**
 * 生成静态资源索引文件
 */
const fs = require('fs');
const path = require('path');
const projectDir = path.resolve(__dirname, '../../../');
// const dir = path.resolve(projectDir, process.argv[2]); //路径参数
const dir = process.argv[2];
const main = dir => {
    const files = fs.readdirSync(dir);
    //根据文件生成内容
    let text = `export default {\n`;
    files
        .filter(item => {
            return item != 'index.js';
        })
        .forEach(fileName => {
            const cutsufix = fileName.split('.')[0];
            let temp = `\t${cutsufix}: require('./${fileName}'),\n`;
            text += temp;
        });
    text += `};`;
    try {
        fs.writeFileSync(`${dir}/index.js`, text);
    } catch (error) {
        console.error(
            `Got an error trying to write to a file: ${error.message}`,
        );
    }
};
main(dir);
