import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel disables automatic body parsing so we can verify the raw Stripe signature
export const config = {
    api: {
        bodyParser: false,
    },
};

const getRawBody = async (req) => {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const rawKey = process.env.STRIPE_SECRET_KEY || '';
        const stripe = new Stripe(rawKey.replace(/['"]/g, '').trim());
        
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.replace(/['"]/g, '').trim();
        const signature = req.headers['stripe-signature'];
        
        let event;

        // If a webhook secret is provided, verify the signature for security
        if (webhookSecret) {
            const rawBody = await getRawBody(req);
            try {
                event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
            } catch (err) {
                console.error('Webhook signature verification failed.', err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
        } else {
            // Local dev fallback if no webhook secret is provided
            console.warn('STRIPE_WEBHOOK_SECRET is not set. Parsing body without signature verification (not secure for production).');
            const rawBody = await getRawBody(req);
            event = JSON.parse(rawBody.toString('utf8'));
        }

        // Handle the successful checkout session
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { clientId, clientName, clientEmail, serviceName } = session.metadata;

            console.log(`Payment successful for Client ID: ${clientId}`);

            // Initialize Supabase & Resend
            const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
            
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey);
                
                // 1. Update the client's status in the database to 'paid'
                const { error } = await supabase
                    .from('client_onboarding')
                    .update({ status: 'paid', paid_at: new Date().toISOString() })
                    .eq('client_id', clientId);
                    
                if (error) {
                    console.error('Failed to update client status in Supabase:', error);
                } else {
                    console.log('Client status successfully updated to "paid"');
                }
            }

            // 2. Send Automated Confirmation Email via Resend
            const resendKey = process.env.RESEND_API_KEY?.replace(/['"]/g, '').trim();
            if (resendKey) {
                const resend = new Resend(resendKey);
                await resend.emails.send({
                    from: 'WDC Onboarding <onboarding@resend.dev>', // Resend testing domain
                    to: clientEmail,
                    subject: 'Welcome to WDC! Next Steps for your Project',
                    html: `
                        <h2>Welcome aboard, ${clientName}!</h2>
                        <p>We're thrilled to have you as a new client and have successfully received your payment for <strong>${serviceName}</strong>.</p>
                        <p>Our team is currently setting up your project dashboard. We will be in touch shortly with your access link and kickoff instructions.</p>
                        <p>If you have any immediate questions, feel free to reply directly to this email.</p>
                        <br/>
                        <p>Best regards,</p>
                        <p><strong>The WDC Team</strong></p>
                    `
                });
                console.log('Confirmation email sent to', clientEmail);
            } else {
                console.log('Skipped sending email: RESEND_API_KEY is not configured.');
            }
        }

        res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook payload error:', err);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
}
