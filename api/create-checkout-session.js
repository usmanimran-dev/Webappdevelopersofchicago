import Stripe from 'stripe';

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check if key is available before initializing Stripe
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ error: 'STRIPE_SECRET_KEY is missing in Vercel project environment variables.' });
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const {
            clientId,
            clientName,
            clientEmail,
            serviceName,
            servicePrice,   // in dollars, e.g. 7000
            discountApplied, // boolean — if true, waive $1000 onboarding fee
        } = req.body;

        if (!clientEmail || !serviceName || !servicePrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Build line items
        const lineItems = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: serviceName,
                        description: `WDC ${serviceName} — Client ${clientId}`,
                    },
                    unit_amount: servicePrice * 100, // Stripe uses cents
                },
                quantity: 1,
            },
        ];

        // Add onboarding fee (unless discount is applied)
        if (!discountApplied) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Onboarding Fee',
                        description: 'One-time client onboarding and setup fee',
                    },
                    unit_amount: 1000 * 100, // $1,000
                },
                quantity: 1,
            });
        }

        // Determine the origin for redirect URLs
        const origin = req.headers.origin || 'https://webappdevelopersofchicago.vercel.app';

        // Create the Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: clientEmail,
            line_items: lineItems,
            metadata: {
                clientId,
                clientName,
                clientEmail,
                serviceName,
                discountApplied: String(discountApplied),
            },
            success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?payment=cancelled`,
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err);
        return res.status(500).json({ error: err.message });
    }
}
