
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";
import { Resend } from "https://esm.sh/resend@1.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAutomationsRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Parse request body
    const { email }: SendAutomationsRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing automation email request for: ${email}`);

    // Get user record from 10automations table
    const { data: userData, error: userError } = await supabase
      .from("10automations")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    // Check if we need to create a user record
    if (!userData) {
      // If user doesn't exist, create a new record
      const { error: insertError } = await supabase
        .from("10automations")
        .insert([{ email, shopify_url: null }]);
        
      if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
        console.error("Error creating user record:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create user record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Send the email with automations
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Shopify Automations <automations@thinkr-app.com>',
      to: email,
      subject: '🚀 Your 10 Powerful Shopify Automations',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your 10 Powerful Shopify Automations</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              margin-bottom: 24px;
            }
            .divider {
              border: none;
              border-top: 1px solid #eee;
              margin: 24px 0;
            }
            .section {
              margin-bottom: 32px;
            }
            h2 {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 18px;
              color: #333;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            p {
              margin-bottom: 16px;
              font-size: 15px;
              line-height: 1.6;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            blockquote {
              border-left: 3px solid #8C74FF;
              padding-left: 16px;
              margin: 24px 0;
              font-style: italic;
              color: #555;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            strong {
              font-weight: 600;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            ol {
              padding-left: 24px;
              margin-bottom: 24px;
            }
            li {
              margin-bottom: 24px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            h3 {
              font-size: 17px;
              font-weight: 600;
              margin-bottom: 8px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            ul {
              padding-left: 24px;
              margin-bottom: 24px;
            }
            a {
              color: #8C74FF;
              text-decoration: none;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .byline {
              margin: 0;
              font-size: 15px;
              line-height: 1.5;
              color: #555;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .cta {
              margin-bottom: 24px;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            em {
              font-style: italic;
              color: #555;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .footer {
              margin-top: 32px;
              font-size: 15px;
              line-height: 1.5;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="byline">By Eduardo Samayoa</p>
              <p class="byline">Co-Founder & CEO, thinkr</p>
            </div>
            
            <hr class="divider">
            
            <div class="section">
              <h2>Introduction</h2>
              
              <p>Running 20+ Shopify stores taught me a brutal truth:</p>
              
              <blockquote>
                "True sustainable scaling is about reducing friction."
              </blockquote>
              
              <p><strong>Time is the enemy of growth.</strong></p>
              <p>Every hour spent manually fixing a product title, emailing about low inventory, or syncing a promo across channels is an hour not spent building.</p>
              
              <p>That's why we built <strong>thinkr</strong> — AI agents for ecommerce operations.</p>
              <p>This document shares 10 real automations I implemented that saved me over 40 hours a month (and my sanity).</p>
              <p>These are available today with thinkr — no coding or Zapier chains required.</p>
              
              <p>Let's get into it.</p>
            </div>
            
            <hr class="divider">
            
            <div class="section">
              <h2>10 Automations That Saved My Business</h2>
              
              <ol>
                <li>
                  <h3>Low Inventory Alerts + Reorder Prompt</h3>
                  <p><em>Problem:</em> Products going out of stock without me knowing.</p>
                  <p><em>Automation:</em> thinkr monitors stock levels and alerts me before I run out, with 1-click reorder suggestions based on past patterns.</p>
                </li>
                
                <li>
                  <h3>Abandoned Cart Action Plan</h3>
                  <p><em>Problem:</em> Missed revenue from unfinished checkouts.</p>
                  <p><em>Automation:</em> thinkr identifies common abandonment reasons (e.g., slow shipping) and suggests targeted actions — like offering a discount or improving page speed.</p>
                </li>
                
                <li>
                  <h3>Weekly Sales Summary + Anomaly Detection</h3>
                  <p><em>Problem:</em> Drowning in dashboards.</p>
                  <p><em>Automation:</em> Every Monday, thinkr sends a summary of key performance shifts — and flags anything unusual (like a sudden drop in a top product).</p>
                </li>
                
                <li>
                  <h3>Smart Discount Triggers</h3>
                  <p><em>Problem:</em> Random, gut-feeling promotions.</p>
                  <p><em>Automation:</em> thinkr suggests time-sensitive discounts based on browsing data, conversion rates, and competitor activity.</p>
                </li>
                
                <li>
                  <h3>Product Description Optimizer</h3>
                  <p><em>Problem:</em> Weak SEO + copy.</p>
                  <p><em>Automation:</em> thinkr rewrites top product descriptions based on what's trending in your niche — in your tone.</p>
                </li>
                
                <li>
                  <h3>Customer Winback Campaigns</h3>
                  <p><em>Problem:</em> No time to chase lapsed buyers.</p>
                  <p><em>Automation:</em> thinkr auto-generates targeted emails to win back customers who haven't bought in 60+ days.</p>
                </li>
                
                <li>
                  <h3>Bundling Recommendations</h3>
                  <p><em>Problem:</em> Missing upsell opportunities.</p>
                  <p><em>Automation:</em> thinkr finds which products are often bought together and suggests bundles with optimized pricing.</p>
                </li>
                
                <li>
                  <h3>Shopify to Email Syncing</h3>
                  <p><em>Problem:</em> Inconsistent updates across platforms.</p>
                  <p><em>Automation:</em> Push product changes or promotions directly into your email platform — without touching it manually.</p>
                </li>
                
                <li>
                  <h3>Campaign Attribution Insights</h3>
                  <p><em>Problem:</em> Guessing what worked.</p>
                  <p><em>Automation:</em> thinkr shows which email, ad, or influencer actually drove revenue — with clear attribution suggestions.</p>
                </li>
                
                <li>
                  <h3>1-Click Approval for All Above</h3>
                  <p><em>Problem:</em> Even with insights, I didn't have time to <em>do</em> the work.</p>
                  <p><em>Automation:</em> thinkr turns each insight into an actionable card I can approve in one click. The agent handles the rest.</p>
                </li>
              </ol>
            </div>
            
            <hr class="divider">
            
            <div class="section">
              <h2>Want These Running In Your Store?</h2>
              
              <p>thinkr is already powering 100+ stores — helping users like you:</p>
              
              <ul>
                <li>Save 5–10 hours/week</li>
                <li>Increase revenue by 15–30%</li>
                <li>Avoid burnout</li>
              </ul>
              
              <p>You don't need to hire an ops person or build custom automations. thinkr connects to your Shopify store and starts suggesting improvements in minutes.</p>
              
              <p class="cta">
                <a href="https://www.thinkr.pro">» Try it free or book a setup call at thinkr.pro</a>
              </p>
              
              <p>
                Or email me personally — <a href="mailto:edu@thinkr.pro">edu@thinkr.pro</a> — if you want help installing or just want to jam about ecommerce.
              </p>
              
              <p>Let AI do the heavy lifting so you can get back to building.</p>
              
              <p class="footer">– Eduardo</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send automations email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully:", emailData);

    // Update the document_sent field to true
    const { error: updateError } = await supabase
      .from("10automations")
      .update({ document_sent: true })
      .eq("email", email);

    if (updateError) {
      console.error("Error updating document_sent status:", updateError);
      // We'll continue since the email was already sent successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Automations sent successfully",
        email 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in send-automations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
