import React, { useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { successToast } from "../../components/toast/index.js";
import { uploadImageToCloudinary } from "../../uploads/cloudinaryConfig.js";
import useProductApi from "../../hooks/useProductApi.jsx";
import { useParams } from 'react-router'
import { useUpdateProductImageMutation } from "../../redux/slices/productApiSlice.js";
const ManageImage = () => {
  const ImageRefs = Array.from({ length: 4 }, () => useRef());
  const [images, setImages] = useState([null, null, null, null]);

  const { id: productId } = useParams();
  const [updateImage] = useUpdateProductImageMutation();

  const handleImageClick = (index) => {
    ImageRefs[index].current.click();
  };

  const handleImageChange = (e, index) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const updatedImages = [...images];
      updatedImages[index] = selectedImage;
      setImages(updatedImages);
    }
  };

  const handleDelete = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const uploadToCloudinary = async () => {
    const filteredImages = images.filter((img) => img !== null);

    if (filteredImages.length < 1) {
      alert("Please select at least one image");
      return;
    }

    const uploadedUrls = [];
    for (const image of filteredImages) {
      try {
        const data = await uploadImageToCloudinary(image);
        uploadedUrls.push(data);
        await updateImage({productId, uploadedUrls});
        successToast("Image uploading completed");
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    
  };

  return (
    <div className="flex flex-col ms-14 items-center justify-center space-y-6 p-4 overflow-auto">
      {/* Image Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden shadow-md border border-black h-40 sm:h-72 w-full"
          >
            {image ? (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-40 sm:h-72 w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-4 py-2 bg-black text-white rounded-full"
                  >
                    <FontAwesomeIcon icon="fa-solid fa-trash" />
                  </button>
                </div>
              </>
            ) : (
              <div
                onClick={() => handleImageClick(index)}
                className="h-full flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer"
              >
                <span className="text-gray-500">Add Image</span>
              </div>
            )}
            <input
              ref={ImageRefs[index]}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
              hidden
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button
          action={uploadToCloudinary}
          icon={<FontAwesomeIcon icon="fa-solid fa-upload" />}
          text="Upload Image"
        />
      </div>
    </div>
  );
};

export default ManageImage;
