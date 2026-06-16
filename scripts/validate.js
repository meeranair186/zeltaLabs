var fs = require('fs');
var path = require('path');

var rootDir = path.join(__dirname, '..');
var requiredFiles = [
  'server.js',
  'package.json',
  'public/index.html',
  'public/styles.css',
  'public/script.js'
];

var requiredCopy = [
  'Hello, my name is',
  'Radha',
  "I'm from Thane",
  "I'm from Navi Mumbai",
  'NIFT Mumbai',
  'Knitwear designer, chronic Pinterest scroller',
  'Likes',
  'Crochet',
  'My Playlist',
  'Chupa Chups',
  'Dislikes',
  'Anything to do with numbers or maths',
  'Next Stop:',
  'Bhubaneswar'
];

function fail(message) {
  console.error('Validation failed: ' + message);
  process.exit(1);
}

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), 'utf8');
}

for (var i = 0; i < requiredFiles.length; i += 1) {
  var filePath = requiredFiles[i];
  if (!fs.existsSync(path.join(rootDir, filePath))) {
    fail('Missing required file ' + filePath);
  }
}

var packageJson = JSON.parse(readProjectFile('package.json'));

if (!packageJson.engines || packageJson.engines.node !== '11.x') {
  fail('package.json must declare Node 11.x support');
}

if (packageJson.dependencies || packageJson.devDependencies) {
  fail('The first portfolio iteration should remain dependency-free');
}

var html = readProjectFile('public/index.html');
var css = readProjectFile('public/styles.css');
var js = readProjectFile('public/script.js');

for (var j = 0; j < requiredCopy.length; j += 1) {
  if (html.indexOf(requiredCopy[j]) === -1) {
    fail('Missing expected scene copy: ' + requiredCopy[j]);
  }
}

if (css.indexOf('--train-yellow') === -1 || css.indexOf('.hello-tag') === -1) {
  fail('Sketch theme styles are incomplete');
}

if (js.indexOf('--tag-scale') === -1 || js.indexOf('--floor-opacity') === -1) {
  fail('Scroll animation variables are incomplete');
}

console.log('Validation passed: Node 11 portfolio files and scene copy are present.');
