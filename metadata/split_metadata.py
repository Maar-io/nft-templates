# python3 split_metadata.py   
import json
import os

def get_image_number(data):
    # Get the "image" value
    image = data.get('image')

    if image:
        # Split the "image" value by '/' and return the last part, without the file extension
        return os.path.splitext(image.split('/')[-1])[0]

    return None

# Create the output directory if it doesn't exist
if not os.path.exists('output'):
    os.makedirs('output')

# Open the JSON file and load its content
with open('input.json', 'r') as f:
    data = json.load(f)

# Iterate over each entry in the JSON array
for entry in data:
    # Get the image number
    image_number = get_image_number(entry)

    if image_number:
        # Create a new file and write the entry to the file
        with open(os.path.join('output', f'{image_number}.json'), 'w') as f:
            json.dump(entry, f, indent=4)