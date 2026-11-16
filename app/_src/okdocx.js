/* Ökoplan — offers and agreements as Word files (16 Nov 2026).
   The two Word templates of the office (Technical & Financial Offer, Consultancy Agreement) live in _src/tpl/ with
   {tags} in place of the variable parts; this file turns what Rawan fills in the CRM into the data for those tags,
   fills the template with docxtemplater (MIT) and returns a .docx Blob. Loaded only when a Word file is made. */
(function (root) {
  'use strict';
  const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const below1000 = n => { const h = Math.floor(n / 100), r = n % 100; const out = []; if (h) out.push(ONES[h] + ' Hundred'); if (r) out.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : '')); return out.join(' and '); };
  /* 1250000 → "One Million, Two Hundred and Fifty Thousand" */
  function words(n) { n = Math.floor(Math.abs(+n || 0)); if (!n) return 'Zero'; const U = [[1e12, 'Trillion'], [1e9, 'Billion'], [1e6, 'Million'], [1e3, 'Thousand']]; const parts = []; for (const [v, w] of U) { if (n >= v) { parts.push(below1000(Math.floor(n / v)) + ' ' + w); n %= v; } } if (n) parts.push(below1000(n)); return parts.join(', '); }
  const CUR = { EGP: 'Egyptian Pounds', USD: 'US Dollars', EUR: 'Euros', SAR: 'Saudi Riyals', AED: 'UAE Dirhams', QAR: 'Qatari Riyals', KWD: 'Kuwaiti Dinars', GBP: 'Pounds Sterling' };
  const curName = c => CUR[String(c || 'EGP').toUpperCase()] || String(c || '');
  const fmt = n => Math.round(+n || 0).toLocaleString('en-US');
  const num = v => { const n = +String(v == null ? '' : v).replace(/[^\d.-]/g, ''); return isFinite(n) ? n : 0; };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dLong = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? `${+m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : (iso || ''); };
  const dShort = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso || ''); };
  const lines = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean);
  const arr = x => (Array.isArray(x) ? x : lines(x));
  const dots = v => (String(v == null ? '' : v).trim() || '……………………');

  /* the stage text Rawan writes:  "## Green heading"  "### Bold sub-heading"  "- bullet"  anything else = a paragraph */
  function blocks(t) { return lines(t).map(l => { if (/^###\s*/.test(l)) return { s: { t: l.replace(/^###\s*/, '') } }; if (/^##\s*/.test(l)) return { h: { t: l.replace(/^##\s*/, '') } }; if (/^[-•*·]\s*/.test(l)) return { li: { t: l.replace(/^[-•*·]\s*/, '') } }; return { p: { t: l } }; }); }

  /* ----- the standard offer, word for word from the office template (Rev 0) ----- */
  const OFFER_DEFAULT = {
    title: 'Technical and Financial Proposal', subtitle: 'Landscape Consultancy Services', rev: 'Rev 0',
    intro: '', planTitle: 'Project Master Plan / Location',
    scopeInTitle: 'The scope of services SHALL cover the following:', scopeIn: ['Softscape', 'Hardscape', 'Lighting (Distribution Only)', 'Lateral Irrigation'],
    scopeOutTitle: 'The scope of services SHALL NOT cover the following:', scopeOut: ['Any structure or electro-mechanical works.', 'Infrastructure, utilities and roads.', 'Any surveying or geotechnical works.'],
    methodIntro: 'Ökoplan shall perform all obligations with care, efficiency and diligence, and will undertake all activities, according to the following stages, which include a clarification of Ökoplan scope of services in every stage.',
    stages: [
      { name: 'Conceptual Design', days: 20, text: 'ÖKOPLAN’s role shall cover the following:\n- Produce a Landscape Concept Sketch.\n- Produce a presentation of the concept inspiring moods.\n## Deliverables\n- One (1) soft copy of the Concept Design Report' },
      { name: 'Schematic Design', days: 30, text: 'During this stage, Ökoplan will develop the concept design drawings and incorporate various consultants, comments & markup drawings from the other consultants taking into consideration civil defense requirements, fire truck access and disability requirement, work during this phase include but not limited to:\n- Concept design review\n- Analyze Client and other consultants’ comments on landscape concept design.\n- Prepare a general description of the project, including materials and plants out line.\n- Start landscape outline specification.\nDuring this phase, Ökoplan will prepare the following:\n- Site plan at the appropriate scale approved by the Client showing green areas.\n- Sectional Site elevations indicating wall treatment and pattern, handrails, planters, etc…\n- Plant philosophy.\n- Hardscape materials palette.\n- Furniture layout concept.\n- Landscape Elements Locations.\n## Deliverables\n- One (1) soft copy of the CAD drawings (Size A1)' },
      { name: 'Design Development', days: 60, text: 'The developed drawings stage shall comprise detailed and fully coordinated drawings (CAD Drawings), finishing schedules and other documents. The detailed drawings package for all project components will consist of:\n### Hardscape\n- Site and fine grading plans – in coordination with the civil engineer (assigned by the owner)\n- Hardscape plans and material schedules\n- Water features\n- Profile Sections\n- Floor pattern\n- Space furniture\n- Details\n### Soft-scape\n- Planting plans and plant schedules\n- Trees\n- Palms\n- Bushes\n- Ground covers\n### Irrigation (Lateral Only)\n- Lateral irrigation network\n- Cables network\n- Drip/Sprinkles network\n- Sleeves network\n- Irrigation details\n### Lighting for Landscape (distribution only)\n- Lighting fixtures for pedestrian pathways\n- Lighting fixtures for water features\n- Lighting fixture schedule\n- Details for lighting fixtures installation\n## Deliverables\n- One (1) soft copy of the CAD drawings (Size A1)' },
      { name: 'Tender Drawings and Documents', days: 15, text: 'During this stage, drawings, specifications and other particulars are completed and submitted to the Client for review and approval.\n### Landscape Architecture:\n- Grading and leveling plans\n- Cross sections\n- Full detailed plans for all hardscape works, material schedules, shades and fountains\n- Construction details\n- Finishing and detailed flooring plans\n- Layout plans for planting details and plants table with all related details (scientific name, common name, plant specs, irrigation specs, quantity)\n- Lateral irrigation networks and details\n- Lighting plans and details\n### Specification and BOQs:\n- Preparation of project specifications and BOQs covering the following:\n- Ökoplan shall prepare and submit specifications for all project components. These shall include quality control requirements, product detail, technical specification, and execution and workmanship requirements. Project specifications shall also include performance specifications of custom manufactured assembled systems.\n- Ökoplan shall prepare and submit the Bills of Quantities to all of the project components.\n## Deliverables\n- One (1) soft copy and one (1) hard copy of the CAD drawings & documents (Size A1 + A4)' }
    ],
    durNotes: ['The above durations do not include durations taken by the client for approval.', 'Ökoplan will fully comply with the above required submission durations.', 'Ökoplan shall only start working in a phase after a written approval of the previous phase.'],
    feeIntro: 'Ökoplan fee for the performance of complete design services as shown in our technical offer is', vat: 10, currency: 'EGP',
    payments: [{ name: 'Down Payment', pct: 20 }, { name: 'Upon submission of Conceptual Design', pct: 25 }, { name: 'Upon submission of Schematic Design', pct: 20 }, { name: 'Upon submission of Design Development', pct: 25 }, { name: 'Upon submission of Tender Drawings and Documents', pct: 10 }],
    clar: ['The work shall start after receiving the 20% down payment.', 'Any optional scope, such as the physical model and any extra perspectives not mentioned in the scope of work, shall be agreed upon in due time and shall be considered reimbursable expenses.', 'Ökoplan’s fees are to be paid within 7 calendar days of submitting the invoice.', 'Ökoplan shall use the “stop-work” policy in the event that invoices remain unpaid for a period of 21 calendar days from invoice submission date.', 'In case the Owner decides to stop the works for a reason beyond the responsibilities of Ökoplan, the Owner shall pay Ökoplan all the fees for the finished/ ongoing works in the stages before the stoppage of work.'],
    validity: 30, signName: 'Dr. Tarek Sobhy', signTitle: 'CEO'
  };
  const introOf = d => `Ökoplan is pleased to submit this technical and financial proposal for providing design consultancy services for ${d.project || 'the project'}${d.location ? ' located in ' + d.location : ''}.`;
  const feeMain = (v, cur) => `${String(cur || 'EGP').toUpperCase()} ${fmt(v)} (Only ${words(v)} ${curName(cur)})`;

  /* offer record → template data */
  function offerData(d) {
    d = Object.assign({}, OFFER_DEFAULT, d || {});
    const stages = (d.stages || []).filter(s => s && String(s.name || '').trim()).map((s, i) => ({ n: i + 1, name: String(s.name).trim(), daysText: num(s.days) ? `${num(s.days)} days` : '—', blocks: blocks(s.text) }));
    const info = [{ label: 'Project Name', value: d.project || '', note: '' }, { label: 'Location', value: d.location || '', note: '' }, { label: 'Land Area', value: d.area ? (/[a-z²]/i.test(String(d.area)) ? String(d.area) : `Approx. ${fmt(num(d.area))} sqm`) : '', note: '' }, { label: 'Project Components', value: d.components || 'N.A', note: '' }].concat((d.info || []).filter(r => r && r.label));
    if (d.areaNote) info[2].note = d.areaNote;
    const v = num(d.value), vat = num(d.vat);
    const clar = arr(d.clar).concat(num(d.validity) ? [`This proposal is valid for ${num(d.validity)} days.`] : []);
    return {
      project: d.project || '', location: d.location || '', client: d.client || '', dateText: dLong(d.date), rev: d.rev || 'Rev 0',
      title: d.title, subtitle: d.subtitle, intro: String(d.intro || '').trim() || introOf(d), info,
      hasPlan: !!d.plan, planTitle: d.planTitle || OFFER_DEFAULT.planTitle,
      scopeInTitle: d.scopeInTitle, scopeIn: arr(d.scopeIn), hasOut: arr(d.scopeOut).length > 0, scopeOutTitle: d.scopeOutTitle, scopeOut: arr(d.scopeOut),
      methodIntro: d.methodIntro, stages, durNotes: arr(d.durNotes),
      feeIntro: d.feeIntro, feeMain: v ? feeMain(v, d.currency) : `${String(d.currency || 'EGP').toUpperCase()} ……………`, feeTail: vat ? ` + ${vat}% VAT, which is a fixed lump sum, including all related taxes.` : ', which is a fixed lump sum, including all related taxes.',
      payments: (d.payments || []).filter(p => p && String(p.name || '').trim()).map(p => ({ name: String(p.name).trim(), pct: num(p.pct) })), clar,
      signName: d.signName || OFFER_DEFAULT.signName, signTitle: d.signTitle || OFFER_DEFAULT.signTitle
    };
  }

  /* ----- the agreement ----- */
  const AGR_DEFAULT = { companyType: 'a real estate development Company', vat: 10, currency: 'EGP', payDays: 14, suspendDays: 21, durText: '', parts: [], reEvalMonths: 12, termDays: 160, renewDays: 60, noticeText: 'two weeks', breachDays: 30, fmDays: 180, approvalDays: 5, extra: [], extraTitle: 'Special Conditions' };
  const agrClar = a => [
    'Each party shall bear all taxes and fees applicable to it in accordance with the laws in force at the time of signing this Contract, except for Value Added Tax (VAT).',
    `Work shall commence upon receipt of the advance payment of ${num(a.downPct) || 20}%.`,
    'Any optional scope and any additional works not mentioned in the scope of work must be agreed upon in due time and shall be considered reimbursable expenses.',
    `Ökoplan for Landscaping fees shall be paid within ${num(a.payDays) || 14} days from the submission of the invoice.`,
    `Ökoplan for Landscaping reserves the right to apply a “suspension of work” policy in case of non-payment of invoices for a period of ${num(a.suspendDays) || 21} days from the invoice submission date.`,
    'In the event that the Client decides to suspend the works for reasons beyond the responsibility of Ökoplan for Landscaping, the Client shall pay all fees related to the completed and/or ongoing works up to the stages prior to suspension.'];
  function agreementData(a) {
    a = Object.assign({}, AGR_DEFAULT, a || {});
    const v = num(a.value); const fees = (a.fees || []).filter(f => f && String(f.scope || '').trim());
    const feeRows = fees.length ? fees.map(f => ({ scope: String(f.scope).trim(), fee: fmt(num(f.fee)) })) : [{ scope: 'Landscape Design', fee: fmt(v) }];
    const total = fees.length ? fees.reduce((s, f) => s + num(f.fee), 0) : v;
    const parts = (a.parts || []).filter(p => p && String(p.name || '').trim()).map(p => ({ name: String(p.name).trim(), days: num(p.days) }));
    const wd = parts.reduce((s, p) => s + p.days, 0);
    const lc = s => String(s).toLowerCase();
    return {
      project: a.project || '', dateShort: dShort(a.date), dateLong: dLong(a.date), client: a.client || '……………………',
      cAddress: dots(a.address), cTel: dots(a.tel), cFax: dots(a.fax), cCr: dots(a.cr), cTax: dots(a.taxId), repName: dots(a.repName), repTitle: String(a.repTitle || '').trim() || 'Managing Director',
      companyType: a.companyType || AGR_DEFAULT.companyType, area: a.area ? fmt(num(a.area)) : '………', location: a.location || '………',
      feeMain: v ? feeMain(v, a.currency) : '……………', vat: num(a.vat), fees: feeRows, feeTotal: fmt(total),
      payments: (a.payments || []).filter(p => p && String(p.name || '').trim()).map(p => ({ name: String(p.name).trim(), pct: num(p.pct) })),
      clar: (a.clar && arr(a.clar).length ? arr(a.clar) : agrClar(a)),
      durText: String(a.durText || '').trim() || (wd ? `${wd} working days` : '………'), durTail: parts.length ? ' These durations are divided as follows:' : '', parts,
      reEvalMonths: num(a.reEvalMonths) || 12, termDays: num(a.termDays) || wd || 160, renewDays: num(a.renewDays) || 60, noticeText: a.noticeText || 'two weeks',
      breachDays: num(a.breachDays) || 30, breachWords: lc(words(num(a.breachDays) || 30)), fmDays: num(a.fmDays) || 180, fmWords: lc(words(num(a.fmDays) || 180)).replace(/, /g, ' '), approvalDays: num(a.approvalDays) || 5,
      hasExtra: arr(a.extra).length > 0, extraTitle: a.extraTitle || 'Special Conditions', extra: arr(a.extra),
      signClientName: String(a.signClientName || a.repName || '').trim() || '……………………', signClientTitle: String(a.signClientTitle || a.repTitle || '').trim() || '……………………'
    };
  }

  /* put the master plan picture where the template says [[OK_PLAN]] */
  function addPlan(zip, img) {
    const docXml = zip.file('word/document.xml').asText();
    if (docXml.indexOf('[[OK_PLAN]]') < 0) return;
    if (!img || !img.bytes) { zip.file('word/document.xml', docXml.replace(/<w:r>(?:(?!<w:r>).)*?\[\[OK_PLAN\]\].*?<\/w:r>/, '')); return; }
    const ext = img.type === 'image/png' ? 'png' : 'jpeg';
    const name = 'okplan.' + ext; zip.file('word/media/' + name, img.bytes);
    let rels = zip.file('word/_rels/document.xml.rels').asText();
    rels = rels.replace('</Relationships>', `<Relationship Id="rIdOkPlan" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${name}"/></Relationships>`);
    zip.file('word/_rels/document.xml.rels', rels);
    let ct = zip.file('[Content_Types].xml').asText();
    if (ct.indexOf(`Extension="${ext}"`) < 0) ct = ct.replace('<Types ', '<Types ').replace(/(<Types[^>]*>)/, `$1<Default Extension="${ext}" ContentType="image/${ext}"/>`);
    zip.file('[Content_Types].xml', ct);
    const maxW = 6.1 * 914400, maxH = 6.4 * 914400; let w = img.w || 1600, h = img.h || 1000; const k = Math.min(maxW / w, maxH / h); w = Math.round(w * k); h = Math.round(h * k);
    const run = `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${w}" cy="${h}"/><wp:docPr id="9101" name="Master plan"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="${name}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdOkPlan"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    zip.file('word/document.xml', docXml.replace(/<w:r>(?:(?!<w:r>).)*?\[\[OK_PLAN\]\].*?<\/w:r>/, run));
  }

  /* fill a template: buf = ArrayBuffer of the .docx, data = offerData()/agreementData() output */
  function fill(buf, data, opts) {
    opts = opts || {}; const PZ = opts.PizZip || root.PizZip, DX = opts.Docxtemplater || root.docxtemplater;
    const zip = new PZ(buf);
    const doc = new DX(zip, { paragraphLoop: true, linebreaks: true, nullGetter: () => '' });
    doc.render(data);
    const out = doc.getZip(); if (opts.plan !== undefined) addPlan(out, opts.plan);
    return out.generate({ type: opts.type || 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  }

  root.OkDocx = { words, curName, fmt, dLong, dShort, blocks, OFFER_DEFAULT, AGR_DEFAULT, agrClar, offerData, agreementData, fill, addPlan, introOf };
})(typeof window !== 'undefined' ? window : globalThis);
