/* =========================================================
   KENTECH Career Lab — app.js
   Features: dark mode, hamburger, Claude API interview
   question generator, Claude API career recommender
   ========================================================= */

// ── Dark mode ──────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const savedDark = localStorage.getItem('kcl-dark') === 'true';
if (savedDark) document.body.classList.add('dark');
if (darkToggle) {
  darkToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('kcl-dark', isDark);
    darkToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// ── Hamburger ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Utility: call Claude API ───────────────────────────────
async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) throw new Error('API request failed: ' + response.status);
  const data = await response.json();
  const raw = data.content.map(b => b.text || '').join('');
  // Strip markdown fences if present
  return raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
}

// ── Loading helpers ────────────────────────────────────────
function showLoading(messages) {
  const box = document.getElementById('loadingBox');
  const txt = document.getElementById('loadingText');
  if (!box) return;
  box.classList.add('visible');
  document.getElementById('resultBox')?.classList.remove('visible');
  let i = 0;
  txt.textContent = messages[0];
  const interval = setInterval(() => {
    i = (i + 1) % messages.length;
    txt.textContent = messages[i];
  }, 1800);
  return interval;
}

function hideLoading(interval) {
  const box = document.getElementById('loadingBox');
  if (box) box.classList.remove('visible');
  clearInterval(interval);
}

function showResult() {
  document.getElementById('resultBox')?.classList.add('visible');
  document.getElementById('resultBox')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════════════════
//  INTERVIEW PAGE
// ══════════════════════════════════════════════════════════
const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {

  async function generateQuestions() {
    const jobField      = document.getElementById('jobField').value;
    const company       = document.getElementById('company').value;
    const interviewType = document.getElementById('interviewType').value;
    const count         = document.getElementById('questionCount').value;
    const extra         = document.getElementById('extraInfo').value.trim();

    if (!jobField) {
      alert('에너지 직무 분야를 선택해주세요.');
      return;
    }
    if (!company) {
      alert('지원 기관을 선택해주세요.');
      return;
    }

    const interval = showLoading([
      'AI가 면접 질문을 생성하는 중...',
      '에너지 직무 데이터베이스 분석 중...',
      '맞춤 질문 구성 중...',
    ]);

    const systemPrompt = `You are an expert Korean career counselor specializing in the energy sector. 
You generate realistic interview questions for Korean energy companies, research institutes, and graduate schools.
Always respond with ONLY a valid JSON array, no markdown, no preamble.
Each element: { "question": "질문 내용", "type": "기술면접|인성면접|연구면접", "hint": "답변 포인트 한 줄" }`;

    const userPrompt = `다음 조건으로 면접 질문 ${count}개를 생성해주세요:
- 직무: ${jobField}
- 지원 기관: ${company}
- 면접 유형: ${interviewType}
${extra ? `- 추가 정보: ${extra}` : ''}

JSON 배열만 반환하세요. 한국어로 작성하세요.`;

    try {
      const raw = await callClaude(systemPrompt, userPrompt);
      const questions = JSON.parse(raw);
      renderQuestions(questions, jobField, company);
      hideLoading(interval);
      showResult();
    } catch (err) {
      hideLoading(interval);
      alert('질문 생성 중 오류가 발생했습니다. 다시 시도해주세요.\n' + err.message);
    }
  }

  function renderQuestions(questions, jobField, company) {
    const list = document.getElementById('questionList');
    list.innerHTML = questions.map((q, i) => `
      <div class="question-item">
        <div class="question-num">Q${i + 1} · ${q.type || '면접 질문'}</div>
        <div class="question-text">${escapeHtml(q.question)}</div>
        ${q.hint ? `<div class="question-hint">💡 ${escapeHtml(q.hint)}</div>` : ''}
      </div>
    `).join('');

    // Update result title
    document.querySelector('#resultBox h2').textContent =
      `📝 ${company} ${jobField} 면접 질문 (${questions.length}개)`;
  }

  generateBtn.addEventListener('click', generateQuestions);

  // Regenerate
  document.getElementById('regenerateBtn')?.addEventListener('click', generateQuestions);

  // Copy all
  document.getElementById('copyBtn')?.addEventListener('click', () => {
    const items = document.querySelectorAll('.question-item');
    const text = [...items].map((el, i) => {
      const q = el.querySelector('.question-text')?.textContent || '';
      const h = el.querySelector('.question-hint')?.textContent || '';
      return `Q${i + 1}. ${q}\n${h ? '💡 ' + h : ''}`;
    }).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.textContent = '✅ 복사 완료!';
      setTimeout(() => { btn.textContent = '📋 전체 복사'; }, 2000);
    });
  });
}

// ══════════════════════════════════════════════════════════
//  CAREER PAGE
// ══════════════════════════════════════════════════════════
const recommendBtn = document.getElementById('recommendBtn');
if (recommendBtn) {

  async function recommendCareers() {
    const interest    = document.getElementById('interest').value;
    const grade       = document.getElementById('grade').value;
    const workStyle   = document.getElementById('workStyle').value;
    const strength    = document.getElementById('strength').value;
    const additional  = document.getElementById('additionalInfo').value.trim();

    if (!interest) { alert('관심 에너지 분야를 선택해주세요.'); return; }
    if (!workStyle) { alert('선호 근무 환경을 선택해주세요.'); return; }
    if (!strength)  { alert('나의 강점을 선택해주세요.'); return; }

    const interval = showLoading([
      'AI가 진로를 분석하는 중...',
      '에너지 산업 트렌드 반영 중...',
      '맞춤 진로 3가지 구성 중...',
    ]);

    const systemPrompt = `You are an expert Korean career counselor specializing in the energy sector for KENTECH (Korea Institute of Energy Technology) students.
You provide specific, actionable career recommendations based on student profiles.
Always respond with ONLY a valid JSON array of exactly 3 objects, no markdown, no preamble.
Each object: { "rank": 1, "title": "진로명", "description": "2-3문장 설명", "reason": "이 학생에게 맞는 이유 1문장", "tags": ["태그1","태그2","태그3"], "nextStep": "당장 할 수 있는 첫 번째 행동" }`;

    const userPrompt = `KENTECH 에너지공대 학생의 진로를 추천해주세요:
- 관심 분야: ${interest}
- 학년: ${grade}
- 선호 근무 환경: ${workStyle}
- 강점: ${strength}
${additional ? `- 추가 조건: ${additional}` : ''}

한국어로, JSON 배열만 반환하세요.`;

    try {
      const raw = await callClaude(systemPrompt, userPrompt);
      const careers = JSON.parse(raw);
      renderCareers(careers);
      hideLoading(interval);
      showResult();
    } catch (err) {
      hideLoading(interval);
      alert('추천 생성 중 오류가 발생했습니다. 다시 시도해주세요.\n' + err.message);
    }
  }

  function renderCareers(careers) {
    const container = document.getElementById('careerCards');
    container.innerHTML = careers.map(c => `
      <div class="career-card">
        <div class="career-card-header">
          <span class="career-rank">추천 ${c.rank}</span>
          <h3>${escapeHtml(c.title)}</h3>
        </div>
        <p>${escapeHtml(c.description)}</p>
        ${c.reason ? `<p style="color:var(--blue);font-size:0.87rem;font-weight:600;margin-bottom:0.75rem;">✅ ${escapeHtml(c.reason)}</p>` : ''}
        ${c.nextStep ? `<p style="font-size:0.87rem;color:var(--orange);font-weight:600;margin-bottom:0.75rem;">🚀 첫 번째 행동: ${escapeHtml(c.nextStep)}</p>` : ''}
        <div class="career-tags">
          ${(c.tags || []).map(t => `<span class="career-tag-sm">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  recommendBtn.addEventListener('click', recommendCareers);
  document.getElementById('retryBtn')?.addEventListener('click', recommendCareers);
}

// ── Utility ────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
