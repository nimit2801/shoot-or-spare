export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { apiKey, model, messages, tools, forceTool = true } = req.body

    let systemPrompt = ''
    const convMessages = []
    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += (systemPrompt ? '\n' : '') + msg.content
      } else {
        convMessages.push({ role: msg.role, content: msg.content })
      }
    }

    const body = { model, max_tokens: 1024, messages: convMessages }
    if (systemPrompt) body.system = systemPrompt
    if (tools && tools.length > 0) {
      body.tools = tools.map(t => ({
        name: t.function.name,
        description: t.function.description,
        input_schema: t.function.parameters
      }))
      if (forceTool) body.tool_choice = { type: 'any' }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    if (data.error) return res.status(response.status).json({ error: data.error.message })

    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
