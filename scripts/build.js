/* eslint-env node */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const webExt = require('web-ext').default;

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

var deleteFolderRecursive = function(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file, index) => {
      var curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

var targetBrowser = process.argv[2];
const rootDir = path.join(__dirname, '..');
if (targetBrowser === 'chrome') {
  const tmpDir = path.join(rootDir, 'tmp-chrome');
  if (fs.existsSync(tmpDir)) {
    deleteFolderRecursive(tmpDir);
  }

  copyFolderSync(path.join(rootDir, 'extension'), tmpDir);

  const manifestFile = path.join(tmpDir, 'manifest.json');
  let config = JSON.parse(fs.readFileSync(manifestFile));
  delete config['applications'];
  delete config['key'];
  fs.writeFileSync(manifestFile, JSON.stringify(config), 'utf8');

  let output = fs.createWriteStream(path.join(rootDir, 'extension-chrome.zip'));
  let archive = archiver('zip');

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
  });

  archive.on('error', function(err){
    throw err;
  });

  archive.pipe(output);
  archive.directory(tmpDir, false);
  archive.finalize().then(() => {
    deleteFolderRecursive(tmpDir);
  });
}
else if (targetBrowser === 'firefox') {
  const sourceDir = path.join(__dirname, '..', 'extension');
  webExt.cmd.lint({
    sourceDir: sourceDir
  });
  webExt.cmd.build({
    sourceDir: sourceDir,
    artifactsDir: path.join(__dirname, '..', 'web-ext-artifacts')
  });
}
