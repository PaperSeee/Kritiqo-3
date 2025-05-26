// Price IDs mapping - Updated with actual Stripe price IDs
export const PRICE_IDS = {
  STARTER: {
    MONTHLY: 'prod_SNkfysyyNDlAf1', // Starter product ID
    YEARLY: 'prod_SNkfysyyNDlAf1',  // Use same for now, update with yearly price ID when created
  },
  PRO: {
    MONTHLY: 'prod_SNkftOYNNkmVdA', // Pro product ID  
    YEARLY: 'prod_SNkftOYNNkmVdA',  // Use same for now, update with yearly price ID when created
  }
};

export async function handleCheckout(priceId: string, userEmail?: string) {
  try {
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

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    // Handle error (show toast, etc.)
    alert('Erreur lors de la création de la session de paiement');
  }
}

// Helper function to get price ID based on plan and billing period
export function getPriceId(plan: 'starter' | 'pro', billingPeriod: 'monthly' | 'yearly'): string {
  if (plan === 'starter') {
    return billingPeriod === 'yearly' ? PRICE_IDS.STARTER.YEARLY : PRICE_IDS.STARTER.MONTHLY;
  } else {
    return billingPeriod === 'yearly' ? PRICE_IDS.PRO.YEARLY : PRICE_IDS.PRO.MONTHLY;
  }
}
