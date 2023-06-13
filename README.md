# Generative BRC-721

> ***TLDR**: This proposal introduces the Generative BRC-721 standard, a solution to optimize block space usage in the Bitcoin ordinals ecosystem, accommodating more creators and fostering innovation. The standard utilizes a "deploy" operation to create a Generative BRC-721 collection with unique traits stored on-chain. A "mint" operation then generates Non-Fungible Ordinals, referencing the traits from the deploy operation. This process cuts down block space usage between 50% and 90%. The impact of the proposed standard was demonstrated through a case study with a Generative BRC-721 collection called "OrdiBots," showing a block space reduction of 55%. The standard will work without any action from any Front-end that has implemented [Recursive Inscriptions](https://github.com/ordinals/ord/pull/2167)*

This initiative seeks to spark more conversations around the Non-Fungible standard within the Bitcoin ordinals ecosystem. It aims to enhance the efficiency of launching Image Ordinals Collections, similar to the creation of fungible tokens through the BRC-20 standard.

**Dune Dashboard Demo:** [Generative BRC-721 (WIP)](https://dune.com/j543/generative-brc-721)
This Dune Analytics dashboard currently serves as a tool to monitor the minting activity of specific Generative BRC-721 collections. Please note that it may require further refinements to fully meet the needs of users.

![](./assets/gen-brc721-dune.png)

## Context

With Bitcoin network fees surging and settling at a new higher equilibrium, an influx of creators is joining the space. This trend is increasing demand for Bitcoin block space, expected to rise even further in the near future. To keep the door wide open for creators to launch their innovative ideas on the Bitcoin blockchain, we must optimize the current standard for launching Image Ordinals Collections.

## Idea

We propose a new standard for launching Non-Fungible Generative Ordinals collections. This standard can conserve all on-chain resources while achieving a 50% to 90% optimization of the block space. The process includes three main operations:

- Create a Generative BRC-721 collection with the deploy operation
- Mint a Non-Fungible Ordinal of the collection with the mint operation
- Transferring the Non-Fungible Ordinal as a standard ordinal inscription.

All these processes can be conducted without the need for an external indexer, provided that the collection creators release the official list of inscriptions of their collections, as currently required. Moreover, the images will be automatically rendered, requiring no additional steps, on all front-end interfaces that have already implemented [Recursive Inscriptions](https://github.com/ordinals/ord/pull/2167).

## Operations

### Deploy Generative BRC-721

The Deploy operation is a JSON/Text inscription that contains the general information of the collection, and the base64 encoded data of the traits composing the collection. The unique images of the traits used to create the Non-Fungible Ordinals are stored on-chain in this inscription. The inscription serves as the reference and the definitive source of the traits.

Note: It is also possible to create multiple deploy inscription for the same collection, that each will store a set of different traits. 

*For demonstration purposes, we're using the OrdiBots collection*
*Example of a deployed operation inscription: [Ord.io](https://www.ord.io/8326719)*

```javascript
{
    "p": "gen-brc-721",
    "op": "deploy",
    "slug": "ordibots",
    "name": "OrdiBots",
    "supply": 1000,
    "trait_types": [
        "background",
        "accessories",
        "body",
        "belly",
        "face"
    ],
    "r": "2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0",
    "traits": {
        "background": {
            "blue": {
                "name": "Blue",
                "base64": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEVkhZa3PARZAAAAC0lEQVR4AWMY5AAAAKAAAVQqnscAAAAASUVORK5CYII="
            },
            ... // more backgrounds
        },
			  "accessories": {
            "antenna": {
                "name": "Antenna",
                "base64": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAKUlEQVRYCe3BsQ0AIADDsOT/o8sJLEgssSHJhTpg4oDxmzKSJEmS5KEDUlIFA6L+DvwAAAAASUVORK5CYII="
            },
              ... // more accessories
        },
        	... // other traits
    }
}
```

| Key         | Required | Description                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| p           | YES      | Protocol: Helps other systems identify and process gen-brc-721 events |
| op          | YES      | Operation: Type of event (Deploy, Mint)                      |
| slug        | YES      | Slug: Identifier of the collection. Not enforced if no indexer implemented |
| name        | NO       | Name: Human readable name of the collection                  |
| supply      | NO       | Supply: Supply of the collection. Not enforced if no indexer implemented |
| trait_types | YES      | Trait Types: This is an array which dictates the sequence in which the traits ought to be rendered. |
| ~~dim~~     | ~~YES~~  | ~~Dimensions: An array representing the dimensions (width and height) of the trait and final images  in pixels, defined as [width, height].~~ |
| traits      | YES      | Traits: Object containing the unique traits of teh collection. Composed as: {trait type: {trait key: {name, base64 image encoded}}} |
| r           | YES      | Renderer: Inscription ID where the render JS function (*GBRC721RenderImage*) is stored. The default render function can be found at [2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0](https://ordinals.com/content/2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0) |

### Mint Generative BRC-721

The Mint operation utilizes a HTML type inscription that encapsulates information about the actual Non-Fungible Ordinal being minted and the references to the Deploy inscription(s) and Render Function. The aim is to store the values of the attributes that generate the image, and the references of the collection Deploy inscription(s) on-chain. This approach allows any Front-end with Recursive Inscription to automatically render the image using on-chain inscribed data.

**The actual attributes are stored in the `nfo` variable as a json object.** 

*For demonstration purposes, we're using the OrdiBots collection*
*Example of a mint operation inscription:* [Ord.io](https://www.ord.io/preview/3a6de40265a029e883b957d70bad60bc9372f2f4bd4fddeec4665f8b690df92bi0?type=text/html&raw=true)

```html
<html>
<body>
  <script>
  let nfo = {"p":"gen-brc-721","op":"mint","s":"ordibots",
  "t_ins":["fee71f3b8d958fb4b98142c3af8475a7d4a77e145289ab46a21642abafc4c2c9i0"],
  "id":"554",
  "a":[[0,"bitcoin-orange"],[0,"rainbow"],[0,"black-and-white-triangular"],[0,"square"],[0,"happy"]]};
  </script>

  <canvas id="canvas" width="500" height="500" style="image-rendering: pixelated;"></canvas>

  <script type="module">
    Promise.all(nfo.t_ins.map(url => fetch(`https://ordinals.com/content/${url}`).then(response => response.json())))
      .then(async deploys => {
        console.log(deploys)
        let renderUrl = deploys[0].r
          ? `/content/${deploys[0].r}`
          : '/content/2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0';

        import(renderUrl).then(module => {
          let GBRC721RenderImage = module.GBRC721RenderImage;
          GBRC721RenderImage({
            "a": nfo.a.map((item, index) => [item[0], deploys[item[0]].traits[deploys[item[0]].trait_types[index]][item[1]].base64])
          });
        });
      })
      .catch(err => console.log(err));
  </script>
</body>
</html>
```

| Key   | Required   | Description                                                  |
| ----- | ---------- | ------------------------------------------------------------ |
| p     | YES        | Protocol: Helps other systems identify and process gen-brc-721 events |
| op    | YES        | Operation: Type of event (Deploy, Mint)                      |
| s     | YES        | Slug: Identifier of the collection. Not enforced if no indexer implemented |
| t_ins | YES        | Traits (Deploy) Inscription: Array containing the inscription ID(s) of the deploy inscription(s) |
| ~~h~~ | ~~YES NO~~ | ~~Hash: This refers to the SHA256 output of the generated image. <u>It's an optional element</u>; collection creators have the flexibility to decide if they want to include this additional security check on their collections. Opting not to use the hash can enhance the efficiency of the inscription process.~~ |
| id    | YES        | Token ID: Unique identifier for each Non-Fungible Ordinal within the collection. Essential for tracking and distinguishing individual NFOs. |
| a     | YES        | Attributes: This is an array that carries the attribute values of this specific Non-Fungible Ordinal. Each array element is structured as follows: [inscription_index, traits_value]. <br />Here, the inscription_index represents the deploy inscription containing the base64 data of the corresponding trait, and traits_value denotes the actual value of the specific trait. The sequence of elements in the "a" array should correspond with the "trait_types" key ordering from the deploy inscription. <br />As an example, the ordering in this case would be: (1) background = bitcoin-orange; (2) accessories = rainbow; (3) body = black-and-white-triangular; (4) belly = square; (5) face = happy. |

## Impact

Implementing the Generative BRC-721 standard will enhance the efficiency of Bitcoin block space utilization. As the unique traits' images are inscribed just once in the deploy transaction, the assets are composed of a HTML file referencing these traits. Any Front-end with Recursive Inscription implementation can render the images withouh any additional step using the on-chain deploy inscription.

### Case Study: OrdiBots (Prior Recursive Inscriptions)

*This Case Study was done prior to the release of recursive inscriptions. A recursive inscription example may be presented as well.*

To demonstrate the implementation of this proposed standard pre-recursive inscriptions., we launched a demo Generative BRC-721 collection called OrdiBots. This collection of 1,000 ordinals, composed of 26 different traits, showed a 55% reduction in block space with the new standard. This result indicates a potential for even greater efficiency with more complex traits collections.

 The 1,000 images combined have a total size of around 663kb. At the current network fee of around 30 sats/vB, the cost to inscribe the whole collection is about 0.293BTC ($7,850 at current price). By implementing the Generative BRC-721 standard, we can reduce the size of the whole collection to 294kb (10kb + 284kb), thus having a total expected reduction of about 55% of block space. This can be considered a lower threshold, since OrdiBots is already a very light collection, and we can expect greater efficiency with collection generated by more complex traits. 

- Deploy inscription: https://www.ord.io/8326719 (10kb)
- All possible assets inscription file: [ordibots-assets.json](https://luminex-public.s3.eu-west-1.amazonaws.com/collections/ordibots/ordibots-assets.json) (284kb)
- Example Mint inscription: https://www.ord.io/8400075 (344 bytes)

![image-20230521234811232](./assets/ordibots-sample.png)

### Front-ends

Front-ends that have already implemented recursive inscriptions will not need to take additional actions to render the images. These images will be directly rendered on-chain, requiring no further modifications or changes.

### Image Rendering

Every collection creator retains the freedom to devise their own image rendering methods, under the condition that the rendering function is inscribed on-chain and is accessible in the deployment inscription. Presently, a standard rendering function is offered as the default choice, which can be found at the following Inscription ID: [2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0](https://ordinals.com/content/2b126792c4a5d736dc071cea3a2439fd957f47b5cc7bf5c6fed5304ba5bd7f32i0).

The JavaScript function, GBRC721RenderImage, is provided as an example:

```javascript
export function GBRC721RenderImage(nfo) {
    // Get the canvas context
    let ctx = document.getElementById('canvas').getContext('2d');
    // Disable image smoothing
    ctx.imageSmoothingEnabled = false;

    // For each layer
    for(let i = 0; i < nfo.a.length; i++) {
        let img = new Image();

        // When the image has loaded
        img.onload = function() {
          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, 500, 500);
        }

        // Set the source of the image to be the base64 string
        img.src = 'data:image/png;base64,' + nfo.a[i][1];
    }
}
```

This function, GBRC721RenderImage, receives a JSON object as input. The object contains a key "a" that maps to an array of base64 encoded attributes. These attributes are arranged in the precise sequence in which they are meant to be rendered.
