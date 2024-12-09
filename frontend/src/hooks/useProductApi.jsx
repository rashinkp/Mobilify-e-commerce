import React from 'react'
import { useAddProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useGetProductQuery, useUpdateProductMutation } from '../redux/slices/productApiSlice'

const useProductApi = () => {
  const [addProduct] = useAddProductMutation();
  const { data: products, isLoading } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  return { addProduct, products, isLoading , deleteProduct, updateProduct }
}

export default useProductApi