import React from "react";
import ListItem from "../admin/ListItem";

const ProductList = ({ products, getProductControles, icon }) => {
  const brandColumns = [
    { key: "name", label: "Product Name", render: (value) => value },
    { key: "model", label: "Model", render: (value) => value },
  ];
  return (
    <ListItem
      title="Brand List"
      items={products || []}
      columns={brandColumns}
      icon={icon}
      textColor="text-skyBlue"
      controles={getProductControles}
    />
  );
};

export default ProductList;
