import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
    try {
          const body = await request.json()
          const { answers } = body

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                            price_data: {
                                          currency: 'eur',
                                          product_data: {
                                                          name: 'Il Nome Giusto — Report Completo',
                                                          description: '5 nomi personalizzati con etimologia, significato e compatibilita fonetica',
                                          },
                                          unit_amount: 490,
                            },
                            quantity: 1,
                },
                      ],
              mode: 'payment',
              metadata: {
                        answers: JSON.stringify(answers).slice(0, 500),
              },
              success_url: `${siteUrl}/successo?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${siteUrl}/?cancelled=true`,
              locale: 'it',
      })

      return NextResponse.json({ url: session.url })
    } catch (error) {
          console.error('Errore Stripe checkout:', error)
          return NextResponse.json(
            { error: 'Impossibile avviare il pagamento. Riprova.' },
            { status: 500 }
                )
    }
}
