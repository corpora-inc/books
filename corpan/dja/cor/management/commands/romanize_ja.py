from django.core.management.base import BaseCommand
from fugashi import Tagger
import pykakasi
from cor.models import Language, Translation


class Command(BaseCommand):
    help = "Fill Translation.romanization for Japanese (ja) using MeCab+pykakasi Hepburn romanization"

    def handle(self, *args, **options):
        ja = Language.objects.get(code="ja")
        qs = Translation.objects.filter(language=ja)
        self.stdout.write(f"Found {qs.count()} Japanese translations.")

        # Initialize MeCab tokenizer
        tagger = Tagger()

        # Initialize pykakasi
        kakasi = pykakasi.kakasi()
        kakasi.setMode("H", "a")  # Hiragana → ascii
        kakasi.setMode("K", "a")  # Katakana → ascii
        kakasi.setMode("J", "a")  # Kanji → ascii
        kakasi.setMode("r", "Hepburn")  # Hepburn
        conv = kakasi.getConverter()

        for t in qs:
            tokens = tagger(t.text)
            romaji_chunks = []
            for tok in tokens:
                # Use the token's .pron if available, else fallback to .surface
                kana = getattr(tok.feature, "pron", None) or tok.surface
                chunk = conv.do(kana)
                romaji_chunks.append(chunk)
            # Join with spaces, but avoid spaces before punctuation
            out = ""
            for chunk in romaji_chunks:
                if chunk in {".", ",", "?", "!", "。", "、"}:
                    out += chunk
                else:
                    if out:
                        out += " "
                    out += chunk
            t.romanization = out
            # print(f"ID={t.id} text={t.text!r} → romanization={t.romanization!r}")
            t.save(update_fields=["romanization"])

        self.stdout.write(
            "✅ All Japanese translations have been romanized (MeCab+pykakasi)."
        )
