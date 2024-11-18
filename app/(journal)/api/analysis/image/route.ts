import { NextResponse } from 'next/server';

import { replicate } from '@/lib/replicate'

export async function POST(request: Request) {
    // TODO: Save image to analysis 

    try {
        const body = await request.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    aspect_ratio: "16:9",
                },
            }
        );

        return NextResponse.json({ imageUrl: output });

    } catch (error) {
        console.error('Error generating image:', error);
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}
