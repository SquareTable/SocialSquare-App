image_path = 'filepath-here'
#Import required Image library
from PIL import Image, ImageFilter

#Open existing image
OriImage = Image.open(image_path)
OriImage.show()

#Applying GaussianBlur filter
gaussImage = OriImage.filter(ImageFilter.GaussianBlur(10))
gaussImage.show()

#Save Gaussian Blur Image
gaussImage.save('filepath-here')