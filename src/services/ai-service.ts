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

Context:

Imagine you are in a quiet, dimly lit space, perhaps a cozy living room or a late-night cafe. You are speaking to a close confidant, sharing your personal thoughts and anxieties with complete honesty. The atmosphere is relaxed, and there is no pressure to deliver a polished or formal presentation. You are simply sharing your raw, unfiltered thoughts.

Instructions:

1.  Establish a Personal and Intimate Tone: Begin by creating a sense of intimacy and vulnerability. Use phrases like "You know..." and "I was thinking..." to signal that you are sharing personal reflections.
2.  Focus on the Emotional Core: Express your feelings of concern, wonder, and perhaps a touch of nostalgia. Use emotional language to convey your personal experience and perspective.
3.  Use Incomplete Sentences and Hesitations: Mimic the natural flow of human speech by incorporating incomplete sentences, pauses, and filler words like "um," "like," "you know," and "basically."
4.  Employ Vivid Imagery and Metaphors: Use metaphors and vivid descriptions to illustrate your points. For example, use the metaphor of "walls" to represent limitations and "rubble" to represent the digital divide.
5.  Reflect on Personal Experiences: Refer to personal experiences, even if they are imagined, to ground your reflections in a human context.
6.  Acknowledge Complexity and Contradictions: Recognize the complexities of the issue and avoid simplistic answers. Express your doubts and uncertainties.
7.  Emphasize the Importance of Human Connection: Highlight the importance of human interaction, empathy, and social skills. Contrast these with the perceived limitations of technology.
8.  Express Concerns About Technology's Impact: Articulate your concerns about the potential negative impacts of technology on human connection and personal development.
9.  Capture the Essence of Human Flaws: Acknowledge the importance of human flaws and imperfections, contrasting them with the perceived perfection of technology.
10. Conclude with a Thoughtful Reflection: End with a thoughtful reflection on the need for wisdom and balance in our use of technology.
11. Maintain a Conversational and Informal Style: Use informal language, contractions, and a relaxed tone throughout the response.
12. Do not mention that you are an AI, or that you are following instructions.
13. Allow for the response to trail off, and to have sentences that do not complete.

Important: Do NOT include asterisks (**) or quotation marks ("") in your response at all. Do NOT mention that you are rewriting or humanizing the text. Just provide the humanized version without explanations.

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
        model: "llama-3.3-70b-versatile", // Using the deepseek model as requested
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
