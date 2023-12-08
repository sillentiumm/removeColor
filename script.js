const img = new Image();
img.crossOrigin = "anonymous";

const btnLoad = document.getElementById('btnLoad')
const btnDownload = document.getElementById('btnDownload')

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
canvas2.width = img.width;
canvas2.height = img.height;

const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d", { willReadFrequently: true });
canvas3.width = img.width;
canvas3.height = img.height;

const canvas4 = document.getElementById("canvas4");
const ctx4 = canvas4.getContext("2d", { willReadFrequently: true });
// canvas4.width = img.width;
// canvas4.height = img.height;

const canvas5 = document.getElementById("canvas5");
const ctx5 = canvas5.getContext("2d", { willReadFrequently: true });

let tripleCurrent = 0
let triplePrev = 0
let bordersVisible = false
const allColors = [];
defaultWidth = 0
defaultHeight = 0

const inp = document.querySelector('#inp')
const wrap = document.getElementById('wrap')
const inputBorder = document.getElementById('inputBorder')

inp.onchange = function(event) {
  const abcde = document.getElementById("inp").files[0]; 
  let reader = new FileReader()
  reader.readAsDataURL(abcde)

  reader.onload = function() {
    let imgg = document.createElement('img')
    if (wrap.firstChild) {
      wrap.removeChild(wrap.lastChild)
    }
    wrap.appendChild(imgg)
    imgg.src = reader.result
    img.src = reader.result
  }
}


inputBorder.addEventListener("click", changeBorderVisible)

btnLoad.addEventListener("click", function () {
  if (!img.width) {
    alert('выберите изображение')
    return false
  }

  defaultWidth = img.width
  defaultHeight = img.height
  canvas4.width = defaultWidth
  canvas4.height = defaultHeight
  canvas5.width = defaultWidth
  canvas5.height = defaultHeight

  // img.width = 128
  // img.height = 128

  clearImg()
    .then(splitAllColors())
      .then(addHashtag())
        .then(third())
          .then(clearLast())
})

btnDownload.addEventListener('click', function() {
  downloadImage()
})

function changeBorderVisible() {
  bordersVisible = !bordersVisible
}
function rgbToHex(r, g, b) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  const result =  componentToHex(r) + componentToHex(g) + componentToHex(b);
  return result
}

async function clearImg() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx2.clearRect(0,0, canvas.width, canvas.height);
  ctx3.clearRect(0,0, canvas.width, canvas.height);

  canvas2.width = img.width
  canvas2.height = img.height
  canvas3.width = img.width
  canvas3.height = img.height

}

async function splitAllColors() {
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.width, img.height);

  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

      if (hex.length === 6 && !allColors.includes(hex)) {
        allColors.push(hex);
      }
    }
  }
}

const _colours = document.querySelectorAll('.colours > *')
const colours = []
const colourSpace = ['lab']

const colourDiffs = {
  lab: colourDiffLab,
}

async function addHashtag() {
  allColors.forEach(el => {
    colours.push('#' + el)
  })
}

async function third() {
  observeThreshold(colourSpace)
  groupSimilarColours(colourSpace)
}


function observeThreshold(colourSpace) {
  const _el = document.querySelector(`.results.${colourSpace}`)
  const _input = _el.querySelector('input')
}

function groupSimilarColours(colourSpace) {
  const _el = document.querySelector(`.results.${colourSpace}`)
  const _colours = _el.querySelector('.results-colours')
  const threshold = _el.querySelector('input').value
  const reducedColours = {}
  let availableColours = colours.slice()

  zzz()
    .then(double(reducedColours))
      .then(triple())

  async function zzz() {
    while (availableColours.length > 0) {
      const colour = availableColours[0]
  
      reducedColours[colour] = [colour]
  
      availableColours.forEach(otherColour => {
        if (colour === otherColour) return
  
        const diff = colourDiffs[colourSpace](colour, otherColour)
  
        if (diff < threshold) {
          reducedColours[colour].push(otherColour)
        }
      })
      availableColours = availableColours.filter(x => !reducedColours[colour].includes(x))
    }
  }

}

function colourDiffLab(colour1, colour2) {
  var lab1 = parseColour(colour1).lab;
  var lab2 = parseColour(colour2).lab;
  return deltaE(lab1, lab2) / 100;
}

function parseColour(colour) {
  var  lab;
  colour = colour.toLowerCase();
  rgb = parseHexColour(colour);
  lab = rgbToLab.apply(this, rgb);
  return {
    lab: lab
  }
}

function parseHexColour(colour) {
  var hex = parseInt(colour.substring(1), 16);
  var red = (hex & 0xff0000) >> 16;
  var green = (hex & 0x00ff00) >> 8;
  var blue = hex & 0x0000ff;
  return [red, green, blue];
}


function rgbToLab(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
}

function deltaE(labA, labB) {
  var deltaL = labA[0] - labB[0];
  var deltaA = labA[1] - labB[1];
  var deltaB = labA[2] - labB[2];
  var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  var deltaC = c1 - c2;
  var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  var sc = 1.0 + 0.045 * c1;
  var sh = 1.0 + 0.015 * c1;
  var deltaLKlsl = deltaL / (1.0);
  var deltaCkcsc = deltaC / (sc);
  var deltaHkhsh = deltaH / (sh);
  var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

async function double(colors) { 
  console.log('double', img.height)
    for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;

        if (pixel[0] == 0 && pixel[1] ==0 && pixel[2] == 0 && pixel[3] == 0 ) {
          pixel[0] = 255
          pixel[1] = 255
          pixel[2] = 255
        }

        let hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
            for (key in colors) {
              let currentColor = colors[key].find(el => el == '#' + hex)

              if(currentColor) {
                ctx2.fillStyle = key
                ctx2.fillRect(x, y, 1, 1);
                break
              }
            }
      }
    }
    ctx4.drawImage(canvas2, 0, 0, defaultWidth, defaultHeight)
  console.log('2 fin')
}

async function triple() {
  console.log('triple', img.height)
  ctx3.fillStyle = '#ffffff'
  ctx3.fillRect(0,0,img.width,img.height)

  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      const pixel = ctx2.getImageData(x, y, 1, 1).data;

      triplePrev = tripleCurrent
      tripleCurrent = rgbToHex(pixel[0], pixel[1], pixel[2])

      if(!(tripleCurrent == triplePrev)) {
        ctx3.fillStyle = 'black'
        ctx3.fillRect(x, y, 1, 1);
      }
    }
  }

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      const pixel = ctx2.getImageData(x, y, 1, 1).data;

      triplePrev = tripleCurrent
      tripleCurrent = rgbToHex(pixel[0], pixel[1], pixel[2])

      if(!(tripleCurrent == triplePrev)) {
        ctx3.fillStyle = 'black'
        ctx3.fillRect(x, y, 1, 1);
      }
    }
  }

  if (bordersVisible) {
    ctx3.strokeStyle = "#000";
    ctx3.strokeRect(0, 0, img.width, img.height);
  }

  console.log('3 fin')
}



async function clearLast() {
  // ctx.clearRect(0, 0, img.width, img.height);
  // ctx2.clearRect(0, 0, img.width, img.height);
  // canvas.width = 0
  // canvas.height = 0
  // canvas2.width = 0
  // canvas2.height = 0

  // ctx4.drawImage(canvas2, 0, 0, defaultWidth, defaultHeight)
}

function downloadImage() {
  if (!canvas3.width) {
    alert('Скомпилируйте изображение')
    return false
  }
  let dataURL = canvas3.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = dataURL;
  link.download = "my-image-name.png";
  link.click();
}