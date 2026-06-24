import litellm
import os


async def run(prompt_text: str) -> str:
    response = await litellm.acompletion(
        model="gpt-4.1-nano",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant. Answer the user's question concisely.",
            },
            {"role": "user", "content": prompt_text},
        ],
        api_key=os.environ["OPENAI_API_KEY"],
        max_tokens=512,
    )
    return response.choices[0].message.content or ""
