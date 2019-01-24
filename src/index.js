const fs = require("fs");
const path = require("path");
const querystring = require('querystring');

const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it');
const templateCompiler = require('vue-template-compiler')
const loaderUtils = require("loader-utils");
// const { parse } = require('@vue/component-compiler-utils')
const wrapper = content => `
<template>
  <section v-html="content" v-once />
</template>
<script>
export default {
  created() {
    this.content = decodeURIComponent(\`${encodeURIComponent(content)}\`);
  }
};
</script>
`;

const replaceVue = (source, types = ['template', 'script']) => {
  const descriptor = templateCompiler.parseComponent(source)
  const lang = {
    template: 'html',
    script: 'javascript' //,
    // style: 'css'
  }

  return types.map(type => lang[type] && `
  \`\`\`${lang[type]}
  ${descriptor[type].content}
  \`\`\` 
  `).join('')
}
const replaceResults = (template, baseDir) => {
  // const regexp = new RegExp("\\{\\{" + (prefix ? prefix + ":" : "") + "([^:\\}]+)\\}\\}", "g");
  const regexp = new RegExp("\\{\\{:([^:\\}]+)\\}\\}", "g");

  return template.replace(regexp, function(match) {
    match = match.substr(3, match.length - 5);
    let [loadFile, query] = match.split('?')
    const source = fs.readFileSync(path.join(baseDir, loadFile), "utf-8").replace(/[\r\n]*$/, "")

    if (path.extname(loadFile) === ".vue") {
      let { type } = querystring.parse(query)
      // let types = ['template', 'script']
      return replaceVue(source, type ? [type] : undefined)
    }

    return source
  });
};

const parser = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + MarkdownIt().utils.escapeHtml(str) + '</code></pre>';
  }
});

module.exports = function(source) {
  this.cacheable && this.cacheable();
  const options = loaderUtils.getOptions(this);
  if (options.replaceFiles) {
    source = replaceResults(source, process.cwd())
  }
  return wrapper(parser.render(source));
}