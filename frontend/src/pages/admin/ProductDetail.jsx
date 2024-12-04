import React from 'react'
import ProductDetailCard from '../../components/admin/ProductDetails.jsx'
import StorageCapacityManager from '../../components/admin/CapacityManager.jsx'

const ProductDetail = () => {
  return (
    <div className='pt-20'>
      <ProductDetailCard role='admin' />
      <StorageCapacityManager />
    </div>
  )
}

export default ProductDetail