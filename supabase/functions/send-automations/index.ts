
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
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #8C74FF; margin-bottom: 20px;">Your Shopify Automations Guide</h2>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            By Eduardo Samayoa<br>
            Co-Founder & CEO, thinkr
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <h3 style="color: #6D56D7; margin-top: 30px; margin-bottom: 15px;">Introduction</h3>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            Running 20+ Shopify stores taught me a brutal truth:
          </p>
          
          <blockquote style="border-left: 4px solid #8C74FF; padding-left: 15px; margin: 20px 0; font-style: italic;">
            "Scaling is not about growing revenue. It's about reducing friction."
          </blockquote>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            Time is the enemy of growth. Every hour spent manually fixing a product title, emailing about low inventory, or syncing a promo across channels is an hour not spent building.
          </p>
          
          <p style="margin-bottom: 30px; font-size: 16px; line-height: 1.5;">
            That's why I built <strong>thinkr</strong> — AI agents for ecommerce operations.
            This document shares 10 real automations I implemented that saved me over 40 hours a month (and my sanity). These are available today with Thinkr — no coding or Zapier chains required.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <h3 style="color: #6D56D7; margin-top: 30px; margin-bottom: 15px;">10 Automations That Saved My Business</h3>
          
          <ol style="margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Low Inventory Alerts + Reorder Prompt</strong><br>
              <em>Problem:</em> Products going out of stock without me knowing.<br>
              <em>Automation:</em> thinkr monitors stock levels and alerts me before I run out, with 1-click reorder suggestions based on past patterns.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Abandoned Cart Action Plan</strong><br>
              <em>Problem:</em> Missed revenue from unfinished checkouts.<br>
              <em>Automation:</em> thinkr identifies common abandonment reasons (e.g., slow shipping) and suggests targeted actions — like offering a discount or improving page speed.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Weekly Sales Summary + Anomaly Detection</strong><br>
              <em>Problem:</em> Drowning in dashboards.<br>
              <em>Automation:</em> Every Monday, thinkr sends a summary of key performance shifts — and flags anything unusual (like a sudden drop in a top product).
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Smart Discount Triggers</strong><br>
              <em>Problem:</em> Random, gut-feeling promotions.<br>
              <em>Automation:</em> thinkr suggests time-sensitive discounts based on browsing data, conversion rates, and competitor activity.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Product Description Optimizer</strong><br>
              <em>Problem:</em> Weak SEO + copy.<br>
              <em>Automation:</em> thinkr rewrites top product descriptions based on what's trending in your niche — in your tone.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Customer Winback Campaigns</strong><br>
              <em>Problem:</em> No time to chase lapsed buyers.<br>
              <em>Automation:</em> thinkr auto-generates targeted emails to win back customers who haven't bought in 60+ days.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Bundling Recommendations</strong><br>
              <em>Problem:</em> Missing upsell opportunities.<br>
              <em>Automation:</em> thinkr finds which products are often bought together and suggests bundles with optimized pricing.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Shopify to Email Syncing</strong><br>
              <em>Problem:</em> Inconsistent updates across platforms.<br>
              <em>Automation:</em> Push product changes or promotions directly into your email platform — without touching it manually.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>Campaign Attribution Insights</strong><br>
              <em>Problem:</em> Guessing what worked.<br>
              <em>Automation:</em> thinkr shows which email, ad, or influencer actually drove revenue — with clear attribution suggestions.
            </li>
            
            <li style="margin-bottom: 20px; font-size: 16px;">
              <strong>1-Click Approval for All Above</strong><br>
              <em>Problem:</em> Even with insights, I didn't have time to <em>do</em> the work.<br>
              <em>Automation:</em> thinkr turns each insight into an actionable card I can approve in one click. The agent handles the rest.
            </li>
          </ol>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <h3 style="color: #6D56D7; margin-top: 30px; margin-bottom: 15px;">Want These Running In Your Store?</h3>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            thinkr is already powering 100+ stores — helping users like you:
          </p>
          
          <ul style="margin-bottom: 20px; padding-left: 20px;">
            <li style="margin-bottom: 10px; font-size: 16px;">Save 5–10 hours/week</li>
            <li style="margin-bottom: 10px; font-size: 16px;">Increase revenue by 15–30%</li>
            <li style="margin-bottom: 10px; font-size: 16px;">Avoid burnout</li>
          </ul>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            You don't need to hire an ops person or build custom automations. Thinkr connects to your Shopify store and starts suggesting improvements in minutes.
          </p>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            <strong>Try it free or book a setup call at <a href="https://www.thinkr.pro" style="color: #8C74FF; text-decoration: none;">thinkr.pro</a></strong>
          </p>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            Or email me personally — <a href="mailto:eduardo@thinkr.pro" style="color: #8C74FF; text-decoration: none;">eduardo@thinkr.pro</a> — if you want help installing or just want to jam about ecommerce.
          </p>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            Let AI do the heavy lifting so you can get back to building.
          </p>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">
            – Eduardo
          </p>
        </div>
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
