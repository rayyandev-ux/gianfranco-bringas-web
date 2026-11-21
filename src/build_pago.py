import sys,os
root=sys.argv[1]
orig=open(os.path.join(root,'raw/sitio-actual/pago.html'),encoding='utf-8').read().split('\n')
meta='\n'.join(orig[:8])            # doctype → description (title, noindex, description)
pixel='\n'.join(orig[14:25])        # Meta Pixel block + noscript
css=open(os.path.join(root,'src/style.css'),encoding='utf-8').read()+'\n'+open(os.path.join(root,'src/pago/style.css'),encoding='utf-8').read()
body=open(os.path.join(root,'src/pago/body.html'),encoding='utf-8').read()
js=open(os.path.join(root,'src/pago/app.js'),encoding='utf-8').read()
out=f'''{meta}
<meta name="theme-color" content="#f6f2ea">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
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
open(os.path.join(root,'web/pago.html'),'w',encoding='utf-8').write(out)
print('ok',len(out))
