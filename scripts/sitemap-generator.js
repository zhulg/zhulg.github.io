'use strict';

// URL规范化函数
function normalizeUrl(url) {
  // 移除多余的斜杠
  return url.replace(/([^:]\/)\/+/g, '$1');
}

// 添加404页面检查函数
function is404Page(path) {
  return /404(\.html|\/index\.html|\/)?$/i.test(path);
}

// 修改 sitemap 配置
hexo.config.sitemap = Object.assign({}, hexo.config.sitemap, {
  exclude: [
    'sitemap/index.html',
    'sitemap/**',
    '404.html',
    '404/index.html',
    '/404/',
    '/404.html',
    '404/**',
    'robots.txt',
    'ads.txt',
    '*.json'
  ]
});

// 添加URL处理钩子
hexo.extend.filter.register('pre_generate', function() {
  const config = this.config;
  if (config.url.endsWith('/')) {
    config.url = config.url.slice(0, -1);
  }
});

// 添加sitemap过滤钩子
hexo.extend.filter.register('before_generate', function() {
  const sitemapConfig = this.config.sitemap;
  if (sitemapConfig) {
    // 确保exclude数组存在
    sitemapConfig.exclude = sitemapConfig.exclude || [];
    // 添加404相关的路径
    if (!sitemapConfig.exclude.includes('404.html')) {
      sitemapConfig.exclude.push('404.html');
    }
    if (!sitemapConfig.exclude.includes('404/index.html')) {
      sitemapConfig.exclude.push('404/index.html');
    }
  }
});

// 修改生成器
hexo.extend.generator.register('html_sitemap', function(locals) {
  return {
    path: 'sitemap/index.html',
    data: {
      title: '站点地图',
      posts: locals.posts.sort('-date'),
      categories: locals.categories,
      tags: locals.tags,
      site: locals.site
    },
    layout: ['sitemap', 'page']
  };
}); 