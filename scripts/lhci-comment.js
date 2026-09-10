const fs = require('fs');
const path = require('path');

const LHCI_DIR = path.resolve(process.cwd(), '.lighthouseci');
const COMMENT_MARKER = '<!-- lhci-audit-bot -->';

function readLighthouseScores() {
  if (!fs.existsSync(LHCI_DIR)) return [];

  const jsonFiles = fs.readdirSync(LHCI_DIR).filter((f) => f.endsWith('.json'));
  const results = [];

  for (const file of jsonFiles) {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(LHCI_DIR, file), 'utf-8'),
      );
      if (!data.categories || !data.finalUrl) continue;

      const url = new URL(data.finalUrl);
      const page = url.pathname + url.search;

      results.push({
        page,
        performance: Math.round(data.categories.performance?.score * 100 ?? 0),
        accessibility: Math.round(
          data.categories.accessibility?.score * 100 ?? 0,
        ),
        seo: Math.round(data.categories.seo?.score * 100 ?? 0),
        bestPractices: Math.round(
          data.categories['best-practices']?.score * 100 ?? 0,
        ),
      });
    } catch {
      // skip malformed files
    }
  }

  return results.sort((a, b) => a.page.localeCompare(b.page));
}

function formatScore(score, min) {
  if (score >= min) return `${score}`;
  return `**${score}** ❌`;
}

function buildComment(results) {
  if (results.length === 0) {
    return `${COMMENT_MARKER}\n\n## Lighthouse Audit\n\n⚠️ No Lighthouse results found.`;
  }

  const avgPerf =
    results.reduce((s, r) => s + r.performance, 0) / results.length;
  const avgA11y =
    results.reduce((s, r) => s + r.accessibility, 0) / results.length;
  const avgSeo = results.reduce((s, r) => s + r.seo, 0) / results.length;
  const avgBp =
    results.reduce((s, r) => s + r.bestPractices, 0) / results.length;

  const allPass = results.every(
    (r) =>
      r.performance >= 90 &&
      r.accessibility >= 100 &&
      r.seo >= 100 &&
      r.bestPractices >= 100,
  );

  const header = allPass
    ? '## ✅ Lighthouse Audit — All Pages Passing'
    : '## ❌ Lighthouse Audit — Issues Found';

  let table = `| Page | Perf | A11y | SEO | BP |\n|------|------|------|-----|----|`;
  for (const r of results) {
    table += `\n| ${r.page} | ${formatScore(r.performance, 90)} | ${formatScore(r.accessibility, 100)} | ${formatScore(r.seo, 100)} | ${formatScore(r.bestPractices, 100)} |`;
  }

  const summary = `\n\n**Average:** Perf ${Math.round(avgPerf)} | A11y ${Math.round(avgA11y)} | SEO ${Math.round(avgSeo)} | BP ${Math.round(avgBp)}\n\nThresholds: Performance ≥ 90, Accessibility/SEO/Best Practices ≥ 100`;

  return `${COMMENT_MARKER}\n\n${header}\n\n${table}${summary}`;
}

async function postComment() {
  const token = process.env.GITHUB_TOKEN;
  const eventName = process.env.EVENT_NAME;
  const prNumber = process.env.PR_NUMBER;

  if (!token || eventName !== 'pull_request' || !prNumber) {
    console.log('Skipping PR comment (not a PR or missing token)');
    return;
  }

  const results = readLighthouseScores();
  const body = buildComment(results);

  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  if (!owner || !repo) {
    console.error('GITHUB_REPOSITORY not set');
    return;
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;

  // Find existing comment to update
  let existingCommentId = null;
  try {
    const listRes = await fetch(
      `${apiUrl}?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );
    const comments = await listRes.json();
    const existing = comments.find((c) => c.body?.includes(COMMENT_MARKER));
    if (existing) existingCommentId = existing.id;
  } catch (err) {
    console.error('Failed to list comments:', err.message);
  }

  if (existingCommentId) {
    // Update existing
    try {
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/comments/${existingCommentId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body }),
        },
      );
      console.log(`Updated existing PR comment #${existingCommentId}`);
    } catch (err) {
      console.error('Failed to update comment:', err.message);
    }
  } else {
    // Create new
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });
      console.log('Posted new Lighthouse audit comment');
    } catch (err) {
      console.error('Failed to post comment:', err.message);
    }
  }
}

postComment();
