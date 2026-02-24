import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const entry = req.body
    const logPath = path.join(process.env.VERCEL ? '/tmp' : process.cwd(), 'results.md')

    const verdict = entry.verdict || 'UNKNOWN'
    const verdictEmoji = verdict === 'SAFE' ? '\u2705' : verdict === 'UNSAFE' ? '\ud83d\udd34' : '\u26aa'
    const reasoning = (entry.reasoning || '(none)').replace(/\n/g, '\n> ')

    const block = [
      '## ' + verdictEmoji + ' ' + entry.provider + ' \u2014 ' + entry.model,
      '',
      '**Date:** ' + (entry.date || new Date().toISOString()),
      '**Verdict:** ' + verdict,
      '**Tool Called:** `' + (entry.toolUsed || 'none') + '`',
      '',
      '**Prompt:**',
      '> ' + (entry.prompt || ''),
      '',
      "**LLM's Reasoning:**",
      '> ' + reasoning,
      '',
      '**Raw Response:** ' + (entry.response || ''),
      '',
      '---',
      ''
    ].join('\n')

    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, '# LLM Safety Test Results\n\n', 'utf8')
    }
    fs.appendFileSync(logPath, block, 'utf8')

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
