import litellm
import os


async def run(prompt_text: str) -> str:
    response = await litellm.acompletion(
        model="perplexity/sonar",
        messages=[{"role": "user", "content": prompt_text}],
        api_key=os.environ["PERPLEXITY_API_KEY"],
        api_base="https://api.perplexity.ai",
        max_tokens=512,
    )
    return response.choices[0].message.content or ""
