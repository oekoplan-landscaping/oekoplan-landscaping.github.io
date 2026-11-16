import sys, re
sys.path.insert(0, '.')
from docxtag import *
SRC = 'src/agreement.docx'; OUT = '../../app/_src/tpl/agreement.docx'
z = zipfile.ZipFile(SRC)
doc = etree.fromstring(z.read('word/document.xml'))
ftr = etree.fromstring(z.read('word/footer1.xml'))
for r in (doc, ftr):
    unwrap_sdts(r); strip_highlight(r)
body = doc.find(q('body')); B = list(body)
T = lambda i: text(B[i]).strip()
def need(i, s):
    assert T(i).startswith(s), (i, T(i), s)
need(5, '[Project Name]'); set_text(B[5], '{project}')
need(7, 'This Agreement'); set_text(B[7], 'This Agreement (Consultancy Agreement) is made this {dateShort}, by and between:')
need(9, '[Client Name]'); set_text(B[9], '{client}')
need(10, 'Address'); set_text(B[10], 'Address: {cAddress}')
need(11, 'Tel'); set_text(B[11], 'Tel.: {cTel}')
need(12, 'Fax'); set_text(B[12], 'Fax: {cFax}')
need(13, 'Commercial Registration'); set_text(B[13], 'Commercial Registration Number: {cCr}')
need(14, 'Tax ID'); set_text(B[14], 'Tax ID: {cTax}')
need(15, '……'); set_text(B[15], '{repName} represents {client} in his capacity as {repTitle} of the company.')
need(30, 'The Company is a real estate'); set_text(B[30], 'The Company is {companyType} and is seeking to engage the services of the Consultant to provide The Landscape Design of {project} with total area of {area} m2, located in {location}. Based on the available criteria and background information provided by the Company as a foundation for creating the design concept.')
need(94, 'In consideration'); rp_n = run_rpr(B[94], 0); rp_b = bold_rpr(rp_n)
set_runs(B[94], [('In consideration of the services to be executed by Consultant, Company shall pay to consultant a fee amounting to ', rp_n), ('{feeMain}', rp_b), (' subject to {vat}% value added taxes including site visits and all related taxes and reimbursable expenses to be paid according to the terms of payments detailed in Annex 2', rp_n)])
# fees breakdown
fees = B[97]; rows = fees.findall(q('tr'))
row_loop(fees, keep_rows=[0, 3], loop_row_index=1, cells_text=['{scope}', '{fee}'], loop_name='fees')
set_cell(fees, len(fees.findall(q('tr'))) - 1, 1, '{feeTotal}')
row_loop(B[100], keep_rows=[0], loop_row_index=1, cells_text=['{name}', '{pct}%'], loop_name='payments')
need(103, 'Each party'); cl = clone(B[103], '{.}')
idx = body.index(B[103])
for i in range(103, 109): body.remove(B[i])
for k, el in enumerate(loop('clar', [cl], B[101])): body.insert(idx + k, el)
for i in range(109, 117): body.remove(B[i])
need(124, 'The duration'); set_text(B[124], 'The duration for the execution of the consultancy services under this Contract is {durText}, excluding review periods.{durTail}')
need(125, 'Land CN-09'); pt = clone(B[125], '{name}: {days} working days')
idx = body.index(B[125]); body.remove(B[125]); body.remove(B[126])
for k, el in enumerate(loop('parts', [pt], B[122])): body.insert(idx + k, el)
need(127, 'If the Contract extends'); set_text(B[127], 'If the Contract extends beyond {reEvalMonths} months, the fees shall be re-evaluated.')
need(133, 'This Agreement shall enter'); set_text(B[133], 'This Agreement shall enter into force with effect from date of signature and shall continue in force for a period of {termDays} working days not including client reviews and approvals. This contract could be renewed for a similar period/s based on the written mutual agreement of both parties {renewDays} days before expiration to the date by which the Consultant is obliged to successfully render all the services under this Agreement with determining an extra fees agreed by both parties.')
need(134, 'Company may terminate'); set_text(B[134], 'Company may terminate this agreement by giving Consultant {noticeText} prior written notice and the Company shall pay any due payment till the date of termination to the Consultant.')
need(145, 'This Agreement may be terminated'); set_text(B[145], 'This Agreement may be terminated immediately by either party if the other party commits a breach of this Agreement, and if this breaching party fails to remedy such breach within {breachWords} ({breachDays}) days of receiving written notice of such breach. Termination of this Agreement does not prejudice any other right for remedy of either party in respect of any breach.')
need(149, 'If such Force Majeure'); t149 = T(149)
t149 = t149.replace('one hundred and eighty (180) days', '{fmWords} ({fmDays}) days'); assert '{fmDays}' in t149; set_text(B[149], t149)
need(182, 'For all submittals'); t182 = T(182).replace('within 5 working days', 'within {approvalDays} working days'); assert '{approvalDays}' in t182; set_text(B[182], t182)
# special conditions (optional article 24) after article 23
need(189, 'Article 23'); need(191, 'This agreement shall be valid')
h24 = clone(B[189], 'Article 24: {extraTitle}'); c24 = clone(B[191], '{.}'); sp = blank_para(B[190])
idx = body.index(B[191]) + 1
for k, el in enumerate(loop('hasExtra', [sp, h24, sp.__copy__()] + loop('extra', [c24], B[190]), B[190])): body.insert(idx + k, el)
# signatures
need(198, '[Client Name]'); set_text(B[198], '{client}')
need(206, '……'); set_runs(B[206], [('……………………', run_rpr(B[206], 0))])
need(211, '……'); set_text(B[211], '{signClientName}')
need(213, 'TITLE')
for r in B[213].iter(q('r')):
    t = r.find(q('t'))
    if t is not None and t.text == 'TITLE': t.text = '{signClientTitle}'
for p in ftr.iter(q('p')):
    for r in p.iter(q('r')):
        t = r.find(q('t'))
        if t is not None and t.text and t.text.strip() == '6 April 2026': t.text = '{dateLong}'
core = z.read('docProps/core.xml').decode('utf8')
core = re.sub(r'<dc:title>.*?</dc:title>', '<dc:title>Consultancy Agreement</dc:title>', core)
save_docx(SRC, OUT, doc, {'word/footer1.xml': etree.tostring(ftr, xml_declaration=True, encoding='UTF-8', standalone=True), 'docProps/core.xml': core.encode('utf8')})
print('ok', OUT)
