## 安装

```
npm i vue-markd-loader
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

### 扩展配置

若要在`.md`里自动替换文件内容,`.md`里可以直接写文件路径替换内容，语法如下：

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
 
