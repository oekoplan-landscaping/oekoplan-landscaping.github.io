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
  /* motion (17 Nov 2026): on unless the visitor asked the system for reduced motion — then everything is shown still */
  const MO = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); if (MO) document.documentElement.classList.add('mo');
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
  const ic = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(ICON[k] || '').replace(/<(path|circle|line|rect|polyline|polygon|ellipse)\b/g, '<$1 pathLength="1"')}</svg>`;
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
  /* the site's content is kept for the tab (sessionStorage), so moving between pages is instant; a reload or a new tab always asks the system */
  const CK = 'ok.site.v1';
  async function fetchSite() {
    const r = await fetch(API + '?a=site&_=' + Math.floor(Date.now() / 30000), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status);
    const j = await r.json(); if (!j || !j.ok) throw new Error('bad');
    try { sessionStorage.setItem(CK, JSON.stringify({ t: Date.now(), j })); } catch (e) { /* full or blocked */ }
    return j;
  }
  async function loadProjects() {
    let how = 'navigate'; try { how = (performance.getEntriesByType('navigation')[0] || {}).type || 'navigate'; } catch (e) { /* old browser */ }
    let c = null; try { c = JSON.parse(sessionStorage.getItem(CK) || 'null'); } catch (e) { /* blocked */ }
    if (c && c.j && how !== 'reload' && Date.now() - c.t < 15 * 60e3) { try { applySite(c.j); fetchSite().catch(() => {}); return PROJECTS; } catch (e) { /* fall through to the network */ } }
    try { applySite(await fetchSite()); } catch (e) { /* the built-in content stays */ }
    return PROJECTS;
  }
  function applySite(j) {
    {
      if (Array.isArray(j.projects) && j.projects.length) PROJECTS = j.projects.filter(p => p.shots && p.shots.length);
      if (j.module && j.site) {
        MODULE = true; const w = j.site;
        const two = k => [w[k + 'En'] || '', w[k + 'Ar'] || w[k + 'En'] || ''];
        if (w.heroEn) OFFICE.hero = two('hero'); if (w.heroSubEn) OFFICE.heroSub = two('heroSub'); OFFICE.heroImg = w.heroImg || ''; OFFICE.heroVideo = w.heroVideo || '';
        if (w.aboutEn) OFFICE.about = two('about'); if (w.visionEn) OFFICE.vision = two('vision'); if (w.missionEn) OFFICE.mission = two('mission');
        if (w.valuesEn) { const e = w.valuesEn.split(/[,،]/).map(x => x.trim()).filter(Boolean), a = (w.valuesAr || '').split(/[,،]/).map(x => x.trim()).filter(Boolean); OFFICE.values = e.map((x, i) => [x, a[i] || x]); }
        if (Array.isArray(w.stats) && w.stats.length) OFFICE.stats = w.stats.map(x => [+x.n || 0, x.s || '', x.en || '', x.ar || x.en || '']);
        if (w.leaderEn) OFFICE.leader = two('leader'); if (w.leader2En) OFFICE.leader2 = two('leader2');
        if (w.email) OFFICE.email = w.email; if (w.phone) OFFICE.phone = w.phone; if (w.addressEn) OFFICE.address = two('address'); if (w.hoursEn) OFFICE.hours = two('hours');
        if (j.services && j.services.steps && j.services.steps.length) OFFICE.steps = j.services.steps.map(x => [x.en, x.ar || x.en, x.textEn, x.textAr || x.textEn, x.note || '']);
        if (j.services && j.services.specs && j.services.specs.length) OFFICE.specialisms = j.services.specs.map(x => [x.icon || 'land', x.en, x.ar || x.en, x.textEn, x.textAr || x.textEn]);
        ['awards', 'collab', 'logos', 'team'].forEach(k => (Array.isArray(j[k]) ? j[k] : []).forEach(d => { if (d.img && d.fit) FIT.set(d.img, d.fit); }));
        (j.projects || []).forEach(p => (p.shots || []).forEach(s => { const f = p.fits && p.fits[s.id]; if (f) { FIT.set(s.src, f); FIT.set(s.full, f); } }));
        if (j.site && j.site.heroImg && j.site.heroFit) FIT.set(j.site.heroImg, j.site.heroFit);
        if (Array.isArray(j.awards) && j.awards.length) OFFICE.awards = j.awards.map(a => [a.img, a.year, a.titleEn, a.titleAr || a.titleEn, a.subEn, a.subAr || a.subEn]);
        if (Array.isArray(j.collab) && j.collab.length) OFFICE.collab = j.collab.map(c => [c.img, c.name, c.projectsEn, c.projectsAr || c.projectsEn]);
        if (Array.isArray(j.logos) && j.logos.length) OFFICE.partners = j.logos.map(l => l.img);
        if (Array.isArray(j.team) && j.team.length) OFFICE.team = j.team.map(t => t.img);
      }
    }
  }
  const cover = p => (p.shots && p.shots[0]) || { src: '', full: '' };
  /* crop / zoom set in the system (Website module): fit = {x,y (focal point %), z (zoom), m ('cover'|'contain')} — keyed by picture URL */
  const FIT = new Map();
  const fitOf = src => FIT.get(src) || null;
  const im = (src, attrs, fit) => {
    const f = fit === undefined ? fitOf(src) : fit; const a = attrs || '';
    if (!f || !(f.z > 1 || f.m === 'contain' || (f.x != null && f.x !== 50) || (f.y != null && f.y !== 50))) return `<img src="${esc(src)}" ${a}>`;
    const x = Math.max(0, Math.min(100, +f.x || 50)), y = Math.max(0, Math.min(100, +f.y || 50)); const z = f.m === 'contain' ? 1 : Math.max(1, Math.min(4, +f.z || 1));
    const st = `width:${z * 100}%;height:${z * 100}%;left:${-(z - 1) * x}%;top:${-(z - 1) * y}%;object-position:${x}% ${y}%;object-fit:${f.m === 'contain' ? 'contain' : 'cover'}`;
    return `<span class="fit ${f.m === 'contain' ? 'contain' : ''}"><img src="${esc(src)}" style="${st}" ${a}></span>`;
  };
  const imLazy = (src, attrs, fit) => im(src, attrs, fit).replace('<img src=', '<img data-src=');
  const story = p => { if (p.aboutEn || p.aboutAr) return [L(p.aboutEn || p.aboutAr, p.aboutAr || p.aboutEn)]; const s = STORY[p.id]; return s ? [L(s[0], s[1])] : [p.about].filter(Boolean); };

  /* ------------------------------------------------------------------ chrome */
  const arrow = () => `<i class="ar" aria-hidden="true">${ar() ? '←' : '→'}</i>`;
  function nav() {
    const here = location.pathname.replace(/^.*\//, '') || 'index.html';
    const el = document.createElement('header'); el.className = 'nav'; el.id = 'nav';
    el.innerHTML = `<div class="wrap"><a class="brand" href="${withLang('index.html')}" aria-label="Ökoplan Landscaping"><img src="${SRC}brand/lockup.png" alt="Ökoplan Landscaping"></a>
      <nav class="menu" id="menu">${NAVS.slice(0, 4).map((n, i) => `<a href="${withLang(n[0])}" class="${here === n[0] ? 'on' : ''}" style="--i:${i}">${esc(L(n[1], n[2]))}</a>`).join('')}
        <a class="btn sm" href="${withLang('contact.html')}" style="--i:4">${esc(L('Contact us', 'تواصل معانا'))}</a></nav>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button></div>`;
    document.body.prepend(el);
    $('#burger').addEventListener('click', () => { const o = el.classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o ? 'true' : 'false'); document.body.style.overflow = o ? 'hidden' : ''; });
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll, { passive: true }); onScroll();
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
    const el = document.createElement('section'); el.className = 'band ln';
    el.innerHTML = `${topo('bd')}<div class="wrap"><div><div class="eyebrow light">${esc(L('Start a project', 'ابدأ مشروع'))}</div><h2>${esc(T('bandH'))}</h2></div><a class="btn light" href="${withLang('contact.html')}">${esc(T('bandB'))} <span aria-hidden="true">${arrow()}</span></a></div>`;
    return el;
  }
  let RIO = null;
  function reveal() {
    const els = $$('.rv:not(.in), .ln:not(.in)');
    if (!MO || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    if (!RIO) RIO = new IntersectionObserver(es => {
      const hit = es.filter(e => e.isIntersecting).map(e => e.target).sort((a, b) => { const r = a.getBoundingClientRect(), q = b.getBoundingClientRect(); return Math.round(r.top - q.top) || (ar() ? q.left - r.left : r.left - q.left); });
      hit.forEach((el, i) => { RIO.unobserve(el); const d = Math.min(i, 8) * 60; el.style.setProperty('--d', d + 'ms'); el.classList.add('in'); if (el.classList.contains('rv')) setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, d + 2700); });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => RIO.observe(el));
  }

  /* ------------------------------------------------------------------ motion: contour lines, words, parallax, progress */
  const TOPO = ["M437 0Q385 128 381 140Q378 152 377 162Q376 172 378 180Q381 188 386 193Q392 198 402 201Q412 205 428 207Q444 208 458 207Q472 206 486 203Q500 200 510 196Q520 191 530 185Q540 178 552 164Q564 151 585 120Q605 88 617 72Q629 56 642 42Q654 28 670 14L686 0","M758 640Q748 628 742 623Q736 619 730 617Q724 615 716 614Q708 613 690 616Q672 619 647 630L622 640","M358 0Q345 56 339 76Q333 96 323 118Q314 140 294 176Q273 212 271 218Q269 224 270 230Q270 236 273 240Q276 243 280 246Q284 248 302 252Q320 257 358 260Q397 264 444 266Q492 268 510 267Q528 266 542 264Q556 262 566 258Q576 254 585 247Q594 240 598 234Q603 228 607 220Q611 212 624 170Q638 128 650 104Q662 80 670 68Q679 56 687 46Q696 36 718 18L739 0","M1168 0Q1200 9 1220 12Q1240 16 1282 19Q1324 21 1344 21Q1364 20 1382 18Q1400 16 1416 13Q1432 10 1448 5L1465 0","M1600 251Q1572 316 1569 328Q1566 340 1564 352Q1563 364 1563 374Q1564 384 1566 394Q1568 404 1578 436Q1589 468 1592 480Q1595 492 1596 506Q1597 520 1595 534Q1593 548 1587 563Q1580 578 1569 591Q1557 604 1543 614Q1528 624 1509 632L1490 640","M120 640Q86 588 74 566Q62 544 53 524Q45 504 39 484Q33 464 31 448Q29 432 30 418Q31 404 34 390Q37 376 47 350Q57 324 57 316Q57 308 55 304Q53 300 48 296Q43 292 22 282L0 272","M914 640Q871 560 854 537Q836 513 825 503Q813 492 803 485Q792 478 782 474Q772 469 762 468Q752 466 742 468Q732 470 720 476Q708 483 656 531Q604 580 583 596Q562 612 541 626L519 640","M297 0Q301 28 301 42Q300 56 298 70Q296 84 291 98Q287 112 281 124Q275 136 265 149Q256 162 246 173Q236 184 224 193Q212 203 200 210Q188 217 176 221Q164 226 150 229Q136 232 122 232Q108 233 92 232Q76 230 62 227Q48 224 34 219Q20 213 10 207L0 200","M1061 0Q1126 28 1153 36Q1180 43 1220 49Q1260 55 1378 66Q1496 77 1514 82Q1532 86 1538 90Q1544 93 1550 99Q1555 104 1559 110Q1562 116 1564 124Q1566 132 1566 154Q1567 176 1562 202Q1558 228 1547 274Q1535 320 1533 340Q1531 360 1535 380Q1538 400 1552 440Q1566 480 1568 498Q1570 516 1568 528Q1566 540 1562 550Q1558 560 1551 569Q1544 579 1536 586Q1528 594 1512 603Q1496 613 1476 619Q1456 626 1434 629Q1412 632 1388 632Q1364 632 1342 630Q1320 628 1262 620Q1204 611 1148 609Q1092 607 1074 605Q1056 603 1044 600Q1032 597 1022 593Q1012 589 1002 584Q992 578 982 571Q972 564 954 547Q936 530 896 486Q856 442 838 424Q820 406 804 392Q788 378 759 357Q730 336 720 328Q711 320 701 308Q692 296 686 282Q679 268 675 248Q670 228 669 208Q667 188 669 168Q671 148 676 130Q681 112 689 96Q697 80 710 64Q722 48 737 35Q752 21 769 11L786 0","M182 640Q156 617 143 603Q131 588 120 572Q109 556 101 540Q94 524 89 508Q84 492 82 478Q80 464 81 450Q82 436 86 422Q90 408 97 395Q104 382 114 371Q124 359 136 349Q148 339 164 329Q180 320 194 315Q208 309 226 305Q244 301 264 299Q284 297 306 296Q328 295 356 296Q384 297 412 300Q440 303 468 308Q496 312 520 318Q545 324 562 330Q578 336 590 342Q601 348 610 356Q619 364 624 374Q630 384 632 392Q633 400 634 408Q634 416 632 434Q629 452 623 470Q616 488 605 506Q595 524 581 540Q568 556 551 572Q533 588 512 602Q492 616 470 628L447 640","M245 0Q257 20 260 32Q264 44 264 56Q265 68 263 80Q261 92 257 104Q252 116 245 128Q238 140 228 150Q219 160 208 169Q196 178 184 184Q172 190 158 194Q144 198 130 200Q116 201 102 201Q88 200 74 197Q60 193 48 188Q36 183 26 175Q16 168 8 159L0 149","M983 0Q1020 13 1060 31Q1100 49 1122 56Q1144 63 1168 68Q1192 72 1266 82Q1340 92 1376 101Q1412 109 1434 117Q1456 126 1464 131Q1472 136 1480 143Q1488 150 1493 157Q1499 164 1503 172Q1507 180 1511 198Q1515 216 1515 236Q1514 256 1509 298Q1504 340 1505 358Q1506 376 1510 390Q1514 404 1527 436Q1540 468 1544 484Q1547 500 1547 510Q1547 520 1544 530Q1542 540 1536 550Q1531 560 1523 568Q1516 576 1508 582Q1500 588 1492 593Q1484 597 1464 604Q1444 610 1420 613Q1396 616 1368 614Q1340 612 1320 609Q1300 605 1252 594Q1204 583 1156 575Q1108 567 1088 562Q1068 558 1054 553Q1040 548 1028 542Q1016 536 1004 528Q992 520 980 511Q968 502 945 479Q921 456 878 406Q834 356 789 313Q744 270 732 253Q720 236 713 218Q706 200 704 184Q702 168 703 152Q704 136 709 122Q713 108 720 94Q727 80 738 67Q748 55 762 43Q776 31 792 22Q808 13 825 6L842 0","M269 640Q228 627 218 621Q208 616 198 609Q188 602 172 586Q156 570 144 551Q131 532 127 522Q123 512 120 502Q118 492 117 474Q116 456 118 446Q120 436 123 428Q126 420 131 412Q135 404 142 396Q148 388 164 375Q180 361 198 352Q216 343 238 336Q260 330 284 327Q308 323 338 323Q368 323 398 327Q428 331 454 338Q480 345 501 354Q522 364 531 371Q540 377 547 385Q554 392 559 400Q564 408 568 418Q571 428 572 438Q574 448 572 460Q571 472 567 484Q563 496 558 506Q553 516 546 526Q539 536 530 547Q520 557 509 567Q499 576 485 585Q472 595 458 603Q444 610 430 617Q416 623 400 628Q384 633 369 637L354 640","M188 0Q204 9 210 15Q216 20 223 32Q230 44 232 52Q234 60 234 68Q235 76 233 84Q232 92 229 100Q227 108 217 122Q208 136 194 147Q180 158 164 165Q148 172 130 174Q112 176 94 173Q76 171 61 163Q46 156 39 150Q33 144 28 138Q24 132 21 126Q18 120 16 112Q14 104 14 96Q14 88 15 80Q16 72 23 58Q30 44 35 38Q40 32 48 25Q56 17 72 9L88 0","M1400 600Q1360 599 1340 595Q1320 592 1262 576Q1204 559 1148 545Q1092 532 1078 527Q1064 522 1050 516Q1036 509 1022 501Q1008 493 996 484Q984 475 960 451Q936 428 895 378Q854 328 814 290Q774 252 761 234Q747 216 740 198Q733 180 732 162Q731 144 733 134Q734 124 737 116Q740 108 744 100Q748 92 754 83Q760 74 768 66Q776 58 785 51Q794 44 804 38Q814 32 825 27Q836 23 848 19Q860 16 872 14Q884 12 896 11Q908 11 922 12Q936 13 948 15Q960 17 974 22Q988 26 1034 46Q1080 67 1102 74Q1124 81 1148 86Q1172 91 1234 100Q1296 108 1328 116Q1360 123 1382 132Q1405 140 1422 151Q1440 162 1447 169Q1454 176 1459 183Q1464 189 1468 197Q1472 204 1475 214Q1479 224 1481 242Q1483 260 1481 300Q1479 340 1480 356Q1481 372 1486 388Q1490 404 1505 438Q1521 472 1523 482Q1525 492 1526 502Q1526 512 1524 522Q1522 532 1518 540Q1514 548 1509 554Q1504 561 1496 567Q1488 574 1478 580Q1468 585 1458 589Q1448 593 1436 595Q1424 598 1412 599L1400 600Z","M328 616Q284 614 264 608Q244 602 226 592Q208 582 193 567Q177 552 167 536Q157 520 154 512Q151 504 149 494Q147 484 147 474Q147 464 149 456Q150 448 153 440Q156 432 161 424Q165 416 177 404Q188 391 204 381Q220 371 240 363Q260 356 282 352Q304 348 330 347Q356 346 380 349Q404 352 426 358Q448 365 467 374Q486 384 494 390Q501 396 508 404Q515 412 520 420Q524 428 527 438Q529 448 530 456Q530 464 529 474Q527 484 523 494Q520 504 514 514Q508 524 500 534Q492 543 483 552Q474 560 453 574Q432 588 420 593Q408 598 394 603Q380 608 366 611Q352 614 340 615L328 616Z","M140 149Q108 151 94 148Q79 144 68 136Q57 128 52 122Q48 116 46 110Q44 104 43 98Q42 92 43 84Q44 76 50 64Q56 52 67 42Q78 32 93 26Q108 19 124 18Q140 17 154 20Q169 24 180 32Q190 40 194 46Q199 52 201 58Q203 64 204 70Q204 76 203 84Q202 92 197 104Q191 116 180 126Q169 136 155 142L140 149Z","M1408 584Q1368 584 1348 581Q1328 577 1268 557Q1208 538 1156 524Q1104 509 1076 498Q1048 487 1025 471Q1001 456 989 445Q976 433 964 421Q952 408 914 359Q876 310 838 274Q800 238 787 221Q773 204 767 190Q761 176 759 160Q757 144 761 128Q764 112 772 98Q781 84 794 71Q808 59 817 53Q827 48 836 44Q846 40 867 36Q888 31 910 32Q932 33 956 39Q980 45 1023 65Q1065 84 1087 91Q1108 98 1130 103Q1152 107 1210 115Q1268 123 1298 130Q1328 137 1352 146Q1376 155 1393 166Q1409 176 1417 183Q1424 189 1430 197Q1436 204 1443 220Q1451 236 1454 254Q1457 272 1456 308Q1455 344 1457 360Q1458 376 1464 392Q1469 408 1484 438Q1499 468 1501 478Q1504 488 1505 496Q1506 504 1505 512Q1504 520 1502 526Q1500 532 1496 538Q1492 545 1486 551Q1480 557 1472 563Q1465 568 1456 572Q1448 576 1428 580L1408 584Z","M352 589Q308 591 296 589Q284 587 274 584Q264 581 254 577Q244 573 234 566Q224 560 216 553Q208 546 202 539Q196 531 191 524Q187 516 183 506Q180 496 178 486Q177 476 178 468Q179 460 181 452Q184 444 188 436Q193 428 199 420Q206 412 214 406Q221 400 236 392Q251 384 267 379Q284 374 302 371Q320 369 340 369Q360 370 379 373Q398 376 415 382Q432 388 445 396Q459 404 469 414Q478 424 484 436Q490 448 491 460Q492 472 488 486Q485 500 477 512Q470 524 459 535Q448 546 434 556Q420 565 404 572Q388 580 370 584L352 589Z","M132 120Q116 121 108 120Q100 118 93 113Q86 108 82 102Q79 96 79 90Q78 84 81 77Q84 69 88 65Q92 60 100 56Q108 51 118 49Q128 48 136 49Q144 51 151 55Q158 60 162 66Q166 72 166 80Q167 88 164 94Q161 100 156 106Q150 112 141 116L132 120Z","M1408 569Q1364 568 1342 563Q1320 558 1270 539Q1220 520 1156 501Q1092 482 1074 474Q1056 466 1038 454Q1020 443 1008 432Q996 422 984 409Q972 396 933 344Q894 292 858 258Q822 224 811 210Q800 196 794 184Q788 172 786 158Q784 144 786 132Q788 120 794 108Q801 96 812 85Q824 74 840 66Q856 58 874 55Q892 51 910 52Q928 53 949 58Q970 64 1011 83Q1052 101 1072 108Q1092 115 1114 119Q1136 123 1192 130Q1248 137 1278 144Q1308 151 1330 159Q1352 168 1368 177Q1384 187 1391 194Q1398 200 1405 208Q1411 216 1419 232Q1427 248 1430 264Q1433 280 1433 316Q1433 352 1435 368Q1437 384 1443 398Q1448 412 1462 440Q1477 468 1481 482Q1485 496 1484 504Q1484 512 1482 518Q1480 524 1473 534Q1466 544 1454 552Q1441 560 1424 564L1408 569Z","M344 564Q308 565 290 560Q272 556 258 548Q243 540 237 534Q230 528 226 522Q221 516 216 504Q211 492 210 484Q209 476 210 470Q211 464 213 456Q216 448 220 442Q224 436 235 426Q246 416 257 410Q268 404 282 400Q296 396 310 394Q324 392 340 393Q356 393 370 396Q384 399 396 403Q408 408 418 414Q428 420 436 429Q444 437 448 447Q453 456 453 466Q454 476 452 486Q449 496 443 506Q437 516 428 524Q420 533 408 540Q397 548 384 553Q372 558 358 561L344 564Z","M1396 552Q1368 552 1352 548Q1336 545 1284 524Q1232 503 1172 486Q1112 469 1090 459Q1068 450 1050 438Q1032 426 1020 416Q1008 405 997 393Q986 380 959 340Q932 299 922 286Q912 273 878 241Q844 208 834 196Q824 184 820 174Q815 164 814 154Q812 144 814 134Q816 124 822 114Q827 104 837 96Q846 88 859 82Q872 77 886 75Q900 73 914 74Q928 75 944 79Q961 84 998 101Q1036 118 1056 125Q1076 131 1098 135Q1120 139 1174 144Q1228 150 1258 157Q1288 163 1310 171Q1332 180 1348 189Q1364 199 1376 212Q1388 224 1393 232Q1398 240 1401 248Q1405 256 1408 274Q1411 292 1411 326Q1411 360 1413 374Q1415 388 1420 402Q1425 416 1439 442Q1454 468 1458 480Q1461 492 1460 502Q1460 512 1457 518Q1454 524 1451 528Q1447 532 1442 536Q1437 540 1431 543Q1424 546 1410 549L1396 552Z","M336 536Q308 535 296 532Q284 528 275 522Q266 516 259 508Q253 500 250 492Q247 484 248 474Q249 464 255 455Q260 446 269 439Q279 432 287 428Q296 425 304 423Q312 421 322 420Q332 419 342 420Q352 421 362 424Q372 427 380 431Q388 435 394 439Q399 444 404 450Q408 456 410 462Q412 468 411 476Q411 484 409 490Q406 496 402 502Q397 508 391 514Q384 519 376 524Q368 528 352 532L336 536Z","M1404 528Q1376 531 1360 528Q1344 525 1298 506Q1252 487 1200 474Q1148 461 1130 455Q1112 449 1096 442Q1080 435 1065 426Q1050 416 1036 404Q1022 392 1011 378Q999 364 990 350Q981 336 965 306Q948 276 940 264Q931 252 922 242Q912 231 893 214Q874 196 866 186Q857 176 853 168Q850 160 849 154Q847 148 849 140Q850 132 853 126Q856 121 862 115Q868 110 876 106Q884 103 894 101Q904 99 914 100Q924 101 940 105Q956 110 988 124Q1020 138 1038 144Q1056 149 1076 152Q1096 154 1152 159Q1208 163 1236 168Q1264 173 1286 181Q1308 188 1325 198Q1342 208 1355 221Q1368 234 1376 249Q1384 264 1387 282Q1390 300 1390 336Q1389 372 1391 386Q1392 400 1397 412Q1401 424 1412 444Q1424 464 1428 474Q1432 484 1432 492Q1432 500 1430 506Q1428 512 1424 516Q1420 520 1412 524L1404 528Z","M1372 492Q1351 492 1314 480Q1276 468 1210 455Q1144 441 1122 433Q1100 425 1082 414Q1064 404 1049 390Q1034 376 1021 358Q1008 340 1000 324Q992 308 975 268Q959 228 953 218Q948 209 935 190Q922 172 921 168Q920 164 921 160Q923 156 925 155Q928 153 934 153Q940 153 966 160Q992 166 1012 169Q1032 172 1098 173Q1164 175 1192 177Q1220 180 1236 183Q1252 186 1266 191Q1280 195 1292 200Q1304 206 1314 212Q1324 219 1332 225Q1339 232 1346 240Q1352 248 1357 258Q1362 268 1365 278Q1367 288 1368 304Q1369 320 1367 352Q1364 384 1364 398Q1364 412 1366 423Q1368 434 1375 455Q1383 476 1381 481Q1380 487 1376 490L1372 492Z","M1280 436Q1220 436 1188 431Q1156 426 1132 418Q1108 409 1098 403Q1088 398 1079 391Q1069 384 1061 376Q1053 368 1045 358Q1037 348 1030 336Q1024 324 1019 312Q1015 300 1012 288Q1009 276 1008 264Q1007 252 1009 242Q1011 232 1015 226Q1019 220 1023 216Q1028 212 1034 209Q1040 206 1056 202Q1072 198 1098 195Q1124 192 1150 192Q1176 191 1196 193Q1216 195 1234 199Q1252 203 1268 209Q1284 216 1297 224Q1310 232 1321 244Q1332 256 1337 268Q1343 280 1345 294Q1348 308 1347 324Q1346 340 1340 362Q1335 384 1328 400Q1320 416 1312 423Q1304 430 1292 433L1280 436Z","M1248 413Q1204 415 1180 411Q1156 407 1136 400Q1116 392 1100 382Q1084 371 1077 363Q1069 356 1063 348Q1057 340 1053 332Q1049 324 1046 314Q1042 304 1041 294Q1039 284 1040 276Q1040 268 1043 260Q1045 252 1049 246Q1054 240 1063 233Q1072 226 1086 221Q1100 216 1118 213Q1136 209 1156 209Q1176 208 1194 209Q1212 211 1228 215Q1244 218 1258 224Q1272 230 1284 238Q1296 247 1305 257Q1313 268 1318 280Q1323 292 1324 306Q1325 320 1322 333Q1320 346 1315 359Q1309 372 1301 382Q1294 392 1283 399Q1272 406 1260 409L1248 413Z","M1224 392Q1188 393 1170 389Q1152 386 1136 379Q1121 372 1108 362Q1096 353 1087 340Q1078 328 1074 314Q1069 300 1070 288Q1071 276 1074 270Q1077 264 1080 259Q1084 254 1092 248Q1100 242 1112 237Q1124 233 1138 230Q1152 227 1166 227Q1180 226 1194 227Q1208 228 1222 232Q1236 235 1248 241Q1260 246 1269 253Q1278 260 1284 268Q1291 276 1294 286Q1298 296 1299 306Q1300 316 1297 328Q1295 340 1289 350Q1284 360 1276 368Q1268 375 1258 381Q1248 386 1236 389L1224 392Z","M1212 369Q1188 370 1174 367Q1160 364 1148 359Q1136 353 1128 347Q1119 340 1113 332Q1108 324 1105 314Q1102 304 1103 294Q1104 284 1110 276Q1116 268 1122 264Q1128 259 1137 256Q1146 252 1156 250Q1166 248 1177 248Q1188 247 1198 249Q1208 250 1218 253Q1228 256 1235 260Q1243 264 1249 269Q1256 275 1261 281Q1265 288 1268 296Q1270 304 1270 312Q1269 320 1267 326Q1266 332 1262 338Q1258 344 1251 350Q1245 356 1237 360Q1229 364 1221 366L1212 369Z","M1208 332Q1196 336 1190 336Q1184 336 1177 334Q1170 332 1165 329Q1160 326 1156 322Q1152 318 1150 313Q1148 308 1148 304Q1149 300 1151 296Q1153 292 1158 288Q1164 284 1172 282Q1180 279 1188 280Q1196 280 1205 284Q1214 288 1219 294Q1224 300 1225 306Q1226 312 1223 318Q1220 324 1214 328L1208 332Z"];
  const topo = cls => `<svg class="topo ${cls || ''}" viewBox="0 0 1600 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">${TOPO.map((d, i) => `<path d="${d}" pathLength="1" style="--k:${i % 14}"/>`).join('')}</svg>`;
  const splitWords = el => {
    if (!MO || !el || el.dataset.split) return; el.dataset.split = '1'; let i = 0;
    const walk = n => Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 1) return walk(c); if (c.nodeType !== 3) return;
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(t)); return; } const w = document.createElement('span'); w.className = 'w'; const x = document.createElement('span'); x.textContent = t; x.style.setProperty('--i', i++); w.appendChild(x); f.appendChild(w); });
      c.replaceWith(f);
    });
    walk(el);
  };
  const PX = new Set(); let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false; const y = window.scrollY, vh = window.innerHeight, H = document.documentElement.scrollHeight - vh, p = H > 0 ? Math.min(1, Math.max(0, y / H)) : 0;
      const nv = $('#nav'); if (nv) { nv.classList.toggle('scrolled', y > 8); nv.style.setProperty('--p', p.toFixed(4)); }
      const tt = $('#totop'); if (tt) { tt.classList.toggle('on', y > vh * 1.2); tt.style.setProperty('--p', p.toFixed(4)); }
      if (MO) PX.forEach(im => { const r = im.parentNode.getBoundingClientRect(); if (r.bottom < -120 || r.top > vh + 120) return; const k = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2))); im.style.setProperty('--py', (k * -6).toFixed(2) + '%'); });
    });
  }
  function parallax() {
    if (!MO) return;
    $$('figure.wide, figure.group, .phero').forEach(f => {
      if (f.querySelector('.px')) return; const fit = f.querySelector('.fit'); const im = fit ? fit.querySelector('img') : f.querySelector(':scope > img'); if (!im) return;
      if (fit) fit.classList.add('px'); else { const s = document.createElement('span'); s.className = 'px'; im.replaceWith(s); s.appendChild(im); }
      im.classList.add('pxi'); PX.add(im);
    });
    onScroll();
  }
  function toTop() {
    if ($('#totop')) return; const b = document.createElement('button'); b.id = 'totop'; b.className = 'totop'; b.type = 'button'; b.setAttribute('aria-label', L('Back to top', 'لأعلى الصفحة'));
    b.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22.5" pathLength="1"/></svg><span aria-hidden="true">↑</span>';
    b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: MO ? 'smooth' : 'auto' })); document.body.appendChild(b); onScroll();
  }
  function intro() { $$('.hero h1, .phead h1').forEach(splitWords); }
  const lazy = root => $$('img[data-src]', root || document).forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); im.onload = () => im.classList.add('ok'); if (im.complete && im.naturalWidth) im.classList.add('ok'); });

  /* ------------------------------------------------------------------ pieces */
  const tile = p => `<a class="card rv" href="${withLang('work.html?p=' + encodeURIComponent(p.id))}"><div class="ph">${imLazy(cover(p).src, `alt="${esc(p.title)}" loading="lazy"`)}<span class="pill">${esc(typeL(p.type) || L('Landscape', 'لاند سكيب'))}</span></div><div class="cap"><b>${esc(p.title)}</b><small>${esc([p.location, p.year].filter(Boolean).join(' · '))}</small><span class="go">${esc(T('view'))} ${arrow()}</span></div></a>`;
  const numbers = () => `<div class="nums">${OFFICE.stats.map(s => `<div class="num rv"><b><span data-count="${s[0]}">0</span><i>${s[1]}</i></b><span>${esc(L(s[2], s[3]))}</span></div>`).join('')}</div>`;
  function countUp() {
    const fin = el => { const n = el.closest('.num'); if (n) n.classList.add('go', 'fin'); };
    if (!MO || !('IntersectionObserver' in window)) { $$('[data-count]').forEach(el => { el.textContent = el.dataset.count; fin(el); }); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); const el = e.target, to = +el.dataset.count, t0 = performance.now(); const n = el.closest('.num'); if (n) n.classList.add('go'); const tick = t => { const k = Math.min(1, (t - t0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = v; if (k < 1) requestAnimationFrame(tick); else fin(el); }; requestAnimationFrame(tick); }), { rootMargin: '0px 0px -8% 0px' }); $$('[data-count]').forEach(el => io.observe(el)); }
  const partnersMarquee = () => { const few = OFFICE.partners.length < 8; const row = OFFICE.partners.map(k => `<span class="lg">${im(pic(k, 'partners', 'png'), 'alt="" loading="lazy"')}</span>`).join(''); return `<div class="marq ${few ? 'static wrap' : ''}" aria-label="${esc(T('partners'))}"><div class="tr">${row}${few ? '' : row}</div></div>`; };
  const collabMarquee = () => { const few = OFFICE.collab.length < 7; const row = OFFICE.collab.map(c => `<span class="lgi" title="${esc(c[1])} — ${esc(L(c[2], c[3]))}"><span class="lg wide">${im(pic(c[0], 'collab', 'png'), `alt="${esc(c[1])}" loading="lazy"`)}</span><small>${esc(c[1])}</small></span>`).join(''); return `<div class="marq slow ${few ? 'static wrap' : ''}"><div class="tr">${row}${few ? '' : row}</div></div>`; };
  const teamStrip = () => { const ks = OFFICE.team.slice(); if (!ks.length) return ''; if (ks.length < 12) { return `<div class="wrap"><div class="marq static wrap"><div class="tr">${ks.map(k => `<span class="pp">${im(pic(k, 'team', 'jpg'), 'alt="" loading="lazy"')}</span>`).join('')}</div></div></div>`; } const half = Math.ceil(ks.length / 2); const row = xs => xs.map(k => `<span class="pp">${im(pic(k, 'team', 'jpg'), 'alt="" loading="lazy"')}</span>`).join(''); const a = row(ks.slice(0, half)), b = row(ks.slice(half)); return `<div class="tstrip"><div class="marq people"><div class="tr">${a}${a}</div></div><div class="marq people rev"><div class="tr">${b}${b}</div></div></div>`; };
  const awardCards = n => `<div class="g3">${OFFICE.awards.slice(0, n || 99).map(a => `<div class="awc rv">${im(pic(a[0], 'awards', 'png'), 'alt=""')}<span class="y">${a[1]}</span><b>${esc(L(a[2], a[3]))}</b><small>${esc(L(a[4], a[5]))}</small></div>`).join('')}</div>`;
  const collabGrid = () => `<div class="g3 collab">${OFFICE.collab.map(c => `<div class="cc rv">${im(pic(c[0], 'collab', 'png'), `alt="${esc(c[1])}"`)}<div><b>${esc(c[1])}</b><small>${esc(L(c[2], c[3]))}</small></div></div>`).join('')}</div>`;
  const specGrid = () => `<div class="g4 spec">${OFFICE.specialisms.map(s => `<div class="sc rv"><span class="ico">${ic(s[0])}</span><b>${esc(L(s[1], s[2]))}</b><small>${esc(L(s[3], s[4]))}</small></div>`).join('')}</div>`;
  const stepsGrid = () => `<div class="steps">${OFFICE.steps.map((s, i) => `<div class="step rv"><span class="n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(L(s[0], s[1]))}</b><p>${esc(L(s[2], s[3]))}</p><small>${esc(s[4])}</small></div></div>`).join('')}</div>`;
  const sectorsRow = () => `<div class="chips">${Object.keys(TYPES).map(k => `<span class="rv">${esc(typeL(k))}</span>`).join('')}</div>`;
  const sechead = (eye, h, sub, more, href) => `<div class="sechead ln"><div><div class="eyebrow rv">${esc(eye)}</div><h2 class="rv">${esc(h)}</h2>${sub ? `<p class="sub rv">${esc(sub)}</p>` : ''}</div>${more ? `<a class="btn ghost rv" href="${withLang(href)}">${esc(more)} ${arrow()}</a>` : ''}</div>`;
  const pagehead = (eye, h, sub) => `<section class="phead ln">${topo('ph')}<div class="wrap"><div class="eyebrow">${esc(eye)}</div><h1>${esc(h)}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div></section>`;

  /* ------------------------------------------------------------------ pages */
  const PAGES = {
    async home(main) {
      const FEAT = PROJECTS.filter(p => p.featured).sort((a, b) => (a.featOrder || 999) - (b.featOrder || 999)); const SEL = (FEAT.length ? FEAT : PROJECTS).slice(0, 8); const heroP = PROJECTS.find(p => p.hero) || SEL[0] || FALLBACK[0];
      main.innerHTML = `<section class="hero ln">${topo('hr')}<div class="wrap"><div class="txt"><div class="eyebrow">${esc(L('Landscape architecture · Cairo, Egypt', 'عمارة اللاند سكيب · القاهرة'))}</div><h1>${esc(OFFICE.hero ? L(OFFICE.hero[0], OFFICE.hero[1]) : L('Landscape architecture for resorts, residences and public places.', 'عمارة لاند سكيب للمنتجعات والمجمعات السكنية والأماكن العامة.'))}</h1><p>${esc(OFFICE.heroSub ? L(OFFICE.heroSub[0], OFFICE.heroSub[1]) : L('Ökoplan Landscaping stands as an award-winning, pioneering consultancy firm that has been reshaping the landscape architecture scene in Egypt for nearly three decades.', 'مكتب استشاري حائز على جوايز بتلاتين سنة من الشغل المنفّذ في مصر — فريق واحد من أول مشية في الأرض لحد الإشراف في الموقع.'))}</p><div class="btns"><a class="btn" href="${withLang('work.html')}">${esc(L('Our work', 'شغلنا'))} <span aria-hidden="true">${arrow()}</span></a><a class="btn ghost" href="${withLang('services.html')}">${esc(L('Our services', 'خدماتنا'))}</a></div></div>
        <figure class="img ${OFFICE.heroVideo ? 'video' : OFFICE.heroImg && !(fitOf(OFFICE.heroImg) && fitOf(OFFICE.heroImg).m !== 'contain') ? 'own' : ''}"><span class="hm">${OFFICE.heroVideo ? `<video src="${esc(OFFICE.heroVideo)}" ${OFFICE.heroImg ? `poster="${esc(OFFICE.heroImg)}"` : ''} autoplay muted loop playsinline preload="auto" aria-label="Ökoplan Landscaping"></video>` : im(OFFICE.heroImg || cover(heroP).full || cover(heroP).src, `alt="${esc(OFFICE.heroImg ? 'Ökoplan Landscaping' : heroP.title)}" fetchpriority="high"`)}</span>${OFFICE.heroImg || OFFICE.heroVideo ? '' : `<figcaption>${esc(heroP.title)}${heroP.location ? ' — ' + esc(heroP.location) : ''}</figcaption>`}</figure></div></section>
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
        <div class="filters rv" id="filters"><div class="frow"><span class="flbl">${esc(L('Sector', 'القطاع'))}</span><button class="on" data-f="">${esc(T('all'))}</button>${types.map(t => `<button data-f="t:${esc(t)}">${esc(typeL(t))}</button>`).join('')}</div>${locs.length > 1 ? `<div class="frow"><span class="flbl">${esc(L('City', 'المدينة'))}</span>${locs.map(l => `<button data-f="l:${esc(l)}">${esc(l)}</button>`).join('')}</div>` : ''}<div class="frow fsearch"><input type="search" id="psearch" placeholder="${esc(L('Search a project, client or city…', 'ابحث باسم المشروع أو العميل أو المدينة…'))}" autocomplete="off"><span class="count" id="count"></span></div></div>
        <div class="g3" id="grid"></div><div class="more" id="more"></div></div></section>`;
      const grid = $('#grid'); const PAGE = 24; let cur = '', page = 1, q = '';
      const norm = s => String(s || '').toLowerCase().replace(/[ً-ْ]/g, '').replace(/[-–—_.,']/g, ' ').replace(/\s+/g, ' ').trim();
      const top = () => window.scrollTo({ top: $('#filters').offsetTop - 120, behavior: 'smooth' });
      const draw = (scroll) => {
        const f = cur; const qq = norm(q);
        const xs = PROJECTS.filter(x => (!f || (f.startsWith('t:') ? x.type === f.slice(2) : (x.location || '').startsWith(f.slice(2)))) && (!qq || norm(`${x.title} ${x.client} ${x.location} ${typeL(x.type)}`).includes(qq)));
        const pages = Math.max(1, Math.ceil(xs.length / PAGE)); page = Math.min(Math.max(1, page), pages); const from = (page - 1) * PAGE;
        grid.innerHTML = xs.slice(from, from + PAGE).map(tile).join('') || `<div class="empty">${esc(L('No projects match.', 'مفيش مشاريع مطابقة.'))}</div>`;
        $('#count').textContent = xs.length ? L(`${from + 1}–${Math.min(from + PAGE, xs.length)} of ${xs.length} projects`, `${from + 1}–${Math.min(from + PAGE, xs.length)} من ${xs.length} مشروع`) : '';
        const nums = []; for (let i = 1; i <= pages; i++) { if (pages <= 7 || i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i); else if (nums[nums.length - 1] !== '…') nums.push('…'); }
        $('#more').innerHTML = pages > 1 ? `<nav class="pager" aria-label="Pages"><button class="pg prev" data-p="${page - 1}" ${page === 1 ? 'disabled' : ''} aria-label="Previous">${ar() ? '→' : '←'}</button>${nums.map(n => n === '…' ? '<span class="dots">…</span>' : `<button class="pg ${n === page ? 'on' : ''}" data-p="${n}" ${n === page ? 'aria-current="page"' : ''}>${n}</button>`).join('')}<button class="pg next" data-p="${page + 1}" ${page === pages ? 'disabled' : ''} aria-label="Next">${ar() ? '←' : '→'}</button></nav>` : '';
        $$('#more .pg').forEach(b => b.addEventListener('click', () => { page = +b.dataset.p; draw(true); }));
        if (scroll) top(); lazy(grid); reveal();
      };
      draw(); $('#psearch').addEventListener('input', e => { q = e.target.value; page = 1; draw(); }); $('#filters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#filters button').forEach(x => x.classList.toggle('on', x === b)); cur = b.dataset.f; page = 1; draw(true); });
      main.appendChild(band());
    },
    async project(main, p) {
      document.title = `${p.title} — Ökoplan Landscaping`;
      const i = PROJECTS.indexOf(p); const nx = PROJECTS[(i + 1) % PROJECTS.length]; const pv = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]; const c = cover(p); const st = story(p);
      const parts = (st[0] || '').replace(/\s*Services:[^.]*\.\s*/g, ' ').replace(/\s*Scope of work:[^.]*\.?\s*/gi, ' ').replace(/\s+/g, ' ').trim().split(/(?<=[.؟!])\s+/).filter(Boolean); const first = parts[0] || L('A landscape designed to be lived in.', 'لاند سكيب متصمم يتعاش.'); const rest = [parts.slice(1).join(' ')].concat(st.slice(1)).filter(Boolean); if (!rest.length) rest.push(L(`${typeL(p.type) || 'Landscape'} project${p.client ? ' for ' + p.client : ''}${p.location ? ' in ' + p.location : ''}${p.year ? ', ' + p.year : ''}. Landscape architecture by Ökoplan Landscaping — our scope on the project is listed below.`, `${typeL(p.type) || 'لاند سكيب'}${p.client ? ' لصالح ' + p.client : ''}${p.location ? ' في ' + p.location : ''}${p.year ? '، ' + p.year : ''}. تصميم اللاند سكيب من أوكوبلان — نطاق شغلنا تحت.`));
      main.innerHTML = `<section class="phead project ln">${topo('ph')}<div class="wrap"><a class="crumb" href="${withLang('work.html')}">${esc(L('Work', 'المشاريع'))}</a><div class="eyebrow">${esc(typeL(p.type) || L('Landscape', 'لاند سكيب'))}</div><h1>${esc(p.title)}</h1><p class="sub">${esc([p.client, p.location].filter(Boolean).join(' · '))}</p></div></section>
      <section class="wrap"><figure class="phero rv wipe">${im(c.full || c.src, `alt="${esc(p.title)}" data-i="0"`)}</figure>
        <div class="facts rv"><div><small>${esc(T('client'))}</small><b>${esc(p.client || '—')}</b></div><div><small>${esc(T('location'))}</small><b>${esc(p.location || '—')}</b></div><div><small>${esc(T('year'))}</small><b>${esc(p.year || '—')}</b></div><div><small>${esc(T('sector'))}</small><b>${esc(typeL(p.type) || '—')}</b></div>${p.area ? `<div><small>${esc(L('Area', 'المساحة'))}</small><b>${esc(p.area)}</b></div>` : ''}</div>
        <div class="story"><div class="rv"><div class="eyebrow">${esc(L('About the project', 'عن المشروع'))}</div><h2>${esc(first)}</h2></div><div class="rv">${rest.map(s => `<p>${esc(s)}</p>`).join('')}${p.services && p.services.length ? `<div class="eyebrow" style="margin-top:28px">${esc(T('scope'))}</div><div class="chips sm">${p.services.map(s => `<span>${esc(svcL(s))}</span>`).join('')}</div>` : ''}${p.behance ? `<p style="margin-top:20px"><a class="btn ghost" href="${esc(p.behance)}" target="_blank" rel="noopener">Behance ${arrow()}</a></p>` : ''}</div></div>
        ${p.shots.length > 1 ? `<div class="eyebrow rv">${esc(T('gallery'))}</div><div class="shots">${p.shots.slice(1).map((s, k) => `<figure class="rv wipe" data-i="${k + 1}">${imLazy(s.src, `alt="${esc(p.title)} — ${k + 2}" loading="lazy"`)}</figure>`).join('')}</div>` : ''}
        <div class="pn"><a href="${withLang('work.html?p=' + encodeURIComponent(pv.id))}"><small>${esc(L('Previous', 'السابق'))}</small><b>${esc(pv.title)}</b></a><a class="mid" href="${withLang('work.html')}">${esc(T('backWork'))}</a><a class="r" href="${withLang('work.html?p=' + encodeURIComponent(nx.id))}"><small>${esc(T('next'))}</small><b>${esc(nx.title)}</b></a></div></section>
      <div class="lb" id="lb" role="dialog" aria-modal="true"><button class="x" id="lbx">✕</button><button class="p" id="lbp">${ar() ? '→' : '←'}</button><button class="n" id="lbn">${ar() ? '←' : '→'}</button><img id="lbi" alt=""><div class="c" id="lbc"></div></div>`;
      let cur = 0; const lb = $('#lb'); const show = k => { cur = (k + p.shots.length) % p.shots.length; const li = $('#lbi'); li.classList.remove('sw'); void li.offsetWidth; li.classList.add('sw'); li.src = p.shots[cur].full || p.shots[cur].src; $('#lbc').textContent = `${p.title} · ${cur + 1} / ${p.shots.length}`; lb.classList.add('on'); document.body.style.overflow = 'hidden'; };
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
      <section class="wrap"><figure class="wide rv wipe">${im(cover(h).full || cover(h).src, `alt="${esc(h.title)}"`)}<figcaption>${esc(h.title)}${h.location && !h.title.includes(h.location.split(',')[0]) ? ' — ' + esc(h.location) : ''}</figcaption></figure></section>
      <section class="sec"><div class="wrap">${sechead(T('how'), L('Seven stages, one responsibility', 'سبع مراحل ومسؤولية واحدة'), L('Our focus goes beyond aesthetics; it extends to sustainability and better quality of life for both the present and future generations. We aim to create outdoor spaces that are both beautiful and functional, delivering on our promise of exceptional design.', 'Our focus goes beyond aesthetics; it extends to sustainability and better quality of life for both the present and future generations. We aim to create outdoor spaces that are both beautiful and functional, delivering on our promise of exceptional design.'))}${stepsGrid()}</div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('special'), L('The disciplines inside every project', 'التخصصات جوه كل مشروع'))}${specGrid()}</div></section>
      <section class="sec"><div class="wrap">${sechead(T('sectors'), L('Where we work', 'القطاعات'), L('Resorts and hotels first — and well beyond.', 'المنتجعات والفنادق أولاً — وأبعد منها بكتير.'))}${sectorsRow()}</div></section>`;
      main.appendChild(band());
    },
    async studio(main) {
      const h = PROJECTS.find(x => x.id === 'ok-xanadu') || PROJECTS[2] || FALLBACK[2];
      main.innerHTML = pagehead(L('The studio', 'المكتب'), L('Nearly thirty years of outdoor life in Egypt', 'قرابة تلاتين سنة من الحياة في الهواء الطلق في مصر'), L(OFFICE.about[0], OFFICE.about[1])) + `
      <section class="wrap"><figure class="wide rv wipe">${im(cover(h).full || cover(h).src, `alt="${esc(h.title)}"`)}<figcaption>${esc(h.title)}${h.location && !h.title.includes(h.location.split(',')[0]) ? ' — ' + esc(h.location) : ''}</figcaption></figure></section>
      <section class="numband"><div class="wrap">${numbers()}</div></section>
      <section class="sec"><div class="wrap"><div class="g3 vm"><div class="vmc rv"><div class="eyebrow">${esc(L('Vision', 'رؤيتنا'))}</div><p>${esc(L(OFFICE.vision[0], OFFICE.vision[1]))}</p></div><div class="vmc rv"><div class="eyebrow">${esc(L('Mission', 'مهمتنا'))}</div><p>${esc(L(OFFICE.mission[0], OFFICE.mission[1]))}</p></div><div class="vmc rv"><div class="eyebrow">${esc(L('Values', 'قيمنا'))}</div><div class="chips sm">${OFFICE.values.map(v => `<span>${esc(L(v[0], v[1]))}</span>`).join('')}</div><p style="margin-top:14px;font-size:14.5px">${esc('At Ökoplan Landscaping, our core values form the very foundation of our work and our identity. These values, which are deeply ingrained in our organizational culture, guide our every decision and action. They are the pillars upon which we build our reputation and successful projects; our impact extends not only across Egypt but also reaches distant corners of the globe.')}</p></div></div></div></section>
      <section class="sec alt"><div class="wrap">${sechead(T('leadership'), L('Dr. Tarek Sobhy', 'د. طارق صبحي'))}<div class="lead2"><div class="ph rv wipe"><img src="${SRC}brand/tarek.jpg" alt="Dr. Tarek Sobhy"></div><div class="rv"><p class="big">${esc(OFFICE.leader ? L(OFFICE.leader[0], OFFICE.leader[1]) : L('Founder and principal. In 2019 he received the first Lifetime Achievement Award given by Landscape Middle East — a recognition of three decades shaping the discipline in Egypt and the region.', 'المؤسس ورئيس المكتب. سنة 2019 استلم أول جايزة إنجاز مدى الحياة بتمنحها Landscape Middle East — تقدير لتلاتين سنة من تشكيل المهنة في مصر والمنطقة.'))}</p><p>${esc(OFFICE.leader2 ? L(OFFICE.leader2[0], OFFICE.leader2[1]) : L('He leads every project personally from the first site walk, with a studio of 90+ landscape architects, engineers and site supervisors behind him.', 'بيقود كل مشروع بنفسه من أول مشية في الأرض، ووراه مكتب فيه أكتر من تسعين مهندس لاند سكيب ومهندس ومشرف موقع.'))}</p><div class="name"><img src="${SRC}brand/sig.png" alt=""><div><b>Dr. Tarek Sobhy</b><small>${esc(L('Founder & Principal', 'المؤسس ورئيس المكتب'))}</small></div></div></div></div></div></section>
      <section class="sec"><div class="wrap">${sechead(T('team'), L('One team, 90+ people', 'فريق واحد — أكتر من 90 شخص'), L('In our diverse team, innovation and collaboration are our driving forces. Together, we turn ideas into extraordinary realities, fueled by our shared commitment to excellence.', 'In our diverse team, innovation and collaboration are our driving forces. Together, we turn ideas into extraordinary realities, fueled by our shared commitment to excellence.'))}<div class="teamlist rv"><span class="eyebrow" style="margin:0">Our team includes</span><span class="chip">Landscape Architects</span><span class="chip">Agriculture Engineers</span><span class="chip">Irrigation Engineers</span><span class="chip">Site Engineers</span></div><figure class="group rv wipe"><img src="${SRC}brand/team-group.jpg" alt="The Ökoplan Landscaping team"></figure></div>
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
    if (!main.querySelector('.boot')) main.insertAdjacentHTML('afterbegin', '<div class="boot" aria-hidden="true"><i></i></div>');
    await loadProjects();
    await PAGES[page](main);
    intro(); footer(); toTop(); lazy(); reveal(); parallax(); if ($('[data-count]')) countUp();
    const tt = { home: ['Ökoplan Landscaping — Landscape architecture, Cairo', 'أوكوبلان لتنسيق المواقع — عمارة اللاند سكيب، القاهرة'], work: ['Projects — Ökoplan Landscaping', 'المشاريع — أوكوبلان'], services: ['Services — Ökoplan Landscaping', 'الخدمات — أوكوبلان'], studio: ['The studio — Ökoplan Landscaping', 'المكتب — أوكوبلان'], contact: ['Contact — Ökoplan Landscaping', 'تواصل معانا — أوكوبلان'] };
    if (!qs.get('p') && tt[page] && ar()) document.title = tt[page][1];
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
