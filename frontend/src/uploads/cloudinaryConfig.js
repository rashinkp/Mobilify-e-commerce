// src/config/cloudinaryConfig.js
export const CLOUDINARY_UPLOAD_PRESET = "Mobilify";
export const CLOUDINARY_CLOUD_NAME = "dxogdfuse";
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImageToCloudinary = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
