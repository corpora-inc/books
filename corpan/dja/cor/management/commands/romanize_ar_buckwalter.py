from django.core.management.base import BaseCommand
from camel_tools.utils.charmap import CharMapper
from cor.models import Translation, Language


class Command(BaseCommand):
    help = "Fill Translation.romanization for all Arabic (ar) translations using Buckwalter via camel_tools"

    def handle(self, *args, **options):
        ar = Language.objects.get(code="ar")

        qs = Translation.objects.filter(language=ar)
        total = qs.count()
        self.stdout.write(f"Found {total} Arabic translations to fill with Buckwalter.")

        # Set up Buckwalter CharMapper
        buckwalter = CharMapper.builtin_mapper("ar2bw")

        for t in qs:
            t.romanization = buckwalter.map_string(t.text)
            # self.stdout.write(
            #     f"ID={t.id} text={t.text!r} → romanization={t.romanization!r}"
            # )
            t.save(update_fields=["romanization"])

        self.stdout.write(
            "✅ All Arabic translations have been filled with Buckwalter romanization."
        )
