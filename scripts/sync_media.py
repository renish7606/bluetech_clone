#!/usr/bin/env python3
"""Import authorized public reference media. Does not copy reference scripts or forms."""
import argparse, hashlib, json, mimetypes, re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
ROOT=Path(__file__).resolve().parents[1]
BASE='https://puppy.instabizweb.com'
DATA=ROOT/'backend/app/data'
DEST=ROOT/'frontend/public/media/reference'
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.media=[]; self.links=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag in ('img','video','source') and a.get('src'):
            url=urljoin(BASE,a['src']); u=urlparse(url)
            if u.netloc!=urlparse(BASE).netloc:return
            original=parse_qs(u.query).get('url',[u.path])[0] if u.path=='/_next/image' else u.path
            if not original.startswith('/media/'):return
            typ='video' if tag=='video' or re.search(r'\.(mp4|webm)$',original,re.I) else 'image'
            self.media.append((urljoin(BASE,original),typ,a.get('alt','')))
def get(url):
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 TeddyPups reference asset import'}),timeout=35) as r:return r.read(),r.headers.get_content_type()
def parse(path):
    html,_=get(urljoin(BASE,path));p=Parser();p.feed(html.decode('utf-8','replace'));return p

def cache(url,typ):
    data,content=get(url)
    if not content.startswith(typ+'/'):raise ValueError(f'Unexpected content: {content}')
    ext=mimetypes.guess_extension(content) or Path(urlparse(url).path).suffix
    name=hashlib.sha256(url.encode()).hexdigest()[:20]+ext
    DEST.mkdir(parents=True,exist_ok=True);(DEST/name).write_bytes(data)
    return '/media/reference/'+name

def extract(path, family=False):
    p=parse(path); seen=set();out=[]
    for url,typ,alt in p.media:
        if url in seen:continue
        if family and not ('family' in alt.lower() or 'puppy' in alt.lower()):continue
        # Skip logo/decorative imagery, keep profile photos and video.
        if not family and ('logo' in alt.lower() or 'family' in alt.lower()):continue
        seen.add(url)
        try:out.append({'url':cache(url,typ),'caption':alt if family else '',**({} if family else {'type':typ})})
        except Exception as e:print('Skipped',url,e)
    return out

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--authorized',action='store_true',help='Confirm rights to use reference media');args=parser.parse_args()
    if not args.authorized:parser.error('Use --authorized only if you have permission to reuse the media.')
    pups=json.loads((DATA/'puppies.json').read_text());
    try: adopted_links=list(dict.fromkeys(h for h in parse('/gone-home').links if h.startswith('/puppies/')))
    except Exception as e: print('Adopted links unavailable:',e);adopted_links=[]
    adopted=[p for p in pups if p['status']=='adopted']
    if len(adopted_links)==len(adopted):
        for p,href in zip(adopted,adopted_links):p['slug']=href.rstrip('/').split('/')[-1]
    def sync(p):
        if p['slug'].startswith('home-'):return p
        try:
            media=extract('/puppies/'+p['slug']);
            if media:p['media']=[{'url':m['url'],'type':m['type']} for m in media]
            print(p['slug'],len(media))
        except Exception as e:print('Skipped profile',p['slug'],e)
        return p
    with ThreadPoolExecutor(max_workers=3) as pool:pups=list(pool.map(sync,pups))
    (DATA/'puppies.json').write_text(json.dumps(pups,indent=2,ensure_ascii=False))
    try:
        families=extract('/happy-families',True)
        if families:(DATA/'families.json').write_text(json.dumps(families,indent=2,ensure_ascii=False))
        print('Family gallery:',len(families))
    except Exception as e:print('Skipped families',e)
if __name__=='__main__':main()
