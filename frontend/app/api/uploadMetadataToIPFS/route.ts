import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const requestBody = await request.json();
  const metadata = requestBody.metadata;
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
      },
    );
    const data = await response.json();
    console.log("data", data);
    return NextResponse.json(
      {
        ipfsHash: data.IpfsHash,
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
};
