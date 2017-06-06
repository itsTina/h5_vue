# vue

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ##

支持动态配置ajax请求路径,其配置文件具体路径: h5_vue/src/utils/config.js,其中字段如下:
api_url:  'http://www.h5api.com/'                       -- 请求域名
url_map:  {                                             -- 具体请求路径名(不包括域名)
  topicInfo:'qiezi/topic/detail',
  ***:'***'
}