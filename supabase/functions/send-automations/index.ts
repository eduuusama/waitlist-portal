
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

    // Send the email with automations - using email-client friendly HTML
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
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="margin-bottom: 24px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #555;"><strong>By Eduardo Samayoa</strong></p>
              <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #555;"><strong>Co-Founder & CEO, thinkr</strong></p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            
            <div style="margin-bottom: 32px;">
              <h2 style="font-size: 22px; font-weight: 600; margin-bottom: 18px; color: #333;">Introduction</h2>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">Running 20+ Shopify stores taught me a brutal truth:</p>
              
              <blockquote style="border-left: 3px solid #8C74FF; padding-left: 16px; margin: 24px 0; font-style: italic; color: #555;">
                "True sustainable scaling is about reducing friction."
              </blockquote>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><strong>Time is the enemy of growth.</strong></p>
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">Every hour spent manually fixing a product title, emailing about low inventory, or syncing a promo across channels is an hour not spent building.</p>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">That's why we built <strong>thinkr</strong> — AI agents for ecommerce operations.</p>
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">This document shares 10 real automations I implemented that saved me over 40 hours a month (and my sanity).</p>
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">These are available today with thinkr — no coding or Zapier chains required.</p>
              
              <a href="https://apps.shopify.com/thinkr" style="display: inline-block; background-color: #8C74FF; color: white; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 16px 0 24px; font-size: 16px; text-align: center;">Download thinkr shopit app</a>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">Let's get into it.</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            
            <div style="margin-bottom: 32px;">
              <h2 style="font-size: 22px; font-weight: 600; margin-bottom: 18px; color: #333;">10 Automations That Saved My Business</h2>
              
              <ol style="padding-left: 24px; margin-bottom: 24px;">
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Low Inventory Alerts + Reorder Prompt</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Products going out of stock without me knowing.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr monitors stock levels and alerts me before I run out, with 1-click reorder suggestions based on past patterns.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Abandoned Cart Action Plan</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Missed revenue from unfinished checkouts.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr identifies common abandonment reasons (e.g., slow shipping) and suggests targeted actions — like offering a discount or improving page speed.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Weekly Sales Summary + Anomaly Detection</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Drowning in dashboards.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> Every Monday, thinkr sends a summary of key performance shifts — and flags anything unusual (like a sudden drop in a top product).</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Smart Discount Triggers</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Random, gut-feeling promotions.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr suggests time-sensitive discounts based on browsing data, conversion rates, and competitor activity.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Product Description Optimizer</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Weak SEO + copy.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr rewrites top product descriptions based on what's trending in your niche — in your tone.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Customer Winback Campaigns</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> No time to chase lapsed buyers.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr auto-generates targeted emails to win back customers who haven't bought in 60+ days.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Bundling Recommendations</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Missing upsell opportunities.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr finds which products are often bought together and suggests bundles with optimized pricing.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Shopify to Email Syncing</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Inconsistent updates across platforms.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> Push product changes or promotions directly into your email platform — without touching it manually.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Campaign Attribution Insights</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Guessing what worked.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr shows which email, ad, or influencer actually drove revenue — with clear attribution suggestions.</p>
                </li>
                
                <li style="margin-bottom: 24px;">
                  <h3 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">1-Click Approval for All Above</h3>
                  <p style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Problem:</em> Even with insights, I didn't have time to <em style="font-style: italic; color: #555;">do</em> the work.</p>
                  <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;"><em style="font-style: italic; color: #555;">Automation:</em> thinkr turns each insight into an actionable card I can approve in one click. The agent handles the rest.</p>
                </li>
              </ol>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            
            <div style="margin-bottom: 32px;">
              <h2 style="font-size: 22px; font-weight: 600; margin-bottom: 18px; color: #333;">Want These Running In Your Store?</h2>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">thinkr is already powering 100+ stores — helping users like you:</p>
              
              <ul style="padding-left: 24px; margin-bottom: 24px;">
                <li style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;">Save 5–10 hours/week</li>
                <li style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;">Increase revenue by 15–30%</li>
                <li style="margin-bottom: 8px; font-size: 15px; line-height: 1.6;">Avoid burnout</li>
              </ul>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">You don't need to hire an ops person or build custom automations. thinkr connects to your Shopify store and starts suggesting improvements in minutes.</p>
              
              <p style="margin-bottom: 24px; font-size: 16px; font-weight: 600; text-align: center;">
                <a href="https://www.thinkr.pro" style="color: #8C74FF; text-decoration: none;">» Try it free or book a setup call at thinkr.pro</a>
              </p>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">
                Or email me personally — <a href="mailto:edu@thinkr.pro" style="color: #8C74FF; text-decoration: none;">edu@thinkr.pro</a> — if you want help installing or just want to jam about ecommerce.
              </p>
              
              <p style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">Let AI do the heavy lifting so you can get back to building.</p>
              
              <p style="margin-top: 32px; font-size: 15px; line-height: 1.5;">– Eduardo</p>
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
