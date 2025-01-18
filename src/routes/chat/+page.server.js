import { GoogleGenerativeAI } from "@google/generative-ai";
import { error } from "@sveltejs/kit";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const actions = {
    chat: async ({ request, locals }) => {
        try {
            const { messages } = await request.json();
            const supabase = locals.supabase;

            if (!messages || messages.length === 0) {
                throw error(400, "No messages provided");
            }

            // Get user session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw error(401, "Unauthorized");
            }

            const user_id = session.user.id;
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const result = await model.generateContent({ contents: messages });
            const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

            // Store user message in Supabase
            await supabase.from("chat_messages").insert([
                { user_id, role: "user", message: messages[messages.length - 1].parts[0].text }
            ]);

            // Store model response in Supabase
            await supabase.from("chat_messages").insert([
                { user_id, role: "model", message: responseText }
            ]);

            return { response: responseText };

        } catch (err) {
            console.error("Error:", err);
            return { error: "Failed to process request" };
        }
    }
};
