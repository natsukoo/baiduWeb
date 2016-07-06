// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

//压缩！！
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});
fis.match('*.html', {
  optimizer: fis.plugin('html-minifier')
});
//压缩结束


// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

// 所有的 js
fis.match('/js/**.js', {
    //发布到/static/js/xxx目录下
    release : '/static/js$0'
});

// 所有的 css
fis.match('/css/**.css', {
    //发布到/static/css/xxx目录下
    release : '/static/css$0'
});

// 所有img目录下的.png，.jpg文件
fis.match('/img/(*.{png,jpg})', {
    //发布到/static/pic/xxx目录下
    release: '/static/pic/$1$2'
});