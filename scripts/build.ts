/* eslint-env node */

import * as fs from 'node:fs';
import { rm } from 'node:fs/promises';
import * as path from 'node:path';
import archiver from 'archiver';
import webExt from 'web-ext';

function copyFileSync(source: string, target: string): void {
  let targetFile = target;

  //if target is a directory a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
    if ( fs.lstatSync( target ).isDirectory() ) {
      targetFile = path.join( target, path.basename( source ) );
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderSync(source: string, target: string): void {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  if ( fs.lstatSync(source).isDirectory() ) {
    let files = fs.readdirSync( source );
    files.forEach(( file ) => {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, target);
      } else {
        copyFileSync(curSource, target);
      }
    } );
  }
}

function copyFolderRecursiveSync(source: string, target: string): void {
  //check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if ( !fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    } );
  }
}

function deleteFolderRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      var curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

async function buildChrome(): Promise<void> {
  const tmpDir = path.join(rootDir, 'tmp-chrome');
  if (fs.existsSync(tmpDir)) {
    deleteFolderRecursive(tmpDir);
  }

  copyFolderSync(path.join(rootDir, 'extension'), tmpDir);

  const manifestFile = path.join(tmpDir, 'manifest.json');
  let config = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
  delete config['applications'];
  delete config['background']['scripts'];
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
  await archive.finalize();
  deleteFolderRecursive(tmpDir);
}

async function buildFirefox(): Promise<void> {
  const tmpDir = path.join(rootDir, 'tmp-firefox');

  if (fs.existsSync(tmpDir)) {
    deleteFolderRecursive(tmpDir);
  }
  copyFolderSync(path.join(rootDir, 'extension'), tmpDir);
  const manifestFile = path.join(tmpDir, 'manifest.json');
  let config = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
  delete config['background']['service_worker'];
  config.permissions = config.permissions.filter((p: string) => p !== 'offscreen');
  fs.writeFileSync(manifestFile, JSON.stringify(config), 'utf8');

  await rm(path.join(tmpDir, 'js', 'offscreen.js'));
  await rm(path.join(tmpDir, 'offscreen.html'));

  await rm(path.join(__dirname, '..', 'web-ext-artifacts'), { recursive: true, force: true });
  await webExt.cmd.lint(
    {
      sourceDir: tmpDir,
    },
    {
      shouldExitProgram: false,
    }
  );
  await webExt.cmd.build({
    sourceDir: tmpDir,
    artifactsDir: path.join(__dirname, '..', 'web-ext-artifacts')
  });
  deleteFolderRecursive(tmpDir);
}

var targetBrowser = process.argv[2];
if (!['chrome', 'firefox'].includes(targetBrowser)) {
  console.error('Usage: tsx build.ts chrome|firefox');
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
(async () => {
  const func = targetBrowser === 'chrome' ? buildChrome : buildFirefox;
  await func();
})()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log('--ERROR--')
    console.error(err);
  });
