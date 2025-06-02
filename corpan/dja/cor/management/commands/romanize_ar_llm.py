from django.core.management.base import BaseCommand
from typing import List, Optional
from pydantic import BaseModel
from corpora_ai.provider_loader import load_llm_provider
from corpora_ai.llm_interface import ChatCompletionTextMessage
from cor.models import Language, Translation

llm = load_llm_provider("local", completion_model="qwen3-30b-a3b-mlx")
# llm = load_llm_provider("openai", completion_model="gpt-4o")


class ArabicRomanizationItem(BaseModel):
    id: int
    arabic: str
    buckwalter: str
    old_romanization: Optional[str] = None


class RomanizationResponseItem(BaseModel):
    id: int
    romanization: str


class RomanizationResponse(BaseModel):
    romanizations: List[RomanizationResponseItem]


def get_system_prompt():
    return (
        "You are an expert Arabic linguist and educator. Your job is to produce Latin-script romanizations of Arabic text that are easy for beginners to pronounce. "
        "You are given both Arabic and Buckwalter transliteration. DO NOT copy Buckwalter—write out natural, readable, phrasebook-style romanizations. "
        "No numerals, no weird symbols, no Arabizi. Use only regular letters and apostrophes for 'ayn (ع) or glottal stops (ء). "
        "Examples: حبيبي: habibi, رحلة: rihla, صديق: sadiq, عربي: 'arabi, خالد: khalid, أستاذ: 'ustadh, سؤال: su'al. "
        "Your romanization should be as if written for a beginner phrasebook for English or Spanish speakers. Output only the JSON."
    )


def build_llm_messages(
    items: List[ArabicRomanizationItem],
) -> List[ChatCompletionTextMessage]:
    user_prompt = (
        "For each item below, return a learner-friendly romanization using the Latin alphabet. "
        "Each object has: id, arabic, buckwalter. "
        'Return ONLY a single JSON object: {"romanizations": [{"id": ..., "romanization": ...}, ...]}. '
        "Examples: حبيبي → habibi, رحلة → rihla, خالد → khalid, غرفة → ghurfa, عربي → 'arabi, مستشفى → mustashfa, أستاذ → 'ustadh, سؤال → su'al, المدرسة → al-madrasa."
    )
    return [
        ChatCompletionTextMessage(role="system", text=get_system_prompt()),
        ChatCompletionTextMessage(role="user", text=user_prompt),
        ChatCompletionTextMessage(
            role="user",
            text=ArabicRomanizationItem.schema_json()
            + "\n"
            + RomanizationResponse.schema_json()
            + "\n\n"
            + str([item.dict() for item in items]),
        ),
    ]


def batch_qs(qs, batch_size):
    total = qs.count()
    for i in range(0, total, batch_size):
        yield qs[i : i + batch_size]


def show_results(chunk, response):
    for obj in response.romanizations:
        t = next((tr for tr in chunk if tr.id == obj.id), None)
        print("=" * 60)
        print(f"ID: {obj.id}")
        print(f"Arabic:        {t.text if t else ''}")
        print(f"Buckwalter:    {t.romanization if t else ''}")
        print(f"Old Roman.:    {t.romanization if t else ''}")
        print(f"LLM Suggested: {obj.romanization}")
    print("=" * 60)
    print("Dry run complete. No changes saved.")


class Command(BaseCommand):
    help = "Use LLM to convert Arabic+Buckwalter to learner-friendly romanizations."

    def add_arguments(self, parser):
        parser.add_argument("--batch", type=int, default=20)
        parser.add_argument("--dry", action="store_true", default=False)

    def handle(self, *args, **opts):
        ar = Language.objects.get(code="ar")
        dry_run = opts["dry"]
        batch_size = opts["batch"]

        # Get translations queryset
        qs = Translation.objects.filter(language=ar)
        if dry_run:
            qs = qs.order_by("?")[:batch_size]
            self.stdout.write(
                f"🔎 Dry run: sampling {batch_size} random Arabic translations."
            )
            chunk = qs
            items = [
                ArabicRomanizationItem(
                    id=t.id,
                    arabic=t.text,
                    buckwalter=t.romanization or "",
                    old_romanization=t.romanization or None,
                )
                for t in chunk
            ]
            messages = build_llm_messages(items)
            response = llm.get_data_completion(messages, RomanizationResponse)
            show_results(chunk, response)
            return

        # Non-dry run: all, batch update
        for chunk in batch_qs(qs, batch_size):
            items = [
                ArabicRomanizationItem(
                    id=t.id,
                    arabic=t.text,
                    buckwalter=t.romanization or "",
                    old_romanization=t.romanization or None,
                )
                for t in chunk
            ]
            messages = build_llm_messages(items)
            response = llm.get_data_completion(messages, RomanizationResponse)
            updates = 0
            for obj in response.romanizations:
                t = next((tr for tr in chunk if tr.id == obj.id), None)
                if t and obj.romanization.strip():
                    t.romanization = obj.romanization.strip()
                    t.save(update_fields=["romanization"])
                    updates += 1
            self.stdout.write(f"Batch: {len(chunk)} processed, {updates} updated.")
        self.stdout.write("✅ All batches complete.")
