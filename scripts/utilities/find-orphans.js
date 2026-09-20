const fs = require('fs');
const path = require('path');

function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getAllFiles(path.join(__dirname, 'apps/web/src'));

const routes = [
  '/',
  '/wishlist',
  '/account/orders',
  '/admin',
  '/admin/categories',
  '/admin/chats',
  '/admin/customers',
  '/admin/footer',
  '/admin/homepage',
  '/admin/notifications',
  '/admin/orders',
  '/admin/products',
  '/admin/products/new',
  '/admin/settings',
  '/cart',
  '/checkout',
  '/login',
  '/messages',
  '/notifications',
  '/orders/success',
  '/products',
  '/profile',
  '/profile/setup',
  '/register'
];

const patterns = routes.map(route => {
  return { route, regex: new RegExp(`(href=|push\\(|replace\\(|Link.*?href=)['"\`]?${route}['"\`]?\\)?`, 'g') };
});

const unreferencedRoutes = new Set(routes);

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const { route, regex } of patterns) {
    if (content.includes(`"${route}"`) || content.includes(`'${route}'`) || content.includes(`\`${route}\``) || content.includes(`href="${route}"`) || content.includes(`href={'${route}'}`) || content.includes(`push('${route}')`) || content.includes(`replace('${route}')`)) {
      // Don't count the page itself as a reference if it just has it in a comment, but simpler:
      if (!file.replace(/\\/g, '/').endsWith(`app${route === '/' ? '/page.tsx' : route + '/page.tsx'}`)) {
        unreferencedRoutes.delete(route);
      }
    }
  }
}

// Special dynamic routes
const dynamicRoutes = [
  { path: '/account/orders/[orderId]', check: 'account/orders/' },
  { path: '/admin/products/[productId]/edit', check: 'admin/products/' }, // they probably use admin/products/${id}/edit
  { path: '/messages/[conversationId]', check: 'messages/' },
  { path: '/products/[productId]', check: 'products/' }
];

const unreferencedDynamic = new Set(dynamicRoutes.map(d => d.path));

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const { path, check } of dynamicRoutes) {
    if (content.includes(`\`/${check}`) || content.includes(`"/${check}`) || content.includes(`'/${check}`)) {
      if (!file.replace(/\\/g, '/').endsWith(`app${path}/page.tsx`)) {
        unreferencedDynamic.delete(path);
      }
    }
  }
}

console.log("Unreferenced Static Routes:", Array.from(unreferencedRoutes));
console.log("Unreferenced Dynamic Routes:", Array.from(unreferencedDynamic));
