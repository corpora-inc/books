from django.core.management.base import BaseCommand
from cor.models import Language, Translation
from indic_transliteration.sanscript import transliterate, DEVANAGARI, IAST


class Command(BaseCommand):
    help = "Overwrite Translation.romanization for all Hindi (hi) rows with IAST (no checks, no batching)."

    def handle(self, *args, **opts):
        hi = Language.objects.get(code="hi")
        qs = Translation.objects.filter(language=hi)
        total = qs.count()
        print(f"Total Hindi translations: {total}")

        for t in qs:
            t.romanization = transliterate(t.text, DEVANAGARI, IAST)
            t.save(update_fields=["romanization"])

        print("✅ All Hindi romanizations overwritten using IAST.")
