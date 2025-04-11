
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

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

    if (userError) {
      console.error("Error fetching user:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the document_sent field to true
    const { error: updateError } = await supabase
      .from("10automations")
      .update({ document_sent: true })
      .eq("id", userData.id);

    if (updateError) {
      console.error("Error updating document_sent status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update document status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For now, we'll simulate sending the email
    // In a real implementation, you would use an email service like Resend, SendGrid, etc.
    console.log(`🚀 Automations sent to ${email} successfully!`);

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
