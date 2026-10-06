import type { Handler } from 'aws-lambda';

interface ExtractIdDataEvent {
  imageUrl: string;
  idType: string;
  userId: string;
}

interface OpenAiChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface ExtractedData {
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  rawData?: Record<string, unknown>;
}

export const handler: Handler = async (event: ExtractIdDataEvent) => {
  const { imageUrl, idType, userId } = event;

  console.log('Extracting ID data:', { idType, userId });

  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting data from identity documents from the Democratic Republic of Congo (DRC).
Extract ALL visible information from the document and return it as a structured JSON object.
Document type: ${idType}

Important notes:
- DRC documents are typically in French
- Names: prénom (first name), postnom (middle name), nom (last name)
- Dates should be in YYYY-MM-DD format
- Gender: M (Masculin) or F (Féminin)
- Return null for any field you cannot find or read clearly

Return a JSON object with these fields (all optional except what you can clearly read):
{
  "idNumber": "document number",
  "issueDate": "YYYY-MM-DD",
  "expiryDate": "YYYY-MM-DD",
  "firstName": "prénom",
  "middleName": "postnom",
  "lastName": "nom/nom de famille",
  "birthDate": "YYYY-MM-DD",
  "birthPlace": "lieu de naissance",
  "nationality": "nationalité",
  "gender": "M or F",
  "address": "adresse complète",
  "city": "ville",
  "province": "province",
  "country": "pays",
  "rawData": { any other relevant information }
}`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please extract all information from this ${idType} document.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = (await response.json()) as OpenAiChatResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse the JSON from the response
    let extractedData: ExtractedData;
    try {
      // Try to find JSON in the response (might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       [null, content];
      extractedData = JSON.parse(jsonMatch[1] || content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse extracted data');
    }

    console.log('Successfully extracted data:', extractedData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: extractedData,
        idType,
        userId,
      }),
    };
  } catch (error) {
    console.error('Error extracting ID data:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
