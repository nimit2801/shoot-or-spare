export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { apiKey, model, messages, tools, forceTool = true } = req.body

    const body = { model, messages }
    if (tools && tools.length > 0) {
      body.tools = tools
      body.tool_choice = forceTool ? 'required' : 'auto'
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
