import sys, os
# v9 · landing de oferta (lo que pidió Gianfranco el 20-11, referencia blimbooster.vip/low-ticket-a) → web/index.html
# El <head> (SEO, JSON-LD, Pixel) sale del sitio original, igual que en build.py (que ahora arma la versión chat en web/chat.html).
root = sys.argv[1]
R = lambda f: open(os.path.join(root, f), encoding='utf-8').read()
orig = R('raw/sitio-actual/index.html').split('\n')
head = '\n'.join(orig[:348])
pixel = '\n'.join(orig[363:373])
body = R('src/lp/body.html').replace('<!--FAQ-->', R('src/faq.html'))
out = f'''{head}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/cormorantgaramond-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="assets/img/vsl-poster.jpg">
<meta name="theme-color" content="#070c16">
<script>if(!/[?&]static/.test(location.search)&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&((performance.getEntriesByType('navigation')[0]||{{}}).type!=='back_forward'))document.documentElement.classList.add('ld')</script>
<style>
{R('src/lp/style.css')}
</style>
{pixel}
</head>
{body}
<script>
{R('src/lp/app.js')}
</script>
</body>
</html>
'''
open(os.path.join(root, 'web/index.html'), 'w', encoding='utf-8').write(out)
print('ok', len(out))
