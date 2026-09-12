import fitz

doc = fitz.open('reference.pdf')
print('Total pages:', len(doc))

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=200)
    pix.save(f'page_{i+1}_highres.png')
    print(f'--- PAGE {i+1} ---')
    print('Rect:', page.rect)
    text = page.get_text()
    print('Text content:\n', text.strip())
    
    images = page.get_images()
    print('Images count:', len(images))
    for j, img in enumerate(images):
        xref = img[0]
        base_img = doc.extract_image(xref)
        image_bytes = base_img['image']
        image_ext = base_img['ext']
        w = base_img['width']
        h = base_img['height']
        filename = f'extracted_p{i+1}_img{j+1}.{image_ext}'
        with open(filename, 'wb') as f:
            f.write(image_bytes)
        print(f'  Image {j+1}: {w}x{h} saved to {filename}')
