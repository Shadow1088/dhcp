// P5 function - "A function that's called once to load assets before the sketch runs."
function preload() {
  loadImages();
}

// loads all images into an object
function loadImages() {
  for (let i = 0; i < Object.keys(IMAGES).length; i++) {
    img_name = Object.keys(IMAGES)[i];
    IMAGES[img_name] = loadImage(`img/${img_name}.png`);
  }
}
