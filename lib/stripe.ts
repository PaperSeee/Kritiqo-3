export async function handleCheckout(priceId: string, userEmail?: string) {
  try {
    console.log('Starting checkout process:', { priceId, userEmail });
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userEmail,
      }),
    });

    const data = await response.json();
    
    console.log('API response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      console.log('Redirecting to Stripe:', data.url);
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    
    // More user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('Stripe error')) {
        alert('Erreur de configuration du paiement. Veuillez contacter le support.');
      } else {
        alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.');
      }
    } else {
      alert('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    }
  }
}
