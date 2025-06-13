from django.core.management.base import BaseCommand
from hangul_romanize import Transliter
from hangul_romanize.rule import academic  # “academic” = Revised Romanization
from cor.models import Translation, Language


class Command(BaseCommand):
    help = "Fill Translation.romanization for all Korean (ko) rows using Revised Romanization"

    def handle(self, *args, **options):
        # 1. Locate your Language row (adjust code if needed)
        try:
            ko = Language.objects.get(code="ko-polite")
        except Language.DoesNotExist:
            self.stderr.write(
                "❌ Language with code 'ko' does not exist. Please check your DB."
            )
            return

        # 2. Find all Korean translations missing romanization
        qs = Translation.objects.filter(language=ko, romanization__exact="")
        total = qs.count()
        self.stdout.write(f"Found {total} Korean translations without romanization.")

        # 3. Initialize Revised Romanization engine
        tr = Transliter(academic)

        # 4. Loop through each Translation and save romanization
        for t in qs:
            try:
                latin = tr.translit(t.text)
            except Exception as e:
                # If for some reason the text contains non-Hangul or invalid chars, skip and log
                self.stderr.write(f"Error on ID={t.id} text={t.text!r}: {e}")
                continue

            t.romanization = latin
            t.save(update_fields=["romanization"])

        self.stdout.write("✅ All Korean translations have been romanized.")
