import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const AddCartButton = () => {
  return (
    <>
      <button className="flex items-center justify-center border border-darkText rounded-full py-2 px-4 w-full text-darkText dark:text-lightText dark:border-lightText ">
        <span className="mr-2">
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="lg"
            className="cursor-pointer dark:text-lightText"
          />
        </span>
        Add to Cart
      </button>
    </>
  );
}

export default AddCartButton