# The agreement as a list of blocks for the PDF (app/_src/okpdf.js): same text and {tags} as the Word template,
# with the list labels Word shows (4-1, 8-2, •, ▪) taken from a LibreOffice text export of the same template.
import sys, re, json, subprocess, os, shutil, tempfile
from lxml import etree
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
SRC = sys.argv[1] if len(sys.argv) > 1 else '../../app/_src/tpl/agreement.docx'
OUT = sys.argv[2] if len(sys.argv) > 2 else '../../app/_src/tpl/agreement.layout.json'
import zipfile
doc = etree.fromstring(zipfile.ZipFile(SRC).read('word/document.xml'))
styles = etree.fromstring(zipfile.ZipFile(SRC).read('word/styles.xml'))
# labels from LibreOffice
tmp = tempfile.mkdtemp(); shutil.copy(SRC, os.path.join(tmp, 'a.docx'))
subprocess.run(['soffice', '--headless', '--convert-to', 'txt:Text (encoded):UTF8', '--outdir', tmp, os.path.join(tmp, 'a.docx')], capture_output=True)
lab = []
for line in open(os.path.join(tmp, 'a.txt'), encoding='utf-8'):
    m = re.match(r'^\s+(\d+-\d+|\d+\.|•|◦|▪)\s(.*)$', line.rstrip('\n'))
    if m: lab.append((m.group(1), m.group(2).strip()))
li = 0
txt = lambda el: ''.join(x.text or '' for x in el.iter(W + 't'))
def style_rpr(sid):
    for s in styles.findall(W + 'style'):
        if s.get(W + 'styleId') == sid: return s.find(W + 'rPr')
    return None
def flag(rpr, base):
    f = dict(base)
    if rpr is None: return f
    b = rpr.find(W + 'b'); u = rpr.find(W + 'u'); i = rpr.find(W + 'i')
    if b is not None: f['b'] = b.get(W + 'val') not in ('0', 'false')
    if u is not None: f['u'] = u.get(W + 'val') not in ('none',)
    if i is not None: f['i'] = i.get(W + 'val') not in ('0', 'false')
    return f
def para(p):
    global li
    ppr = p.find(W + 'pPr'); sid = ''
    if ppr is not None and ppr.find(W + 'pStyle') is not None: sid = ppr.find(W + 'pStyle').get(W + 'val')
    base = flag(style_rpr(sid), {'b': False, 'u': False, 'i': False})
    runs = []
    for r in p.iter(W + 'r'):
        t = ''.join(x.text or '' for x in r if x.tag == W + 't')
        if r.find(W + 'tab') is not None: t = t + '\t' if t else '\t'
        if not t: continue
        f = flag(r.find(W + 'rPr'), base)
        k = ('b' if f['b'] else '') + ('u' if f['u'] else '') + ('i' if f['i'] else '')
        if runs and runs[-1][1] == k: runs[-1][0] += t
        else: runs.append([t, k])
    text = ''.join(r[0] for r in runs).strip()
    o = {'k': 'p', 'st': 'h' if sid == 'Heading2' else 'b', 'r': runs}
    if ppr is not None:
        jc = ppr.find(W + 'jc'); o['jc'] = jc.get(W + 'val') if jc is not None else ''
        ind = ppr.find(W + 'ind')
        if ind is not None and ind.get(W + 'left'): o['ind'] = round(int(ind.get(W + 'left')) / 20)
        if ppr.find(W + 'numPr') is not None and text:
            while li < len(lab) and lab[li][1].replace(' ', '') != text.replace(' ', '')[:len(lab[li][1].replace(' ', ''))]: li += 1
            if li < len(lab): o['lab'] = lab[li][0]; li += 1
            lv = ppr.find(W + 'numPr').find(W + 'ilvl'); o['lv'] = int(lv.get(W + 'val')) if lv is not None else 0
    return o, text
blocks = []; stack = [blocks]
body = doc.find(W + 'body'); els = list(body)
sig_at = next(i for i, el in enumerate(els) if el.tag == W + 'p' and txt(el).strip().startswith('THE Company'))
for i, el in enumerate(els):
    if i >= sig_at: break
    if el.tag == W + 'tbl':
        t = txt(el); stack[-1].append({'k': 'tbl', 'id': 'fees' if '{#fees}' in t else 'payments'}); continue
    if el.tag != W + 'p': continue
    o, text = para(el)
    m = re.fullmatch(r'\{([#/])(\w+)\}', text)
    if m and m.group(1) == '#': nb = {'k': 'loop', 'n': m.group(2), 'body': []}; stack[-1].append(nb); stack.append(nb['body']); continue
    if m and m.group(1) == '/': stack.pop(); continue
    if not text:
        if stack[-1] and stack[-1][-1].get('k') != 'gap': stack[-1].append({'k': 'gap'})
        continue
    stack[-1].append(o)
blocks.append({'k': 'sig'})
json.dump(blocks, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
print('blocks', len(blocks), 'labels used', li, 'of', len(lab))
