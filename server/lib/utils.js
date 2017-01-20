const path = require('path');
const fs = require('fs');
const cpr = require('cpr');
const sharp = require('sharp');

this.deleteOne = function deleteOne(pathToFile) {
  return new Promise((resolve, reject) => {
    fs.unlink(pathToFile, (err) => {
      if (err) return reject(Error(err));
      return resolve(true);
    });
  });
};

this.deleteMany = function deleteMany(pathsArray) {
  return new Promise((resolve, reject) => {
    pathsArray.forEach((onePath, i, arr) => {
      fs.unlink(onePath, (err) => {
        if (err) {
          return reject(Error(err));
        } else if (i === arr.length - 1) {
          return resolve(null);
        }
        return null;
      });
    });
  });
};

this.copyOneToMany = function copyOneToMany(sourceFolder, file, destinationArray) {
  return new Promise((resolve, reject) => {
    destinationArray.forEach((onePath, i, arr) => {
      cpr(sourceFolder + file, onePath + file, (err) => {
        if (err) {
          return reject(Error(err));
        } else if (i === arr.length - 1) {
          return resolve(null);
        }
        return null;
      });
    });
  });
};

this.resizeWithSharp = function resizeWithSharp(fullPath, filename, width, height, saveFolder) {
  const fileExt = path.extname(filename).toLowerCase();

  let sharpResize = sharp(fullPath)
      .resize(width, height)
      .max()
      .withoutEnlargement();

  if (fileExt === '.jpeg' || fileExt === '.jpg') {
    sharpResize = sharpResize.jpeg({ quality: 95 });
  }

  sharpResize = sharpResize.toFile(saveFolder + filename);

  return sharpResize;
};

this.moveFile = function moveFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) return reject(Error(err));
      return resolve(null);
    });
  });
};
