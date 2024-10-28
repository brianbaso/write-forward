import { NextRequest, NextResponse } from 'next/server';
import { createAnalysis } from '@/lib/api';

const GOOGLE_CLOUD_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_VISION_API_KEY}`;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image) {
            return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
        }

        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // TODO: Enable languages
        const languageHint = "en-t-i0-handwrit";

        try {
            // Prepare the request body for Google Cloud Vision API
            const body = {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: 'DOCUMENT_TEXT_DETECTION',
                            },
                        ],
                        "imageContext": {
                            "languageHints": [languageHint]
                        }
                    },
                ],
            };

            const response = await fetch(GOOGLE_CLOUD_VISION_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error('Google Cloud Vision API Error:', await response.text());
                return NextResponse.json({ error: 'Error processing image' }, { status: response.status });
            }

            const data = await response.json();

            if (data.responses[0].error) {
                console.error('Google Cloud Vision API Error:', data.responses[0].error);
                return NextResponse.json({ error: 'Error processing image' }, { status: 400 });
            }

            const text = data.responses[0].fullTextAnnotation?.text || '';

            const analysis = await createAnalysis(text);

            return NextResponse.json({ analysis: analysis.content[0].text });
        } catch (error) {
            console.error('Error performing text from image:', error);
            return NextResponse.json({ error: 'Text from image API error' }, { status: 500 });
        }
    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: 'An error occurred while processing the image' }, { status: 500 });
    }
}
