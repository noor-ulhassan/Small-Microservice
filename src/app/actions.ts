'use server';

export async function analyzeText(prevState: unknown, formData: FormData) {
    // 1. Extract the text value submitted by the form
    const rawText = formData.get('text');

    if (!rawText || typeof rawText !== 'string') {
        return { error: 'Please provide valid text.', engine: 'Next.js Input Validation' };
    }

    // 2. Resolve the internal Docker network address
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:8000';

    try {
        // 3. Make the secure server-to-server HTTP request
        const response = await fetch(`${apiUrl}/count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 4. Send the payload strictly matching the Python backend Pydantic schema
            body: JSON.stringify({ text: rawText }),
        });

        if (!response.ok) {
            throw new Error(`Failed to communicate with compute service. Status: ${response.status}`);
        }

        // 5. Parse the returned JSON response
        const data = await response.json();
        return data;

    } catch (error) {
        // 6. Handle errors gracefully if the Python backend is unreachable
        console.error('Word-Scale Engine Error:', error);
        return {
            error: 'Compute service is currently unavailable. Please try again later.',
            engine: 'Next.js Error Handler'
        };
    }
}
