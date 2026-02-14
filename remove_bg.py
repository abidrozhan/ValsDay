from rembg import remove
from PIL import Image
import os
import glob

# Directory containing the flowers
input_dir = r"d:\Kayla Saldrina\Valentine-Day\public\flowers"

# Find all jpeg files
files = glob.glob(os.path.join(input_dir, "*.jpeg"))

print(f"Found {len(files)} images to process...")

for file in files:
    try:
        # Define output path (same name, changed extension to .png)
        output_path = file.replace(".jpeg", ".png")
        
        print(f"Processing: {os.path.basename(file)} -> {os.path.basename(output_path)}")
        
        # Open input and remove background
        with open(file, 'rb') as i:
            with open(output_path, 'wb') as o:
                input_image = i.read()
                output_image = remove(input_image)
                o.write(output_image)
        
        print(f"Success: {os.path.basename(output_path)}")
        
    except Exception as e:
        print(f"Error processing {file}: {e}")

print("All done!")
