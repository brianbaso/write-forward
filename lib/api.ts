export const saveJournalEntry = async (entryText: string): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journal/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryText }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving journal entry:', error);
        throw error;
    }
}

export const saveAnalysis = async (journalId: string, analysisText: string): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ journalId, analysisText }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving analysis:', error);
        throw error;
    }
}

export const getTextFromImage = async (formData: FormData): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/image-to-text`, {
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

export const getJournalEntries = async (): Promise<any> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journal/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.redirected && response.url.includes('/login')) {
            throw new Error('Authentication required');
        }

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        throw error;
    }
}

export const getJournalAndAnalysis = async (id: string): Promise<any> => {
    try {
        if (!id) {
            throw new Error('Journal ID is required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journal/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching journal and analysis:', error);
        throw error;
    }
}

export const createImage = async (prompt: string): Promise<any> => {
    try {
        const response = await fetch('/api/analysis/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        return await response.json();
    } catch (error) {
        console.error('Error creating image:', error)
        throw error;
    }
}