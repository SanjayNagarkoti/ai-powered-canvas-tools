import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with the API key
const genAI = new GoogleGenerativeAI("AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI");

const analyzeCanvas = async (imageData, prompt) => {
  try {
    // Get the model with the correct version
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract base64 data and verify it
    const imageBase64 = imageData.split(',')[1];
    console.log('Canvas data URL length:', imageData.length);
    console.log('Base64 image data length:', imageBase64.length);

    // Convert base64 image data to FileData array
    const imageFileData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png"
      }
    };

    // Log the full request data for verification
    console.log('Sending request with data:', {
      prompt,
      imageDataLength: imageBase64.length,
      mimeType: "image/png"
    });

    // Generate content with both image and text prompt
    const result = await model.generateContent([prompt, imageFileData]);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Error analyzing canvas:', error);
    throw error;
  }
};

export { analyzeCanvas }; 