export const createAnalysis = async (userInput: string): Promise<any> => {
    try {
        const response = await fetch('/api/analysis/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating analysis:', error);
        throw error;
    }
};

export const getTextFromImage = async (formData: FormData): Promise<any> => {
    try {
        const response = await fetch('/api/textFromImage', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting text from image:', error);
        throw error;
    }
}
