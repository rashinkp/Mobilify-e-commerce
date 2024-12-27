import React from "react";
import { CreditCard } from "lucide-react";

const  PaymentSection = ({ selectedPayment, setSelectedPayment }) => {
  const paymentMethods = ["Razorpay", "Cash On Delivery", 'Wallet'];
  
  

  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <CreditCard className="mr-2" /> Payment Method
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedPayment === method
                ? "border-blue-500 bg-blue-50 dark:bg-black"
                : "hover:bg-gray-100 hover:dark:bg-gray-500"
            }`}
            onClick={() => setSelectedPayment(method)}
          >
            {method}
          </div>
        ))}
      </div>
    </section>
  );
};


export default PaymentSection