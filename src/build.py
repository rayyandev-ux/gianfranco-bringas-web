import sys,os
root=sys.argv[1]
orig=open(os.path.join(root,'raw/sitio-actual/index.html'),encoding='utf-8').read().split('\n')
head='\n'.join(orig[:348])  # through </script> of JSON-LD (line 348)
pixel='\n'.join(orig[363:373])  # <script> fbq ... </script> + noscript
css=open(os.path.join(root,'src/style.css'),encoding='utf-8').read()
body=open(os.path.join(root,'src/body.html'),encoding='utf-8').read()
faq=open(os.path.join(root,'src/faq.html'),encoding='utf-8').read()
body=body.replace('<!--FAQ-->',faq)
js=open(os.path.join(root,'src/app.js'),encoding='utf-8').read()
out=f'''{head}
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="assets/img/vsl-poster.jpg">
<meta name="theme-color" content="#f6f2ea">
<script>if(!/[?&]static/.test(location.search)&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&((performance.getEntriesByType('navigation')[0]||{{}}).type!=='back_forward'))document.documentElement.classList.add('ld')</script>
<script>(function(){{var f=new URLSearchParams(location.search).get("fuente");if(f)document.documentElement.dataset.fuente=f}})()</script>
<style>
{css}
</style>
{pixel}
</head>
{body}
<script>
{js}
</script>
</body>
</html>
'''
open(os.path.join(root,'web/index.html'),'w',encoding='utf-8').write(out)
print('ok',len(out))
