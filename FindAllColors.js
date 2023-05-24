// const img = new Image();
// 		img.crossOrigin = "anonymous";
// 		// img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/640px-Flag_of_Russia.svg.png";
// 		img.src = '../img/1.png'
// 		const canvas = document.getElementById("canvas");
// 		const ctx = canvas.getContext("2d");
// 		const colors = [];
 
// 		img.addEventListener("load", function () {
// 			canvas.width = img.width;
// 			canvas.height = img.height;

// 			ctx.drawImage(img, 0, 0, img.width, img.height);
 
// 			for (var y = 0; y < img.height; y++) {
// 				for (var x = 0; x < img.width; x++) {
// 					const pixel = ctx.getImageData(x, y, 1, 1).data;
// 					const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
 
// 					if (hex.length === 6 && !colors.includes(hex)) {
// 						colors.push(hex);
// 					}
// 				}
// 			}
// 			console.log(colors.length)
// 		});
 
// 		function rgbToHex(r, g, b) {
// 			if (r > 255 || g > 255 || b > 255)
// 				throw "Invalid color component";
                
// 			return ((r << 16) | (g << 8) | b).toString(16);
// 		}

//         console.log(colors)
		// console.log(colors.length)