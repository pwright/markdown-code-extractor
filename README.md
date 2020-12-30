# autodidact POC

```
npm i
cd output
./test.sh
```


based on: https://github.com/chad-autry/markdown-code-extractor


Converts `test.md` into `/output/test.didact.md`:

* comment above a code block determines how the didact url is constructed.
* each code block is named and a file created with the code


Future plans:

* support `$` style - only lines starting with `$` are output, only lines are regarded as output
* support asciidoc
* support all didact commands, eg requirmentCheck

# Original readme: markdown-code-extractor
Extracts code blocks in markdown to the relative path link given right above


### Purpose
While developing copy pasteable systemd and fleet units inline in a markdown file with descriptions, I thought it'd be handy to have them each in their own file as well.

### Directions
* Install from npm
* Put a relative link immediatelly in front of code blocks to extract
* Do NOT put any other type of link there
* Make sure any folders required are pre-created
* Execute from the directory the relative paths are in relation to
* Pipe in input markdown