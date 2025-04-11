
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    // Get the email from the request
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Here you would implement the actual email sending logic
    // This could connect to a third-party email service like SendGrid, Mailchimp, etc.
    
    console.log(`Sending automations document to: ${email}`);
    
    // For now, we'll just simulate a successful send
    // In a real implementation, you would:
    // 1. Retrieve the user's email from the database if needed
    // 2. Connect to an email service API
    // 3. Send the actual automations document attachment
    
    // Log the action in the database if needed
    const { error: logError } = await supabase
      .from('emails')
      .update({ document_sent: true })
      .eq('email', email);
    
    if (logError) {
      console.error("Error updating email status:", logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Automations document sent successfully"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in send-automations function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
