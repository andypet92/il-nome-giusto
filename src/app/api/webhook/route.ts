import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

// Necessario per leggere il body grezzo (Stripe lo richiede per verificare la firma)
export const config = {
  api: { bodyParser: false },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Firma mancante' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Firma non valida' }, { status: 400 })
  }

  // Gestiamo solo il completamento del pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession

    // Qui puoi aggiungere logica extra:
    // - Salvare su database (Supabase, PlanetScale, ecc.)
    // - Inviare email di conferma con Resend o SendGrid
    // - Registrare l'accesso al report
    console.log('Pagamento completato:', session.id, session.customer_email)
  }

  return NextResponse.json({ received: true })
}
