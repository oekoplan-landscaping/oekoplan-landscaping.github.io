import sys, copy
sys.path.insert(0, '.')
from docxtag import *
SRC = 'src/offer.docx'; OUT = '../../app/_src/tpl/offer.docx'
z = zipfile.ZipFile(SRC)
doc = etree.fromstring(z.read('word/document.xml'))
hdr = etree.fromstring(z.read('word/header1.xml'))
ftr = etree.fromstring(z.read('word/footer1.xml'))
for r in (doc, hdr, ftr):
    unwrap_sdts(r); strip_highlight(r)
body = doc.find(q('body')); B = list(body)
T = lambda i: text(B[i]).strip()
def need(i, s):
    assert T(i).startswith(s), (i, T(i), s)

# ---- cover
inner = [p for p in B[12].iter(q('p')) if p is not B[12] and p.xpath('ancestor::w:txbxContent', namespaces={'w': W})]
for p in inner:
    t = text(p).strip()
    if t.startswith('Project Name'): set_text(p, '{project}')
    elif t.startswith('Location'): set_text(p, '{location}')
need(29, 'technical and Financial'); set_text(B[29], '{title}')
need(30, 'landscape consultancy'); set_text(B[30], '{subtitle}')
need(32, 'Submitted to'); set_runs(B[32], [('Submitted to: ', run_rpr(B[32], 0)), ('{client}', run_rpr(B[32], 1))])
need(33, 'Date:'); set_text(B[33], 'Date: {dateText} – {rev}')
# ---- introduction and project information
need(35, 'Ökoplan is pleased'); set_text(B[35], '{intro}')
tbl = B[37]
row_loop(tbl, keep_rows=[0], loop_row_index=1, cells_text=['{label}', '{value}', '{note}'], loop_name='info')
# master plan (optional image)
need(39, 'Project Master Plan'); plan_head = B[39]
set_text(plan_head, '{planTitle}')
plan_img = blank_para(B[39]); r = etree.SubElement(plan_img, q('r')); t = etree.SubElement(r, q('t')); t.text = '[[OK_PLAN]]'
ppr_set(plan_img, 'jc', {'val': 'center'})
for i in range(40, 69): body.remove(B[i])
idx = body.index(plan_head)
body.remove(plan_head)
for k, el in enumerate(loop('hasPlan', [plan_head, plan_img], B[38])): body.insert(idx + k, el)
# ---- scope
need(69, 'Scope of services'); ppr_set(B[69], 'pageBreakBefore')
need(70, 'The scope of services SHALL cover'); set_text(B[70], '{scopeInTitle}')
li_in = clone(B[71], '{.}')
idx = body.index(B[71])
for i in (71, 72, 73, 74): body.remove(B[i])
for k, el in enumerate(loop('scopeIn', [li_in], B[70])): body.insert(idx + k, el)
need(76, 'The scope of services SHALL NOT'); set_text(B[76], '{scopeOutTitle}')
li_out = clone(B[77], '{.}')
idx = body.index(B[77])
for i in (77, 78, 79): body.remove(B[i])
for k, el in enumerate(loop('scopeOut', [li_out], B[76])): body.insert(idx + k, el)
# wrap the "SHALL NOT" part in a condition
i75 = body.index(B[75]); body.insert(i75, marker('{#hasOut}', B[70]))
end = body.index(B[80]); body.insert(end, marker('{/hasOut}', B[70]))
# ---- methodology
need(81, 'Methodology'); need(82, 'Ökoplan shall perform'); set_text(B[82], '{methodIntro}')
st_li = clone(B[83], 'Stage {n}: {name}')
idx = body.index(B[83])
for i in (83, 84, 85, 86): body.remove(B[i])
for k, el in enumerate(loop('stages', [st_li], B[82])): body.insert(idx + k, el)
# stage details 88..202 -> one nested loop
need(88, 'Stage 1'); need(89, 'ÖKOPLAN’s role'); need(90, 'Produce a Landscape'); need(93, 'Deliverables'); need(131, 'Hardscape')
m_head, m_p, m_li, m_h, m_s, m_blank = B[88], B[89], B[90], B[93], B[131], B[95]
h_stage = clone(m_head, 'Stage {n}: {name}'); ppr_set(h_stage, 'keepNext'); ppr_set(h_stage, 'spacing', {'before': '240', 'after': '80'})
p_par = clone(m_p, '{t}'); ppr_set(p_par, 'spacing', {'before': '100', 'after': '40'})
p_li = clone(m_li, '{t}')
p_h = clone(m_h, '{t}'); ppr_set(p_h, 'keepNext'); ppr_set(p_h, 'spacing', {'before': '160', 'after': '60'})
p_s = clone(m_s, '{t}'); ppr_set(p_s, 'keepNext'); ppr_set(p_s, 'spacing', {'before': '120', 'after': '40'})
blank = blank_para(m_blank)
inner = []
inner += loop('p', [p_par], m_blank) + loop('h', [p_h], m_blank) + loop('s', [p_s], m_blank) + loop('li', [p_li], m_blank)
block = [h_stage] + loop('blocks', inner, m_blank) + [blank]
idx = body.index(B[88])
for i in range(87, 203):
    if B[i].getparent() is body: body.remove(B[i])
for k, el in enumerate(loop('stages', block, m_blank)): body.insert(idx - 1 + k, el)
# ---- durations
need(203, 'Estimated Durations'); ppr_set(B[203], 'keepNext'); ppr_set(B[203], 'spacing', {'before': '360'})
row_loop(B[204], keep_rows=[0], loop_row_index=1, cells_text=['Stage {n}: {name}', '{daysText}'], loop_name='stages')
need(206, 'The above durations'); dn = clone(B[206], '{.}')
idx = body.index(B[206])
for i in (206, 207, 208): body.remove(B[i])
for k, el in enumerate(loop('durNotes', [dn], B[205])): body.insert(idx + k, el)
for i in range(209, 225): body.remove(B[i])
# ---- fee
need(228, 'Financial Proposal'); ppr_set(B[228], 'pageBreakBefore')
need(229, 'Ökoplan fee'); set_text(B[229], '{feeIntro}')
need(230, '[EGP'); set_runs(B[230], [('{feeMain}', run_rpr(B[230], 0)), ('{feeTail}', run_rpr(B[230], 9))])
body.remove(B[232]); body.remove(B[233])
need(234, 'Terms of Payment'); ppr_set(B[234], 'keepNext')
row_loop(B[236], keep_rows=[0], loop_row_index=1, cells_text=['{name}', '{pct}%'], loop_name='payments')
need(238, 'Clarifications'); ppr_set(B[238], 'keepNext')
cl = clone(B[239], '{.}')
idx = body.index(B[239])
for i in range(239, 245): body.remove(B[i])
for k, el in enumerate(loop('clar', [cl], B[237])): body.insert(idx + k, el)
# signature table
sig = B[245]
for tc in sig.iter(q('tc')):
    t = text(tc).strip()
    if t == 'Dr. Tarek Sobhy':
        set_text(tc.find(q('p')), '{signName}')
    elif t == 'CEO':
        set_text(tc.find(q('p')), '{signTitle}')
# ---- header / footer
for p in hdr.iter(q('p')):
    t = text(p).strip()
    if t == 'Project Name': set_text(p, '{project}')
    elif t == 'Location': set_text(p, '{location}')
for p in ftr.iter(q('p')):
    t = text(p).strip()
    if t.startswith('28 April 2025'): set_runs(p, [('{dateText}', run_rpr(p, 0)), ('  ', run_rpr(p, 1)), ('{rev}', run_rpr(p, 2))])
# core properties: a neutral title
core = z.read('docProps/core.xml').decode('utf8')
import re
core = re.sub(r'<dc:title>.*?</dc:title>', '<dc:title>Technical and Financial Proposal</dc:title>', core)
core = re.sub(r'<cp:contentStatus>.*?</cp:contentStatus>', '', core)
save_docx(SRC, OUT, doc, {'word/header1.xml': etree.tostring(hdr, xml_declaration=True, encoding='UTF-8', standalone=True), 'word/footer1.xml': etree.tostring(ftr, xml_declaration=True, encoding='UTF-8', standalone=True), 'docProps/core.xml': core.encode('utf8')})
print('ok', OUT)
