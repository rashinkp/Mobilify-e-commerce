import React from 'react'
import { useAddProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useGetProductQuery, useGetProductsQuery, useUpdateProductImageMutation, useUpdateProductMutation } from '../redux/slices/productApiSlice'

const useProductApi = () => {
  const [addProduct] = useAddProductMutation();
  const { data: products, isLoading } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [updateImage] = useUpdateProductImageMutation()
  return {
    addProduct,
    products,
    isLoading,
    deleteProduct,
    updateProduct,
    updateImage,
  };
}

export default useProductApi