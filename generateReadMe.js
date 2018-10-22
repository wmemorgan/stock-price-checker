const marked = require('marked');
const fs = require('fs');

const readMe = fs.readFileSync('README.md', 'utf-8');
const markdownReadMe = marked(readMe);

fs.writeFileSync('./public/README.html', markdownReadMe);