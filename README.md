# Nicolas Website

This is my personal website, build with Vue.js, Flowbite and Tailwind CSS.

Check it out at https://nicolasneudeck.com/

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Add a Blog Entry

1. Write the blog entry in a markdown file and save it to `blog_entries/md_files`.
2. Visit https://markdowntohtml.com/#converter and convert the Markdown file into a html file. 
3. Save the html file in the `blog_entries/html_files` folder.
4. Add a entry in the `src/data/blog_entries/blogentries.json` JSON file. Add everything except for text.
5. Style the HTML file
    ```sh
    python style.py src/data/blog_entries/html_files/<file_name>.html
    ```