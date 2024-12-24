import React, { useRef, useState, useEffect } from "react";
import { imageValidationSchema } from "../../validationSchemas.js";
import Button from "../../components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { errorToast, successToast } from "../../components/toast/index.js";
import { uploadImageToCloudinary } from "../../uploads/cloudinaryConfig.js";
import { Link, useParams } from "react-router";
import {
  useGetProductQuery,
  useUpdateProductImageMutation,
} from "../../redux/slices/productApiSlice.js";
import { RotatingLines } from "react-loader-spinner";
import Modal from "../../components/Modal.jsx";
import { Upload, Trash2, Plus, Box, ChevronRight, Home } from "lucide-react";

const ManageImage = () => {
  const ImageRefs = Array.from({ length: 4 }, () => useRef());
  const [images, setImages] = useState([null, null, null, null]);
  const [deleteQueue, setDeleteQueue] = useState([]);
  const { id: productId } = useParams();
  const [updateImage] = useUpdateProductImageMutation();
  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const [isUploading, setIsUploading] = useState(false);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  const handleImageChange = async (e, index) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      try {
        await imageValidationSchema.validate({ file: selectedImage });
        const updatedImages = [...images];
        updatedImages[index] = selectedImage;
        setImages(updatedImages);
      } catch (validationError) {
        errorToast(validationError.message);
      }
    }
  };

  const handleDelete = () => {
    const index = deleteIndex;
    const updatedImages = [...images];
    if (typeof updatedImages[index] === "string") {
      setDeleteQueue((prevQueue) => [...prevQueue, index]);
    }
    updatedImages[index] = null;
    setIsDelModalOpen(false);
    setImages(updatedImages);
  };

  const uploadToCloudinary = async () => {
    setIsUploading(true);
    let newImages = images.filter((img) => img && typeof img !== "string");
    if (newImages.length < 1) {
      errorToast("Please select 1 new image to upload");
      setIsUploading(false);
      return true;
    }

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
        uploadedUrl: [...uploadedUrl],
        deleteQueue,
      });
      setIsUploading(false);
      successToast("Images updated successfully!");
      uploadedUrl = [];
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (isLoading || isUploading) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen p-4">
      {isDelModalOpen && (
        <Modal
          title="Are you sure?"
          description="This process cannot be undone..."
          controles={[
            {
              text: "Cancel",
              action: () => setIsDelModalOpen(false),
              style:
                "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100",
            },
            {
              text: "Delete",
              action: handleDelete,
              style: "text-white bg-red-600 hover:bg-red-700",
            },
          ]}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link to="/admin" className="flex items-center hover:text-blue-600">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            to="/admin/manage-products"
            className="flex items-center hover:text-blue-600"
          >
            <Box className="w-4 h-4 mr-2" />
            Product Management
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            to={`/admin/product/${product._id}`}
            className="hover:text-blue-600"
          >
            {product.name}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-700">Manage Images</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Images</h1>
          <p className="mt-2 text-gray-600">
            Upload up to 4 high-quality images of your product
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {image ? (
                <div className="relative group">
                  <div className="aspect-square">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => {
                        setIsDelModalOpen(true);
                        setDeleteIndex(index);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleImageClick(index)}
                  className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="p-2 rounded-full bg-white shadow-sm">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Add Image
                  </span>
                </button>
              )}
              <input
                ref={ImageRefs[index]}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="hidden"
              />
            </div>
          ))}
        </div>

        {/* Upload Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={uploadToCloudinary}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </button>
        </div>

        {/* Helper Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Images should be in JPG, PNG, or WebP format, with a maximum size of
            5MB each.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageImage;
