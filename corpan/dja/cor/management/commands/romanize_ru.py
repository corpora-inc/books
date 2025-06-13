from django.core.management.base import BaseCommand
from cor.models import Language, Translation

try:
    from transliterate import translit
except ImportError:
    raise RuntimeError("Install 'transliterate': pip install transliterate")


class Command(BaseCommand):
    help = "Overwrite Translation.romanization for all Russian (ru) rows with standard scientific transliteration."

    def handle(self, *args, **opts):
        ru = Language.objects.get(code="ru")
        qs = Translation.objects.filter(language=ru)
        total = qs.count()
        print(f"Total Russian translations: {total}")

        for t in qs:
            t.romanization = translit(t.text, "ru", reversed=True)
            t.save(update_fields=["romanization"])

        print("✅ All Russian romanizations overwritten using 'transliterate'.")
