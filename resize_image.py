from PIL import Image

def resize_image_to_4_3_with_background(image_path, output_path):
    with Image.open(image_path) as img:
        original_width, original_height = img.size
        
        # Determine the target width and height for a 4:3 aspect ratio
        aspect_ratio = 4 / 3
        if original_width / original_height > aspect_ratio:
            # Width is the limiting factor
            target_width = original_width
            target_height = int(target_width / aspect_ratio)
        else:
            # Height is the limiting factor
            target_height = original_height
            target_width = int(target_height * aspect_ratio)
        
        # Create a new image with a white background
        new_img = Image.new("RGB", (target_width, target_height), (255, 255, 255))
        
        # Calculate position to paste the original image
        x = (target_width - original_width) // 2
        y = (target_height - original_height) // 2
        
        # Paste the original image onto the centered background
        new_img.paste(img, (x, y))
        
        # Save the new image
        new_img.save(output_path)
        print(f"Image resized to 4:3 aspect ratio with white background and saved to {output_path}")

# Example usage
image_path = 'blog_entries/covers/genai-powered-excel-add-in-01.webp'
output_path = 'blog_entries/covers/genai-powered-excel-add-in-01_4_3.webp'
resize_image_to_4_3_with_background(image_path, output_path)
