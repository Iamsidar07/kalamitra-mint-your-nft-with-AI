import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function parseOutput(rawJson: string) {
  let jsonString = "";
  if (rawJson.includes("```json")) {
    jsonString = rawJson.replaceAll("```", "");
    jsonString = jsonString.replace("json", "");
  }
  return JSON.parse(jsonString);
}

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const ipfsHash = formData.get("ipfsHash");
  if (!file || !ipfsHash) {
    return NextResponse.json(
      {
        success: false,
        message: "Fields are required",
      },
      { status: 400 },
    );
  }
  const prompt = `Please analyze the given NFT image and provide the metadata in the following object format:
    <OUTPUT>
      {
      "attributes": [
        {
          "trait_type": "Background",
          "value": "Blue"
        },
        {
          "trait_type": "Eyes",
          "value": "Blue"
        },
        {
          "trait_type": "Mouth",
          "value": "Blue"
        },
        {
          "trait_type": "Head",
          "value": "Red"
        }
      ]
     }
    <OUTPUT>
    Include 5 trait_type property.
    `;
  const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash-latest" },
    {
      timeout: 3 * 60 * 100,
    },
  );

  const image = {
    inlineData: {
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      mimeType: file.type,
    },
  };
  try {
    const result = await model.generateContent([prompt, image]);
    const rawJsonAsString = result.response.text();
    const metadata = parseOutput(rawJsonAsString);
    return NextResponse.json(
      {
        metadata: { name: file.name, image: "ipfs://" + ipfsHash, ...metadata },
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("Failed to get metadata", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
};
