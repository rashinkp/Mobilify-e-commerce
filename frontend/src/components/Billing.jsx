import { CreditCard } from "lucide-react";

const PriceBreakdown = ({ order }) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  console.log(order)

  
  
  const totalOffer = order?.offerPrice;

  const actualPrice = order.price + totalOffer;


  const discount =
    order.couponApplied?.offerAmount || 0 ;
  
const subTotal = order.price * (order?.quantity || 1);


  const finalPrice = subTotal - discount;

  return (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between text-gray-600">
        <span>Original Price:</span>
        <span>₹{formatter.format(actualPrice)}</span>
      </div>

      <div className="flex items-center justify-between text-gray-600">
        <span>Offer Price:</span>
        <span>₹{formatter.format(order?.offerPrice)}</span>
      </div>

      <div className="flex items-center justify-between text-gray-600">
        <span>Price after offer :</span>
        <span>₹{formatter.format(order?.price  || 0)}</span>
      </div>

      <div className="flex items-center justify-between text-gray-600">
        <span>Price after quantity:</span>
        <span>₹{formatter.format(subTotal)}</span>
      </div>

      <div className="flex items-center justify-between text-green-600">
        <span>Coupon Discount:</span>
        <span>-₹{formatter.format(discount)}</span>
      </div>

      <div className="flex items-center justify-between text-gray-600">
        <span>Shipping:</span>
        <span>₹{formatter.format(order.shippingCost || 0)}</span>
      </div>

      <div className="h-px bg-gray-200 my-2" />

      <div className="flex items-center justify-between">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <span className="font-bold text-xl">
          ₹{formatter.format(finalPrice)}
        </span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
