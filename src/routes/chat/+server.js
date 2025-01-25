import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY } from "$env/static/public";

const client = new GoogleGenerativeAI("AIzaSyCx4iBYJv9zVltzH_U5E9rCMGYt-OEFwgI");

export async function POST({ request }) {
    try {
        const formData = await request.formData();
        const rawMessages = formData.get('messages');
        console.log('Raw messages:', rawMessages);

        const messages = JSON.parse(rawMessages);

        // Format messages correctly
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            parts: (msg.parts || msg.content || []).map(part => ({ text: part.text })) 
            // Ensure both "parts" and "content" are handled
        }));

        console.log("Formatted Request:", JSON.stringify({ contents: formattedMessages }, null, 2));

        const model = client.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const _response = await model.generateContent({ contents: formattedMessages });

        console.log("API Response:", JSON.stringify(_response, null, 2));

        // Extract response content correctly
        const responseContent = _response?.response?.candidates?.[0]?.content;
        const responseText = responseContent?.parts?.map(p => p.text).join("") || "I'm not sure how to respond.";

        // Ensure consistency in memory structure
        return new Response(JSON.stringify({ response: responseText }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("❌ Error calling Gemini API:", err);
        return new Response(
            JSON.stringify({
                message: 'Internal server error while fetching AI response',
                error: err.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
