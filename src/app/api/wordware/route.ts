import { NextResponse } from 'next/server'

const API_KEY = process.env.WORDWARE_API_KEY
const promptId = process.env.WORDWARE_PROMPT_ID

console.log('API_KEY:', API_KEY ? 'Set' : 'Not set')
console.log('promptId:', promptId ? 'Set' : 'Not set')

export const maxDuration = 300
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

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

    const reader = runResponse.body?.getReader()
    if (!reader) {
      throw new Error('No reader available')
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    let buffer: string[] = []
    let finalOutput = false
    let excuse = ''

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(''))

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              return
            }

            const chunk = decoder.decode(value)

            for (let i = 0, len = chunk.length; i < len; ++i) {
              const isChunkSeparator = chunk[i] === '\n'

              if (!isChunkSeparator) {
                buffer.push(chunk[i])
                continue
              }

              const line = buffer.join('').trimEnd()

              try {
                const content = JSON.parse(line)
                const value = content.value

                if (value.type === 'generation') {
                  if (value.state === 'start') {
                    if (value.label === 'output') {
                      finalOutput = true
                    }
                  } else {
                    if (value.label === 'output') {
                      finalOutput = false
                    }
                  }
                } else if (value.type === 'chunk') {
                  if (finalOutput) {
                    excuse += value.value ?? ''
                    controller.enqueue(encoder.encode(value.value ?? ''))
                  }
                } else if (value.type === 'outputs') {
                  console.log(`Wordware output:`, value.values.output, '. Now parsing')
                  if (value.values.output && value.values.output.styled_excuse) {
                    excuse = value.values.output.styled_excuse
                    controller.enqueue(encoder.encode(value.values.output.styled_excuse))
                  }
                }
              } catch (parseError) {
                console.error('Error parsing JSON:', parseError)
              }

              buffer = []
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error)
          controller.error(error)
        } finally {
          reader.releaseLock()
        }
      }
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to generate excuse', details: errorMessage }, { status: 500 })
  }
}