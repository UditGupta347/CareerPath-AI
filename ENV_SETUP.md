# Environment Setup Guide

This guide will help you set up the environment variables required for CareerPathAI.

## Required API Keys

### 1. Groq API Key (Required)
Used for the **Resume Builder** and **AI Assistant** features.

**How to get:**
1. Visit: https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

### 2. Gemini API Key (Required)
Used for the **Resume Builder**, **ATS Analyzer**, and **Project Generator** features.

**How to get:**
1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the key (starts with `AIza`)

### 3. OpenRouter API Key (Optional)
Currently not in use, but kept for reference.

**How to get:**
1. Visit: https://openrouter.ai/keys
2. Sign up for an account
3. Create a new API key
4. Copy the key (starts with `sk-or-v1-`)

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file and add your API keys:**
   ```bash
   VITE_GROQ_API_KEY=your_actual_groq_api_key_here
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   VITE_OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
   ```

3. **Never commit the `.env` file to Git:**
   - The `.env` file is already in `.gitignore`
   - Only commit `.env.example` with placeholder values
   - Share real API keys through secure channels only

## Security Best Practices

- ✅ **DO:** Keep your `.env` file local and never commit it
- ✅ **DO:** Use `.env.example` as a template for team members
- ✅ **DO:** Regenerate API keys if they're accidentally exposed
- ❌ **DON'T:** Hardcode API keys in source code
- ❌ **DON'T:** Share API keys in public repositories
- ❌ **DON'T:** Commit `.env` files to version control

## Troubleshooting

### API Key Not Working
1. Verify the key is correctly copied (no extra spaces)
2. Check if the API service is enabled in your account
3. Ensure the key hasn't expired or been revoked
4. Try regenerating a new key

### Features Not Working
1. Make sure the `.env` file is in the root directory
2. Restart the development server after updating `.env`
3. Check the browser console for specific error messages

## File Structure
```
CareerPathAI/
├── .env                 ← Your actual API keys (DO NOT COMMIT)
├── .env.example        ← Template with placeholders (COMMIT THIS)
├── .gitignore          ← Contains .env to prevent commits
└── ENV_SETUP.md        ← This file
```
