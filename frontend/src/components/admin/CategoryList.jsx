import React from "react";
import ListItem from "./ListItem";

const CategoryList = ({
  categories,
  categoryColumns,
  getCategoryControles,
  icon,
}) => (
  <ListItem
    title="Category List"
    items={categories || []}
    columns={categoryColumns}
    icon={icon}
    textColor="text-skyBlue"
    controles={getCategoryControles}
  />
);

export default CategoryList;
