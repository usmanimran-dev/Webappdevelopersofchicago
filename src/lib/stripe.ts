import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
    if (!stripePromise && stripePublishableKey) {
        stripePromise = loadStripe(stripePublishableKey);
    }
    return stripePromise;
};

interface CheckoutParams {
    clientId: string;
    clientName: string;
    clientEmail: string;
    serviceName: string;
    servicePrice: number;
    discountApplied: boolean;
}

export async function redirectToCheckout(params: CheckoutParams): Promise<void> {
    const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    // Redirect to Stripe-hosted checkout page
    if (data.url) {
        window.location.href = data.url;
    }
}
