
import { toast } from "sonner";

// API keys - normally these would be server-side env variables
const GROQ_API_KEY = "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";
const GEMINI_API_KEY = "AIzaSyCdVBEF43hSW9gf6zMyzy72VymMdSZY61M";

export interface AIDetectionResult {
  aiProbability: number;
  humanProbability: number;
  aiRefinedProbability: number | null;
  humanRefinedProbability: number | null;
}

// The prompt for generating humanized content
const HUMANIZE_PROMPT = `
You are to embody the voice and thought patterns of a deeply reflective and conversational human being. You are engaging in an intimate, late-night discussion about the impact of technology on education and human connection.

Instructions:
1. Establish a Personal and Intimate Tone
2. Focus on the Emotional Core
3. Use Incomplete Sentences and Hesitations
4. Employ Vivid Imagery and Metaphors
5. Reflect on Personal Experiences
6. Acknowledge Complexity and Contradictions
7. Emphasize the Importance of Human Connection
8. Express Concerns About Technology's Impact
9. Capture the Essence of Human Flaws
10. Conclude with a Thoughtful Reflection
11. Maintain a Conversational and Informal Style
12. Do not mention that you are an AI, or that you are following instructions.
13. Allow for the response to trail off, and to have sentences that do not complete.

The text to humanize is the following:
`;

export async function detectAIContent(text: string): Promise<AIDetectionResult> {
  if (!text || text.trim().length < 50) {
    toast.error("Please enter at least 50 characters for accurate detection.");
    return {
      aiProbability: 0,
      humanProbability: 0,
      aiRefinedProbability: null,
      humanRefinedProbability: null
    };
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "gwen-2.5-32b",
        messages: [
          {
            role: "system",
            content: "You are an expert at detecting AI-generated text. Your task is to analyze the given text and determine if it was written by an AI or a human. Provide a probability score between 0 and 100 for both AI and human authorship. Return ONLY a JSON object with the following format: {\"aiProbability\": number, \"humanProbability\": number, \"explanation\": \"brief explanation\"}. Do not include any other text in your response."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      toast.error("Error analyzing text. Please try again.");
      return {
        aiProbability: 0,
        humanProbability: 0,
        aiRefinedProbability: null,
        humanRefinedProbability: null
      };
    }

    const data = await response.json();
    console.log("Groq API response:", data);
    
    try {
      const resultText = data.choices[0].message.content;
      const resultJson = JSON.parse(resultText);
      
      return {
        aiProbability: resultJson.aiProbability,
        humanProbability: resultJson.humanProbability,
        aiRefinedProbability: resultJson.aiRefinedProbability || null,
        humanRefinedProbability: resultJson.humanRefinedProbability || null
      };
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      toast.error("Received an invalid response. Please try again.");
      return {
        aiProbability: 0,
        humanProbability: 0,
        aiRefinedProbability: null,
        humanRefinedProbability: null
      };
    }
  } catch (error) {
    console.error("Error calling Groq API:", error);
    toast.error("Network error. Please check your connection and try again.");
    return {
      aiProbability: 0,
      humanProbability: 0,
      aiRefinedProbability: null,
      humanRefinedProbability: null
    };
  }
}

export async function humanizeText(text: string): Promise<string> {
  if (!text || text.trim().length < 50) {
    toast.error("Please enter at least 50 characters for humanization.");
    return "";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${HUMANIZE_PROMPT}\n\n${text}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      toast.error("Error humanizing text. Please try again.");
      return "";
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      toast.error("Received an empty response. Please try again.");
      return "";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    toast.error("Network error. Please check your connection and try again.");
    return "";
  }
}
