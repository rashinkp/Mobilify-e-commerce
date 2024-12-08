import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "../redux/slices/categoryApiSlices";

export const useCategoryApi = () => {
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: categories, isLoading } = useGetAllCategoryQuery();

  return { addCategory, deleteCategory, categories, isLoading };
};
