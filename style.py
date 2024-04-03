import argparse
import json
import markdown2
from bs4 import BeautifulSoup


def replace_with_code_block(pre, code):
    code_card = f"""
    <div class="mb-2 relative bg-gray-50 rounded-lg" style="margin-top:10px;">
        <div class="overflow-auto max-h-full">
            {pre}
        </div>
    </div>
    """
    pre.replace_with(BeautifulSoup(code_card, 'html.parser'))

def add_classes_to_elements(html_content):
    """
    Add classes to HTML elements.
    You can customize this function to add classes to other HTML elements.
    """
    soup = BeautifulSoup(html_content, 'html.parser')

    for h1_tag in soup.find_all('h1'):
        # text-5xl font-extrabold
        h1_tag['class'] = h1_tag.get('class', []) + ["font-extrabold"]
        h1_tag['style'] = 'font-size: 2.5rem;'
    
    for h2_tag in soup.find_all('h2'):
        # text-4xl font-bold
        h2_tag['class'] = h2_tag.get('class', []) + ["font-bold"]
        h2_tag['style'] = 'font-size: 2rem;'

    for h3_tag in soup.find_all('h3'):
        # text-3xl font-bold
        h3_tag['class'] = h3_tag.get('class', []) + ["font-bold"]
        h3_tag['style'] = 'font-size: 1.5rem;'

    for h4_tag in soup.find_all('h4'):
        # text-2xl font-bold
        h4_tag['class'] = h4_tag.get('class', []) + ["font-bold"]
        h4_tag['style'] = 'font-size: 1.25rem;'

    for h5_tag in soup.find_all('h5'):
        # text-xl font-bold
        h5_tag['class'] = h5_tag.get('class', []) + ["font-bold"]
        h5_tag['style'] = 'font-size: 1rem;'

    for h6_tag in soup.find_all('h6'):
        # text-lg font-bold
        h6_tag['class'] = h6_tag.get('class', []) + ["font-bold"]
        h6_tag['style'] = 'font-size: 0.75rem;'

    for code_tag in soup.find_all('code'):
        # text-sm text-gray-500 whitespace-pre
        code_tag['class'] = code_tag.get('class', []) + ["text-sm", "text-gray-500", "whitespace-pre"]
        code_tag['class'] = [s.replace("lang-", "language-") for s in code_tag['class']]
        code_tag['style'] = 'color: #4B5563;'

    for pre_tag in soup.find_all('pre'):
        # check if pre tag hast style attribute background-color: rgb(249 250 251);
        if pre_tag.get('style') is None:
            pre_tag['style'] = 'background-color: rgb(249 250 251);'
            replace_with_code_block(pre_tag, pre_tag.get_text())
    
    for p_tag in soup.find_all('p'):
        p_tag['class'] = p_tag.get('class', []) + ['mb-3']
        p_tag['style'] = 'color: #4B5563;'

    for ul_tag in soup.find_all('ul'):
        # max-w-md space-y-1 text-gray-500 list-disc list-inside 
        ul_tag['class'] = ul_tag.get('class', []) + ["max-w-lg", "space-y-1", "list-disc", "list-inside", "px-4"]
        ul_tag['style'] = 'color: #4B5563;'

    for ol_tag in soup.find_all('ol'):
        # max-w-md space-y-1 text-gray-500 list-decimal list-inside 
        ol_tag['class'] = ol_tag.get('class', []) + ["max-w-lg", "space-y-4", "list-decimal", "list-inside ", "px-4", "text-gray-500"]
        ol_tag['style'] = 'list-style: decimal;'

    for blockquote_tag in soup.find_all('blockquote'):
        blockquote_tag['class'] = blockquote_tag.get('class', []) + ["p-2", "my-3"]
        for p_tag in blockquote_tag.find_all('p'):
            p_tag['class'] = p_tag.get('class', []) + ["italic", "font-medium", "leading-relaxed"]
            p_tag['class'] = [s for s in p_tag['class'] if s != 'mb-3']
            p_tag['style'] = 'font-style: italic;'
    for a_tag in soup.find_all('a'):
        # font-medium text-blue-600 hover:underline
        a_tag['class'] = a_tag.get('class', []) + ["font-medium", "text-blue-600", "hover:underline"]

    for img_tag in soup.find_all('img'):
        # h-auto max-w-full rounded-lg
        img_tag['class'] = img_tag.get('class', []) + ["h-auto", "max-w-full", "rounded-lg"]

    for hr_tag in soup.find_all('hr'):
        # h-px my-8 bg-gray-200 border-0
        hr_tag['class'] = hr_tag.get('class', []) + ["h-px", "my-8", "bg-gray-200", "border-0"]


    return str(soup)

def main(html_file_path):

    id = html_file_path.split('/')[-1].split('.')[0]

    # Read the markdown file
    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Add classes to HTML elements
    modified_html_content = add_classes_to_elements(html_content)

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
    parser.add_argument('html_file', help='The path to the HTML file to be styled.')

    args = parser.parse_args()

    main(args.html_file)
