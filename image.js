const fetch = require('node-fetch');
const { createCanvas, Image } = require('canvas');
const crypto = require('crypto');

async function createImage(attributes, t_ins) {
    let baseImg;
    let ctx;

    let promises = [];
    let images = new Array(attributes.length);

    for (let i = 0; i < attributes.length; i++) {
        let attribute = attributes[i];
        let inscriptionIndex = attribute[0];
        let traitValue = attribute[1];

        let traitsInscriptionId = t_ins[inscriptionIndex];

        let promise = fetch('https://ordinals.com/content/' + traitsInscriptionId)
            .then(res => res.json())
            .then(data => {
                // Map the index of the attribute to the corresponding trait_type
                let traitType = data.trait_types[i];

                let base64ImageString = data.traits[traitType][traitValue]['base64'];

                let img = new Image();
                let [x_dim, y_dim] = data.dim || [32, 32];  // Default to [32, 32] if 'dim' is not defined

                baseImg = createCanvas(x_dim, y_dim);
                ctx = baseImg.getContext('2d');

                return new Promise((resolve, reject) => {
                    img.onload = () => {
                        // Instead of drawing the image here, store it in the array
                        images[i] = img;
                        resolve();
                    };
                    img.onerror = reject;

                    img.src = "data:image/png;base64," + base64ImageString;
                });
            });

        promises.push(promise);
    }

    await Promise.all(promises);
    // Now draw the images in order
    for (let i = 0; i < images.length; i++) {
        if (images[i]) {  // Check if the image was successfully loaded
            ctx.drawImage(images[i], 0, 0);
        }
    }
    return baseImg.toDataURL();
}

// Parse the command-line arguments as JSON
// var obj = JSON.parse(process.argv[2]);
var obj = { "p": "gen-brc-721", "op": "mint", "s": "ordibots", "t_ins": [ "b7205d40f3b1b1486567f0d6e53ff2812983db4c03ad7d3606812cd150c64802i0" ], "h": "aa0d33b748e0177528a910a56a61c47bee2ba9b69749228d6520049c0fea3f4f", "id": "554", "a": [ [ 0, "bitcoin-orange" ], [ 0, "rainbow" ], [ 0, "black-and-white-triangular" ], [ 0, "square" ], [ 0, "happy" ] ] }

// adjust the dimensions of the image. In this case is set to 32x32
createImage(obj.a, obj.t_ins).then(data => {
    // Split the data from the prefix
    let [prefix, base64Data] = data.split(",");
    // console.log({base64Data});

    // Convert the base64 string into bytes
    let imgBytes = Buffer.from(base64Data, 'base64');
    console.log('base64:', base64Data)
    // Compute the SHA256 hash of the bytes
    let hash = crypto.createHash('sha256');
    hash.update(imgBytes);

    let hashHex = hash.digest('hex');
    console.log('*********************')
    console.log('hash:', hashHex)
}).catch(error => {
    console.error(error);
});
