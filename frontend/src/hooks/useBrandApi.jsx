import React from "react";
import {
  useAddBrandMutation,
  useDeleteBrandMutation,
  useGetAllBrandQuery,
} from "../redux/slices/adminApiSlices";

const useBrandApi = () => {
  const [addBrand] = useAddBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const { data: brands, isLoading } = useGetAllBrandQuery();

  return { addBrand, deleteBrand, brands, isLoading };
};

export default useBrandApi;
