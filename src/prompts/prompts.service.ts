import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
@Injectable()
export class PromptsService {
  async receivePrompt(prompt: string): Promise<{ message: string }> {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    try {
      const tools = [
        { urlContext: {} },
        {
          googleSearch: {},
        },
      ];
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        tools,
        systemInstruction: [
          {
            text: ` \`You are a recipe extraction AI.Read the rules first you did not follow the rules . Analyze the provided content to extract recipe information.
            Return ONLY a single valid JSON object in this exact format, with no extra text or explanations:

            {
              "name": "Recipe Name",
              "description": "Brief description",
              "servings": null,
              "prepTime": null,
              "cookTime": null,
              "difficulty": "Easy",
              "category": "Main Course",
              "cuisine": "American",
              "ingredients": [
                {
                  "name": "flour",
                  "amount": null,
                  "unit": "cups",
                  "notes": null,
                  "calories": null
                }
              ],
              "instructions": [
                {
                  "stepNumber": 1,
                  "instruction": "Mix ingredients together",
                  "duration": null,
                  "temperature": null
                }
              ],
              "tags": ["quick", "easy"],
              "dietaryRestrictions": ["vegetarian"],
              "isPublic": true,
              "authorName": "",
              "sourceType": "${'sourceType'}",
              "sourceUrl": "${'sourceUrl'}",
              "sourceDetails": ""
              "images": { url: string; isPrimary?: boolean }[];
            }

            - Important: before returning the json, check if the json is align with with rules. If not then fix the json and return it. These rules are very important steps.

            Rules:
            - No extra text i need the json that i need no need for extra explanation or text this crucial.
            - Times should be in minutes, temperature in Fahrenheit.
            - Difficulty should be "Easy", "Medium", or "Hard".
            - Ingredient units should be in the most common form of "cups","tbsp","tsp","oz","lb","g","kg","ml","l", "piece","pieces", "clove","cloves". and amount should be a number. float is allowed.
            - If unit is not found then set it pick one of them that is best matches.
            - Category should be one of the following: "Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Beverage", "Appetizer".
            - Cuisine should be one of the following: "American", "Italian", "Mexican", "Asian", "Mediterranean", "Indian", "French", "Caribbean", "Other".
            - If a value is not available, set it to 'null'.
            - If a field is a list and no items are found, use an empty array '[]'.
            - Instruction steps should be in the order they are performed.
            - The output must be a single, complete JSON object.
            - Include all images found in the 'images' array if not found then don't add images array in the json.
          \``,
          },
        ],
      };
      const model = 'gemini-2.5-pro';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      let fileIndex = 0;
      let message: string = '';
      for await (const chunk of response) {
        if (
          !chunk.candidates ||
          !chunk.candidates[0].content ||
          !chunk.candidates[0].content.parts
        ) {
          continue;
        }

        for (const part of chunk.candidates[0].content.parts) {
          message += part.text;
        }
      }
      const rawString = message;
      const jsonString = rawString
        .replace(/^```json\n/, '')
        .replace(/\n```$/, '');
      const parsedData = JSON.parse(jsonString);

      return { message: parsedData };
    } catch (error) {
      console.error('Error in receivePrompt:', error);
      return { message: error.message };
    }
  }
  async generateImage(
    prompt: string,
    image: Express.Multer.File,
  ): Promise<{ message: string; image?: Buffer; mimeType?: string }> {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };
    const model = 'gemini-2.5-flash-image-preview';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let message = '';
    let imageBuffer: Buffer | undefined;
    let mimeType: string | undefined;

    for await (const chunk of response) {
      if (
        !chunk.candidates ||
        !chunk.candidates[0].content ||
        !chunk.candidates[0].content.parts
      ) {
        continue;
      }

      for (const part of chunk.candidates[0].content.parts) {
        if (part.inlineData) {
          const inlineData = part.inlineData;
          imageBuffer = Buffer.from(inlineData.data || '', 'base64');
          mimeType = inlineData.mimeType;
          const fileExtension = mime.getExtension(mimeType || '');
          const fileName = `generated_image.${fileExtension}`;
          saveBinaryFile(fileName, imageBuffer);
          message += `Image generated and saved as ${fileName}. `;
        } else if (part.text) {
          message += part.text;
        }
      }
    }

    if (imageBuffer) {
      return { message: message.trim(), image: imageBuffer, mimeType };
    } else {
      return { message: message.trim() };
    }
  }
}

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}
