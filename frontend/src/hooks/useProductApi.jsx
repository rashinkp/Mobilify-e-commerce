import React from 'react'
import { useAddProductMutation, useGetAllProductsQuery } from '../redux/slices/productApiSlice'

const useProductApi = () => {
  const [addProduct] = useAddProductMutation();
  const {data:products , isLoading} = useGetAllProductsQuery()
  return {addProduct , products,isLoading}
}

export default useProductApi