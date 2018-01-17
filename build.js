const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function copyFileSync( source, target ) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
    if ( fs.lstatSync( target ).isDirectory() ) {
      targetFile = path.join( target, path.basename( source ) );
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  if ( fs.lstatSync( source ).isDirectory() ) {
    let files = fs.readdirSync( source );
    files.forEach( function ( file ) {
      var curSource = path.join( source, file );
      if ( fs.lstatSync( curSource ).isDirectory() ) {
        copyFolderRecursiveSync( curSource, target );
      } else {
        copyFileSync( curSource, target );
      }
    } );
  }
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync( targetFolder );
  }

  //copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    files = fs.readdirSync( source );
    files.forEach( function ( file ) {
      var curSource = path.join( source, file );
      if ( fs.lstatSync( curSource ).isDirectory() ) {
        copyFolderRecursiveSync( curSource, targetFolder );
      } else {
        copyFileSync( curSource, targetFolder );
      }
    } );
  }
}

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

if (fs.existsSync('tmp-chrome')) {
  deleteFolderRecursive('tmp-chrome');
}

copyFolderSync('extension', 'tmp-chrome');

let config = JSON.parse(fs.readFileSync('tmp-chrome/manifest.json'));
delete config['applications'];
delete config['key'];
fs.writeFileSync('tmp-chrome/manifest.json', JSON.stringify(config), 'utf8');

let output = fs.createWriteStream('extension-chrome.zip');
let archive = archiver('zip');

output.on('close', () => {
  console.log(archive.pointer() + ' total bytes');
});

archive.on('error', function(err){
  throw err;
});

archive.pipe(output);
archive.directory('tmp-chrome', false);
archive.finalize();