var Readable = require('stream').Readable
var fs = require('fs')
var path = require('path')
var codeBlocks = require('gfm-code-blocks')

var rs = Readable()

var filename = path.join(process.cwd(), process.argv[2])
try {
  var stats = fs.lstatSync(filename)
  if (stats.isDirectory()) {
    console.log('Te specified file ' + filename + ' its a directory.')
    process.exit()
  }
} catch (e) {
  console.log('File ' + filename + ' not found.', e)
  process.exit()
}

rs._read = function () {
  var content = fs.readFileSync(filename)
  codeBlocks(content.toString()).forEach(function (block) {
    if (block.lang === 'js') rs.push(block.code + '\n')
  })
  rs.push('\n')
  rs.push(null)
}

rs.pipe(process.stdout)
