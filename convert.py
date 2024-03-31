import argparse
import json
import markdown
from bs4 import BeautifulSoup


def replace_with_code_block(p, code):
    code = code.replace("'","&#x27;").replace('"','&quot;')
    code_card = f"""
    <div class="relative bg-gray-50 rounded-lg dark:bg-gray-700 p-4" style="margin-top:10px;">
        <div class="overflow-auto max-h-full pr-32">
            <pre><code id="code-block" class="text-sm text-gray-500 dark:text-gray-400 whitespace-pre">{code}</code></pre>
        </div>
    </div>
    """
    p.replace_with(BeautifulSoup(code_card, 'html.parser'))

def add_classes_to_elements(html_content):
    """
    Add classes to HTML elements.
    You can customize this function to add classes to other HTML elements.
    """
    soup = BeautifulSoup(html_content, 'html.parser')

    for h1_tag in soup.find_all('h1'):
        # text-5xl font-extrabold dark:text-white
        h1_tag['class'] = h1_tag.get('class', []) + ["font-extrabold", "dark:text-white"]
        h1_tag['style'] = 'font-size: 2.5rem;'
    
    for h2_tag in soup.find_all('h2'):
        # text-4xl font-bold dark:text-white
        h2_tag['class'] = h2_tag.get('class', []) + ["font-bold", "dark:text-white"]
        h2_tag['style'] = 'font-size: 2rem;'

    for h3_tag in soup.find_all('h3'):
        # text-3xl font-bold dark:text-white
        h3_tag['class'] = h3_tag.get('class', []) + ["font-bold", "dark:text-white"]
        h3_tag['style'] = 'font-size: 1.5rem;'

    for h4_tag in soup.find_all('h4'):
        # text-2xl font-bold dark:text-white
        h4_tag['class'] = h4_tag.get('class', []) + ["font-bold", "dark:text-white"]
        h4_tag['style'] = 'font-size: 1.25rem;'

    for h5_tag in soup.find_all('h5'):
        # text-xl font-bold dark:text-white
        h5_tag['class'] = h5_tag.get('class', []) + ["font-bold", "dark:text-white"]
        h5_tag['style'] = 'font-size: 1rem;'

    for h6_tag in soup.find_all('h6'):
        # text-lg font-bold dark:text-white
        h6_tag['class'] = h6_tag.get('class', []) + ["font-bold", "dark:text-white"]
        h6_tag['style'] = 'font-size: 0.75rem;'

    first_code_block_encountered = False
    for p in soup.find_all('p'):
        text = p.get_text().strip()
        if text.startswith("```") and text.endswith("```"):
            current_code = '\n'.join(text.split("\n")[1:-1])
            replace_with_code_block(p, current_code)


        elif text.startswith("```"):
            # Start of a code block
            current_code = '\n'.join(text.split("\n")[1:]) + '\n'
            first_code_block_encountered = True
            # delete element from html
            p.decompose()
        elif text.endswith("```"):
            # End of a code block
            current_code += '\n'.join(text.split("\n")[:-1])
            first_code_block_encountered = False
            replace_with_code_block(p, current_code)
        elif first_code_block_encountered:
            # Inside a code block
            current_code += text
            p.decompose()
    
    for p_tag in soup.find_all('p'):
        p_tag['class'] = p_tag.get('class', []) + ['mb-3', 'dark:text-gray-400']
        p_tag['style'] = 'color: #4B5563;'

    for ul_tag in soup.find_all('ul'):
        # max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400
        ul_tag['class'] = ul_tag.get('class', []) + ["max-w-lg", "space-y-1", "list-disc", "px-4", "dark:text-gray-400"]
        ul_tag['style'] = 'color: #4B5563;'

    for ol_tag in soup.find_all('ol'):
        # max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400
        ol_tag['class'] = ol_tag.get('class', []) + ["max-w-lg", "space-y-1", "list-decimal", "px-4", "dark:text-gray-400"]
        ol_tag['style'] = 'color: #4B5563;'

    for blockquote_tag in soup.find_all('blockquote'):
        # text-xl italic font-semibold text-gray-900 dark:text-white
        blockquote_tag['class'] = blockquote_tag.get('class', []) + ["text-xl", "italic", "font-semibold", "text-gray-900", "dark:text-white"]

    for a_tag in soup.find_all('a'):
        # font-medium text-blue-600 dark:text-blue-500 hover:underline
        a_tag['class'] = a_tag.get('class', []) + ["font-medium", "text-blue-600", "dark:text-blue-500", "hover:underline"]

    for img_tag in soup.find_all('img'):
        # h-auto max-w-full rounded-lg
        img_tag['class'] = img_tag.get('class', []) + ["h-auto", "max-w-full", "rounded-lg"]

    for hr_tag in soup.find_all('hr'):
        # h-px my-8 bg-gray-200 border-0 dark:bg-gray-700
        hr_tag['class'] = hr_tag.get('class', []) + ["h-px", "my-8", "bg-gray-200", "border-0", "dark:bg-gray-700"]


    return str(soup)

def main(markdown_file_path):

    id = markdown_file_path.split('/')[-1].split('.')[0]

    # Path to save the modified HTML file
    html_file_path = f'src/data/blog_entries/html_files/{id}.html'

    # Read the markdown file
    with open(markdown_file_path, 'r', encoding='utf-8') as file:
        markdown_content = file.read()

    # Convert markdown to HTML
    html_content = markdown.markdown(markdown_content)

    # Add classes to HTML elements
    modified_html_content = add_classes_to_elements(html_content)

    # Save the modified HTML to a file
    with open(html_file_path, 'w', encoding='utf-8') as file:
        file.write(modified_html_content)

    # read a json file
    with open('src/data/blog_entries/blogentries.json', 'r') as f:
        data = json.load(f)

    # add d to data
    for blogentry in data:
        if blogentry['id'] == id:
            blogentry["text"] = modified_html_content

    # save d as json
    with open('src/data/blog_entries/blogentries.json', 'w') as f:
        json.dump(data, f)

    print(f'HTML file saved to {html_file_path}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Convert Markdown to HTML and add classes to elements.')
    parser.add_argument('markdown_file', help='The path to the Markdown file to be converted.')

    args = parser.parse_args()

    main(args.markdown_file)
