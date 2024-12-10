import React, { useRef, useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { errorToast, successToast } from "../../components/toast/index.js";
import { uploadImageToCloudinary } from "../../uploads/cloudinaryConfig.js";
import { useParams } from "react-router";
import {
  useGetProductQuery,
  useUpdateProductImageMutation,
} from "../../redux/slices/productApiSlice.js";
import { RotatingLines } from "react-loader-spinner";

const ManageImage = () => {
  const ImageRefs = Array.from({ length: 4 }, () => useRef());
  const [images, setImages] = useState([null, null, null, null]); 
  const [deleteQueue, setDeleteQueue] = useState([]); 

  const { id: productId } = useParams();
  const [updateImage] = useUpdateProductImageMutation();
  const { data: product, isLoading, error } = useGetProductQuery(productId);

  useEffect(() => {
    if (product?.images) {
      const initialImages = product.images.map((img) => img.secure_url);
      setImages((prev) => [
        ...initialImages,
        ...Array(4 - initialImages.length).fill(null),
      ]);
    }
  }, [product]);


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
    if (typeof updatedImages[index] === "string") {
      setDeleteQueue([...deleteQueue, updatedImages[index]]);
    }
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const uploadToCloudinary = async () => {
    let newImages = images.filter((img) => img && typeof img !== "string"); 
    if (newImages.length < 1) {
      errorToast('Please select 1 new image to upload')
      return true
    }
    const existingImages = images.filter(
      (img) => typeof img === "string" && !deleteQueue.includes(img)
    ); 
    let uploadedUrl = [];
    

    for (const image of newImages) {
      try {
        const data = await uploadImageToCloudinary(image);
        uploadedUrl.push(data);
        newImages = null;
      } catch (error) {
        console.error("Upload error:", error);
      }
    }


    try {
      await updateImage({
        productId,
        uploadedUrl: [...uploadedUrl]
      });
      successToast("Images updated successfully!");
      uploadedUrl=[]
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="h-screen w-full absolute top-0 z-50 left-0 backdrop-blur-sm bg-black/30 flex justify-center items-center">
          <RotatingLines
            visible={true}
            height="50"
            width="50"
            color="grey"
            strokeColor="#fff"
            strokeWidth="2"
            animationDuration="8"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      </div>
    );
  }

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
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
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
