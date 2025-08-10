# API Key Setup

To use the OpenAI integration in this application, you need to set up an OpenAI API key.

## Steps:

1. Create an account at [OpenAI](https://platform.openai.com/) if you don't have one already.
2. Generate an API key in the OpenAI dashboard.
3. Create a `.env.local` file in the root of this project.
4. Add your API key to the file:

```
OPENAI_API_KEY=your_api_key_here
```

## How it works:

The application uses the `@ai-sdk/openai` package which automatically reads the `OPENAI_API_KEY` environment variable. No additional configuration is needed in the code.

## Security:

- Never commit your `.env.local` file to version control
- The `.gitignore` file is already configured to exclude all `.env*` files
- In production, set the environment variable in your deployment platform instead of using a file
