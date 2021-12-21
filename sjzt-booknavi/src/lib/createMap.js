/**
 * 生成资源索引文件 index
 */
const fs = require('fs');
const path = require('path');
//命令运行时的路径，加参数
// const dir = path.resolve(process.cwd(), `src/${process.argv[2]}`); //路径参数
const dir = process.argv[2];
async function main(dir) {
    let files = fs.readdirSync(dir);
    let importText = '';
    let exportText = `export {`;
    files = files.filter(item => item !== 'index.js');
    console.log(files);
    files.forEach(item => {
        const cutSufix = item.split('.')[0];
        let temp = `import ${cutSufix} from './${cutSufix}'\n`;
        importText += temp;
        exportText += cutSufix + ', ';
    });
    exportText += '}';
    let text = importText + exportText;
    try {
        fs.writeFileSync(`${dir}/index.js`, text);
    } catch (error) {
        console.error(
            `Got an error trying to write to a file: ${error.message}`,
        );
    }
}
main(dir);
