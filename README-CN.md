# 生成式 BRC-721

> ***概述**: 本提案介绍了生成式 BRC-721 标准，这是一种优化比特币序数生态系统中区块空间使用的解决方案，可容纳更多创作者并促进创新。该标准利用“部署”操作来创建具有存储在链上的独特特征的生成式 BRC-721 集合。然后，“铸造”操作引用部署操作中的特征，生成非同质化的 Ordinals(NFT)。此过程将区块空间使用量减少 50% 到 90%。通过一个名为“OrdiBots”的生成式 BRC-721 集合的案例研究证明了本提案的影响，该集合减少了 55% 区块空间。前端将需要进行调整以重新创建和显示来自铸造铭文文本数据里的图像。本提案标准为比特币区块链的高效去中心化创新奠定了基础。*

本倡议旨在在比特币序数生态系统中引发更多关于不可替代标准的交流。它旨在提高启动 Ordinals 图片集合的效率，类似于通过 BRC-20 标准创建同质化代币。

**Dune 仪表板演示:** [Generative BRC-721 (WIP)](https://dune.com/j543/generative-brc-721)
此 Dune 分析仪表板目前用作监控特定生成式 BRC-721 集合的铸造活动的工具。请注意，它可能需要进一步改进才能完全满足用户的需求。

![](./assets/gen-brc721-dune.png)

## 背景

随着比特币网络费用飙升并稳定在一个新的更高的平衡点，大量的创作者正在加入这个领域。这种趋势正在增加对比特币区块空间的需求，预计在不久的将来会进一步上升。为了让创作者在比特币区块链上发布他们的创新想法敞开大门，我们必须优化当前发布  Ordinals 图片集合的标准。

## 想法

我们提出了一个新标准来启动非同质化的生成式 Ordinals 集合。该标准可以节省所有链上资源，同时实现 50% 到 90% 的区块空间优化。该过程包括三个主要操作：

- 使用部署操作创建生成式 BRC-721 集合
- 使用铸造操作铸造一个非同质化的 Ordinal 集合
- 将非同质化 Ordinal 转移为标准序号铭文。
  
所有这些过程都可以在不需要外部索引器的情况下进行，前提是集合创建者按照当前要求发布其集合铭文的官方清单。

## 操作

### 部署生成式 BRC-721

部署操作使用一个 JSON/Text 铭文，其中包含集合的一般信息，以及构成集合特征的 base64 编码数据。用于创建Ordinals NFT 特征的独特图像存储在链上铭文内。铭文作为特征的参考和最终来源。

注意：也可以为同一个集合创建多个部署铭文，每个都将存储一组不同的特征。

*出于演示目的，我们使用 OrdiBots 集合*
*部署铭文示例：[Ord.io](https://www.ord.io/8326719)*

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
    "dim": [32,32],
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

| 字段         | 是否必须 | 描述                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| p           | 是       | 协议：帮助其他系统识别和处理 gen-brc-721 事件 |
| op          | 是       | 操作：事件类型（部署、铸造）                      |
| slug        | 是       | 代币：集合的标识符。如果没有索引器实施则不强制执行 |
| name        | 否       | 名称：集合的人类可读名称                  |
| supply      | 否       | 供应量：集合的供应量。如果没有索引器实施则不强制执行 |
| trait_types | 是       | 特征类型：这是一个数组，它规定了应该呈现特征的顺序。 |
| dim         | 是       | 尺寸：一个数组，表示以像素为单位的特征和最终图像的尺寸（宽度和高度），定义为 [width, height]。 |
| traits      | 是       | 特征：包含集合的独特特征的对象。组成为：{trait type: {trait key: {name, base64 image encoded}}} |



### 铸造生成式 BRC-721

铸造操作使用 JSON/Text 铭文，其中封装了有关正在铸造的实际非同质化 Ordinal(NFT) 的信息以及对部署铭文的引用。目的是存储生成图像的属性值、最终图像的哈希值以及链上部署铭文集合的引用。这种方法允许任何人使用链上刻录数据重新创建图像。

*出于演示目的，我们使用 OrdiBots 集合*
*铸造铭文示例：* [Ord.io](https://www.ord.io/8400075)

```javascript
{
   "p":"gen-brc-721",
   "op":"mint",
   "s":"ordibots",
   "t_ins":[
      "b7205d40f3b1b1486567f0d6e53ff2812983db4c03ad7d3606812cd150c64802i0"
   ],
   "h":"aa0d33b748e0177528a910a56a61c47bee2ba9b69749228d6520049c0fea3f4f",
   "id":"554",
   "a":[
      [0,"bitcoin-orange"],
      [0,"rainbow"],
      [0,"black-and-white-triangular"],
      [0,"square"],
      [0,"happy"]
   ]
}
```

| 字段   | 是否必须    | 描述                                                  |
| ----- | ---------- | ------------------------------------------------------------ |
| p     | 是         | 协议：帮助其他系统识别和处理 gen-brc-721 事件 |
| op    | 是         | 操作：事件类型（部署、铸造）                     |
| s     | 是         | 代币：集合的标识符。如果没有索引器实施则不强制执行 |
| t_ins | 是         | 特征（部署）铭文：包含部署铭文的铭文 ID(s) 的数组 |
| h     | ~~是~~ 否  | 哈希：这是指生成图像的 SHA256 输出。<u>这是一个可选元素</u>；集合创建者可以灵活地决定是否要在他们的集合中加入这个额外的安全检查。选择不使用哈希可以提高生成铭文过程的效率。 |
| id    | ~~否~~ 是  | Token ID：集合中每个非同质化 Ordinal(NFT) 的唯一标识符。对于跟踪和区分单个 NFOs 至关重要。 |
| a     | 是         | 属性：这是一个数组，其中包含此特定非同质化 Ordinal(NFT) 的属性值。每个数组元素的结构如下：[inscription_index, traits_value]。<br />这里的 inscription_index 表示包含相应特征的base64数据的部署铭文ID，traits_value 表示具体特征的实际值。“a”数组中的元素顺序应与部署铭文中的“trait_types”键顺序相对应。<br />例如，这种情况下的顺序是：(1) background = bitcoin-orange; (2) accessories = rainbow; (3) body = black-and-white-triangular; (4) belly = square; (5) face = happy. |

## 影响

实施生成式 BRC-721 标准将提高比特币区块空间的利用效率。由于独特特征的图像在部署事务中只被记录一次，资产由引用这些特征的文本文件组成。任何人都可以使用链上部署铭文重新创建图像，并使用 SHA256 输出验证结果。

### 案例研究： OrdiBots

为了演示该提议标准的实施，我们推出了一个名为 OrdiBots 的演示生成式 BRC-721 集合。这个由 26 个不同特征组成的 1,000 个序数的集合显示，新标准的区块使用空间减少了 55%。这一结果表明，使用更复杂的特征集合可能会提高效率。

1,000 张图像加起来的总大小约为 663kb。以目前大约 30 sats/vB 的网络费用计算，刻录整个收藏的成本约为 0.293BTC（按当前价格计算为 7,850 美元）。通过实施生成式 BRC-721 标准，我们可以将整个集合的大小减少到 294kb（10kb + 284kb），因此预计总区块空间减少约 55%。这可以被认为是一个较低的门槛，因为 OrdiBots 已经是一个非常轻的集合，我们可以期望通过更复杂的特征生成的集合具有更高的效率。 

- 部署铭文： https://www.ord.io/8326719 (10kb)
- 所有可能的资产铭文文件： [ordibots-assets.json](https://luminex-public.s3.eu-west-1.amazonaws.com/collections/ordibots/ordibots-assets.json) (284kb)
- Mint 铭文示例： https://www.ord.io/8400075 (344 bytes)

![image-20230521234811232](./assets/ordibots-sample.png)

### 前端

如果这个标准被广泛的收藏和创作者采用，前端界面将需要调整以显示铸造铭文生成的实际图像，而不是文本数据。这可以通过扫描“gen-brc-721”用户文本铭文来无缝完成。然后可以使用专门的链上数据重新生成图像，并随后存储在他们的系统基础设施中，其方式与目前的做法大致相同。

事实上，大多数 ordinal 平台不会在每次需要向用户显示图像铭文时查询区块链。相反，为了方便和高效，他们通常将这些图像存储在自己的数据库中。因此，实施该标准不会对流行的方法造成重大改变。

### 重新创建链上图像

要从部署铭文重建图像，我们可以使用下面描述的简单脚本。将前面描述的铸造操作格式数据作为输入，该脚本不仅会生成 base64 编码的图像，还会生成其相应的哈希值。

但是，请务必注意，此脚本只是一个说明性示例，此时可能无法全面涵盖所有场景。

```javascript
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
var obj = JSON.parse(process.argv[2]);

// adjust the dimensions of the image. In this case is set to 32x32
createImage(obj.a, obj.t_ins).then(data => {
    // Split the data from the prefix
    let [prefix, base64Data] = data.split(",");

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
```