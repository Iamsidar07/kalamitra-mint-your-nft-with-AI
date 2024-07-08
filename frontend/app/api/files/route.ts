import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function uploadToIPFS(file: File) {
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET_KEY!,
        },
        body: form,
      }
    );
    const data = await response.json();
    return data.IpfsHash;
  } catch (error: any) {
    console.log(error);
    throw new Error("Something went wrong", error.message);
  }
}

async function uploadMetadataToIPFS(metadata: any) {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: { name: new Date().toLocaleTimeString() },
        }),
      }
    );
    const data = await response.json();
    return data.IpfsHash;
  } catch (error: any) {
    console.log(error);
    throw new Error("Something went wrong", error.message);
  }
}

async function generateMetadata(file: File) {
  const prompt = `Please analyze the given NFT image and provide the metadata in the following object format:
    <OUTPUT>
      {
      "description": "This is a description",
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
    Include 5 trait_type property. Only response with a Object.
    `;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const image = {
    inlineData: {
      data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      mimeType: file.type,
    },
  };
  try {
    const result = await model.generateContent([prompt, image]);
    console.log("got response", result.response.text());
    console.log(JSON.parse(result.response.text()));
    return JSON.parse(result.response.text());
  } catch (error: any) {
    console.log("Failed to get metadata");
    throw new Error("Failed to get metadata for NFT ", error.message);
  }
}

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  try {
    const ifpsHash = await uploadToIPFS(file);
    // const metadata = {
    //   name: file.name,
    //   image: "ipfs://" + ifpsHash,
    //   description: "This is a description",
    //   attributes: [
    //     {
    //       trait_type: "Background",
    //       value: "Blue",
    //     },
    //     {
    //       trait_type: "Eyes",
    //       value: "Blue",
    //     },
    //     {
    //       trait_type: "Mouth",
    //       value: "Blue",
    //     },
    //     {
    //       trait_type: "Head",
    //       value: "Red",
    //     },
    //   ],
    // };
    // const generatedMetadata = await generateMetadata(file);
    // const metadata = {
    //   name: file.name,
    //   image: "ipfs://" + ifpsHash,
    //   ...generatedMetadata,
    // };

    // const metadataHash = await uploadMetadataToIPFS(metadata);
    // console.log("metadataHash", metadataHash);
    return NextResponse.json({
      success: true,
      // IpfsHash: metadataHash,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
