import time
from django.core.management.base import BaseCommand
from typing import List, Optional
from pydantic import BaseModel
from corpora_ai.provider_loader import load_llm_provider
from corpora_ai.llm_interface import ChatCompletionTextMessage
from cor.models import Language, Translation

# Choose your LLM provider/model
# llm = load_llm_provider("local", completion_model="qwen3-30b-a3b-mlx")
# llm = load_llm_provider("local", completion_model="qwen3-1.7b")
# llm = load_llm_provider("local", completion_model="qwen1.5-7b-chat")
llm = load_llm_provider("openai", completion_model="gpt-3.5-turbo")


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
        parser.add_argument(
            "--skip",
            type=int,
            default=0,
            help="Number of batches to skip before processing.",
        )

    def handle(self, *args, **opts):
        import datetime

        ar = Language.objects.get(code="ar")
        dry_run = opts["dry"]
        batch_size = opts["batch"]
        skip_batches = opts.get("skip", 0)

        total_translations = Translation.objects.filter(language=ar).count()
        self.stdout.write(f"Total Arabic translations: {total_translations}")

        overall_start = time.time()
        sentence_count = 0
        total_llm_time = 0.0
        batch_num = 0

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
            batch_start = time.time()
            messages = build_llm_messages(items)
            response = llm.get_data_completion(messages, RomanizationResponse)
            batch_elapsed = time.time() - batch_start
            show_results(chunk, response)
            self.stdout.write(
                f"⏱️ Batch time: {batch_elapsed:.2f}s | Per sentence: {batch_elapsed/len(chunk):.2f}s"
            )
            self.stdout.write("Dry run complete. No changes saved.")
            return

        # Non-dry run: all, batch update, with skip logic
        for chunk in batch_qs(qs, batch_size):
            batch_num += 1
            if batch_num <= skip_batches:
                self.stdout.write(f"⏭️ Skipping batch {batch_num} (as requested)")
                continue

            items = [
                ArabicRomanizationItem(
                    id=t.id,
                    arabic=t.text,
                    buckwalter=t.romanization or "",
                    old_romanization=t.romanization or None,
                )
                for t in chunk
            ]
            batch_start = time.time()
            messages = build_llm_messages(items)

            tries = 0
            max_retries = 5
            response = None
            while tries < max_retries:
                try:
                    response = llm.get_data_completion(messages, RomanizationResponse)
                    break
                except Exception as e:
                    tries += 1
                    self.stderr.write(
                        f"Error in batch {batch_num}, attempt {tries}: {e}"
                    )
                    if tries >= max_retries:
                        self.stderr.write("Max retries reached. Skipping this batch.")
                        break

            if response is None:
                continue

            batch_elapsed = time.time() - batch_start
            total_llm_time += batch_elapsed
            sentence_count += len(chunk)
            updates = 0
            for obj in response.romanizations:
                t = next((tr for tr in chunk if tr.id == obj.id), None)
                if t and obj.romanization.strip():
                    t.romanization = obj.romanization.strip()
                    t.save(update_fields=["romanization"])
                    updates += 1
            self.stdout.write(
                f"[Batch {batch_num}] {len(chunk)} processed, {updates} updated. "
                f"⏱️ Batch: {batch_elapsed:.2f}s | Per sentence: {batch_elapsed/len(chunk):.2f}s"
            )

        overall_elapsed = time.time() - overall_start
        avg_per_sentence = total_llm_time / sentence_count if sentence_count else 0
        self.stdout.write(
            f"✅ All batches complete in {str(datetime.timedelta(seconds=overall_elapsed))}"
        )
        self.stdout.write(
            f"LLM processing time: {total_llm_time:.2f}s | {sentence_count} sentences | Avg per sentence: {avg_per_sentence:.2f}s"
        )
