import React from 'react'
import { useAddProductMutation, useDeleteProductMutation, useGetAllProductsQuery, useGetProductQuery } from '../redux/slices/productApiSlice'

const useProductApi = () => {
  const [addProduct] = useAddProductMutation();
  const { data: products, isLoading } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation();
  return { addProduct, products, isLoading , deleteProduct }
}

export default useProductApi