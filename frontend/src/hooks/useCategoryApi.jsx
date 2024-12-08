import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useGetAllCategoryQuery,
} from "../redux/slices/categoryApiSlices";

export const useCategoryApi = () => {
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const [editCategory] = useEditCategoryMutation()

  return { addCategory, deleteCategory,editCategory, categories, isLoading };
};
