import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  if (!formData.get("file")) {
    return NextResponse.json("File is required", { status: 400 });
  }
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY!,
          pinata_secret_api_key: process.env.PINATA_API_SECRET_KEY!,
        },
        body: formData,
      },
    );
    const data = await response.json();
    return NextResponse.json(
      { success: true, ipfsHash: data.IpfsHash },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
};
