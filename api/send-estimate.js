import { Resend } from 'resend';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, estimateData } = req.body;

        if (!email || !estimateData) {
            return res.status(400).json({ error: 'Missing email or estimate data.' });
        }

        const resendKey = process.env.RESEND_API_KEY?.replace(/['"]/g, '').trim();
        if (!resendKey) {
            throw new Error('RESEND_API_KEY is not configured on the server.');
        }

        const resend = new Resend(resendKey);

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            }).format(amount);
        };

        const { data, error } = await resend.emails.send({
            from: 'WDC AI Estimator <onboarding@resend.dev>',
            to: email,
            subject: 'Your AI Project Estimate from WDC',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0A1628;">
                    <h2 style="color: #2563EB;">Your Project Estimate</h2>
                    <p>Thanks for using the WDC AI Estimator! Here is a summary of the project analysis we generated for you.</p>
                    
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #10B981;">Investment & Timeline</h3>
                        <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">
                            ${formatCurrency(estimateData.minPrice)} - ${formatCurrency(estimateData.maxPrice)}
                        </p>
                        <p style="color: #64748b;"><strong>Estimated Timeline:</strong> ${estimateData.timeline}</p>
                    </div>

                    <h3>Analysis Summary</h3>
                    <p style="line-height: 1.6;">${estimateData.summary}</p>

                    <h3>Key Features</h3>
                    <ul>
                        ${estimateData.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>

                    <h3>Recommended Tech Stack</h3>
                    <p>${estimateData.techStack.join(', ')}</p>

                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                    <p style="font-size: 14px; color: #64748b;">Ready to start? Reply to this email or visit <a href="https://webappdevelopersofchicago.vercel.app">our website</a> to book a discovery call.</p>
                    <p style="font-weight: bold;">The WDC Team</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
        }

        return res.status(200).json({ success: true, id: data.id });

    } catch (err) {
        console.error('Send Estimate Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
