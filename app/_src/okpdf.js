/* Ökoplan — offers and agreements as PDF (16 Nov 2026).
   Same content as the Word files (okdocx.js builds the data from what Rawan fills in), laid out like the office
   templates: Arial-metric font (Liberation Sans, SIL OFL), the green headings and table lines of the offer, the
   ÖKOPLAN logo, the cover page; the agreement's standard text comes from _src/tpl/agreement.layout.json, which is
   made from the same Word template (tools/oeko-templates/make_agr_layout.py). Built with pdfmake (MIT).
   OkPdf.make(kind, data, assets) → Promise<Blob>; kind 'offer' | 'agr', data = OkDocx.offerData()/agreementData(). */
(function (root) {
  'use strict';
  const G1 = '#009900', G2 = '#019A01', LN = '#008000', INK = '#1d1f20', MUTED = '#5d6463', BLUE = '#00B0F0';
  const A4W = 595.28, MX = 64;
  const W = A4W - 2 * MX;
  /* Word's small caps: first letter of each word full size, the rest capitals a size smaller */
  const smallCaps = (s, size) => { const out = []; for (const ch of String(s)) { const big = ch !== ch.toLowerCase() || /[\s\d\W]/.test(ch); const t = ch.toUpperCase(); const fs = big ? size : size * 0.8; const last = out[out.length - 1]; if (last && last.fontSize === fs) last.text += t; else out.push({ text: t, fontSize: fs }); } return out; };
  const H1 = (t, opts) => Object.assign({ text: smallCaps(t, 12), bold: true, color: G1, margin: [0, 14, 0, 6], headlineLevel: 1 }, opts || {});
  const greenLines = (rowsHead) => ({ hLineWidth: (i, n) => (i === 0 && !rowsHead ? 0 : 1.2), vLineWidth: () => 0, hLineColor: () => LN, paddingTop: () => 4, paddingBottom: () => 4, paddingLeft: () => 4, paddingRight: () => 4 });
  const bullets = (xs, opts) => ({ ul: xs.map(x => ({ text: x, margin: [0, 0, 0, 2] })), margin: [18, 2, 0, 6], ...(opts || {}) });

  /* ---------------- offer ---------------- */
  function offerDoc(d, a) {
    const content = [];
    /* cover */
    content.push({ image: a.logo, width: 104, absolutePosition: { x: A4W - MX - 104 + 20, y: 46 } });
    content.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: A4W, h: 96, color: '#E7E9E8' }, { type: 'rect', x: 0, y: 96, w: A4W, h: 3, color: '#70b62e' }], absolutePosition: { x: 0, y: 250 } });
    content.push({ stack: [{ text: d.project, fontSize: 20, bold: true, color: INK }, { text: d.location, fontSize: 13, color: '#3a3f3e', margin: [0, 4, 0, 0] }], absolutePosition: { x: MX, y: 276 } });
    content.push({ stack: [{ text: String(d.title || '').toUpperCase(), fontSize: 16, bold: true, color: '#232E2E' }, { text: String(d.subtitle || '').toUpperCase(), fontSize: 11, color: '#3a3f3e', margin: [0, 3, 0, 14] }, { text: [{ text: 'Submitted to: ' }, { text: d.client, bold: true }], fontSize: 11 }, { text: `Date: ${d.dateText} – ${d.rev}`, fontSize: 11, margin: [0, 3, 0, 0] }], absolutePosition: { x: MX, y: 640 } });
    content.push({ text: '', pageBreak: 'after' });
    /* introduction and project information */
    content.push(H1('Introduction', { margin: [0, 0, 0, 6] }), { text: d.intro, alignment: 'justify' });
    content.push(H1('Project Information'));
    content.push({ table: { widths: [120, '*', 90], body: [[{ text: '' }, { text: 'Description', bold: true }, { text: 'Notes', bold: true }]].concat(d.info.map(r => [{ text: r.label, bold: true }, { text: r.value || '' }, { text: r.note || '' }])) }, layout: { hLineWidth: i => (i === 0 ? 0 : 1.2), vLineWidth: (i) => (i === 1 ? 1.2 : 0), hLineColor: () => LN, vLineColor: () => LN, paddingTop: () => 4, paddingBottom: () => 4, paddingLeft: () => 5, paddingRight: () => 5 }, fontSize: 9.5 });
    if (d.hasPlan && a.plan) content.push({ text: d.planTitle, bold: true, alignment: 'center', margin: [0, 16, 0, 8] }, { image: a.plan, fit: [W, 430], alignment: 'center' });
    /* scope */
    content.push(H1('Scope of services', { pageBreak: 'before', margin: [0, 0, 0, 6] }), { text: d.scopeInTitle }, bullets(d.scopeIn));
    if (d.hasOut) content.push({ text: d.scopeOutTitle, margin: [0, 4, 0, 0] }, bullets(d.scopeOut));
    /* methodology */
    content.push(H1('Methodology'), { text: d.methodIntro, alignment: 'justify' }, { ul: d.stages.map(s => ({ text: `Stage ${s.n}: ${s.name}`, bold: true })), margin: [18, 4, 0, 4] });
    d.stages.forEach(s => {
      content.push({ text: `Stage ${s.n}: ${s.name}`, bold: true, color: G2, margin: [0, 12, 0, 4], headlineLevel: 1 });
      let ul = null; const flush = () => { if (ul) { content.push(bullets(ul, { margin: [18, 1, 0, 3] })); ul = null; } };
      s.blocks.forEach(b => { if (b.li) { (ul = ul || []).push(b.li.t); return; } flush(); if (b.p) content.push({ text: b.p.t, alignment: 'justify', margin: [0, 3, 0, 2] }); else if (b.h) content.push({ text: b.h.t, bold: true, color: G2, margin: [0, 8, 0, 2], headlineLevel: 1 }); else if (b.s) content.push({ text: b.s.t, bold: true, margin: [0, 6, 0, 1], headlineLevel: 1 }); });
      flush();
    });
    /* durations */
    content.push(H1('Estimated Durations'), { table: { widths: ['*', 150], body: [[{ text: 'Stage', bold: true }, { text: 'Estimated Durations\n(Working Days)', bold: true }]].concat(d.stages.map(s => [{ text: `Stage ${s.n}: ${s.name}`, bold: true }, { text: s.daysText }])) }, layout: greenLines(), fontSize: 9.5, margin: [0, 2, 0, 8] });
    d.durNotes.forEach(t => content.push({ text: t, margin: [0, 0, 0, 3] }));
    /* fee and payment */
    content.push(H1('Financial Proposal', { pageBreak: 'before', margin: [0, 0, 0, 6] }), { text: d.feeIntro }, { text: [{ text: d.feeMain, bold: true }, { text: d.feeTail }], margin: [0, 4, 0, 8], alignment: 'justify' });
    content.push(H1('Terms of Payment'), { table: { widths: ['*', 60], body: [[{ text: 'Stages', bold: true }, { text: '%', bold: true }]].concat(d.payments.map(p => [{ text: p.name, bold: true }, { text: p.pct + '%', bold: true }])) }, layout: { hLineWidth: i => (i === 0 ? 0 : 1.2), vLineWidth: i => (i === 1 ? 1.2 : 0), hLineColor: () => LN, vLineColor: () => LN, paddingTop: () => 5, paddingBottom: () => 5, paddingLeft: () => 5, paddingRight: () => 5 }, fontSize: 9.5, margin: [0, 2, 0, 8] });
    content.push({ text: 'Clarifications', bold: true, color: G2, margin: [0, 6, 0, 2], headlineLevel: 1 }, bullets(d.clar));
    content.push({ stack: [{ text: d.signName }, { text: d.signTitle }, { text: [{ text: 'ÖKO', color: BLUE, bold: true }, { text: 'PLAN Landscaping', bold: true }] }], alignment: 'right', margin: [0, 30, 0, 0], unbreakable: true });
    return {
      pageSize: 'A4', pageMargins: [MX, 96, MX, 70], content,
      defaultStyle: { font: 'LS', fontSize: 10, lineHeight: 1.18, color: INK },
      header: (p) => (p === 1 ? null : { margin: [MX, 26, MX, 0], stack: [{ columns: [{ image: a.logo, width: 74 }, { text: [{ text: d.project + '\n' }, { text: d.location, color: MUTED }], alignment: 'right', fontSize: 9, margin: [0, 10, 0, 0] }] }, { canvas: [{ type: 'line', x1: 0, y1: 6, x2: W, y2: 6, lineWidth: 0.8, lineColor: '#222' }] }] }),
      footer: (p, n) => (p === 1 ? null : { margin: [MX, 18, MX, 0], stack: [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: W, y2: 0, lineWidth: 0.8, lineColor: '#222' }] }, { columns: [{ text: `${d.dateText}   ${d.rev}`, fontSize: 8, color: MUTED }, { text: `Page ${p - 1} of ${n - 1}`, alignment: 'right', fontSize: 8, color: MUTED }], margin: [0, 4, 0, 0] }] }),
      pageBreakBefore: (node, after) => node.headlineLevel === 1 && after.length < 2,
      info: { title: `${d.title} — ${d.project}`, author: 'Ökoplan Landscaping', subject: d.subtitle, creator: 'Ökoplan' }
    };
  }

  /* ---------------- agreement ---------------- */
  const sub = (t, sc) => String(t).replace(/\{([.\w]+)\}/g, (m, k) => { for (const s of sc) { if (k === '.' && (typeof s === 'string' || typeof s === 'number')) return String(s); if (s && typeof s === 'object' && k in s && s[k] != null && typeof s[k] !== 'object') return String(s[k]); } return ''; });
  const runs = (rs, sc) => rs.map(r => ({ text: sub(r[0], sc).replace(/\t/g, '   '), bold: r[1].includes('b') || undefined, decoration: r[1].includes('u') ? 'underline' : undefined, italics: r[1].includes('i') || undefined }));
  const BUL = { '•': '•', '◦': '•', '▪': '▪' };
  function agrBlocks(bs, sc, d, a, out) {
    bs.forEach(b => {
      if (b.k === 'loop') { const v = sc.map(s => (s && typeof s === 'object' ? s[b.n] : undefined)).find(x => x !== undefined); if (Array.isArray(v)) v.forEach(it => agrBlocks(b.body, [it].concat(sc), d, a, out)); else if (v) agrBlocks(b.body, sc, d, a, out); return; }
      if (b.k === 'gap') { out.push({ text: '', margin: [0, 0, 0, 5] }); return; }
      if (b.k === 'tbl') { const isFee = b.id === 'fees'; const body = isFee ? [[{ text: 'Scope', bold: true }, { text: 'Fees (LE)', bold: true, alignment: 'right' }]].concat(d.fees.map(f => [f.scope, { text: f.fee, alignment: 'right' }]), [[{ text: 'Total', bold: true }, { text: d.feeTotal, bold: true, alignment: 'right' }]]) : [[{ text: 'Stages', bold: true }, { text: '%', bold: true, alignment: 'center' }]].concat(d.payments.map(p => [{ text: p.name, bold: true }, { text: p.pct + '%', alignment: 'center' }]));
        out.push({ table: { widths: ['*', isFee ? 110 : 60], body }, layout: { hLineWidth: (i, n) => (i === 0 ? 0 : 0.8), vLineWidth: () => 0, hLineColor: () => '#7d8584', fillColor: (i, n) => (isFee && i === n.table.body.length - 1 ? '#EEF1F0' : null), paddingTop: () => 4, paddingBottom: () => 4 }, margin: [28, 4, 0, 6], fontSize: 10 }); return; }
      if (b.k === 'sig') { out.push(sigBlock(d)); return; }
      const text = runs(b.r, sc); const isH = b.st === 'h';
      const base = { alignment: b.jc === 'center' ? 'center' : (!isH && text.reduce((s, x) => s + x.text.length, 0) > 90 ? 'justify' : 'left') };
      if (isH) { const allPlain = b.r.every(r => !r[1].includes('b')); out.push(Object.assign(base, { text, bold: !allPlain || undefined, margin: [0, 10, 0, 4], headlineLevel: 1 })); return; }
      if (b.lab) { const isNum = /\d/.test(b.lab); const lab = isNum ? b.lab : (BUL[b.lab] || '•'); const left = b.lv >= 2 ? 34 : 6; const lw = isNum ? (b.lab.includes('-') ? 26 : 16) : 12;
        out.push({ columns: [{ text: lab, width: lw, bold: isNum && !b.lab.includes('-') ? true : undefined, fontSize: lab === '▪' ? 8 : undefined, margin: [0, lab === '▪' ? 1.5 : 0, 0, 0] }, Object.assign({ text, width: '*' }, base)], columnGap: 4, margin: [left, 2, 0, 3] }); return; }
      out.push(Object.assign(base, { text, margin: [Math.min(b.ind || 0, 60), 1, 0, 2] }));
    });
    return out;
  }
  function sigBlock(d) {
    const col = (who, name, sigName, sigTitle) => ({ width: '*', stack: [{ text: who, bold: true, decoration: 'underline', margin: [0, 0, 0, 8] }, { text: name, bold: true, margin: [0, 0, 0, 4] }, { text: 'SIGNATURE', margin: [0, 0, 0, 26] }, { text: '……………………………………………', margin: [0, 0, 0, 10] }, { text: sigName, bold: true, margin: [0, 0, 0, 2] }, { text: sigTitle, bold: true, margin: [0, 0, 0, 22] }, { text: '……………………………………………', margin: [0, 0, 0, 4] }, { text: 'DATE', bold: true }] });
    return { columns: [col('THE Company', d.client, d.signClientName, d.signClientTitle), col('The Consultant', [{ text: 'Ö', bold: true }, { text: 'KOPLAN FOR LANDSCAPING', bold: true }], 'Dr Tarek Sobhy', 'CEO')], columnGap: 30, margin: [6, 30, 0, 0], unbreakable: true };
  }
  function agrDoc(d, a) {
    const content = agrBlocks(a.layout, [d], d, a, []);
    return {
      pageSize: 'A4', pageMargins: [MX, 92, MX, 64], content,
      defaultStyle: { font: 'LS', fontSize: 10.5, lineHeight: 1.18, color: INK },
      header: () => ({ margin: [MX, 24, MX, 0], image: a.logo, width: 80 }),
      footer: (p, n) => ({ margin: [MX, 14, MX, 0], stack: [{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: W, y2: 0, lineWidth: 0.8, lineColor: '#222' }] }, { columns: [{ text: d.dateLong, fontSize: 8.5, color: MUTED }, { text: [{ text: 'Page ' }, { text: String(p), bold: true }, { text: ' of ' }, { text: String(n), bold: true }], alignment: 'right', fontSize: 8.5, color: MUTED }], margin: [0, 4, 0, 0] }] }),
      pageBreakBefore: (node, after) => node.headlineLevel === 1 && after.length < 2,
      info: { title: `Consultancy Agreement — ${d.project}`, author: 'Ökoplan Landscaping', creator: 'Ökoplan' }
    };
  }

  /* fonts: a = { fonts: { regular: base64, bold: base64 } } */
  function make(kind, data, a) {
    const pm = root.pdfMake; if (!pm) return Promise.reject(new Error('pdfmake'));
    pm.vfs = Object.assign({}, pm.vfs || {}, { 'LiberationSans-Regular.ttf': a.fonts.regular, 'LiberationSans-Bold.ttf': a.fonts.bold });
    pm.fonts = Object.assign({}, pm.fonts || {}, { LS: { normal: 'LiberationSans-Regular.ttf', bold: 'LiberationSans-Bold.ttf', italics: 'LiberationSans-Regular.ttf', bolditalics: 'LiberationSans-Bold.ttf' } });
    const dd = kind === 'agr' ? agrDoc(data, a) : offerDoc(data, a);
    return new Promise((res, rej) => { try { pm.createPdf(dd).getBlob(b => res(b)); } catch (e) { rej(e); } });
  }
  root.OkPdf = { make, offerDoc, agrDoc };
})(typeof window !== 'undefined' ? window : globalThis);
