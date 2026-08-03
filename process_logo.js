const Jimp = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('app/apex-logo.png');
    
    // Make black pixels transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red   = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue  = this.bitmap.data[idx + 2];
      
      // Threshold for "black"
      if (red < 30 && green < 30 && blue < 30) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      }
    });

    // Autocrop the transparent background
    image.autocrop();

    await image.writeAsync('app/logo.png');
    await image.writeAsync('app/icon.png');
    console.log('Image processed successfully!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
