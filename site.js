/* Ökoplan Landscaping — public website (v1, 16 Oct 2026 — Mahmoud)
   One script for the five pages. English first, Arabic with the toggle (?lang=ar / remembered).
   Projects come live from the system (Edge function oeko-site → the published «Projects gallery»);
   the six profile projects are the fallback when the function is unreachable.
   The contact form becomes a Lead in the system's Enquiries (+ push to management). No money anywhere. */
(() => {
  'use strict';
  const API = 'https://hwpffrjvwnbpzpzbpeml.supabase.co/functions/v1/oeko-site';
  const SRC = 'app/_src/';
  const qs = new URLSearchParams(location.search);
  let LANG = qs.get('lang') || (() => { try { return localStorage.getItem('ok.lang'); } catch (e) { return null; } })() || 'en';
  LANG = 'en'; /* English only (Mahmoud, 16 Oct) — the Arabic strings stay in the code for later */ try { localStorage.setItem('ok.lang', LANG); } catch (e) { /* ignore */ }
  const ar = () => LANG === 'ar';
  const L = (a, b) => (ar() ? (b == null ? a : b) : a);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const withLang = href => { const u = new URL(href, location.href); if (ar()) u.searchParams.set('lang', 'ar'); else u.searchParams.delete('lang'); return u.pathname.replace(/^.*\//, '') + u.search + u.hash; };

  /* ------------------------------------------------------------------ content */
  const TYPES = { hotel: ['Hotels & Resorts', 'فنادق ومنتجعات'], res: ['Residential', 'سكني'], urban: ['Urban & City Planning', 'تخطيط عمراني'], com: ['Mixed-Use & Retail', 'متعدد الاستخدامات وتجاري'], office: ['Offices', 'مكاتب'], edu: ['Educational', 'تعليمي'], gov: ['Governmental', 'حكومي'], sport: ['Sports', 'رياضي'], park: ['Public Parks', 'حدائق عامة'] };
  const typeL = k => (TYPES[k] ? L(TYPES[k][0], TYPES[k][1]) : '');
  const SCOPE_AR = { 'Landscape Design': 'تصميم اللاند سكيب', 'Concept Design': 'التصميم المبدئي', 'Schematic Design': 'التصميم التخطيطي', 'Design Development': 'تطوير التصميم', 'Construction Drawings': 'رسومات التنفيذ', 'Tender Documents': 'مستندات الطرح', 'Site Supervision': 'الإشراف على التنفيذ' };
  const svcL = s => (ar() && SCOPE_AR[s]) || s;
  const img = (p, i, s) => `${SRC}portfolio/${p}/${i}${s || ''}.jpg`;
  const shotsOf = (p, n, cover) => [cover].concat(Array.from({ length: n }, (_, j) => j + 1).filter(i => i !== cover)).map(i => ({ id: p + '-' + i, src: img(p, i, '-m'), full: img(p, i) }));
  const FALLBACK = [
    { id: 'ok-telal-alamein', title: 'Telal El-Alamein', client: 'Rooya for Real Estate Development', location: 'North Coast, Egypt', year: 2013, type: 'hotel', services: ['Landscape Design'], about: 'Cityscape Best Touristic Resort Award 2015.', shots: shotsOf('telal-alamein', 6, 1) },
    { id: 'ok-rixos-seagate', title: 'Rixos Sea Gate', client: 'Rixos Hotels', location: 'Sharm El-Sheikh, Egypt', year: 2015, type: 'hotel', services: ['Landscape Design'], about: '', shots: shotsOf('rixos-seagate', 4, 1) },
    { id: 'ok-xanadu', title: 'Xanadu Makadi Bay', client: 'Tia Makadi', location: 'Hurghada, Egypt', year: 2019, type: 'hotel', services: ['Landscape Design', 'Concept Design', 'Schematic Design', 'Design Development', 'Construction Drawings', 'Tender Documents'], about: '', shots: shotsOf('xanadu', 2, 1) },
    { id: 'ok-crowne-plaza', title: 'Crowne Plaza — Sharm El-Sheikh', client: 'Mr. Montasser Abu Ghaly', location: 'Sharm El-Sheikh, Egypt', year: 1999, type: 'hotel', services: ['Landscape Design', 'Concept Design', 'Schematic Design', 'Design Development', 'Construction Drawings', 'Tender Documents', 'Site Supervision'], about: '', shots: shotsOf('crowne-plaza', 7, 1) },
    { id: 'ok-rixos-sharm', title: 'Rixos Sharm', client: 'Radamis Blue Planet for Hotels and Touristic Resorts', location: 'Sharm El-Sheikh, Egypt', year: 2009, type: 'hotel', services: ['Landscape Design', 'Concept Design', 'Schematic Design', 'Design Development', 'Construction Drawings', 'Tender Documents'], about: '', shots: shotsOf('rixos-sharm', 4, 1) },
    { id: 'ok-sokhna', title: 'Telal El-Sokhna', client: 'Rooya for Real Estate Development', location: 'Al-Ain Al-Sokhna, Egypt', year: 2007, type: 'hotel', services: ['Landscape Design', 'Concept Design', 'Schematic Design', 'Design Development', 'Construction Drawings', 'Tender Documents', 'Site Supervision'], about: 'Cityscape Second Best Touristic Resort Award 2015.', shots: shotsOf('sokhna', 5, 5) },
  ];
  /* a short story per profile project (the website's own words; the system's «about» is appended when present) */
  const STORY = {
    'ok-telal-alamein': ['A hillside resort on the Mediterranean where terraces step down to lagoons and the planting is chosen to live with wind and salt. Awarded Cityscape Best Touristic Resort in 2015.', 'منتجع على تلال المتوسط، المدرّجات بتنزل على بحيرات، والزرع متختار يعيش مع الريح والملح. فاز بجايزة سيتي سكيب لأفضل منتجع سياحي سنة 2015.'],
    'ok-rixos-seagate': ['Generous pool gardens and shaded walks for a large family resort on the Red Sea — a landscape that keeps its calm at full occupancy.', 'حدايق حمّامات سباحة واسعة وممرات مظلّلة لمنتجع عائلي كبير على البحر الأحمر — لاند سكيب بيحافظ على هدوءه والمنتجع مليان.'],
    'ok-xanadu': ['A sequence of courtyards and water gardens leading from the arrival to the bay, carried from concept through tender documents.', 'سلسلة أفنية وحدايق مائية من الوصول لحد الخليج — اشتغلناها من التصميم المبدئي لحد مستندات الطرح.'],
    'ok-crowne-plaza': ['One of the office\'s early resort landscapes in Sharm El-Sheikh: streams, rock gardens and lush planting around the pools, designed and supervised on site to completion.', 'من أوايل مشاريع المكتب في شرم الشيخ: مجاري مياه، حدايق صخرية وزرع كثيف حوالين الحمّامات — تصميم وإشراف على التنفيذ لحد التسليم.'],
    'ok-rixos-sharm': ['Lagoon pools threaded through palm groves, with the levels and the lighting designed together so the gardens read as well at night as by day.', 'بحيرات سباحة ماشية وسط نخيل، المناسيب والإضاءة اتصمموا مع بعض علشان الحدايق تتقري بالليل زي النهار.'],
    'ok-sokhna': ['A resort landscape on the Gulf of Suez stepping from the mountains to the sea, from concept to site supervision. Cityscape Second Best Touristic Resort, 2015.', 'لاند سكيب منتجع على خليج السويس نازل من الجبل للبحر — من التصميم المبدئي لحد الإشراف على التنفيذ. ثاني أفضل منتجع سياحي في سيتي سكيب 2015.'],
  };
  const OFFICE = {
    stats: [[30, '', 'years of practice', 'سنة خبرة'], [90, '+', 'people in the studio', 'في فريق المكتب'], [400, '+', 'projects', 'مشروع'], [12, '', 'awards & honours', 'جايزة وتكريم']],
    about: ['Ökoplan Landscaping stands as an award-winning, pioneering consultancy firm that has been reshaping the landscape architecture scene in Egypt for nearly three decades.' + ' ' + 'Our goal is rooted in the creation of sustainable, cost-effective outdoor spaces that prioritize human-centered design principles. We strive to bridge the gap between indoor and outdoor environments, infusing our projects with innovative, out-of-the-box ideas that render spaces both functional and visually captivating.',
      'أوكوبلان لتنسيق المواقع مكتب استشاري حائز على جوايز، بيشكّل الحياة في الهواء الطلق في مصر من قرابة تلاتين سنة. بنصمم لاند سكيب مستدام وبتكلفة واعية، الإنسان في مركزه — بيوصل بين الداخل والخارج بأفكار عملية وجميلة في نفس الوقت.'],
    vision: ['We aspire to be a global, trendsetting design firm, leading the market and striving to enhance the quality of life for both present and future generations.', 'نكون مكتب تصميم عالمي بيحدد الاتجاه، ويرفع جودة الحياة للجيل الحالي والأجيال الجاية.'],
    mission: ['Our mission is to cultivate innovative ideas for the built environment. We achieve this through a passionate, client-oriented team that embraces progressive design approaches.', 'نزرع أفكار مبتكرة للبيئة المبنية — بفريق شغوف، قريب من العميل، وبيتبنى أساليب تصميم متقدمة.'],
    values: [['Teamwork', 'العمل الجماعي'], ['Dedication', 'الالتزام'], ['Innovation', 'الابتكار'], ['Transparency', 'الشفافية'], ['Belonging', 'الانتماء'], ['Excellence', 'التميّز']],
    specialisms: [
      ['site', 'Site analysis', 'تحليل الموقع', 'Climate, soil, water, views and the brief — read before the first line is drawn.', 'المناخ والتربة والمياه والمناظر والبرنامج — بنقراهم قبل أول خط.'],
      ['land', 'Landscape design', 'تصميم اللاند سكيب', 'The whole outdoor realm: character, movement, shade, and the spaces between buildings.', 'الفراغ الخارجي كله: الشخصية، الحركة، الظل، والمساحات ما بين المباني.'],
      ['hard', 'Hardscape design', 'تصميم الهارد سكيب', 'Paving, walls, steps and terraces detailed to be built well and to age well.', 'الأرضيات والحوائط والسلالم والمدرّجات — تفاصيل تتنفذ صح وتكبر بالعمر صح.'],
      ['light', 'Lighting design', 'تصميم الإضاءة', 'Gardens that read as well at night as by day, without glare or waste.', 'حدايق تتقري بالليل زي النهار — من غير إبهار ولا هدر.'],
      ['water', 'Water features', 'العناصر المائية', 'Lagoons, streams and pools designed with the levels, the planting and the engineering together.', 'بحيرات ومجاري وحمّامات مصممة مع المناسيب والزرع والهندسة في وقت واحد.'],
      ['plant', 'Planting design', 'اختيار النباتات', 'Palettes chosen for the place — wind, salt, heat and water — so they thrive, not just survive.', 'لوحات زرع متختارة للمكان — ريح وملح وحرارة ومياه — علشان تزدهر مش بس تعيش.'],
      ['art', 'Artwork & sculpture', 'الأعمال الفنية والنحت', 'Selecting and placing art so it belongs to the landscape rather than sits on it.', 'اختيار الأعمال الفنية ومكانها علشان تبقى جزء من اللاند سكيب مش حاجة فوقه.'],
      ['sign', 'Signage & wayfinding', 'اللافتات والإرشاد', 'Quiet, consistent wayfinding that lets guests find their way without noticing it.', 'إرشاد هادي ومتّسق يخلي الضيف يلاقي طريقه من غير ما يحس.'],
    ],
    steps: [
      ['Listening & site analysis', 'الاستماع وتحليل الموقع', 'We walk the land with you, read the climate, soil, water and views, and turn the brief into a shared ambition for the place.', 'بنمشي الأرض معاك، نقرا المناخ والتربة والمياه والمناظر، ونحوّل البرنامج لطموح مشترك للمكان.', 'Site visit · brief · opportunities and constraints'],
      ['Concept design', 'التصميم المبدئي', 'The big idea: character, zoning and movement, the first plans and images — enough to decide with confidence.', 'الفكرة الكبيرة: الشخصية والتقسيم والحركة، أول مخططات وصور — بما يكفي تاخد القرار بثقة.', 'Masterplan · character images · materials direction'],
      ['Schematic design', 'التصميم التخطيطي', 'The concept tested against reality: levels and drainage, planting palettes, water and lighting principles, coordination with the architects.', 'الفكرة بتتختبر على الواقع: المناسيب والصرف، لوحات الزرع، مبادئ المياه والإضاءة، والتنسيق مع المعماريين.', 'Plans and sections · palettes · coordination'],
      ['Design development', 'تطوير التصميم', 'Every element resolved and coordinated with structure, MEP and irrigation, so what is drawn can be built as drawn.', 'كل عنصر بيتحل ويتنسق مع الإنشائي والكهروميكانيك والري — علشان اللي اترسم يتنفذ زي ما اترسم.', 'Detailed plans · typical details · specifications'],
      ['Construction drawings', 'رسومات التنفيذ', 'The documents contractors build from: setting-out, grading, planting, irrigation, lighting and hardscape details.', 'المستندات اللي المقاول بيبني منها: التوقيع والمناسيب والزرع والري والإضاءة وتفاصيل الهارد سكيب.', 'Full drawing set · schedules · specifications'],
      ['Tender documents & support', 'مستندات الطرح والدعم', 'Bills of quantities and specifications ready for pricing, then clarifications and technical evaluation of the offers.', 'جداول الكميات والمواصفات جاهزة للتسعير، وبعدها الردود على الاستفسارات والتقييم الفني للعروض.', 'BOQ · specifications · technical evaluation'],
      ['Site supervision', 'الإشراف على التنفيذ', 'On site until the last tree is in and the first guest arrives — reviewing shop drawings, samples, mock-ups and the work itself.', 'في الموقع لحد ما آخر شجرة تتزرع وأول ضيف يوصل — مراجعة الرسومات التنفيذية والعينات والنماذج والشغل نفسه.', 'Site visits · shop drawings · samples and mock-ups · handover'],
    ],
    awards: [
      ['a1', 2019, 'Lifetime Achievement Award — Landscape Middle East', 'جايزة الإنجاز مدى الحياة — Landscape Middle East', 'Dr. Tarek Sobhy — the first Lifetime Achievement Award for landscape in the Middle East, Dubai', 'د. طارق صبحي — أول جايزة إنجاز مدى الحياة للاند سكيب في الشرق الأوسط، دبي'],
      ['a2', 2018, 'Top Mediterranean Resort — MR&H', 'أفضل منتجع في المتوسط — MR&H', 'Fouka Bay', 'فوكا باي'],
      ['a3', 2018, 'African Property Awards — Best Residential Project in Egypt', 'African Property Awards — أفضل مشروع سكني في مصر', 'IL Monte Galala, Sokhna (Tatweer Misr)', 'إل مونتي جالالا — السخنة (تطوير مصر)'],
      ['a4', 2016, 'Cityscape Residential Global Award', 'Cityscape Residential Global Award', 'IL Monte Galala — the first Egyptian company to win it', 'إل مونتي جالالا — أول شركة مصرية تفوز بيها'],
      ['a5', 2015, 'Cityscape — Best Touristic Resort', 'Cityscape — أفضل منتجع سياحي', 'Telal El-Alamein (Rooya) · second best resort: Telal El-Sokhna', 'تلال العلمين (رؤية) · وثاني أفضل منتجع: تلال السخنة'],
      ['a6', 2013, 'Cityscape — Best Residential', 'Cityscape — أفضل مشروع سكني', 'Stone Park (Rooya)', 'ستون بارك (رؤية)'],
    ],
    collab: [['c1', 'CSCEC', 'Al Alamein Towers', 'أبراج العلمين'], ['c2', 'EDSA · !melk', 'Cairo Capital', 'كايرو كابيتال'], ['c3', 'Zaha Hadid Architects', 'Stone Towers', 'ستون تاورز'], ['c4', 'Gianluca Peluffo & Partners', 'Fouka Bay · IL Monte Galala · Bloomfields', 'فوكا باي · إل مونتي جالالا · بلومفيلدز'], ['c5', 'SASAKI', 'NJIT, Mostakbal City', 'NJIT — مدينة المستقبل'], ['c6', 'GROSS. MAX.', 'Stone Street', 'ستون ستريت'], ['c7', 'GB Design', 'Skywalk', 'سكاي ووك'], ['c8', 'WATG', 'One Ninety · Skywalk', 'ون ناينتي · سكاي ووك'], ['c9', 'SWA', 'Noor, Cairo Capital', 'نور — كايرو كابيتال']],
    partners: 'l01 l02 l03 l04 l05 l06 l07 l08 l09 l10 l11 l12 l13 l14 l15 l16 l17 l18 l19 l21 l22 l23 l24 l25 l26 l27 l28 l29 l30 l31 l32 l33 l34 l35 l37 l38 l39 l40 l41 l42 l43 l44 l46 l47 l48 l49 l51 l53 l101 l103 l104 l106 l107 l108 l110 l111 l112 l113 l115 l116'.split(' '),
    team: Array.from({ length: 40 }, (_, i) => 'p' + String(i + 1).padStart(2, '0')),
    email: 'info@oekoplanlandscaping.com',
    address: ['Sheraton Heliopolis, Cairo, Egypt', 'مساكن شيراتون — مصر الجديدة — القاهرة'],
  };
  const ICON = {
    site: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M11 7v4l3 2"/>', land: '<path d="M3 20c3-4 6-5 9-2 2-3 5-4 9-1"/><circle cx="7" cy="8" r="3"/><path d="M7 11v5"/><circle cx="16" cy="6" r="3"/><path d="M16 9v6"/>',
    hard: '<path d="M3 9l5-5 5 4-5 5zM13 8l5-4 3 5-5 3zM3 14l5 2 1 5-6-1zM10 17l5-3 5 3-4 4z"/>', light: '<path d="M12 3v2M9 5h6l1 5H8zM12 10v10M8 20h8"/>',
    water: '<path d="M4 14h16M6 14a6 6 0 0 0 12 0M12 3v4M8 6c1 1 2 2 4 1M16 6c-1 1-2 2-4 1M12 7c-2 2-2 4 0 6 2-2 2-4 0-6z"/>', plant: '<path d="M12 21v-8M12 13c-5 0-7-4-7-8 4 0 7 2 7 8zM12 13c5 0 7-4 7-8-4 0-7 2-7 8z"/>',
    art: '<path d="M8 21h8M10 21v-4h4v4M12 3c-3 0-4 3-3 5s3 3 3 5c0-2 2-3 3-5s0-5-3-5z"/>', sign: '<path d="M12 3v18M6 6h11l2 2-2 2H6zM18 13H7l-2 2 2 2h11z"/>',
  };
  const ic = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] || ''}</svg>`;
  const NAVS = [['index.html', 'Home', 'الرئيسية'], ['work.html', 'Work', 'المشاريع'], ['services.html', 'Services', 'الخدمات'], ['studio.html', 'Studio', 'المكتب'], ['contact.html', 'Contact', 'تواصل معانا']];
  const UI = {
    selected: ['Selected work', 'مشاريع مختارة'], all: ['All work', 'كل المشاريع'], view: ['View project', 'شوف المشروع'], next: ['Next project', 'المشروع اللي بعده'], backWork: ['All projects', 'كل المشاريع'],
    client: ['Client', 'العميل'], location: ['Location', 'المكان'], year: ['Year', 'السنة'], sector: ['Sector', 'القطاع'], scope: ['Our scope', 'نطاق شغلنا'], gallery: ['The project', 'المشروع'],
    numbers: ['The studio in numbers', 'المكتب في أرقام'], how: ['How we work', 'إزاي بنشتغل'], special: ['What we design', 'إيه اللي بنصممه'], sectors: ['Where we work', 'القطاعات'],
    awards: ['Awards & honours', 'جوايز وتكريمات'], collab: ['International collaborations', 'تعاونات دولية'], partners: ['Clients & partners', 'عملاء وشركاء'], team: ['The team', 'الفريق'], leadership: ['Leadership', 'القيادة'],
    talk: ['Start a conversation', 'ابدأ الكلام معانا'], talkSub: ['Tell us about the site and the ambition — we reply within two working days.', 'احكي لنا عن الأرض والطموح — بنرد خلال يومين عمل.'],
    bandH: ['Have a site in mind? Let\'s walk it together.', 'عندك أرض في بالك؟ يلا نمشيها سوا.'], bandB: ['Get in touch', 'تواصل معانا'],
    fName: ['Your name', 'اسمك'], fEmail: ['Email', 'الإيميل'], fPhone: ['Phone', 'التليفون'], fCompany: ['Company / developer', 'الشركة / المطوّر'], fLocation: ['Site location', 'مكان الأرض'], fType: ['Project type', 'نوع المشروع'], fMsg: ['Tell us about the project', 'احكي لنا عن المشروع'], fSend: ['Send enquiry', 'ابعت الطلب'], fSending: ['Sending…', 'بيتبعت…'],
    fOk: ['Thank you — your enquiry reached the studio. We reply within two working days.', 'شكراً — طلبك وصل للمكتب. بنرد خلال يومين عمل.'], fErr: ['Something went wrong. Please email us directly.', 'حصلت مشكلة — ابعت لنا إيميل مباشرة.'], fMissing: ['Please add your name, a way to reach you, and a few words about the project.', 'من فضلك اكتب اسمك، وطريقة نتواصل بيها، وكلمتين عن المشروع.'],
    choose: ['Choose…', 'اختار…'], signin: ['Team sign-in', 'دخول الفريق'], rights: ['All rights reserved.', 'كل الحقوق محفوظة.'], loading: ['Loading the gallery…', 'بنحمّل المعرض…'],
    office: ['Studio', 'المكتب'], mail: ['Email', 'الإيميل'], visit: ['Visit', 'العنوان'], follow: ['Elsewhere', 'في أماكن تانية'],
  };
  const T = k => (UI[k] ? L(UI[k][0], UI[k][1]) : k);

  /* ------------------------------------------------------------------ data */
  let PROJECTS = FALLBACK.slice(); let MODULE = false;
  const pic = (v, folder, ext) => (/^(https?:)?\//.test(String(v || '')) ? v : `${SRC}${folder}/${v}.${ext}`);
  async function loadProjects() {
    try {
      const r = await fetch(API + '?a=site&_=' + Math.floor(Date.now() / 30000), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status);
      const j = await r.json(); if (!j || !j.ok) throw new Error('bad');
      if (Array.isArray(j.projects) && j.projects.length) PROJECTS = j.projects.filter(p => p.shots && p.shots.length);
      if (j.module && j.site) {
        MODULE = true; const w = j.site;
        const two = k => [w[k + 'En'] || '', w[k + 'Ar'] || w[k + 'En'] || ''];
        if (w.heroEn) OFFICE.hero = two('hero'); if (w.heroSubEn) OFFICE.heroSub = two('heroSub');
        if (w.aboutEn) OFFICE.about = two('about'); if (w.visionEn) OFFICE.vision = two('vision'); if (w.missionEn) OFFICE.mission = two('mission');
        if (w.valuesEn) { const e = w.valuesEn.split(/[,،]/).map(x => x.trim()).filter(Boolean), a = (w.valuesAr || '').split(/[,،]/).map(x => x.trim()).filter(Boolean); OFFICE.values = e.map((x, i) => [x, a[i] || x]); }
        if (Array.isArray(w.stats) && w.stats.length) OFFICE.stats = w.stats.map(x => [+x.n || 0, x.s || '', x.en || '', x.ar || x.en || '']);
        if (w.leaderEn) OFFICE.leader = two('leader'); if (w.leader2En) OFFICE.leader2 = two('leader2');
        if (w.email) OFFICE.email = w.email; if (w.phone) OFFICE.phone = w.phone; if (w.addressEn) OFFICE.address = two('address'); if (w.hoursEn) OFFICE.hours = two('hours');
        if (j.services && j.services.steps && j.services.steps.length) OFFICE.steps = j.services.steps.map(x => [x.en, x.ar || x.en, x.textEn, x.textAr || x.textEn, x.note || '']);
        if (j.services && j.services.specs && j.services.specs.length) OFFICE.specialisms = j.services.specs.map(x => [x.icon || 'land', x.en, x.ar || x.en, x.textEn, x.textAr || x.textEn]);
        if (Array.isArray(j.awards) && j.awards.length) OFFICE.awards = j.awards.map(a => [a.img, a.year, a.titleEn, a.titleAr || a.titleEn, a.subEn, a.subAr || a.subEn]);
        if (Array.isArray(j.collab) && j.collab.length) OFFICE.collab = j.collab.map(c => [c.img, c.name, c.projectsEn, c.projectsAr || c.projectsEn]);
        if (Array.isArray(j.logos) && j.logos.length) OFFICE.partners = j.logos.map(l => l.img);
        if (Array.isArray(j.team) && j.team.length) OFFICE.team = j.team.map(t => t.img);
      }
    } catch (e) { /* the built-in content stays */ }
    return PROJECTS;
  }
  const cover = p => (p.shots && p.shots[0]) || { src: '', full: '' };
  const story = p => { if (p.aboutEn || p.aboutAr) return [L(p.aboutEn || p.aboutAr, p.aboutAr || p.aboutEn)]; const s = STORY[p.id]; return s ? [L(s[0], s[1])] : [p.about].filter(Boolean); };

  /* ------------------------------------------------------------------ chrome */
  const arrow = () => (ar() ? '←' : '→');
  function nav() {
    const here = location.pathname.replace(/^.*\//, '') || 'index.html';
    const el = document.createElement('header'); el.className = 'nav'; el.id = 'nav';
    el.innerHTML = `<div class="wrap"><a class="brand" href="${withLang('index.html')}" aria-label="Ökoplan Landscaping"><img src="${SRC}brand/lockup.png" alt="Ökoplan Landscaping"></a>
      <nav class="menu" id="menu">${NAVS.slice(0, 4).map(n => `<a href="${withLang(n[0])}" class="${here === n[0] ? 'on' : ''}">${esc(L(n[1], n[2]))}</a>`).join('')}
        <a class="btn sm" href="${withLang('contact.html')}">${esc(L('Contact us', 'تواصل معانا'))}</a></nav>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button></div>`;
    document.body.prepend(el);
    $('#burger').addEventListener('click', () => { const o = el.classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o ? 'true' : 'false'); document.body.style.overflow = o ? 'hidden' : ''; });
    const onS = () => el.classList.toggle('scrolled', window.scrollY > 8); onS(); addEventListener('scroll', onS, { passive: true });
  }
  const langHref = () => { const u = new URL(location.href); if (ar()) u.searchParams.delete('lang'); else u.searchParams.set('lang', 'ar'); return u.pathname.replace(/^.*\//, '') + u.search + u.hash; };
  function footer() {
    const el = document.createElement('footer'); const y = new Date().getFullYear();
    el.innerHTML = `<div class="wrap"><div class="cols"><div class="lk"><img src="${SRC}brand/lockup.png" alt="Ökoplan Landscaping"><p>${esc(L('Landscape architecture consultancy — Cairo, Egypt. Resorts, residences and public places since the 1990s.', 'مكتب استشاري لعمارة اللاند سكيب — القاهرة. منتجعات ومجمعات سكنية وأماكن عامة من التسعينات.'))}</p></div>
      <div><b>${esc(T('office'))}</b>${NAVS.slice(1).map(n => `<a href="${withLang(n[0])}">${esc(L(n[1], n[2]))}</a>`).join('')}</div>
      <div><b>${esc(T('sectors'))}</b>${Object.keys(TYPES).slice(0, 5).map(k => `<a href="${withLang('work.html')}">${esc(typeL(k))}</a>`).join('')}</div>
      <div><b>${esc(L('Contact', 'تواصل'))}</b><a href="mailto:${OFFICE.email}">${OFFICE.email}</a><span>${esc(L(OFFICE.address[0], OFFICE.address[1]))}</span><a href="app/" rel="nofollow" class="signin">${esc(T('signin'))} ${arrow()}</a></div></div>
      <div class="base"><span>© ${y} Ökoplan Landscaping. ${esc(T('rights'))}</span><span>Cairo · Egypt</span></div></div>`;
    document.body.appendChild(el);
  }
  function band() {
    const el = document.createElement('section'); el.className = 'band';
    el.innerHTML = `<div class="wrap"><div><div class="eyebrow light">${esc(L('Start a project', 'ابدأ مشروع'))}</div><h2>${esc(T('bandH'))}</h2></div><a class="btn light" href="${withLang('contact.html')}">${esc(T('bandB'))} <span aria-hidden="true">${arrow()}</span></a></div>`;
    return el;
  }
  function reveal() { const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null; $$('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in')); }
  const lazy = root => $$('img[data-src]', root || document).forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); im.onload = () => im.classList.add('ok'); if (im.complete && im.naturalWidth) im.classList.add('ok'); });

  /* ------------------------------------------------------------------ pieces */
  const tile = p => `<a class="card rv" href="${withLang('work.html?p=' + encodeURIComponent(p.id))}"><div class="ph"><img data-src="${esc(cover(p).src)}" alt="${esc(p.title)}" loading="lazy"><span class="pill">${esc(typeL(p.type) || L('Landscape', 'لاند سكيب'))}</span></div><div class="cap"><b>${esc(p.title)}</b><small>${esc([p.location, p.year].filter(Boolean).join(' · '))}</small><span class="go">${esc(T('view'))} ${arrow()}</span></div></a>`;
  const numbers = () => `<div class="nums">${OFFICE.stats.map(s => `<div class="num rv"><b><span data-count="${s[0]}">0</span><i>${s[1]}</i></b><span>${esc(L(s[2], s[3]))}</span></div>`).join('')}</div>`;
  function countUp() { const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); const el = e.target, to = +el.dataset.count, t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); })); $$('[data-count]').forEach(el => io.observe(el)); }
  const partnersMarquee = () => { const few = OFFICE.partners.length < 8; const row = OFFICE.partners.map(k => `<span class="lg"><img src="${esc(pic(k, 'partners', 'png'))}" alt="" loading="lazy"></span>`).join(''); return `<div class="marq ${few ? 'static wrap' : ''}" aria-label="${esc(T('partners'))}"><div class="tr">${row}${few ? '' : row}</div></div>`; };
  const collabMarquee = () => { const few = OFFICE.collab.length < 7; const row = OFFICE.collab.map(c => `<span class="lg wide" title="${esc(c[1])} — ${esc(L(c[2], c[3]))}"><img src="${esc(pic(c[0], 'collab', 'png'))}" alt="${esc(c[1])}" loading="lazy"></span>`).join(''); return `<div class="marq slow ${few ? 'static wrap' : ''}"><div class="tr">${row}${few ? '' : row}</div></div>`; };
  const teamStrip = () => { const ks = OFFICE.team.slice(); if (!ks.length) return ''; if (ks.length < 12) { return `<div class="wrap"><div class="marq static wrap"><div class="tr">${ks.map(k => `<span class="pp"><img src="${esc(pic(k, 'team', 'jpg'))}" alt="" loading="lazy"></span>`).join('')}</div></div></div>`; } const half = Math.ceil(ks.length / 2); const row = xs => xs.map(k => `<span class="pp"><img src="${esc(pic(k, 'team', 'jpg'))}" alt="" loading="lazy"></span>`).join(''); const a = row(ks.slice(0, half)), b = row(ks.slice(half)); return `<div class="tstrip"><div class="marq people"><div class="tr">${a}${a}</div></div><div class="marq people rev"><div class="tr">${b}${b}</div></div></div>`; };
  const awardCards = n => `<div class="g3">${OFFICE.awards.slice(0, n || 99).map(a => `<div class="awc rv"><img src="${esc(pic(a[0], 'awards', 'png'))}" alt=""><span class="y">${a[1]}</span><b>${esc(L(a[2], a[3]))}</b><small>${esc(L(a[4], a[5]))}</small></div>`).join('')}</div>`;
  const collabGrid = () => `<div class="g3 collab">${OFFICE.collab.map(c => `<div class="cc rv"><img src="${esc(pic(c[0], 'collab', 'png'))}" alt="${esc(c[1])}"><div><b>${esc(c[1])}</b><small>${esc(L(c[2], c[3]))}</small></div></div>`).join('')}</div>`;
  const specGrid = () => `<div class="g4 spec">${OFFICE.specialisms.map(s => `<div class="sc rv"><span class="ico">${ic(s[0])}</span><b>${esc(L(s[1], s[2]))}</b><small>${esc(L(s[3], s[4]))}</small></div>`).join('')}</div>`;
  const stepsGrid = () => `<div class="steps">${OFFICE.steps.map((s, i) => `<div class="step rv"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(L(s[0], s[1]))}</b><p>${esc(L(s[2], s[3]))}</p><small>${esc(s[4])}</small></div></div>`).join('')}</div>`;
  const sectorsRow = () => `<div class="chips">${Object.keys(TYPES).map(k => `<span class="rv">${esc(typeL(k))}</span>`).join('')}</div>`;
  const sechead = (eye, h, sub, more, href) => `<div class="sechead"><div><div class="eyebrow rv">${esc(eye)}</div><h2 class="rv">${esc(h)}</h2>${sub ? `<p class="sub rv">${esc(sub)}</p>` : ''}</div>${more ? `<a class="btn ghost rv" href="${withLang(href)}">${esc(more)} ${arrow()}</a>` : ''}</div>`;
  const pagehead = (eye, h, sub) => `<section class="phead"><div class="wrap"><div class="eyebrow">${esc(eye)}</div><h1>${esc(h)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div></section>`;

  /* ------------------------------------------------------------------ pages */
  const PAGES = {
    async home(main) {
      const FEAT = PROJECTS.filter(p => p.featured); const SEL = (FEAT.length ? FEAT : PROJECTS).slice(0, 8); const heroP = SEL[0] || FALLBACK[0];
      main.innerHTML = `<section class="hero"><div class="wrap"><div class="txt"><div class="eyebrow">${esc(L('Landscape architecture · Cairo, Egypt', 'عمارة اللاند سكيب · القاهرة'))}</div><h1>${esc(OFFICE.hero ? L(OFFICE.hero[0], OFFICE.hero[1]) : L('Landscape architecture for resorts, residences and public places.', 'عمارة لاند سكيب للمنتجعات والمجمعات السكنية والأماكن العامة.'))}</h1><p>${esc(OFFICE.heroSub ? L(OFFICE.heroSub[0], OFFICE.heroSub[1]) : L('Ökoplan Landscaping stands as an award-winning, pioneering consultancy firm that has been reshaping the landscape architecture scene in Egypt for nearly three decades.', 'مكتب استشاري حائز على جوايز بتلاتين سنة من الشغل المنفّذ في مصر — فريق واحد من أول مشية في الأرض لحد الإشراف في الموقع.'))}</p><div class="btns"><a class="btn" href="${withLang('work.html')}">${esc(L('Our work', 'شغلنا'))} <span aria-hidden="true">${arrow()}</span></a><a class="btn ghost" href="${withLang('services.html')}">${esc(L('Our services', 'خدماتنا'))}</a></div></div>
        <figure class="img"><img src="${esc(cover(heroP).full || cover(heroP).src)}" alt="${esc(heroP.title)}" fetchpriority="high"><figcaption>${esc(heroP.title)}${heroP.location ? ' — ' + esc(heroP.location) : ''}</figcaption></figure></div></section>
      <section class="numband"><div class="wrap">${numbers()}</div></section>
      <section class="sec"><div class="wrap">${sechead(T('selected'), L('Selected projects', 'مشاريع مختارة'), L('Resorts and residences on the coasts, public places in the cities — a few of the places we have shaped.', 'منتجعات ومجمعات على السواحل وأماكن عامة في المدن — شوية من الأماكن اللي شكّلناها.'), T('all'), 'work.html')}<div class="g3">${SEL.map(tile).join('')}</div></div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('special'), L('What we design', 'إيه اللي بنصممه'), L('Eight disciplines, carried by one team inside every project.', 'تماني تخصصات بيشيلها فريق واحد جوه كل مشروع.'), L('How we work', 'إزاي بنشتغل'), 'services.html')}${specGrid()}</div></section>
      <section class="sec"><div class="wrap intro2"><div class="rv"><div class="eyebrow">${esc(L('The studio', 'المكتب'))}</div><h2>${esc(L('Nearly thirty years of outdoor life in Egypt', 'قرابة تلاتين سنة من الحياة في الهواء الطلق في مصر'))}</h2></div><div class="rv"><p>${esc(L(OFFICE.about[0], OFFICE.about[1]))}</p><p>${esc(L('Our diverse portfolio showcases the extensive range of our expertise in landscape design and architecture projects — from urban and city planning to hotels and resorts, residential to retail and entertainment, educational and cultural to offices, sports to industrial, and governmental.', 'Our diverse portfolio showcases the extensive range of our expertise in landscape design and architecture projects — from urban and city planning to hotels and resorts, residential to retail and entertainment, educational and cultural to offices, sports to industrial, and governmental.'))}</p><p>${esc(L('Founded and led by Dr. Tarek Sobhy — recipient of the first Lifetime Achievement Award given by Landscape Middle East (2019).', 'أسسه وبيقوده د. طارق صبحي — الحاصل على أول جايزة إنجاز مدى الحياة من Landscape Middle East (2019).'))}</p><a class="btn ghost" href="${withLang('studio.html')}">${esc(L('About the studio', 'عن المكتب'))} ${arrow()}</a></div></div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('awards'), L('Awards & honours', 'جوايز وتكريمات'), L('Recognised at home and abroad.', 'تكريم في مصر وبرّه.'), L('The studio', 'المكتب'), 'studio.html')}${awardCards()}</div></section>
      <section class="sec"><div class="wrap">${sechead(T('partners'), L('Our partners', 'شركاء النجاح'), L('Clients and institutions who trusted the office.', 'عملاء وجهات وثقت في المكتب.'))}</div>${partnersMarquee()}
        <div class="wrap" style="margin-top:clamp(24px,3.5vw,40px)">${sechead(T('collab'), L('International collaborations', 'تعاون دولي'), L('Global practices we have worked with.', 'مكاتب عالمية اشتغلنا معاها.'))}</div>${collabMarquee()}</section>`;
      main.appendChild(band());
    },
    async work(main) {
      const id = qs.get('p'); const p = id && PROJECTS.find(x => x.id === id);
      if (p) return PAGES.project(main, p);
      const types = Array.from(new Set(PROJECTS.map(x => x.type).filter(Boolean)));
      const lc = {}; PROJECTS.forEach(x => { const k = (x.location || '').split(',')[0].trim(); if (k) lc[k] = (lc[k] || 0) + 1; }); const locs = Object.keys(lc).sort((a, b) => lc[b] - lc[a]).slice(0, 8);
      main.innerHTML = pagehead(L('Work', 'المشاريع'), L('Projects', 'المشاريع'), L('Three decades of built work across Egypt and the region — filter by sector or city.', 'تلاتين سنة من الشغل المنفّذ في مصر والمنطقة — فلتر بالقطاع أو المدينة.')) + `<section class="sec tight"><div class="wrap">
        <div class="filters rv" id="filters"><div class="frow"><span class="flbl">${esc(L('Sector', 'القطاع'))}</span><button class="on" data-f="">${esc(T('all'))}</button>${types.map(t => `<button data-f="t:${esc(t)}">${esc(typeL(t))}</button>`).join('')}</div>${locs.length > 1 ? `<div class="frow"><span class="flbl">${esc(L('City', 'المدينة'))}</span>${locs.map(l => `<button data-f="l:${esc(l)}">${esc(l)}</button>`).join('')}</div>` : ''}<span class="count" id="count"></span></div>
        <div class="g3" id="grid"></div><div class="more" id="more"></div></div></section>`;
      const grid = $('#grid'); const PAGE = 24; let cur = '', shown = PAGE;
      const draw = () => { const f = cur; const xs = PROJECTS.filter(x => !f || (f.startsWith('t:') ? x.type === f.slice(2) : (x.location || '').startsWith(f.slice(2)))); grid.innerHTML = xs.slice(0, shown).map(tile).join('') || `<div class="empty">—</div>`; $('#count').textContent = L(`${Math.min(shown, xs.length)} of ${xs.length} projects`, `${Math.min(shown, xs.length)} من ${xs.length} مشروع`); $('#more').innerHTML = xs.length > shown ? `<button class="btn ghost" id="morebtn">${esc(L('Show more projects', 'اعرض مشاريع أكتر'))} <span aria-hidden="true">${arrow()}</span></button>` : ''; const mb = $('#morebtn'); if (mb) mb.onclick = () => { shown += PAGE; draw(); }; lazy(grid); reveal(); };
      draw(); $('#filters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#filters button').forEach(x => x.classList.toggle('on', x === b)); cur = b.dataset.f; shown = PAGE; draw(); window.scrollTo({ top: $('#filters').offsetTop - 120, behavior: 'smooth' }); });
      main.appendChild(band());
    },
    async project(main, p) {
      document.title = `${p.title} — Ökoplan Landscaping`;
      const i = PROJECTS.indexOf(p); const nx = PROJECTS[(i + 1) % PROJECTS.length]; const pv = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]; const c = cover(p); const st = story(p);
      const parts = (st[0] || '').replace(/\s*Services:[^.]*\.\s*/g, ' ').replace(/\s*Scope of work:[^.]*\.?\s*/gi, ' ').replace(/\s+/g, ' ').trim().split(/(?<=[.؟!])\s+/).filter(Boolean); const first = parts[0] || L('A landscape designed to be lived in.', 'لاند سكيب متصمم يتعاش.'); const rest = [parts.slice(1).join(' ')].concat(st.slice(1)).filter(Boolean); if (!rest.length) rest.push(L(`${typeL(p.type) || 'Landscape'} project${p.client ? ' for ' + p.client : ''}${p.location ? ' in ' + p.location : ''}${p.year ? ', ' + p.year : ''}. Landscape architecture by Ökoplan Landscaping — our scope on the project is listed below.`, `${typeL(p.type) || 'لاند سكيب'}${p.client ? ' لصالح ' + p.client : ''}${p.location ? ' في ' + p.location : ''}${p.year ? '، ' + p.year : ''}. تصميم اللاند سكيب من أوكوبلان — نطاق شغلنا تحت.`));
      main.innerHTML = `<section class="phead project"><div class="wrap"><a class="crumb" href="${withLang('work.html')}">${esc(L('Work', 'المشاريع'))}</a><div class="eyebrow">${esc(typeL(p.type) || L('Landscape', 'لاند سكيب'))}</div><h1>${esc(p.title)}</h1><p class="sub">${esc([p.client, p.location].filter(Boolean).join(' · '))}</p></div></section>
      <section class="wrap"><figure class="phero"><img src="${esc(c.full || c.src)}" alt="${esc(p.title)}" data-i="0"></figure>
        <div class="facts rv"><div><small>${esc(T('client'))}</small><b>${esc(p.client || '—')}</b></div><div><small>${esc(T('location'))}</small><b>${esc(p.location || '—')}</b></div><div><small>${esc(T('year'))}</small><b>${esc(p.year || '—')}</b></div><div><small>${esc(T('sector'))}</small><b>${esc(typeL(p.type) || '—')}</b></div>${p.area ? `<div><small>${esc(L('Area', 'المساحة'))}</small><b>${esc(p.area)}</b></div>` : ''}</div>
        <div class="story"><div class="rv"><div class="eyebrow">${esc(L('About the project', 'عن المشروع'))}</div><h2>${esc(first)}</h2></div><div class="rv">${rest.map(s => `<p>${esc(s)}</p>`).join('')}${p.services && p.services.length ? `<div class="eyebrow" style="margin-top:28px">${esc(T('scope'))}</div><div class="chips sm">${p.services.map(s => `<span>${esc(svcL(s))}</span>`).join('')}</div>` : ''}${p.behance ? `<p style="margin-top:20px"><a class="btn ghost" href="${esc(p.behance)}" target="_blank" rel="noopener">Behance ${arrow()}</a></p>` : ''}</div></div>
        ${p.shots.length > 1 ? `<div class="eyebrow rv">${esc(T('gallery'))}</div><div class="shots">${p.shots.slice(1).map((s, k) => `<figure class="rv" data-i="${k + 1}"><img data-src="${esc(s.src)}" alt="${esc(p.title)} — ${k + 2}" loading="lazy"></figure>`).join('')}</div>` : ''}
        <div class="pn"><a href="${withLang('work.html?p=' + encodeURIComponent(pv.id))}"><small>${esc(L('Previous', 'السابق'))}</small><b>${esc(pv.title)}</b></a><a class="mid" href="${withLang('work.html')}">${esc(T('backWork'))}</a><a class="r" href="${withLang('work.html?p=' + encodeURIComponent(nx.id))}"><small>${esc(T('next'))}</small><b>${esc(nx.title)}</b></a></div></section>
      <div class="lb" id="lb" role="dialog" aria-modal="true"><button class="x" id="lbx">✕</button><button class="p" id="lbp">${ar() ? '→' : '←'}</button><button class="n" id="lbn">${ar() ? '←' : '→'}</button><img id="lbi" alt=""><div class="c" id="lbc"></div></div>`;
      let cur = 0; const lb = $('#lb'); const show = k => { cur = (k + p.shots.length) % p.shots.length; $('#lbi').src = p.shots[cur].full || p.shots[cur].src; $('#lbc').textContent = `${p.title} · ${cur + 1} / ${p.shots.length}`; lb.classList.add('on'); document.body.style.overflow = 'hidden'; };
      const hide = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
      $$('.shots figure, .phero').forEach(f => f.addEventListener('click', () => show(+(f.dataset.i || (f.querySelector('img') || {}).dataset.i || 0))));
      $('#lbx').onclick = hide; $('#lbp').onclick = () => show(cur - 1); $('#lbn').onclick = () => show(cur + 1); lb.addEventListener('click', e => { if (e.target === lb) hide(); });
      addEventListener('keydown', e => { if (!lb.classList.contains('on')) return; if (e.key === 'Escape') hide(); if (e.key === 'ArrowRight') show(cur + (ar() ? -1 : 1)); if (e.key === 'ArrowLeft') show(cur + (ar() ? 1 : -1)); });
      let tx = null; lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true }); lb.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); tx = null; });
      main.appendChild(band());
    },
    async services(main) {
      const h = PROJECTS.find(x => x.id === 'ok-crowne-plaza') || PROJECTS[1] || FALLBACK[3];
      main.innerHTML = pagehead(L('Services', 'الخدمات'), L('One team, from the brief to the last tree', 'فريق واحد — من البرنامج لحد آخر شجرة'), L('As landscape architecture providers, we are deeply committed to the creation of outdoor spaces that provide unforgettable experiences without compromising on quality.', 'As landscape architecture providers, we are deeply committed to the creation of outdoor spaces that provide unforgettable experiences without compromising on quality.')) + `
      <section class="wrap"><figure class="wide rv"><img src="${esc(cover(h).full || cover(h).src)}" alt="${esc(h.title)}"><figcaption>${esc(h.title)}${h.location && !h.title.includes(h.location.split(',')[0]) ? ' — ' + esc(h.location) : ''}</figcaption></figure></section>
      <section class="sec"><div class="wrap">${sechead(T('how'), L('Seven stages, one responsibility', 'سبع مراحل ومسؤولية واحدة'), L('Our focus goes beyond aesthetics; it extends to sustainability and better quality of life for both the present and future generations. We aim to create outdoor spaces that are both beautiful and functional, delivering on our promise of exceptional design.', 'Our focus goes beyond aesthetics; it extends to sustainability and better quality of life for both the present and future generations. We aim to create outdoor spaces that are both beautiful and functional, delivering on our promise of exceptional design.'))}${stepsGrid()}</div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('special'), L('The disciplines inside every project', 'التخصصات جوه كل مشروع'))}${specGrid()}</div></section>
      <section class="sec"><div class="wrap">${sechead(T('sectors'), L('Where we work', 'القطاعات'), L('Resorts and hotels first — and well beyond.', 'المنتجعات والفنادق أولاً — وأبعد منها بكتير.'))}${sectorsRow()}</div></section>`;
      main.appendChild(band());
    },
    async studio(main) {
      const h = PROJECTS.find(x => x.id === 'ok-xanadu') || PROJECTS[2] || FALLBACK[2];
      main.innerHTML = pagehead(L('The studio', 'المكتب'), L('Nearly thirty years of outdoor life in Egypt', 'قرابة تلاتين سنة من الحياة في الهواء الطلق في مصر'), L(OFFICE.about[0], OFFICE.about[1])) + `
      <section class="wrap"><figure class="wide rv"><img src="${esc(cover(h).full || cover(h).src)}" alt="${esc(h.title)}"><figcaption>${esc(h.title)}${h.location && !h.title.includes(h.location.split(',')[0]) ? ' — ' + esc(h.location) : ''}</figcaption></figure></section>
      <section class="numband"><div class="wrap">${numbers()}</div></section>
      <section class="sec"><div class="wrap"><div class="g3 vm"><div class="vmc rv"><div class="eyebrow">${esc(L('Vision', 'رؤيتنا'))}</div><p>${esc(L(OFFICE.vision[0], OFFICE.vision[1]))}</p></div><div class="vmc rv"><div class="eyebrow">${esc(L('Mission', 'مهمتنا'))}</div><p>${esc(L(OFFICE.mission[0], OFFICE.mission[1]))}</p></div><div class="vmc rv"><div class="eyebrow">${esc(L('Values', 'قيمنا'))}</div><div class="chips sm">${OFFICE.values.map(v => `<span>${esc(L(v[0], v[1]))}</span>`).join('')}</div><p style="margin-top:14px;font-size:14.5px">${esc('At Ökoplan Landscaping, our core values form the very foundation of our work and our identity. These values, which are deeply ingrained in our organizational culture, guide our every decision and action. They are the pillars upon which we build our reputation and successful projects; our impact extends not only across Egypt but also reaches distant corners of the globe.')}</p></div></div></div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('leadership'), L('Dr. Tarek Sobhy', 'د. طارق صبحي'))}<div class="lead2"><div class="ph rv"><img src="${SRC}brand/tarek.jpg" alt="Dr. Tarek Sobhy"></div><div class="rv"><p class="big">${esc(OFFICE.leader ? L(OFFICE.leader[0], OFFICE.leader[1]) : L('Founder and principal. In 2019 he received the first Lifetime Achievement Award given by Landscape Middle East — a recognition of three decades shaping the discipline in Egypt and the region.', 'المؤسس ورئيس المكتب. سنة 2019 استلم أول جايزة إنجاز مدى الحياة بتمنحها Landscape Middle East — تقدير لتلاتين سنة من تشكيل المهنة في مصر والمنطقة.'))}</p><p>${esc(OFFICE.leader2 ? L(OFFICE.leader2[0], OFFICE.leader2[1]) : L('He leads every project personally from the first site walk, with a studio of 90+ landscape architects, engineers and site supervisors behind him.', 'بيقود كل مشروع بنفسه من أول مشية في الأرض، ووراه مكتب فيه أكتر من تسعين مهندس لاند سكيب ومهندس ومشرف موقع.'))}</p><div class="name"><img src="${SRC}brand/sig.png" alt=""><div><b>Dr. Tarek Sobhy</b><small>${esc(L('Founder & Principal', 'المؤسس ورئيس المكتب'))}</small></div></div></div></div></div></section>
      <section class="sec"><div class="wrap">${sechead(T('team'), L('One team, 90+ people', 'فريق واحد — أكتر من 90 شخص'), L('In our diverse team, innovation and collaboration are our driving forces. Together, we turn ideas into extraordinary realities, fueled by our shared commitment to excellence.', 'In our diverse team, innovation and collaboration are our driving forces. Together, we turn ideas into extraordinary realities, fueled by our shared commitment to excellence.'))}<div class="teamlist rv"><span class="eyebrow" style="margin:0">Our team includes</span><span class="chip">Landscape Architects</span><span class="chip">Agriculture Engineers</span><span class="chip">Irrigation Engineers</span><span class="chip">Site Engineers</span></div><figure class="group rv"><img src="${SRC}brand/team-group.jpg" alt="The Ökoplan Landscaping team"></figure></div>
        ${teamStrip()}</section>
      <section class="sec alt"><div class="wrap">${sechead(T('awards'), L('Awards & honours', 'جوايز وتكريمات'))}${awardCards()}</div></section>
      <section class="sec"><div class="wrap">${sechead(T('collab'), L('Alongside the world\'s studios', 'جنب مكاتب العالم'))}${collabGrid()}</div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('partners'), L('Developers and operators we work with', 'المطوّرين والمشغّلين اللي بنشتغل معاهم'))}</div>${partnersMarquee()}</section>`;
      main.appendChild(band());
    },
    async contact(main) {
      main.innerHTML = pagehead(L('Contact', 'تواصل معانا'), T('talk'), T('talkSub')) + `<section class="sec tight"><div class="wrap contact"><div class="info rv"><div class="ib"><small>${esc(T('mail'))}</small><a href="mailto:${OFFICE.email}">${OFFICE.email}</a></div><div class="ib"><small>${esc(T('visit'))}</small><span>${esc(L(OFFICE.address[0], OFFICE.address[1]))}</span></div>${OFFICE.phone ? `<div class="ib"><small>${esc(L('Phone', 'التليفون'))}</small><a href="tel:${esc(OFFICE.phone)}" dir="ltr">${esc(OFFICE.phone)}</a></div>` : ''}<div class="ib"><small>${esc(L('Working hours', 'مواعيد العمل'))}</small><span>${esc(OFFICE.hours ? L(OFFICE.hours[0], OFFICE.hours[1]) : L('Sunday – Thursday, 9:00 – 17:00', 'الأحد – الخميس، 9:00 – 17:00'))}</span></div></div>
        <form class="form rv" id="f" novalidate><div class="f"><label for="fn">${esc(T('fName'))}</label><input id="fn" name="name" required autocomplete="name"></div><div class="f"><label for="fc">${esc(T('fCompany'))}</label><input id="fc" name="company" autocomplete="organization"></div>
          <div class="f"><label for="fe">${esc(T('fEmail'))}</label><input id="fe" name="email" type="email" autocomplete="email" inputmode="email"></div><div class="f"><label for="fp">${esc(T('fPhone'))}</label><input id="fp" name="phone" type="tel" autocomplete="tel" inputmode="tel" dir="ltr"></div>
          <div class="f"><label for="fl">${esc(T('fLocation'))}</label><input id="fl" name="location"></div><div class="f"><label for="ft">${esc(T('fType'))}</label><select id="ft" name="type"><option value="">${esc(T('choose'))}</option>${Object.keys(TYPES).map(k => `<option value="${k}">${esc(typeL(k))}</option>`).join('')}</select></div>
          <div class="f full"><label for="fm">${esc(T('fMsg'))}</label><textarea id="fm" name="message" required></textarea></div><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="full act"><button class="btn" type="submit" id="send">${esc(T('fSend'))} <span aria-hidden="true">${arrow()}</span></button><span class="note" id="msg"></span></div></form></div></section>`;
      $('#f').addEventListener('submit', async e => {
        e.preventDefault(); const f = e.target; const d = Object.fromEntries(new FormData(f).entries()); const msg = $('#msg'); const btn = $('#send');
        if (!String(d.name || '').trim() || (!String(d.email || '').trim() && !String(d.phone || '').trim()) || !String(d.message || '').trim()) { msg.className = 'note err'; msg.textContent = T('fMissing'); return; }
        btn.disabled = true; btn.firstChild.textContent = T('fSending') + ' '; msg.className = 'note'; msg.textContent = '';
        try { const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ a: 'enquiry', lang: LANG }, d)) }); const j = await r.json(); if (!j.ok) throw new Error(j.error || 'x'); msg.className = 'note ok'; msg.textContent = T('fOk'); f.reset(); }
        catch (err) { msg.className = 'note err'; msg.innerHTML = `${esc(T('fErr'))} <a href="mailto:${OFFICE.email}">${OFFICE.email}</a>`; }
        btn.disabled = false; btn.firstChild.textContent = T('fSend') + ' ';
      });
    },
  };

  /* ------------------------------------------------------------------ boot */
  async function boot() {
    document.documentElement.lang = ar() ? 'ar' : 'en'; document.documentElement.dir = ar() ? 'rtl' : 'ltr';
    const page = document.body.dataset.page || 'home'; const main = $('#main') || document.body.appendChild(Object.assign(document.createElement('main'), { id: 'main' }));
    nav();
    await loadProjects();
    await PAGES[page](main);
    footer(); lazy(); reveal(); if ($('[data-count]')) countUp();
    const tt = { home: ['Ökoplan Landscaping — Landscape architecture, Cairo', 'أوكوبلان لتنسيق المواقع — عمارة اللاند سكيب، القاهرة'], work: ['Projects — Ökoplan Landscaping', 'المشاريع — أوكوبلان'], services: ['Services — Ökoplan Landscaping', 'الخدمات — أوكوبلان'], studio: ['The studio — Ökoplan Landscaping', 'المكتب — أوكوبلان'], contact: ['Contact — Ökoplan Landscaping', 'تواصل معانا — أوكوبلان'] };
    if (!qs.get('p') && tt[page] && ar()) document.title = tt[page][1];
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
