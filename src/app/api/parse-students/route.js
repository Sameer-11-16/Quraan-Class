import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, apiKey } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text content to parse is required.' },
        { status: 400 }
      );
    }

    const finalApiKey = apiKey || process.env.GROQ_API_KEY;
    if (!finalApiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is required. Please provide it in the input field.' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert data extractor. Extract student codes and names from the unstructured text provided by the user. 
Format your output as a JSON object with a single root key "students" containing an array of objects.
Each object must have exactly two fields: "code" and "name". 

Guidelines:
- Clean up the names (capitalize correctly, remove bullet points, commas, numbers, brackets, etc.).
- Locate or extract student codes if present (e.g. "QS-021", "101", "Code: 22" -> extract as code).
- If no code is present for a student, auto-generate a code starting from "QS-XXX" or based on existing code patterns in the text, or leave it empty so the user can fill it.
- Do not output any notes, comments, or explanations outside the JSON. Return only the JSON object.

Example output format:
{
  "students": [
    { "code": "QS-001", "name": "Ahmad bin Khalid" },
    { "code": "QS-002", "name": "Fatimah bint Abdullah" }
  ]
}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Groq API responded with status ${response.status}`;
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({
      success: true,
      students: parsedContent.students || []
    });
  } catch (error) {
    console.error('Error parsing students with Groq:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while parsing student data.' },
      { status: 500 }
    );
  }
}
