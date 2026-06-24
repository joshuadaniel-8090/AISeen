from rapidfuzz import fuzz
import re

POSITIVE_WORDS = {"best", "top", "leading", "excellent", "great", "recommended", "popular", "trusted", "powerful"}
NEGATIVE_WORDS = {"avoid", "poor", "bad", "worst", "unreliable", "overpriced", "disappointing", "broken"}


def detect_mention(response: str, brand: str, competitors: list[str]) -> dict:
    sentences = re.split(r"(?<=[.!?])\s+", response.strip())

    mentioned = False
    position = None
    cited = False

    for i, sentence in enumerate(sentences, start=1):
        score = fuzz.partial_ratio(brand.lower(), sentence.lower())
        if score >= 80:
            mentioned = True
            if position is None:
                position = i
            break

    sentiment = _sentiment(response, brand) if mentioned else None

    competitor_mentions: dict[str, bool] = {}
    for comp in competitors:
        comp_found = any(
            fuzz.partial_ratio(comp.lower(), s.lower()) >= 80 for s in sentences
        )
        competitor_mentions[comp] = comp_found

    return {
        "mentioned": mentioned,
        "cited": cited,
        "position": position,
        "sentiment": sentiment,
        "competitor_mentions": competitor_mentions,
    }


def _sentiment(response: str, brand: str) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", response.strip())
    brand_sentences = [
        s for s in sentences if fuzz.partial_ratio(brand.lower(), s.lower()) >= 80
    ]
    text = " ".join(brand_sentences).lower()

    pos = sum(1 for w in POSITIVE_WORDS if w in text)
    neg = sum(1 for w in NEGATIVE_WORDS if w in text)

    if pos > neg:
        return "positive"
    if neg > pos:
        return "negative"
    return "neutral"
