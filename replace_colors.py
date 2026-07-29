import os
import re

directory = 'src'

replacements = {
    'emerald': 'blue',
    'teal': 'cyan',
    '#10b981': '#3b82f6', # emerald-500 to blue-500
    '#010403': '#020617', # dark green to slate-950
    '#020806': '#0f172a', # slightly lighter green to slate-900
    'rgba(16,185,129': 'rgba(59,130,246', # emerald-500 rgba shadow to blue-500
    'bg-[#020806]': 'bg-[#0f172a]', 
    'bg-[#010403]': 'bg-[#020617]'
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            # Additional logic for uppercase equivalents if needed (e.g. Emerald, Teal)
            new_content = new_content.replace('Emerald', 'Blue').replace('Teal', 'Cyan')

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file_path}")

print("Done replacing colors.")
