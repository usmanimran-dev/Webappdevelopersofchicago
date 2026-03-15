import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Local dev implementation for Stripe Checkout
            if (req.url === '/api/create-checkout-session' && req.method === 'POST') {
              let bodyText = '';
              req.on('data', chunk => bodyText += chunk);
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyText);
                  const { clientId, clientName, clientEmail, serviceName, servicePrice, discountApplied } = body;
                  
                  const Stripe = (await import('stripe')).default;
                  const rawKey = (env.STRIPE_SECRET_KEY as string) || '';
                  const cleanKey = rawKey.replace(/['"]/g, '').trim();
                  const stripe = new Stripe(cleanKey);

                  const lineItems = [
                    {
                      price_data: {
                        currency: 'usd',
                        product_data: { name: serviceName, description: `WDC ${serviceName} — Client ${clientId}` },
                        unit_amount: servicePrice * 100,
                      },
                      quantity: 1,
                    },
                  ];

                  if (!discountApplied) {
                    lineItems.push({
                      price_data: {
                        currency: 'usd',
                        product_data: { name: 'Onboarding Fee', description: 'One-time client onboarding and setup fee' },
                        unit_amount: 1000 * 100,
                      },
                      quantity: 1,
                    });
                  }

                  const origin = req.headers.origin || 'http://localhost:5173';
                  const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    customer_email: clientEmail,
                    line_items: lineItems,
                    metadata: { clientId, clientName, clientEmail, serviceName, discountApplied: String(discountApplied) },
                    success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${origin}/?payment=cancelled`,
                  });

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: session.url }));
                } catch (e: any) {
                  console.error('Local Stripe Error:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            // Local dev implementation for AI Estimator
            if (req.url === '/api/estimate-project' && req.method === 'POST') {
              let bodyText = '';
              req.on('data', chunk => bodyText += chunk);
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyText);
                  const { projectDescription } = body;

                  if (!projectDescription || projectDescription.length < 10) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Please provide a more detailed project description.' }));
                    return;
                  }

                  const apiKey = env.GEMINI_API_KEY;
                  if (!apiKey) {
                    throw new Error('GEMINI_API_KEY is not configured');
                  }

                  const prompt = `You are a Senior Project Manager at WDC (Web App Developers of Chicago), a premium software agency.\nA potential client wants to build the following project:\n"${projectDescription}"\n\nAnalyze this project and estimate the cost, timeline, and key features required.\nWDC's minimum engagement is $5,000. Complex apps usually range from $15,000 to $50,000+.\nProvide a realistic but slightly premium agency estimate.\n\nYou MUST respond with a perfectly formatted JSON object EXACTLY matching this structure:\n{\n  "minPrice": number, \n  "maxPrice": number,\n  "timeline": "string (e.g. 8-12 weeks)",\n  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],\n  "techStack": ["React", "Node.js", "etc"],\n  "summary": "A 2-sentence professional breakdown of what it takes to build this."\n}\nDo not include markdown blocks, just the raw JSON object.`;

                  const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                          temperature: 0.4,
                          responseMimeType: "application/json"
                        },
                      }),
                    }
                  );

                  if (!response.ok) {
                    const errBody = await response.text();
                    throw new Error(`Gemini API error ${response.status}: ${errBody}`);
                  }

                  const data = await response.json();
                  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                  if (!content) throw new Error('Empty response from Gemini');

                  res.setHeader('Content-Type', 'application/json');
                  res.end(content);
                } catch (e: any) {
                  console.error('Local AI Estimator Error:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            // Local dev implementation for Send Estimate
            if (req.url === '/api/send-estimate' && req.method === 'POST') {
              let bodyText = '';
              req.on('data', chunk => bodyText += chunk);
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyText);
                  const { email, estimateData } = body;

                  const resendKey = env.RESEND_API_KEY;
                  if (!resendKey) {
                    throw new Error('RESEND_API_KEY is not configured');
                  }

                  const { Resend } = await import('resend');
                  const resend = new Resend(resendKey);

                  const { data, error } = await resend.emails.send({
                    from: 'WDC AI Estimator <onboarding@resend.dev>',
                    to: email,
                    subject: 'Your AI Project Estimate from WDC',
                    html: `<h2>Your Estimate</h2><p>${JSON.stringify(estimateData)}</p>` // Simpler for local test
                  });

                  if (error) throw error;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, id: data?.id }));
                } catch (e: any) {
                  console.error('Local Send Estimate Error:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            // Local dev implementation for RSS
            if (req.url === '/rss.xml') {
              const supabaseUrl = env.VITE_SUPABASE_URL;
              const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
              if (!supabaseUrl || !supabaseKey) {
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Missing Supabase variables');
                  return;
              }
              try {
                const response = await fetch(`${supabaseUrl}/rest/v1/blogs?select=*&order=created_at.desc`, {
                  headers: {
                    'apikey': supabaseKey as string,
                    'Authorization': `Bearer ${supabaseKey}`
                  }
                });
                const blogs = await response.json();
                
                let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n  <title>Usman Imran - Blog</title>\n  <link>http://localhost:5173</link>\n  <description>Latest insights and articles.</description>\n`;
                if(Array.isArray(blogs)) {
                  for (const blog of blogs) {
                    rss += `  <item>\n    <title>${blog.title}</title>\n    <link>http://localhost:5173/blog/${blog.slug}</link>\n    <description>${blog.excerpt}</description>\n    <pubDate>${new Date(blog.created_at).toUTCString()}</pubDate>\n  </item>\n`;
                  }
                }
                rss += `</channel>\n</rss>`;
                res.setHeader('Content-Type', 'application/rss+xml');
                res.end(rss);
                return;
              } catch (err) {
                console.error(err);
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
