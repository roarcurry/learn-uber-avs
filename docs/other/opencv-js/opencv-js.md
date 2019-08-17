---
title: '[OpenCV] OpenCV.js'
subtitle: 计算机视觉 JavaScript 库
catalog: true
toc_nav_num: false
header-img: /img/header_img/opencv/opencv.jpg
tags:
  - OpenCV
categories:
  - OpenCV
date: 2019-07-16 14:01:54
---


> 推荐阅读：
> [OpenCV.js Tutorials - OpenCV](https://docs.opencv.org/3.3.1/d5/d10/tutorial_js_root.html)
> [OpenCV.js Demo - roarcurry](https://github.com/roarcurry/opencv.js/tree/master/Demo)
> [OpenCV.js 初步使用及小例子 - aabond](https://blog.csdn.net/qq_23091073/article/details/81461016)


# 1. Overview
> [Introduction to OpenCV.js - OpenCV](https://docs.opencv.org/4.0.1/df/df7/tutorial_js_table_of_contents_setup.html)

## 1.1 Introduction
**OpenCV.js**
OpenCV 于 1999 年由 Gary Bradski 在英特尔创建。第一个版本于 2000 年发布，并在 2005 年赢下了 DARPA 无人驾驶机器人挑战赛。OpenCV 现在支持与计算机视觉和机器学习相关的众多算法，并且正在日益壮大。

OpenCV 支持各种编程语言，如 C++，Python 和 Java，可在不同的平台上使用，包括 Windows，Linux，OS X，Android 和 iOS。基于 CUDA 和 OpenCL 的高速 GPU 操作接口也在积极开发中。 **OpenCV.js** 将 OpenCV 带入开放的 Web 平台，并使其可供 JavaScript 程序员使用。

**OpenCV.js: OpenCV for the JavaScript programmer**
Web 是最普遍存在的开放计算平台，通过在每个浏览器中实施 HTML5 标准，Web 应用程序能够使用 HTML5 视频标签呈现在线视频，通过 WebRTC API 捕获网络摄像头视频，并通过 Canvas API 访问视频帧的每个像素。随着可用的多媒体内容的丰富，Web 开发人员需要 JavaScript 中的各种图像和视觉处理算法来构建创新的应用程序。此要求对于 Web 上的新兴应用程序更为重要，例如 Web 虚拟现实（WebVR）和增强现实（WebAR）。所有这些用例都要求在 Web 上有效地实现计算密集型视觉内核。

[Emscripten](https://github.com/kripken/emscripten) 是一个 LLVM-to-JavaScript 的编译器，它可以将 C/C++ 程序编译为可以直接在 Web 浏览器中执行的 asm.js 或 WebAssembly。Asm.js 是一个高度可优化的 JavaScript 子集，可以在 JavaScript 引擎中实现提前编译和优化，从而提供接近原生的执行速度。WebAssembly 是一种可移植的，大小和加载时间都非常有效率的二进制格式，适用于编译到 Web。WebAssembly 旨在以原生速度执行，目前已被 W3C 设计为开放标准。

OpenCV.js 是针对 Web 平台的 OpenCV 函数的特定子集的 JavaScript 封装。它允许具有多媒体处理功能的新兴 Web 应用程序受益于 OpenCV 中提供的各种视觉功能。OpenCV.js 利用 Emscripten 将 OpenCV 函数编译为 asm.js 或 WebAssembly，并为 Web 应用程序提供 JavaScript API 以访问它们。该库的未来版本将利用 Web 上可用的加速 API，如 SIMD 和多线程执行。

**OpenCV.js Tutorials**
本指南主要关注 **OpenCV 3.x** 版本，目的在于：
+ 提高 OpenCV 在 Web 开发中的适应性；
+ 帮助 Web 开发人员和计算机视觉研究人员以交互方式访问各种基于 Web 的 OpenCV 示例，以帮助他们了解特定的视觉算法。

由于 OpenCV.js 能够直接在浏览器中运行，因此 OpenCV.js 教程网页具有直观性和交互性。例如，使用 WebRTC API 并评估 JavaScript 代码将允许开发人员更改 CV 函数的参数，并在网页上进行实时 CV 编码以实时查看结果。


---
## 1.2 Build OpenCV.js
**Emscripten**
[Emscripten](https://github.com/kripken/emscripten) 是一个 LLVM-to-JavaScript 的编译器，我们使用它来构建 OpenCV.js。

按照以下命令安装 [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html)：
```
# Get the emsdk repo
$ git clone https://github.com/emscripten-core/emsdk.git

# Enter that directory
$ cd emsdk

# update
$ ./emsdk update
# or
$ git pull

# Download and install the latest SDK tools.
$ ./emsdk install latest

# Activate PATH and other environment variables in the current terminal
$ source ./emsdk_env.sh
```

**OpenCV Source Code**
你可以从 [OpenCV releases page](https://opencv.org/releases/) 下载最新的 OpenCV 稳定版本并解压，或者直接从 github 上拉取：
```
$ git clone https://github.com/opencv/opencv.git
```

**Building OpenCV.js from Source**
1. 编译 `opencv.js`，执行 python 命令 `python <opencv_src_dir>/platforms/js/build_js.py <build_dir>`，例如将其编译到目录 `/build_js` 下：
    ```
    $ cd opencv
    $ python ./platforms/js/build_js.py build_js
    ```
    > 需要安装 `python` 和 `cmake`
2. 编译程序默认编译为 asm.js 版本，要编译 WebAssembly 版本，加上 `--build_wasm` 参数，例如将其编译到目录 `/build_wasm` 下：
    ```
    $ python ./platforms/js/build_js.py build_wasm --build_wasm
    ```
3. 如果需要可以编译文档，加上 `--build_doc` 参数，例如：
    ```
    $ python ./platforms/js/build_js.py build_js --build_doc
    ```
    > 需要安装 `doxygen`
4. 如果需要可以编译测试文件，加上 `--build_test` 参数，例如：
    ```
    $ python ./platforms/js/build_js.py build_js --build_test
    ```
    要运行测试，在 `<build_dir>/bin` 目录下启动本地 web server。比如启动 node http-server，可以用浏览器访问 `http://localhost:8080/tests.html`，打开后会自动运行单元测试。
    也可以通过 node 启动测试，例如：
    ```
    $ cd bin
    $ npm install
    $ node tests.js
    ```
    > 需要安装 `node`


---
## 1.3 Using OpenCV.js
**Create a web page**
首先创建一个能够上传图像的简单页面：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello OpenCV.js</title>
</head>
<body>
<h2>Hello OpenCV.js</h2>
<div>
    <div class="inputoutput">
        <img id="imageSrc" alt="No Image" />
        <div class="caption">
            imageSrc
            <input type="file" id="fileInput" name="file" />
        </div>
    </div>
</div>
<script type="text/javascript">
    let imgElement = document.getElementById("imageSrc");
    let inputElement = document.getElementById("fileInput");
    inputElement.addEventListener("change", (e) => {
      imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);
</script>
</body>
</html>
```
将以上代码保存到本地文件 `index.html`，直接在浏览器上打开就可以运行了。
> 虽好能运行在 local web server

**Include OpenCV.js**
利用 `<script>` 标签引入 `opencv.js`，注意修改 `opencv.js` 路径：
```html
<script src="../src/js/opencv.js" type="text/javascript"></script>
```
默认加载方式为同步加载，如果需要异步加载，可以在 `<script>` 标签中添加 `async` 属性，并且在 `onload` 属性中设置加载完成后的回调函数：
```html
<script async src="../src/js/opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>
```

**Use OpenCV.js**
一旦 `opencv.js` 准备就绪，就可以通过 `cv` 对象访问 OpenCV 的对象和函数。例如，可以通过 [cv.imread](https://docs.opencv.org/4.0.1/d4/da8/group__imgcodecs.html#ga288b8b3da0892bd651fce07b3bbd3a56) 方法从图像中创建 [cv.Mat](https://docs.opencv.org/4.0.1/d3/d63/classcv_1_1Mat.html) 对象：
```javascript
imgElement.onload = function() {
    let mat = cv.imread(imgElement);
}
```
> 因为图像加载是异步的，所以要把创建 [cv.Mat](https://docs.opencv.org/4.0.1/d3/d63/classcv_1_1Mat.html) 的代码写到回调函数 `onload` 中

许多 OpenCV 函数可用于处理 [cv.Mat](https://docs.opencv.org/4.0.1/d3/d63/classcv_1_1Mat.html)，可以参考其他教程以获取详细信息，例如 [Image Processing](https://docs.opencv.org/4.0.1/d2/df0/tutorial_js_table_of_contents_imgproc.html)。

本例只显示 [cv.Mat](https://docs.opencv.org/4.0.1/d3/d63/classcv_1_1Mat.html)，该过程需要借助 Canvas 元素。
```html
<canvas id="outputCanvas"></canvas>
```
可以使用 [cv.imshow](https://docs.opencv.org/4.0.1/d7/dfc/group__highgui.html#ga453d42fe4cb60e5723281a89973ee563) 来让 [cv.Mat](https://docs.opencv.org/4.0.1/d3/d63/classcv_1_1Mat.html) 显示在 Canvas 中。
```javascript
cv.imshow(mat, "outputCanvas");
```
将这些步骤结合起来，html 代码如下所示：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello OpenCV.js</title>
</head>
<body>
<h2>Hello OpenCV.js</h2>
<p id="status">OpenCV.js is loading...</p>
<div>
    <div class="inputoutput">
        <img id="imageSrc" alt="No Image" />
        <div class="caption">
            imageSrc
            <input type="file" id="fileInput" name="file" />
        </div>
    </div>
    <div class="inputoutput">
        <canvas id="canvasOutput" ></canvas>
        <div class="caption">canvasOutput</div>
    </div>
</div>
<script type="text/javascript">
    let imgElement = document.getElementById('imageSrc');

    let inputElement = document.getElementById('fileInput');
    inputElement.addEventListener('change', (e) => {
        imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);

    imgElement.onload = function() {
        let mat = cv.imread(imgElement);
        cv.imshow('canvasOutput', mat);
        mat.delete();
    };

    function onOpenCvReady() {
        document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
</script>
<script async src="../src/js/opencv.js" onload="onOpenCvReady();" type="text/javascript"></script>
</body>
</html>
```

> 详情请查看 [Demo1](https://github.com/roarcurry/opencv.js/tree/master/Demo/Demo1)


---
# 2. GUI Features
> [GUI Features - OpenCV](https://docs.opencv.org/4.0.1/df/d04/tutorial_js_table_of_contents_gui.html)




---
# 3. Core Operations
> [Core Operations - OpenCV](https://docs.opencv.org/4.0.1/d1/d78/tutorial_js_table_of_contents_core.html)


---
# 4. Image Processing
> [Image Processing - OpenCV](https://docs.opencv.org/4.0.1/d2/df0/tutorial_js_table_of_contents_imgproc.html)



---
# 5. Video Analysis
> [Video Analysis - OpenCV](https://docs.opencv.org/4.0.1/de/db6/tutorial_js_table_of_contents_video.html)



---
# 6. Object Detection
> [Object Detection - OpenCV](https://docs.opencv.org/4.0.1/dc/d73/tutorial_js_table_of_contents_objdetect.html)
