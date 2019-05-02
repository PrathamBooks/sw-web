const sortImages = function(images) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
          .slice() // slice() is for copying TODO: is there any better way?
          .sort((a, b) => {
              if (a.width < b.width) {
                return -1;
              }

              if (a.width > b.width) {
                return 1;
              }

              return 0;
            });
};

export const generateSrcSet = function(images) {
  if (!Array.isArray(images)) {
    return;
  }

  const srcset = sortImages(images)
                  .slice(1) // Remove the first image URL since it will be set with 'src' attr
                  .map(img => {
                    return `${img.url} ${img.width}w`;
                  });

  return srcset.join(', ');
};

export const getSmallestImage = function(images) {
  return sortImages(images)[0];
}

export const getLargestImage = function(images) {
  const sortedImagesArray = sortImages(images);
  return sortedImagesArray[sortedImagesArray.length - 1];
}

export const getImageSize = function(windowWidth) {
  let imageSize = 6
  
  if (windowWidth <= 359) {
    imageSize = 1;
  }
  else if (windowWidth <= 479) {
    imageSize = 2;
  }
  else if (windowWidth <= 490) {
    imageSize = 3;
  }
  else if (windowWidth <= 767) {
    imageSize = 4;
  }
  else if (windowWidth <= 900) {
    imageSize = 5;
  }
  else if (windowWidth <= 1365) {
    imageSize = 6;
  }
  else {
    imageSize = 7;
  }
  
  return imageSize;

}
