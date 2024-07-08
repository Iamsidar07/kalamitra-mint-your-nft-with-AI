import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();
  const formData = new FormData();
  formData.append("prompt", prompt);
  try {
    const response: any = await fetch(
      `https://api.stability.ai/v2beta/stable-image/generate/core`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STABLE_DIFFUSION_API_KEY}`,
          // Accept: "image/*",
          Accept: "application/json",
        },
        body: formData,
      },
    );

    const data = await response.json();
    console.log("data",data);
    return NextResponse.json({
      success: true,
      image: data.image,
      message: "Your nft is ready to mint",
    }, {status: 200});
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message }, {status: 200});
  }
};
