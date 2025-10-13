import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExtractedData {
  // ID Card Information
  idType: string;
  idNumber: string;
  issueDate?: string;
  expiryDate?: string;

  // Personal Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  provinceOfOrigin?: string;
  gender?: string;

  // Address Information
  address?: string;
  city?: string;
  province?: string;
  country?: string;

  // Additional Fields
  photo?: string; // base64 or URL
  rawData?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageUrl, idType, userId } = await req.json();

    if (!imageUrl || !idType || !userId) {
      throw new Error("Missing required parameters: imageUrl, idType, userId");
    }

    console.log(`Processing ID extraction for user ${userId}, type: ${idType}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Call OpenAI Vision API to extract data
    console.log("Calling OpenAI Vision API...");
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert at extracting data from identity documents. 
Extract ALL visible text and information from the ID document image.
Return the data as a JSON object with the following structure:
{
  "idType": "type of document (passport, driver-license, national-id, voter-card)",
  "idNumber": "document number",
  "issueDate": "date of issue in YYYY-MM-DD format",
  "expiryDate": "expiry date in YYYY-MM-DD format",
  "firstName": "first name or prénom",
  "middleName": "middle name or postnom",
  "lastName": "last name or nom",
  "birthDate": "date of birth in YYYY-MM-DD format",
  "birthPlace": "place of birth (city)",
  "nationality": "nationality or nationalité",
  "provinceOfOrigin": "province of origin (for DRC documents)",
  "gender": "M or F or Masculin/Féminin",
  "address": "full address if visible",
  "city": "city or ville",
  "province": "province or state",
  "country": "country or pays",
  "rawData": "any additional information found"
}

Important:
- Extract dates in YYYY-MM-DD format
- For DRC documents, look for French text (e.g., "Né(e) à" for birth place, "Province d'origine")
- If a field is not visible, use null
- Be accurate and thorough
- For gender, convert to M or F (Masculin=M, Féminin=F)`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract all information from this ${idType} document. Return ONLY valid JSON, no additional text.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                    detail: "high",
                  },
                },
              ],
            },
          ],
          max_tokens: 1500,
          temperature: 0.1,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    console.log("OpenAI response received");

    // Extract the JSON from the response
    const content = openaiData.choices[0].message.content;
    let extractedData: ExtractedData;

    try {
      // Try to parse as JSON directly
      extractedData = JSON.parse(content);
    } catch (parseError) {
      // If direct parse fails, try to extract JSON from markdown code blocks
      const jsonMatch =
        content.match(/```json\n([\s\S]*?)\n```/) ||
        content.match(/```\n([\s\S]*?)\n```/);

      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[1]);
      } else {
        console.error("Failed to parse OpenAI response:", content);
        throw new Error("Failed to parse extracted data from OpenAI response");
      }
    }

    console.log("Data extracted successfully:", extractedData);

    // Map ID type to database enum for consistency
    const idTypeMap: Record<string, string> = {
      passport: "passeport",
      "driver-license": "permis_conduire",
      "national-id": "carte_identite",
      "voter-card": "carte_electeur",
      passeport: "passeport",
      permis_conduire: "permis_conduire",
      carte_identite: "carte_identite",
      carte_electeur: "carte_electeur",
    };

    const mappedIdType = idTypeMap[idType] || idType;

    // Prepare extracted data with metadata
    const extractedDataWithMeta = {
      ...extractedData,
      idType: mappedIdType, // Use mapped ID type
      uploadedImageUrl: imageUrl,
      extractedAt: new Date().toISOString(),
      originalIdType: idType, // Keep original for reference
    };

    // Save extracted data to extracted_user_data table
    const { error: saveError } = await supabase
      .from("extracted_user_data")
      .upsert(
        {
          user_id: userId,
          extracted_data: extractedDataWithMeta,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        }
      );

    if (saveError) {
      console.error("Error saving extracted data:", saveError);
      throw saveError;
    }

    console.log("Data saved to extracted_user_data table successfully");

    // Return the extracted data
    return new Response(
      JSON.stringify({
        success: true,
        data: extractedData,
        message: "ID data extracted successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in extract-id-data function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred during ID extraction",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
