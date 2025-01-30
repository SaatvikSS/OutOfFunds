const { generateContent } = require('./services/geminiService');

async function testGeminiAPI() {
    try {
        const result = await generateContent('Explain how AI works');
        console.log('API Response:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testGeminiAPI();
