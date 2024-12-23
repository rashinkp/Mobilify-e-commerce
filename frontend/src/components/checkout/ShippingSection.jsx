import React from "react";
import { Truck } from "lucide-react";

 const ShippingSection = ({
  shippingMethods,
  selectedShipping,
  setSelectedShipping,
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Truck className="mr-2" /> Shipping Method
      </h2>
      {shippingMethods.map((method) => (
        <div
          key={method.id}
          className={`p-4 border rounded-lg cursor-pointer mb-2 ${
            selectedShipping?.id === method.id
              ? "border-blue-500 bg-blue-50 dark:bg-black"
              : "hover:bg-gray-100 hover:dark:bg-gray-500"
          }`}
          onClick={() => setSelectedShipping(method)}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{method.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{method.time}</p>
            </div>
            <p className="font-bold">&#x20b9;{method.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </section>
  );
};


export default ShippingSection