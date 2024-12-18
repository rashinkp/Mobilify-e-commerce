import React from 'react'
import ListItem from '../admin/ListItem';

const BrandList = ({
  brands,
  getBrandControles,
  icon,
}) => {
  const brandColumns = [
    { key: "name", label: "Brand Name", render: (value) => value },
    { key: "description", label: "Description", render: (value) => value },
    { key: "website", label: "Website", render: (value) => value },
  ];
  return (
    <ListItem
      items={brands || []}
      columns={brandColumns}
      controles={getBrandControles}
    />
  );
}

export default BrandList