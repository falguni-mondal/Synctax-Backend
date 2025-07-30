const imageUrlGenerator = (image) => {
  const base64 = image.data.toString("base64");
  imageUrl = `data:${image.contentType};base64,${base64}`;

  return imageUrl;
};

module.exports = imageUrlGenerator;
