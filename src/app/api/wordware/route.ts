import { NextResponse } from 'next/server'

const API_KEY = process.env.WORDWARE_API_KEY
const promptId = process.env.WORDWARE_PROMPT_ID

console.log('API_KEY:', API_KEY ? 'Set' : 'Not set')
console.log('promptId:', promptId ? 'Set' : 'Not set')


export async function POST(request: Request) {
  const body = await request.json()

  try {
    const runResponse = await fetch(
      `https://app.wordware.ai/api/released-app/${promptId}/run`,
      {
        method: "POST",
        body: JSON.stringify({
          inputs: {
            context: body.context,
            outcome: body.outcome,
            format: body.format,
            name: body.name,
            boss: body.boss,
            seriousness: body.seriousness,
            ridiculousness: body.ridiculousness,
          },
        }),
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!runResponse.ok) {
      throw new Error('Failed to generate excuse')
    }

    const data = await runResponse.json()
    return NextResponse.json({ message: data.outputs.excuse })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to generate excuse' }, { status: 500 })
  }
}