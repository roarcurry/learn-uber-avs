---
title: '[AVS] XVIZ - User Guide'
subtitle: ''
catalog: true
toc_nav_num: false
header-img: /img/header_img/avs/avs.jpg
tags:
  - AVS
categories:
  - AVS
date: 2019-07-05 14:50:58
---



> 推荐阅读：
> [XVIZ - User Guide | AVS](https://avs.auto/#/xviz/user-guide/overview)
> [XVIZ - Github | Uber ](https://github.com/uber/xviz)

XVIZ 附带了许多工具来帮助我们生成、验证、解析 XVIZ 并给予样式。

本指南将展示如何使用这些工具，包括：
+ 解释需要哪些数据
+ 如何在 XVIZ 中管理流、对象和时间
+ 解释与时间和流有关的 **frames** 帧
+ 如何在 XVIZ 中创建 UI 元素


# 1. 安装
根据需要安装相应的 XVIZ 库：
**NPM module** | **Description**
:-: | :-:
`@xviz/builder` | 用于构建和编写 XVIZ 数据的类
`@xviz/parser` | 用于解析和后处理 XVIZ 数据的类
`@xviz/schema` | 用于验证 XVIZ JSON 数据的 JSON 模式
`@xviz/server` | 用于创建服务器

例如：
```
npm install @xviz/builder -s
# or
yarn add @xviz/builder
```


---
# 2. XVIZ Data Structure
有关 XVIZ 的基本概念，请查看 [XVIZ Concepts](https://avs.auto/#/xviz/overview/concepts)。

## 2.1 Binary GLB files
XVIZ 可以编码为二进制 GLB 文件，其包含了一个 JSON 编码的数据结构和许多二进制块，通常表示 JPEG 或 PNG 图像和诸如点云的大几何。

## 2.2 Message
在给定时间戳范围内的各种 `datum` 被集合到 `message` 中，通常每个 `datum` 类型包含一个时间戳。
一个 GLB 文件可以包含多个条 message ，但是按照惯例，一个 `message` 在一个 `.glb` 文件中，这使得 stream server 通过 socket 为每个消息发送一个 GLB 文件变得更容易。

## 2.3 Streams
一条 message 可以包含多个 stream，所以可以将多个数据流写入同一条 message。
需要注意的是，所有流都包含相同类型的数据（几何图元、变量等 `datum`），因此客户端只需合并来自所有流的数据并显示它。

## 2.4 JSON files
XVIZ 也可以用 JSON 编码，虽然没有二进制编码数据在处理大文件上的优势，但是更为灵活，易于检查和操作。


---
# 3. Generating XVIZ
## 3.1 Generating XVIZ metadata
```javascript
import {XVIZMetadataBuilder} from '@xviz/builder';

const xb = new XVIZMetadataBuilder();
xb.startTime(0).endTime(1);

const metadata = xb.getMetadata();
```

## 3.2 Generating XVIZ primitives
```javascript
import {XVIZBuilder} from '@xviz/builder';

const builder = new XVIZBuilder();
const streamId = '/test/polygon';

const verts1 = [[0, 0, 0], [4, 0, 0], [4, 3, 0]];
const verts2 = [[1, 2, 3], [0, 0, 0], [2, 3, 4]];
const ts1 = 1.0;
const ts2 = 2.0;

builder
  .pose({time: ts1})
  .stream(streamId)
  .timestamp(ts1)
  .polygon(verts1)
  .polygon(verts2)
  .timestamp(ts2);
```

## 3.3 Generating XVIZ declarative UI
请查看[该章节](#8-using-the-declarative-ui)。


---
# 4. Validating XVIZ
## 4.1 Validating XVIZ metadata
```javascript
import {XVIZValidator} from '@xviz/schema';

const validator = new XVIZValidator();

// Throws on error
metadata = {
  version: '2.0.0'
};

validator.validateMetadata(metadata);
```

## 4.2 Validating XVIZ primitives
```javascript
// Create a stream
import {XVIZBuilder} from '@xviz/builder';

const builder = new XVIZBuilder();

builder
  .pose()
  .timestamp(ts1);
builder
  .primitive('/test/polygon')
  .timestamp(ts1)
  .polygon([[0, 0, 0], [4, 0, 0], [4, 3, 0]]);

// Validate it
import {XVIZValidator} from '@xviz/schema;

const validator = new XVIZValidator();

validator.validateStateUpdate(builder.getMessage());
```

---
# 5. Serving XVIZ
XVIZ 旨在通过流服务来提供数据，能够根据需要加载和丢弃数据，实现“无限”回放，并且还可以寻找特定时间戳并从该点重新开始传输数据。

请注意，对于小型 XVIZ 数据集，可以使用一个或多个请求将整个数据集加载到客户端，但对于较大的数据集，通常需要进行流式处理。


---
# 6. Parsing XVIZ
虽然大多数 XVIZ 用户的目的在于生成（或将现有数据转换为） XVIZ，以便在客户端中显示，但是也有一些用户希望加载和解析 XVIZ，实现自定义显示、后处理或转换。

## 6.1 Loading XVIZ
XVIZ 旨在通过 socket 提供 GLB 文件大小的消息块，但也可以通过文件或网络请求读取。

## 6.2 Parsing Steps
对于以二进制 GLB 文件格式存储的 XVIZ，必须先解压缩，将二进制块重新分解为更方便的 JS 对象和数组。
然后进行后处理，以确保数据处于标准化、易于使用的格式，并且还可以应用一些配置，例如过滤某些流等。

---
# 7. Styling XVIZ
XVIZ 中的样式可以分为多个层面。

## 7.1 Object inline styles
使用 `XVIZBuilder.style()` 方法在转换期间定义对象样式，只需传递具有适当样式属性和值的对象即可。

## 7.2 Stream style classes
1. `XVIZMetadataBuilder.styleClass()` 为 streamId 定义 class；
2. 使用 `XVIZBuilder.classes()` 向对象添加 class。

## 7.3 Stream style defaults
定义流样式可以为流中所有对象的设置默认样式属性值。它们提供了一个单独的位置来定义流的样式，避免了为单个不必要的元素设置样式。


---
# 8. Using the Declarative UI
XVIZ 允许开发者声明性地将 streams 连接到 UI 组件，如控件小部件、表格、图表和树视图。这些UI组件可以由 XVIZ 客户端呈现，并且可以用于提供除主要 3D 场景之外的其他信息。

在 JS 中向 XVIZ 添加声明性 UI 组件的最简单方法是使用 `XVizUIBuilder`。
```javascript
const builder = new XVIZDeclarativeUIBuilder({});

builder
  .panel('Metrics')
  .container('child-1')

  .metric('child-1-1')
  .title('Acceleration')
  .end()

  .metric('child-1-2')
  .title('Velocity')
  .end()

  .end();
```

---
# 9. Using XVIZ without JavaScript
目前阶段的 XVIZ 版本专注于为生成和使用 XVIZ 提供强大的 JavaScript 支持，所以暂时没有其他的语言支持。



---
返回 [AVS 专题](/2019/07/05/avs)









