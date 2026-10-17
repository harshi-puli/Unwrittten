import cors from 'cors';
import dns from 'node:dns/promises';
import express from 'express';
import net from 'node:net';
import * as cheerio from 'cheerio';

const app = express();
const port = Number(process.env.IMPORT_API_PORT || 8787);
const allowedOrigin = process.env.WEB_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '20kb' }));

const privateIpv4 = address => {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4) return false;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168);
};

const privateIp = address => {
  if (net.isIPv4(address)) return privateIpv4(address);
  if (!net.isIPv6(address)) return true;
  const normalized = address.toLowerCase();
  return normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80:') || normalized.startsWith('::ffff:127.') || normalized.startsWith('::ffff:10.') || normalized.startsWith('::ffff:192.168.');
};

async function validatePublicUrl(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { throw new Error('Enter a valid public web address.'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only public http or https pages are supported.');
  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) throw new Error('Local and private network pages are not supported.');
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(item => privateIp(item.address))) throw new Error('This address resolves to a private or unsupported network.');
  return url;
}

async function fetchPublicHtml(initialUrl) {
  let current = await validatePublicUrl(initialUrl);
  for (let redirectCount = 0; redirectCount < 4; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let response;
    try {
      response = await fetch(current, { redirect: 'manual', signal: controller.signal, headers: { 'User-Agent': 'UnwrittenHackathonImporter/1.1 (+public admissions page importer)', Accept: 'text/html,application/xhtml+xml' } });
    } finally { clearTimeout(timeout); }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('The page redirected without a usable destination.');
      current = await validatePublicUrl(new URL(location, current).toString());
      continue;
    }
    if (!response.ok) throw new Error(`The public page could not be read (HTTP ${response.status}).`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) throw new Error('The link is not a public HTML page.');
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 1_500_000) throw new Error('The page is too large for this prototype importer.');
    return { html: (await response.text()).slice(0, 1_500_000), finalUrl: current.toString() };
  }
  throw new Error('The page redirected too many times.');
}

const requirementPatterns = [
  { title: 'Letters of recommendation', pattern: /recommendation|recommender|reference letter/i, explanation: 'Ask the required number of eligible people to submit letters supporting the application.', hiddenExpectations: ['Confirm who qualifies as a recommender.', 'Ask early and provide the deadline, opportunity, and useful context.', 'Check whether letters must be submitted directly by the recommender.'], tasks: ['Confirm the recommendation rules', 'Identify potential recommenders', 'Prepare context for each person', 'Send personalized requests', 'Track submission'] },
  { title: 'Personal statement or application essay', pattern: /personal statement|statement of purpose|application essay|essay prompt/i, explanation: 'Write an essay that helps reviewers understand your experiences, goals, and preparation.', hiddenExpectations: ['Answer the exact prompt rather than only listing achievements.', 'Use a specific example and explain what you learned.', 'Verify the official word or character limit.'], tasks: ['Confirm the prompt and length', 'Choose one focused experience', 'Create an outline', 'Write a first draft', 'Revise and proofread'] },
  { title: 'Supplemental essay', pattern: /supplemental essay|supplementary essay|short answer response/i, explanation: 'Complete an additional response written specifically for this institution or opportunity.', hiddenExpectations: ['Do not simply reuse a general personal statement.', 'Connect the response to the question and your own goals.', 'Check whether multiple short responses are required.'], tasks: ['Copy the exact prompt', 'Confirm the word limit', 'Brainstorm relevant examples', 'Draft the response', 'Review before submitting'] },
  { title: 'Academic transcript', pattern: /official transcript|academic transcript|school transcript/i, explanation: 'Arrange for the institution to receive an official record of your courses and grades.', hiddenExpectations: ['A document uploaded by the student may not count as official.', 'A counselor or registrar may need to send it directly.', 'Processing may take several school days.'], tasks: ['Ask how official transcripts are requested', 'Submit the school request', 'Confirm receipt'] },
  { title: 'Financial aid materials', pattern: /financial aid|fafsa|css profile|financial information/i, explanation: 'Review and complete the official forms required to be considered for financial assistance.', hiddenExpectations: ['Financial-aid deadlines may differ from the application deadline.', 'Household documents may be required.', 'Use official sources and never assume eligibility rules.'], tasks: ['Open the official financial-aid instructions', 'List required forms and documents', 'Gather missing information', 'Submit each required form', 'Confirm receipt'] },
  { title: 'Application fee or fee waiver', pattern: /application fee|fee waiver/i, explanation: 'Pay the listed application fee or follow the official process for requesting a fee waiver.', hiddenExpectations: ['Fee-waiver rules differ by institution.', 'A counselor or official form may be required.', 'Never invent eligibility or assume a waiver is automatic.'], tasks: ['Review the official fee instructions', 'Check verified fee-waiver options', 'Gather required confirmation', 'Complete the official process'] },
  { title: 'Test scores', pattern: /\b(?:sat|act)\b|test score|standardized test/i, explanation: 'Review whether test scores are required, optional, or accepted for this application.', hiddenExpectations: ['Testing policies can change by cycle and program.', 'Official score reports may differ from self-reported scores.', 'Verify the policy on the official page.'], tasks: ['Confirm the current official testing policy', 'Decide whether to submit scores', 'Send or self-report scores as instructed'] },
  { title: 'Portfolio or work sample', pattern: /portfolio|work sample|writing sample|audition/i, explanation: 'Prepare examples of your work in the format requested by the program.', hiddenExpectations: ['Selection and presentation matter, not only quantity.', 'File formats and upload limits may be strict.', 'Some programs expect context explaining each sample.'], tasks: ['Confirm format and quantity', 'Choose representative work', 'Prepare descriptions', 'Check files and submit'] },
];

const institutionByDomain = [
  [/stanford\.edu$/, 'Stanford University'],
  [/ucla\.edu$/, 'UCLA'],
  [/berkeley\.edu$/, 'UC Berkeley'],
  [/harvard\.edu$/, 'Harvard University'],
  [/mit\.edu$/, 'MIT'],
];

function cleanText(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }

function institutionName($, finalUrl) {
  const host = new URL(finalUrl).hostname.replace(/^www\./, '').toLowerCase();
  const known = institutionByDomain.find(([pattern]) => pattern.test(host));
  if (known) return known[1];
  const siteName = cleanText($('meta[property="og:site_name"]').attr('content'));
  if (siteName && siteName.length > 3 && siteName.length < 90 && !/admission|apply|first-year|undergraduate/i.test(siteName)) return siteName;
  const candidates = [cleanText($('header [class*="logo"]').first().text()), cleanText($('title').first().text().split(/[|–—]/)[0])].filter(value => value.length > 3 && value.length < 90 && !/^(first|apply|admission|undergraduate|requirements)$/i.test(value));
  if (candidates[0]) return candidates[0];
  return host.split('.')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

function contentBlocks($) {
  const root = $('main').length ? $('main').first() : $('article').length ? $('article').first() : $('body');
  return root.find('h1,h2,h3,h4,h5,p,li,dt,dd,time').map((_, element) => ({ tag: element.tagName?.toLowerCase(), text: cleanText($(element).text()) })).get().filter(item => item.text.length >= 5 && item.text.length <= 1200);
}

function deadlineCandidates(blocks) {
  const monthDate = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+(\d{1,2})(?:,?\s+(20\d{2}))?\b/gi;
  const results = [];
  for (const block of blocks) {
    if (!/deadline|due date|applications? (?:are )?due|apply by|submission deadline/i.test(block.text)) continue;
    if (/webinar|event|register|campus tour|information session|office hour/i.test(block.text)) continue;
    for (const match of block.text.matchAll(monthDate)) {
      const year = Number(match[3] || new Date().getFullYear());
      let parsed = new Date(`${match[1]} ${match[2]}, ${year} 12:00:00`);
      if (!match[3] && parsed < new Date(Date.now() - 30 * 86400000)) parsed = new Date(`${match[1]} ${match[2]}, ${year + 1} 12:00:00`);
      if (Number.isNaN(parsed.getTime())) continue;
      let score = 1;
      if (/application deadline|applications? (?:are )?due/i.test(block.text)) score += 4;
      if (/deadline/i.test(block.text)) score += 2;
      if (/apply by|due date/i.test(block.text)) score += 2;
      if (/first-year|undergraduate|transfer|admission/i.test(block.text)) score += 1;
      results.push({ date: parsed.toISOString().slice(0, 10), excerpt: block.text.slice(0, 260), score });
    }
  }
  const deduped = [...new Map(results.sort((a, b) => b.score - a.score).map(item => [`${item.date}-${item.excerpt}`, item])).values()];
  return deduped.slice(0, 6);
}

function extractRequirements(blocks) {
  const directive = /required|requirement|must|submit|provide|upload|send|complete|include|application materials|application checklist/i;
  const negative = /not required|no longer required|optional|if you choose|may submit|not necessary/i;
  const results = [];

  for (const definition of requirementPatterns) {
    const matches = blocks.filter(block => definition.pattern.test(block.text));
    let best = null;
    for (const block of matches) {
      let score = 0;
      if (directive.test(block.text)) score += 4;
      if (['h2', 'h3', 'h4', 'li'].includes(block.tag)) score += 2;
      if (/application|admission|materials|checklist|first-year|transfer/i.test(block.text)) score += 1;
      if (negative.test(block.text)) score -= 5;
      if (!best || score > best.score) best = { block, score };
    }
    if (!best || best.score < 2) continue;
    results.push({
      ...definition,
      id: `imported-${results.length}-${Date.now()}`,
      originalInstruction: best.block.text.slice(0, 500),
      sourceExcerpt: best.block.text.slice(0, 280),
      confidence: best.score >= 5 ? 'High' : 'Medium',
      suggestedDueOffset: 7 + results.length * 4,
    });
  }
  return results;
}

app.get('/api/health', (_request, response) => response.json({ ok: true }));

app.post('/api/import-url', async (request, response) => {
  try {
    const rawUrl = String(request.body?.url || '').trim();
    if (!rawUrl) return response.status(400).json({ error: 'Paste a public application page URL.' });
    const { html, finalUrl } = await fetchPublicHtml(rawUrl);
    const $ = cheerio.load(html);
    $('script,style,noscript,svg,canvas,iframe,nav,footer').remove();
    const blocks = contentBlocks($);
    if (blocks.map(item => item.text).join(' ').length < 120) throw new Error('The page did not expose enough public text to analyze. It may require a login or JavaScript rendering.');

    const candidates = deadlineCandidates(blocks);
    const requirements = extractRequirements(blocks);
    const automaticDeadline = candidates.length === 1 && candidates[0].score >= 5 ? candidates[0].date : null;

    response.json({
      institutionName: institutionName($, finalUrl),
      pageTitle: cleanText($('meta[property="og:title"]').attr('content')) || cleanText($('h1').first().text()) || cleanText($('title').first().text()),
      sourceUrl: finalUrl,
      deadline: automaticDeadline,
      deadlineCandidates: candidates,
      requirements: requirements.length ? requirements : [{ id: `imported-review-${Date.now()}`, title: 'Review the official application instructions', originalInstruction: 'No high-confidence requirement sections were detected automatically.', sourceExcerpt: 'No high-confidence requirement sections were detected automatically.', confidence: 'Low', explanation: 'The importer found a public page but could not reliably classify its requirements.', hiddenExpectations: ['Review the official page carefully.', 'Confirm the exact materials, deadlines, eligibility, and submission method.', 'Copy specific instructions into the Unwritten Go agent for decoding.'], tasks: ['Read the official instructions', 'Copy each confirmed requirement into Unwritten', 'Confirm the official deadline'], suggestedDueOffset: 5 }],
      note: 'Only high-confidence page sections are selected automatically. Review source excerpts and uncheck anything that is not an actual requirement.',
    });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'The public page took too long to respond.' : error.message;
    response.status(400).json({ error: message || 'The public page could not be imported.' });
  }
});

app.listen(port, () => console.log(`Unwritten import API listening on http://localhost:${port}`));
