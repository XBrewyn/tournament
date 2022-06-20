[ 
  {
    tagName: 'script',
    src: './tools/index.js',
  },
  {
    tagName: 'script',
    src: './js/bracket.js',
  },
  {
    tagName: 'script',
    src: './js/interface.js',
  },
  {
    tagName: 'script',
    src: './js/main.js',
  },
  {
    tagName: 'script',
    src: './js/test/tools/index.js',
  },
  {
    tagName: 'link',
    href: './assets/css/main.css'
  }
].forEach(({ tagName, href, src }) => {
  const el = document.createElement(tagName);

  (src && (el.src = src)) ||
  (href && (el.href = href)) && (el.rel = 'stylesheet');

  document.querySelector('head').appendChild(el);
});

