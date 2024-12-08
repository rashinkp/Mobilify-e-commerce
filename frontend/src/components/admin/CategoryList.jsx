import React from "react";
import ListItem from "./ListItem";

const CategoryList = ({
  categories,
  getCategoryControles,
  icon,
}) => {
    const categoryColumns = [
    { key: "name", label: "Category Name", render: (value) => value },
    { key: "description", label: "Description", render: (value) => value },
    {
      key: "isSoftDeleted",
      label: "SoftDelete",
      render: (value) => (value ? "True" : "False"),
    },
  ];
  return((
  <ListItem
    title="Category List"
    items={categories || []}
    columns={categoryColumns}
    icon={icon}
    textColor="text-skyBlue"
    controles={getCategoryControles}
  />
)
)}

export default CategoryList;
