const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'options.json');

async function getOptions() {
    const fileData = await fs.readFile(filePath);
    const storedOptions = JSON.parse(fileData);
    return storedOptions;
}

async function storeOptions(options) {
    await fs.writeFile(filePath, JSON.stringify(options));
}

module.exports = {
    getOptions,
    storeOptions,

};
