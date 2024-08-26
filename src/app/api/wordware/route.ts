import { NextResponse } from 'next/server'

const API_KEY = process.env.WORDWARE_API_KEY
const promptId = process.env.WORDWARE_PROMPT_ID

console.log('API_KEY:', API_KEY ? 'Set' : 'Not set')
console.log('promptId:', promptId ? 'Set' : 'Not set')


export async function POST(request: Request) {
  const body = await request.json()
  console.log('Received body:', body)

  try {
    console.log('Attempting to call Wordware API...')
    const runResponse = await fetch(
      `https://app.wordware.ai/api/released-app/${promptId}/run`,
      {
        method: "POST",
        body: JSON.stringify({
          inputs: {
            context: body.context,
            outcome: body.outcome,
            style: body.style,
            user_name: body.user_name,
            boss_name: body.boss_name,
            severity: body.severity,
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
      const errorText = await runResponse.text()
      console.error('Wordware API error:', runResponse.status, errorText)
      throw new Error(`Wordware API error: ${runResponse.status} ${errorText}`)
    }

    const rawResponseText = await runResponse.text()
    console.log('Raw API response:', rawResponseText)

    let data
    try {
      data = JSON.parse(rawResponseText)
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      throw new Error('Failed to parse API response')
    }

    console.log('Parsed API response:', data)
    return NextResponse.json({ message: data.outputs.excuse })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to generate excuse', details: errorMessage }, { status: 500 })
  }
}