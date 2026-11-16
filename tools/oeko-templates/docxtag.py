# Helpers to turn a Word file into a docxtemplater template: merge a paragraph's runs, set tagged text, build paragraph loops.
import copy, re, zipfile, shutil
from lxml import etree
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
q = lambda t: '{%s}%s' % (W, t)
XS = '{http://www.w3.org/XML/1998/namespace}space'

def text(el):
    return ''.join(x.text or '' for x in el.iter(q('t')))

def set_text(p, s):
    """Keep the paragraph properties and the first text run's formatting; replace all runs with one run holding s."""
    runs = [r for r in p.iter(q('r')) if r.find(q('t')) is not None]
    rpr = None
    if runs and runs[0].find(q('rPr')) is not None:
        rpr = copy.deepcopy(runs[0].find(q('rPr')))
    # remove every run / hyperlink / proofErr / sdt holding text, keep pPr, bookmarks
    for ch in list(p):
        if ch.tag in (q('r'), q('hyperlink'), q('proofErr'), q('ins'), q('smartTag'), q('sdt')):
            p.remove(ch)
    r = etree.SubElement(p, q('r'))
    if rpr is not None:
        r.append(rpr)
    t = etree.SubElement(r, q('t')); t.text = s; t.set(XS, 'preserve')
    return p

def blank_para(p_model=None):
    p = etree.Element(q('p'))
    if p_model is not None and p_model.find(q('pPr')) is not None:
        ppr = copy.deepcopy(p_model.find(q('pPr')))
        for n in ppr.findall(q('numPr')): ppr.remove(n)
        for n in ppr.findall(q('sectPr')): ppr.remove(n)
        p.append(ppr)
    return p

def marker(s, model=None):
    p = blank_para(model)
    r = etree.SubElement(p, q('r')); t = etree.SubElement(r, q('t')); t.text = s; t.set(XS, 'preserve')
    return p

def clone(p, s):
    c = copy.deepcopy(p)
    ppr = c.find(q('pPr'))
    if ppr is not None:
        for n in ppr.findall(q('sectPr')): ppr.remove(n)
    return set_text(c, s)

def loop(name, inner, model=None):
    """[{#name}] + inner paragraphs + [{/name}] — docxtemplater (paragraphLoop) repeats the inner paragraphs."""
    return [marker('{#%s}' % name, model)] + inner + [marker('{/%s}' % name, model)]

def row_loop(tbl, keep_rows, loop_row_index, cells_text, loop_name):
    """Keep the given row indexes; the row at loop_row_index becomes the repeated row with tagged cells."""
    rows = tbl.findall(q('tr'))
    for i, r in enumerate(rows):
        if i not in keep_rows and i != loop_row_index:
            tbl.remove(r)
    r = rows[loop_row_index]
    cells = r.findall(q('tc'))
    for i, (c, s) in enumerate(zip(cells, cells_text)):
        ps = c.findall(q('p'))
        for extra in ps[1:]: c.remove(extra)
        if i == 0: s = '{#%s}' % loop_name + s
        if i == len(cells) - 1: s = s + '{/%s}' % loop_name
        set_text(ps[0], s)
    return r

def set_cell(tbl, ri, ci, s):
    c = tbl.findall(q('tr'))[ri].findall(q('tc'))[ci]
    ps = c.findall(q('p'))
    for extra in ps[1:]: c.remove(extra)
    set_text(ps[0], s)

def save_docx(src, dst, xml_tree, extra=None):
    """Copy src to dst replacing word/document.xml (and any other parts given in extra {name: bytes})."""
    zin = zipfile.ZipFile(src); zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
    for it in zin.infolist():
        data = zin.read(it.filename)
        if it.filename == 'word/document.xml':
            data = etree.tostring(xml_tree, xml_declaration=True, encoding='UTF-8', standalone=True)
        elif extra and it.filename in extra:
            data = extra[it.filename]
        zout.writestr(it, data)
    zout.close()

def unwrap_sdts(root):
    for sdt in list(root.iter(q('sdt'))):
        par = sdt.getparent()
        if par is None: continue
        content = sdt.find(q('sdtContent'))
        idx = par.index(sdt)
        kids = list(content) if content is not None else []
        par.remove(sdt)
        for k, ch in enumerate(kids):
            par.insert(idx + k, ch)

def strip_highlight(root):
    for h in list(root.iter(q('highlight'))):
        h.getparent().remove(h)

def run_rpr(p, i):
    runs = [r for r in p.iter(q('r')) if r.find(q('t')) is not None]
    if not runs: return None
    r = runs[min(i, len(runs) - 1)]
    return copy.deepcopy(r.find(q('rPr'))) if r.find(q('rPr')) is not None else None

def set_runs(p, parts):
    """parts: [(text, rPr or None)] — replace the paragraph's runs with these runs."""
    for ch in list(p):
        if ch.tag in (q('r'), q('hyperlink'), q('proofErr'), q('ins'), q('smartTag'), q('sdt')):
            p.remove(ch)
    for s, rpr in parts:
        r = etree.SubElement(p, q('r'))
        if rpr is not None: r.append(copy.deepcopy(rpr))
        t = etree.SubElement(r, q('t')); t.text = s; t.set(XS, 'preserve')
    return p

def ppr_set(p, tag, attrs=None):
    ppr = p.find(q('pPr'))
    if ppr is None:
        ppr = etree.Element(q('pPr')); p.insert(0, ppr)
    el = ppr.find(q(tag))
    if el is None:
        el = etree.Element(q(tag))
        # keep schema order loosely: pStyle first, then the rest
        st = ppr.find(q('pStyle'))
        if st is not None: st.addnext(el)
        else: ppr.insert(0, el)
    for k, v in (attrs or {}).items(): el.set(q(k), v)
    return el

def bold_rpr(rpr, on=True):
    rpr = copy.deepcopy(rpr) if rpr is not None else etree.Element(q('rPr'))
    for t in ('b', 'bCs'):
        e = rpr.find(q(t))
        if on and e is None: etree.SubElement(rpr, q(t))
        if not on and e is not None: rpr.remove(e)
    return rpr
