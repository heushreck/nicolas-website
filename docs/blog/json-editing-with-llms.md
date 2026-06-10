---
title: JSON Editing with LLMs - Getting it Right
description: Three architectural iterations on how an AI agent should apply edits to JSON tool configurations - structured output, search & replace, and JSON Patch.
head:
  - - meta
    - property: 'og:description'
      content: Three architectural iterations on how an AI agent should apply edits to JSON tool configurations - structured output, search & replace, and JSON Patch.
  - - meta
    - property: 'og:title'
      content: JSON Editing with LLMs - Getting it Right | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: /images/json-editing-with-llms.webp
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog/json-editing-with-llms
  - - meta
    - property: keywords
      content: 'LLMs, JSON, AI Agents, Structured Output, JSON Patch, Nicolas, Neudeck'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: JSON Editing with LLMs - Getting it Right | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: Three architectural iterations on how an AI agent should apply edits to JSON tool configurations - structured output, search & replace, and JSON Patch.
  - - meta
    - name: 'twitter:image'
      content: /images/json-editing-with-llms.webp
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com/blog/json-editing-with-llms
  - - meta
    - name: google-site-verification
      content: 9agtSktJYcUTkHEIMiXa-0GX5OAFp-aq-M-sGdHEDm8
---
<script setup>
import Hero from '../../components/Hero.vue'
import Share from '../../components/Share.vue'
const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const empty_string = ""
const title = "JSON Editing with LLMs - Getting it Right"
const shortDescription = "Three architectural iterations on how an AI agent should apply edits to JSON tool configurations - structured output, search & replace, and JSON Patch."
const subtitle = "2026-01-22"
const tags = [
      "LLMs",
      "JSON",
      "AI Agents",
      "Structured Output",
      "JSON Patch"
    ]
</script>
# JSON Editing with LLMs - Getting it Right
<Hero :title="empty_string" :subtitle="prettyDate(subtitle)"/>
<Share :title="title" :shortDescription="shortDescription" :tags="tags"/>

At superglue, every tool we run on top of a system - APIs, databases, and similar - is defined by an internal JSON configuration.

To improve the experience of creating and editing these tools, I worked on an agentic editing flow. You can manually tweak API headers, or you can simply chat with the agent: *"Update the body to include a timestamp."*, *"Check out the last error and fix the auth issue"*, or *"Edit the final transform step and remove the emails from my return type"*.

It sounds straightforward, but figuring out how the agent should actually apply those edits turned into a surprising engineering challenge. We went through three distinct architectural iterations before getting it right.

## Attempt 1: The "Rewrite Everything" Approach

The first design was the simplest: structured output.

We fed the LLM the current JSON state and the user's request, and asked it to generate the **entire** new JSON object. We would then replace the current tool with the new one.

A simplified version of a tool config:

```json
{
  "url": "www.api.test.com",
  "body": "function(x) { return \"example\" }",
  "header": {
    "content-type": "application/json"
  }
}
```

Say the API call failed because `api.test.com` expects plain text instead of JSON. The LLM would output:

```json
{
  "url": "www.api.test.com",
  "body": "function(x) { return \"example\" }",
  "header": {
    "content-type": "text/plain"
  }
}
```

It worked, technically. But for production use, it was flawed:

1. **Hallucination / forgetfulness:** The LLM would often "forget" keys it deemed unimportant to the current task, resulting in data loss.
2. **Drift:** It would occasionally rewrite parts of the config we didn't ask it to touch.
3. **Performance:** Regenerating a massive configuration object just to change one boolean value is inefficient.

## Attempt 2: The "Cursor" Approach (Search & Replace)

We looked at the state of the art and took inspiration from AI code editors like Cursor. Their model is generally to treat the file as a text buffer: the LLM returns a `search_string` (to locate the context) and a `replacement_string`.

We rebuilt the edit tool to follow this schema and treated the JSON config as a flat text file.

For the same example, the agent would output:

```json
{"search_string": "application/json", "replacement_string": "text/plain"}
```

We would then perform a simple replace operation on the JSON object.

Performance improved immediately. Edits were granular. We weren't regenerating the whole world anymore; we were just swapping out specific blocks of text.

While this worked for simple key-value pairs, errors crept in where the agent couldn't locate the string it wanted to replace. The culprit: **stringified JavaScript**. Because superglue is an integration company, we store a lot of code snippets inside JSON strings.

```json
"body": "function(x) { return \"example\" }"
```

For an LLM, writing a search string for this is a nightmare of escaping. The LLM might output a search string that looks semantically correct, but if it misses a single escaped quote (`\"`) or a newline character (`\n`), the exact-match fails. Too much time was spent trying to get the LLM to understand the exact whitespace of our serialized JSON.

## Attempt 3: JSON Patch (The Solution)

We were trying to solve a structural problem with text-processing tools. We didn't need to search through a text file - we needed to modify a data structure. Unlike Cursor, which has to handle Python, XML, and Markdown files, we can rely on the fact that we only ever edit JSON objects with a fixed structure.

With a narrower problem, the search for a specific solution led to **JSON Patch (RFC 6902)**.

If you aren't familiar, JSON Patch is a standard format for describing changes to a JSON document. It uses simple operations: `add`, `remove`, `replace`, `move`, and `copy`.

Instead of asking the LLM to "find this text and write this text," we ask it to generate a patch operation. For *"Change the content type to text/plain"*, the agent outputs:

```json
[
  { "op": "replace", "path": "/header/content-type", "value": "text/plain" }
]
```

Why this works for us:

1. **No "search" required:** We don't need to match string content. We only need the `path`.
2. **Escaping handled:** The stringification issue goes away. The LLM generates the *value* of the code, and the JSON Patch library handles the insertion.
3. **Determinism:** It is much harder for the LLM to hallucinate when it is constrained to specific paths.

## The Trade-off: Schema Dependency

No solution is perfect. The downside of JSON Patch is that the precision of the edit is tied to the granularity of the JSON structure. If you have a nested object, JSON Patch is surgical. If you store a massive configuration as a single string value under one key, JSON Patch is blunt - you have to replace the whole string.

For our use case, with a granularly typed object structure, this works well, and it nudges us to keep that structure clean.

## The Result

The playground agent now handles complex tools, nested headers, and stringified code blocks without breaking syntax or losing data.

Below is the final UI - the agent proposes a fix, which renders as a diff. The user can then `Accept` or `Reject` the specific patch.

<video controls playsinline style="width: 100%; display: block; border-radius: 12px; margin: 2.5rem 0;">
  <source src="/videos/using-tp-agent.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

If you're curious about the implementation details, the patch logic lives in superglue's [open-source repository](https://github.com/superglue-ai/superglue).
