const { configureSitemap } = require('@sergeymyssak/nextjs-sitemap');

const Sitemap = configureSitemap({
  baseUrl: 'https://fpldashboard.dev',
  exclude: ['/api/*', '/404/', '/player/*'],
  excludeIndex: true,
  pagesConfig: {
    '/price-changes/': {
      priority: '0.9',
      changefreq: 'daily',
    },
  },
  isTrailingSlashRequired: true,
  targetDirectory: __dirname + '/public',
  pagesDirectory: __dirname + '/pages',
});
Sitemap.generateSitemap();
