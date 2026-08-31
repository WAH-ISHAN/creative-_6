import os
import re

components_dir = r'C:\Users\USER\Downloads\creativefx-—-futuristic-creative-agency\src\components'

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, repl in replacements:
        new_content = re.sub(pattern, repl, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

replacements = [
    # text sizing
    (r'(?<!md:)text-6xl', r'text-4xl md:text-6xl'),
    (r'(?<!md:)text-5xl', r'text-3xl md:text-5xl'),
    (r'(?<!md:)text-4xl', r'text-2xl md:text-4xl'),
    (r'(?<!md:)text-3xl', r'text-xl md:text-3xl'),
    # grid columns
    (r'(?<!md:)grid-cols-2', r'grid-cols-1 md:grid-cols-2'),
    (r'(?<!md:)grid-cols-3', r'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'),
    (r'(?<!md:)grid-cols-4', r'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'),
    # flex directions
    (r'flex gap-(\d+)', r'flex flex-col md:flex-row gap-\1'),
    # padding
    (r'(?<!md:)px-12', r'px-4 md:px-12'),
    (r'(?<!md:)px-16', r'px-4 md:px-16'),
    (r'(?<!md:)px-24', r'px-4 md:px-24'),
    (r'(?<!md:)px-8', r'px-4 md:px-8'),
    (r'(?<!md:)py-24', r'py-12 md:py-24'),
    (r'(?<!md:)py-20', r'py-10 md:py-20'),
    (r'(?<!md:)py-32', r'py-16 md:py-32'),
    # max width
    (r'max-w-4xl', r'max-w-full md:max-w-4xl overflow-hidden'),
    (r'max-w-7xl', r'max-w-full md:max-w-7xl overflow-hidden'),
    # w-half
    (r'(?<!md:)w-1/2', r'w-full md:w-1/2'),
    (r'(?<!md:)w-1/3', r'w-full md:w-1/3'),
    (r'(?<!md:)w-2/3', r'w-full md:w-2/3'),
]

for root, _, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            replace_in_file(filepath, replacements)
