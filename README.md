# demo

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# install babel-preset-stage-2
npm install --save-dev babel-preset-stage-2  

.babelrc配置：

    {
        "presets": [
            ["env", { "modules": false }],
            ["stage-2"]
        ]
    }
    
# install vue-router
npm install --save vue-router

# install vuex
npm install --save vue

# 发布
npm run build, 会得到一个dist folder.来到云服务器：

* 创建Bucket
* Static Website Hosting, Enable website hosting, Index Document:index.html, Error Document:error.html, Permissions:添加一个Bucket policy, 就是json字符串，配置完毕，找到Bucket,上传文件，上传index.html, build.js,创建文件夹dist,把build.js放到云服务器上的dist文件夹中，右键bucket属性，点击Endpoint上的链接。
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
