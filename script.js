const form = document.getElementById('image-form');
const promptInput = document.getElementById('prompt');
const generateBtn = document.getElementById('generate-btn');
const generatedImage = document.getElementById('generated-image');
const errorDiv = document.getElementById('error');
const loadingDiv = document.getElementById('loading');

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const OPENAI_API_KEY = 'YOUR_API_KEY';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();

    if (!prompt) {
        showError('Please enter a prompt');
        return;
    }

    try {
        showLoading(true);
        const imageUrl = await generateImage(prompt);
        displayImage(imageUrl);
        showError('');
    } catch (error) {
        showError('Failed to generate image. Please try again.');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
});

async function generateImage(prompt) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: prompt,
            n: 1,
            size: '512x512'
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.data[0].url;
}

function displayImage(imageUrl) {
    generatedImage.src = imageUrl;
    generatedImage.style.display = 'block';
    
    // Add a smooth fade-in effect
    generatedImage.style.opacity = 0;
    setTimeout(() => {
        generatedImage.style.transition = 'opacity 0.5s ease-in-out';
        generatedImage.style.opacity = 1;
    }, 100);
}

function showError(message) {
    errorDiv.textContent = message;
}

function showLoading(isLoading) {
    loadingDiv.style.display = isLoading ? 'block' : 'none';
    generateBtn.disabled = isLoading;
    generateBtn.textContent = isLoading ? 'Generating...' : 'Generate Image';
}

// Add hover effect to additional buttons
const actionButtons = document.querySelectorAll('.action-button');
actionButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-5px)';
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
    });
});