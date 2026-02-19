import groq from "../config/groq.js";

export const generateTextFromGroq = async (prompt) => {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a professional YouTube audience intelligence analyst."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        return completion.choices[0]?.message?.content;

    } catch (error) {
        throw new Error("Groq API Error: " + error.message);
    }
};