const fs = require("fs");
const path = require("path");
const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it');
const templateCompiler = require('vue-template-compiler')
const loaderUtils = require("loader-utils");

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
    let [loadFile, query = ''] = match.split('?')
    const source = fs.readFileSync(path.join(baseDir, loadFile), "utf-8").replace(/[\r\n]*$/, "")
    if (path.extname(loadFile) === ".vue") {
      // let { type } = querystring.parse(query)
      let { type } = loaderUtils.parseQuery(`?${query}`)
      // let types = ['template', 'script']
      return replaceVue(source, typeof type === 'string' ? [type] : type)
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

module.exports = function(source, options) {
  this.cacheable && this.cacheable();
  // const options = loaderUtils.getOptions(this);
  options = Object.assign({}, {
      replaceFiles: false,
      wrapper: true
    },
    loaderUtils.getOptions(this) || options
  )
  if (options.replaceFiles && typeof module !== 'undefined') {
    source = replaceResults(source, process.cwd())
  }
  return options.wrapper ? wrapper(parser.render(source)) : parser.render(source);
}