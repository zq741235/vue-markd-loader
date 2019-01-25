
Vue Markd Loader 是一个 `webpack` 的 loader，将markdown(.md)文件转换为Vue Component 或 html 片段

## 安装

```
npm i vue-markd-loader -D
```

## 介绍

``` 
// *.md
# 一级标题
```

### output

**vue component**
```html
// wrapper:true 
<template>
  <section v-html="content" v-once />
  </template>
  <script>
  export default {
    created() { 
      this.content = '<h1>一级标题</h1>'; 
    }
 };
</script>

```
**html**
```html
// wrapper:false 
<h1>一级标题</h1>

```
**除此之外，Vue Markd Loader 还提供了其他特性：**

### 输出文件到代码片段

index.js
```javascript
var x = 1
```
index.md

```javascript
{{:index.js}}
```

output

```javascript
// index.md
var x = 1
```


## 使用

### 简单配置
```javascript
// webpack config
module: {
  rules: [{
    test: /\.md$/,
    use: [
      'vue-loader',
      'vue-markd-loader'
    ]
  }]
}
```
```javascript
// main.js 
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
```


### 配置

#### replaceFiles

 ```
 type: Boolean
 default:false
 ```

若要在`.md`里自动替换文件内容,`.md`里可以直接写文件路径（路径base为项目根目录）替换内容，语法如下：

```
{{:PATH.(js|css|html|...)}}
```
举个例子：

```javascript
// index.js
var x = 1

```

```javascript
// index.md
{{:index.js}}
```

output

```
// index.md
var x = 1
```

则需要配置`replaceFiles`选项

```
rules: [{
    test: /\.md$/,
    use: [
      'vue-loader',
      {
        loader: 'vue-markd-loader',
        options: {
          replaceFiles: true // 这里！！
        }
      }
    ]
  }]
```

对于`.vue`，默认分别输出：模版+js，对于写组件文档时非常有效，再也不用复制粘贴示例代码到文档上去啦，更新示例也无需手动维护文档，就问棒不棒？！


```html
// 以图片组件为例 ,语法为 {{:PATH}}
{{:examples/views/image.vue}} // 加载 模版+js
{{:examples/views/image.vue?type=template}}  // 只加载模版部分
{{:examples/views/image.vue?type=script}}  // 只加载js部分

```
 
#### wrapper

 ```
 type: Boolean
 default:true
 ```

 例如：
```
// index.md

# 一级标题
```

output

```html
// wrapper:true 
<template>
  <section v-html="content" v-once />
  </template>
  <script>
  export default {
    created() { 
      this.content = '<h1>一级标题</h1>'; 
    }
 };
</script>

```

```html
// wrapper:false 
<h1>一级标题</h1>

```
