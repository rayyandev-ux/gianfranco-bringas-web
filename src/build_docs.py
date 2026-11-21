import sys,os,re
root=sys.argv[1]
P=lambda *a: os.path.join(root,*a)
css=open(P('src/style.css'),encoding='utf-8').read()+'\n'+open(P('src/docs/docs.css'),encoding='utf-8').read()
js=open(P('src/docs/docs.js'),encoding='utf-8').read()
HEADER='''<header class="bar">
  <div class="col">
    <a class="back ic" href="index.html" data-back aria-label="Volver a la web"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
    <a class="me" href="index.html" aria-label="Gianfranco Bringas, volver a la web"><span class="pic"><img src="assets/img/gianfranco-cara.jpg" alt="" width="46" height="46"><i aria-hidden="true"></i></span>
      <span class="who"><b>Gianfranco Bringas</b><small><span class="role">{role}</span><span class="st" id="st" aria-live="polite">responde de 8 a. m. a 10 p. m.</span></small></span></a>
    <nav class="acts" aria-label="Acciones">
      <a class="ic" href="tel:+51992878215" aria-label="Llamar al +51 992 878 215" title="Llamar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.8h2.6l1.4 3.6-1.8 1.2a11 11 0 0 0 6.6 6.6l1.2-1.8 3.6 1.4v2.6a1.8 1.8 0 0 1-1.9 1.8A15.8 15.8 0 0 1 4.8 5.7a1.8 1.8 0 0 1 1.8-1.9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></a>
      <a class="btn book" href="index.html#precio"><span>Revisar<span class="hm"> mi caso</span></span></a>
    </nav>
  </div>
</header>'''
pages=[('docs/informe.html','informe-ergo-capital-escudia.html'),('docs/privacidad.html','privacidad.html'),('docs/cobertura.html','cobertura-ergo-capital.html')]
for src,name in pages:
    orig=open(P('raw/sitio-actual',name),encoding='utf-8').read()
    head=orig[:orig.index('</head>')]
    # drop the old look (Google Fonts, styles.css, navy theme colour); keep title, meta, canonical, robots, Pixel
    head=re.sub(r'\s*<link[^>]*(fonts\.googleapis|fonts\.gstatic|styles\.css)[^>]*>','',head)
    head=re.sub(r'\s*<meta name="theme-color"[^>]*>','',head)
    head=re.sub(r'\s*<link rel="icon"[^>]*>','',head)
    body=open(P('src',src),encoding='utf-8').read()
    m=re.search(r'<!--HEADER:(.*?)-->',body)
    body=body.replace(m.group(0),HEADER.format(role=m.group(1)))
    out=f'''{head}
<meta name="theme-color" content="#f6f2ea">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>(function(){{var f=new URLSearchParams(location.search).get("fuente");if(f)document.documentElement.dataset.fuente=f}})()</script>
<style>
{css}
</style>
</head>
{body}
<script>
{js}
</script>
</body>
</html>
'''
    open(P('web',name),'w',encoding='utf-8').write(out)
    print('ok',name,len(out),'pixel' if "fbq('init'" in out else 'NO PIXEL','canonical' if 'canonical' in out else '')
