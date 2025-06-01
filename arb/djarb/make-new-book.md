# Make a new book with arbdjarb

The easiest way to run the django/pandoc/latex stack is with the
devcontainer. But, be mindful that you often want to run on the host
for certain things like running against the MLX GPU or using xcode iOS tools
and simulators and graphics stack and so on.

The book stack mostly runs in the devcontainer. But, LM Studio server and
local image generation would be running on the host if you configure your
agent pipelines to use local.

Choose a database or start a new one and start an admin instead of convenience.

```sh
export SQLITE_PATH=history.sqlite3
./manage.py migrate
./manage.py createsuperuser
./manage.py runserver
```

## Local sanity check

```sh
./manage.py shell
```

Generate an image against the local LLM provider `corpora_image.service`:

```python
from corpora_ai.provider_loader import load_llm_provider

llm = load_llm_provider("local")
images = llm.get_image("Albrecht Durer black and white pencil drawing of a historically accurate Zheng Yi Sao (c.1775 – 1844), a female Chinese pirate leader active in the South China Sea from 1801 to 1810")

filename = f"zhenyisao.{images[0].format}"
with open(filename, "wb") as f:
    f.write(images[0].data)
```

## Book input

Create a book input directory eg book-input/pirates/

```sh
mkdir -p book-input/pirates
```

Create a config file for the book input:

```sh
touch book-input/pirates/config.yaml
```

Put in your definition. Here's an example:

```yaml
title: Pirates
subtitle: Real, Interesting History
purpose: |
  A complete book on pirates. Fact-dense, simple sentences, no wasted words. Interesting facts and stories, deep dives. Highly entertaining. Simply written. The facts speak for themselves without the author getting in the way.
author: The Encorpora Team
publisher: Corpora Inc
units: 6
lessons_per_unit: 3
exercises_per_lesson: 0
max_images_per_lesson: 3
isbn: ""
image_instructions: |
  Albrecht Durer black and white pencil drawing - a historically accurate drawing of what is described by the caption.
llm_instructions: |
  Write in plain, concise language so you can pack in a ton of interesting facts.

  Do not bore us by trying to be "engaging" and "interesting"-just spill out facts and stories that _are_ interesting.

  Dive directly into facts—no “In this lesson” intros. Maintain a neutral, objective tone: present economic, social, and political contexts without glorification or demonization. Let dense, vivid facts build the narrative.

  Insert image tags (`{{IMAGE: caption}}`) for scenes, people, or places that enhance understanding—captions must be concise, publication-quality figure captions WITHOUT style directives. Avoid maps, diagrams, or meta-educational scenes.

  This is a fun book that people of all ages will love to read. But, not because the author is trying to be fun in a cringey "engaging", obviously LLM way. People will love to read this book because the deep dives into real history are so intereseting and everyone can learn something on every page. No wasted words, no wasted time.

  **Accuracy above all**:
  Report only what's supported by evidence; when in doubt, note scholarly disagreements (“Some chronicle X; others argue Y…”).

  Each lesson aka chapter is part of a larger, seamless unit which is part of a complete textbook.

  Don't excessively summarize and conclude - you are writing a particular part of a comprehensive book. Don't write what will be in other chapters and don't use fluff, boilerplate or trite formulas, "Imagine a time when .."
  The writing style should be dry and parsimonious with the reader's time - packing interesting facts and stories into every bit.

  Don't reference that you are "interesting" either, "Here's and interesting fact!" <- don't do that. Just write the facts and stories. The reader will find them interesting on their own. Don't try to be "interesting" or "engaging" - just be factual and concise. The facts are interesting enough on their own.

```

You can see I really don't like the formulaic bullshit that most LLMs will spit out by default. I've always prefered a very dry, terse style of writing. I hate a bunch of cringey "engaging" stuff that LLMs will do like they are trying to write a blogpost or something. I don't know. The self-referencing, the BS formulaic garbage. It's almost enough to make you want to bang out every last character by hand. But, I digress.

You can put a cover image in the same directory too. But, you don't need it yet if you want to run a few times. We have tested 6x9 standard paperback size that can either be inserted in LaTeX for pdf, or used as the "cover" for the epub or uploaded to Amazon KDP. For the history series I'm working on, Elementary History Illustrated, I did the first one in 6x9 and I think it's a nice size for a ~80-150 ish page paperback with color pictures. I could see maybe doing some 9x9 or something so we could really let full-bleed images shine potentially ... but, 6x9 is pretty cool little size. Anyways. You don't need `book-input/pirates/cover.png` yet.

## Book generation

Let's generate the text, eh?

```sh
./manage.py generate_course --config book-input/pirates/config.yaml
```

Now you have the unit and lesson content in the database.

You might find that there is something pathological about the text. Or, at least, you find that you would like to tweak it a bit. You could do it by hand from here, but maybe you want to run over the whole thing. In my case, I made it write incredibly concisely with the prompt. So, I'm going to run expand.

Before, I do that, I'm going to make one tiny hand-edit, adding:

```
Zheng Yi Sao (c. 1775 – 1844), also known as Shi Yang, Shi Xianggu, Shek Yeung and Ching Shih, was a Chinese pirate leader active in the South China Sea from 1801 to 1810. (TODO: EXPAND HERE)

{{IMAGE: Zheng Yi Sao, known as The Pirate Queen}}
```

The thing made a freaking chapter on women pirates and didn't even mention Zheng Yi Sao. I mean, come on! Maybe I should just write this by hand SMDH.

So, I manually added that with an extra image.

Now, I'm going to run the expand command and then read the whole book to see if maybe I want to use `edit_course` ...

> In the future we envision the Corpora Command Center where you can edit whole swaths of text, books, units, lessons, images, reject, make specific requests, hand edit .. in a fancy interface .. _maybe_ - it depends on if the we can't make the command line and text configuration do the business up to standard.

Note that for this operation, we are working on full units at a time so it has only been tested against super giant context models like GPT 4.1. We should test how open source models perform here. Alternatively, we might retink the structure of the commands in a creative way. :thinking:

```sh
./manage.py generate_course_expand --config book-input/pirates/config.yaml
```

The `edit_course` command is very similar. You can make your own prompt there when you start to read your book and realize that it sucks because of some annoying antipattern. At this point, you are likely to give up and just write the book by hand. HAHA! You thought writing a complete A+ awesome textbook with LLMs was going to be easy, huh?

Okay, you massaged, you've edited, you've expanded, you've tweaked, you've added images, you've done all the things. Now you're ready to render the book.

First, maybe you want to skip the images and just get the text altogether in `md`, `pdf` and `epub` so you can load it up and read through it and thing about more editing you want to do. You can do that with the `--no-generate` flag. This will skip the image generation step and just render the text.

```sh
./manage.py render_book --config book-input/pirates/config.yaml --no-generate --no-cover
```

Now you will have some files in `book-output/pirates/` to look over.

In this case, I found that I would prefer some unit intros. You can see how the complete `md` is rendered by looking at [the default template](./itrary/templates/book.md). You can make your own template for `render_book`.

After some editing, some back and forth, some `edit_course` calls .. maybe with a few hand edits to the scripts ... (TODO: abstract and make iterating even easier) ... I'm ready to render the book with images.

At time of writing, things are parameterized fully. We are still deciding architectural directions and don't want to polish these early experiments too much. So, this time I'm going to make a hand edit. I want to try my local stable diffusion server this time. So, I change the `llm` provider in the `render_book.py` script:

```py
# llm = load_llm_provider("openai")
llm = load_llm_provider("local")
```

Making a complete abstraction for _any_ book is kinda hard. For right now, I tend to do some hand edits to the files for convenience so that they do what I want for this particular book.

Now, I want to see what stable diffusion will do with the captions that were created:

```
./manage.py render_book --config book-input/pirates/config.yaml --no-cover
```

> (`--no-cover` should maybe be the default, it only affects the pdf version and for the printer, it's actually good to have "no bleed" inner pdf and upload the cover separately. If you want to make a nice final pdf standalone, then maybe you want the cover. But, I sort of like a `epub` version better these days for reading ...)


## Fine tuning rendering

The `render_book` has some hardocoded values in it. For example, the memoir class on the pdflatex output.

You can adjust a few things by copying them from `book-input/common/` to your book input directory. For example, you can copy the `custom_headings.tex` file and edit it to change the headings in the pdf pipeline.

```sh
ls book-input/common/
cover.png  custom_headings.tex  epub.css  hrule.lua
```

