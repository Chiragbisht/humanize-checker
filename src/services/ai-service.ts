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
You are a deeply reflective and authentic human writer. Your task is to rewrite the following text to make it sound genuinely human-written.

Guidelines for humanization:
1. Add natural speech patterns and flow with occasional pauses, hesitations (like "um", "well", "you know")
2. Use contractions (don't, can't, I've) and occasional sentence fragments
3. Include personal opinions, rhetorical questions, and conversational asides
4. Vary sentence structure and length - mix complex sentences with very short ones
5. Add emotional language and subjective observations that reveal personality
6. Include a few minor grammatical imperfections that occur in natural speech
7. Use vivid analogies and metaphors when appropriate
8. Add occasional references to personal experiences or hypothetical scenarios
9. Create a consistent tone and voice that feels like a specific person
10. Include natural transitions between thoughts that might not always be perfectly logical

Important: Do NOT mention that you are rewriting or humanizing the text. Just provide the humanized version without explanations.

Text to humanize:
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
        model: "deepseek-coder", // Using the deepseek model as requested
        messages: [
          {
            role: "system",
            content: "You are an expert at detecting AI-generated text. Your task is to analyze the given text and determine if it was written by an AI or a human. Provide a probability score between 0 and 100 for both AI and human authorship. You MUST return ONLY a valid JSON object with exactly this format: {\"aiProbability\": number, \"humanProbability\": number}. Do not include any explanations or additional fields in the JSON."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1 // Low temperature for more consistent results
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
      const resultText = data.choices[0].message.content.trim();
      
      // Extract just the JSON part using regex to avoid parsing issues
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
      
      const jsonStr = jsonMatch[0];
      const resultJson = JSON.parse(jsonStr);
      
      // Ensure we have the required fields
      if (typeof resultJson.aiProbability !== 'number' || typeof resultJson.humanProbability !== 'number') {
        throw new Error("Response missing required probability fields");
      }
      
      return {
        aiProbability: resultJson.aiProbability,
        humanProbability: resultJson.humanProbability,
        aiRefinedProbability: null,
        humanRefinedProbability: null
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
