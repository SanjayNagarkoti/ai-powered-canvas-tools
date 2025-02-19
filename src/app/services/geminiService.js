import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI");

const analyzeCanvas = async (imageData, prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract base64 data
    const imageBase64 = imageData.split(',')[1];

    // Convert base64 image data to FileData array
    const imageFileData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png"
      }
    };

    // Generate content with both image and text prompt
    const result = await model.generateContent([
      prompt,
      imageFileData
    ]);
    
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error analyzing canvas:', error);
    throw error;
  }
};

export { analyzeCanvas }; 