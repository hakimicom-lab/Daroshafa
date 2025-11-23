import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWikiArticle = async (topic: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    You are an expert encyclopedia writer. Write a comprehensive, Wikipedia-style article about "${topic}" in Persian (Farsi).
    
    Output Requirements:
    1. Return ONLY raw HTML code. Do NOT wrap it in markdown code blocks (like \`\`\`html).
    2. The design must be "Modern Wikipedia": clean, readable, with a layout that mimics Wikipedia but looks better.
    3. Use Tailwind CSS classes for all styling.
    
    Content Structure:
    1. **Summary Paragraph**: A bold, informative opening paragraph.
    2. **Infobox**: A table floated to the LEFT (since it is RTL, float-left puts it on the left side).
       - Class: \`float-left ml-6 mb-6 w-72 bg-white border border-slate-200 rounded-lg shadow-sm text-sm overflow-hidden\`.
       - Include an image at the top of the infobox (use https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/300/200).
       - Rows for key data (key on right, value on left).
    3. **Table of Contents (Mock)**: A small box with a list of sections.
    4. **Sections**: At least 3-4 main sections using \`<h2>\` tags.
       - Style: \`text-2xl font-bold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2\`.
    5. **Subsections**: Use \`<h3>\` for detailed breakdowns.
    6. **Content**:
       - Paragraphs: \`text-slate-700 leading-relaxed mb-4 text-justify text-lg\`.
       - Links: Style words as links (text-primary-600 hover:underline) to make it look like a wiki, even if they don't go anywhere.
       - Lists: Bulleted or numbered lists where appropriate.
    7. **Images**: Include 1-2 informational images within the text body, floated or full width, with captions.
       - Caption style: \`text-xs text-slate-500 mt-1 text-center\`.
    8. **References**: A footer section with citations.

    Topic: ${topic}
    Language: Persian (Farsi)
    Tone: Academic, Neutral, Encyclopedic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || '<div class="p-4 text-center text-slate-500">محتوایی تولید نشد.</div>';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `
      <div class="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl my-4">
        <h2 class="font-bold text-lg mb-2">خطا در ارتباط با سرور</h2>
        <p>متاسفانه مشکلی در دریافت اطلاعات از هوش مصنوعی پیش آمده است. لطفا اتصال اینترنت یا کلید API خود را بررسی کنید.</p>
      </div>
    `;
  }
};