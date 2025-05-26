import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    console.log('Received checkout request');

    const { priceId, userEmail } = await request.json();

    console.log('Request data:', { priceId, userEmail });

    if (!priceId) {
      console.error('Missing priceId');
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Stripe configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_URL) {
      console.error('Missing NEXT_PUBLIC_URL');
      return NextResponse.json(
        { error: 'URL configuration error' },
        { status: 500 }
      );
    }

    console.log('Creating Stripe session...');

    // Verify if the price exists first
    try {
      await stripe.prices.retrieve(priceId);
    } catch (stripeError) {
      console.error('Price not found:', priceId);
      return NextResponse.json(
        { error: `Invalid price ID: ${priceId}. Please check your Stripe dashboard for the correct price IDs.` },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      customer_email: userEmail || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    console.log('Stripe session created:', session.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
