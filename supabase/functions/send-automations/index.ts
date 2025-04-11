
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
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error("Error fetching user:", userError);
      
      // If user doesn't exist, create a new record
      const { data: newUser, error: insertError } = await supabase
        .from("10automations")
        .insert([{ email, shopify_url: null }])
        .select()
        .single();
        
      if (insertError) {
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
          <h1 style="color: #8C74FF; margin-bottom: 20px;">Your Shopify Automations are here!</h1>
          
          <p style="margin-bottom: 15px; font-size: 16px; line-height: 1.5;">Thank you for requesting our 10 Shopify Automations that can save you 20+ hours every week.</p>
          
          <h2 style="color: #6D56D7; margin-top: 30px; margin-bottom: 15px;">Here are your 10 time-saving automations:</h2>
          
          <ol style="margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Automated Order Tagging</strong> - Tag orders based on specific criteria like order value, shipping destination, or product categories.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Customer Winback Emails</strong> - Automatically send personalized emails to customers who haven't purchased in a specific timeframe.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Inventory Alert Notifications</strong> - Get alerts when product inventory falls below specific thresholds.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Review Request Workflow</strong> - Send automated review requests after customers receive their orders.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Abandoned Cart Recovery</strong> - Enhanced multi-step recovery workflows with personalized messaging.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Product Restock Notifications</strong> - Notify customers when out-of-stock items they're interested in become available.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Order Status Updates</strong> - Send automated updates at key points in the fulfillment process.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>VIP Customer Recognition</strong> - Automatically identify and tag high-value customers for special treatment.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Seasonal Campaign Automation</strong> - Schedule and automate marketing campaigns for holidays and seasons.
            </li>
            <li style="margin-bottom: 15px; font-size: 16px;">
              <strong>Cross-sell Recommendations</strong> - Send personalized product recommendations based on purchase history.
            </li>
          </ol>
          
          <div style="background-color: #f5f3ff; border-left: 4px solid #8C74FF; padding: 15px; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 16px;">Want help implementing these automations in your Shopify store? Reply to this email and we'll connect you with our automation experts.</p>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 30px;">Happy automating!</p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #777;">
            <p>If you have any questions, simply reply to this email.</p>
          </div>
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
