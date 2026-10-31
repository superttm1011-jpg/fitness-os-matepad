#!/usr/bin/env python3
"""Standard-library-only smoke checks; no private data or API credentials."""
from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
errors=[]
def check(ok,desc):
    if ok: print('PASS',desc)
    else: print('FAIL',desc); errors.append(desc)
html=(root/'index.html').read_text(encoding='utf-8')
sw=(root/'sw.js').read_text(encoding='utf-8')
manifest=json.loads((root/'manifest.webmanifest').read_text(encoding='utf-8'))
check('Fitness OS V4.2' in html, 'Version displayed as V4.2')
check('const VERSION=4.2' in html, 'JS version updated')
check("DBNAME='FitnessOS_Duo_V4'" in html, 'Existing V4 IndexedDB remains unchanged')
check('BASE_HIM=[]' in html and 'LAB_HIM=[]' in html and 'BASE_HER=[]' in html and 'LAB_HER=[]' in html,'Public build excludes personal health baselines')
check('fitnessos-duo-shell-v4.2-' in sw, 'SW cache version updated')
check("request.mode==='navigate'" in sw and 'fetch(event.request)' in sw and 'caches.match(APP_SHELL)' in sw, 'Offline navigation fallback provided')
check('self.skipWaiting()' in sw, 'SW update activation')
check('self.clients.claim()' in sw, 'SW claims active clients')
check(manifest.get('display')=='standalone' and manifest.get('start_url')=='./index.html','PWA manifest for subdirectory deployment')
check(all((root/p).is_file() for p in ['index.html','sw.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','assets/overview.webp','assets/push.webp','assets/pull.webp','assets/legs.webp','assets/food.webp','.nojekyll']), 'All app-shell files exist')
check((root/'.github/workflows/deploy.yml').is_file(), 'GitHub Actions workflow present')
check(all('http://' not in t and 'https://' not in t for t in [sw]), 'SW does not fetch third-party endpoints')
check(not re.search(r'(?<!\d)1[3-9]\d{9}(?!\d)',html) and not re.search(r'(?<!\d)\d{17}[\dXx](?!\d)',html), 'No phone or ID-card formatted personal identifiers in public HTML')
check('content="noindex,nofollow"' in html, 'Basic noindex metadata present (not security control)')
check('sourceMaps' not in html, 'No accidental source map link')
print('\n'+('VERIFICATION PASSED' if not errors else f'{len(errors)} VERIFICATION FAILURES'))
sys.exit(bool(errors))
