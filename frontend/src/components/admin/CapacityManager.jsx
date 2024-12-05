import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTrashAlt,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

const StorageCapacityManager = () => {
  const [capacities, setCapacities] = useState([
    { storage: "64GB", colors: ["Black", "White", "Blue"], stock: 10 },
    { storage: "128GB", colors: ["Black", "Silver", "Green"], stock: 8 },
    { storage: "256GB", colors: ["Black", "Gold", "Red"], stock: 5 },
  ]);

  const increaseStock = (index) => {
    const newCapacities = [...capacities];
    newCapacities[index].stock += 1;
    setCapacities(newCapacities);
  };

  const decreaseStock = (index) => {
    const newCapacities = [...capacities];
    if (newCapacities[index].stock > 0) {
      newCapacities[index].stock -= 1;
      setCapacities(newCapacities);
    }
  };

  const removeCapacity = (index) => {
    const newCapacities = capacities.filter((_, i) => i !== index);
    setCapacities(newCapacities);
  };

  const addCapacity = () => {
    setCapacities([
      ...capacities,
      { storage: "New Storage", colors: ["Black"], stock: 0 },
    ]);
  };

  const addColor = (index) => {
    const newColor = prompt("Enter the new color:");
    if (newColor && !capacities[index].colors.includes(newColor)) {
      const newCapacities = [...capacities];
      newCapacities[index].colors.push(newColor);
      setCapacities(newCapacities);
    } else if (newColor) {
      alert("Color already exists.");
    }
  };

  const removeColor = (index, colorIndex) => {
    const newCapacities = [...capacities];
    newCapacities[index].colors.splice(colorIndex, 1);
    setCapacities(newCapacities);
  };

  return (
    <div className=" mt-10 p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-black dark:text-white">
        Storage Capacity Manager
      </h1>
      <button
        onClick={addCapacity}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg transition duration-300 ease-in-out mx-auto block hover:scale-105"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        Add New Storage
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capacities.map((capacity, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-black dark:text-white  shadow-lg rounded-lg p-7 hover:shadow-xl transition duration-300 ease-in-out relative"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
              {capacity.storage}
            </h2>
            <div className=" mb-4 flex flex-col mt-9 gap-5">
              {capacity.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex px-5 justify-between rounded-lg bg-white dark:bg-darkBackground  items-center mb-2 mr-2"
                >
                  <span className=" py-3 px-2 rounded-md text-sm mr-2">
                    {color}
                  </span>
                  <button
                    onClick={() => removeColor(index, i)}
                    className="px-2 py-1 rounded-md transition duration-200"
                  >
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => addColor(index)}
                className="mb-4 bg-darkBackground dark:bg-darkBackground text-white px-4 py-1 rounded-md shadow-md transition duration-200"
              >
                <FontAwesomeIcon icon="fa-solid fa-plus" className="me-4" />
                Add Color
              </button>
            </div>
            <div className="flex justify-center mt-5 gap-5 items-center">
              <span>Add stock</span>
              <button
                onClick={() => decreaseStock(index)}
                className="bg-darkBackground text-white px-3 py-1 rounded-md shadow-md transition duration-200"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>

              <input
                type="number"
                id="first_name"
                class="bg-gray-50 border w-28 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
              <button
                onClick={() => increaseStock(index)}
                className="bg-darkBackground text-white px-3 py-1 rounded-md shadow-md transition duration-200"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button
              onClick={() => removeCapacity(index)}
              className="absolute top-6 right-14 p-1 rounded-full transition duration-200"
            >
              <FontAwesomeIcon icon="fa-solid fa-trash" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorageCapacityManager;
