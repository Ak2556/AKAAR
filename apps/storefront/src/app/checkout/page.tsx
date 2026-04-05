"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ArrowLeft, CreditCard, Truck, Shield, Lock,
  ChevronRight, CheckCircle, Package
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 499, time: "5-7 business days" },
  { id: "express", name: "Express Shipping", price: 999, time: "2-3 business days" },
  { id: "overnight", name: "Overnight Shipping", price: 1999, time: "Next business day" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const toast = useToast();
  const { formatPrice } = useSettings();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    shippingMethod: "standard",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedShipping = shippingMethods.find((m) => m.id === formData.shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const tax = Math.round(totalPrice * 0.18); // 18% GST
  const orderTotal = totalPrice + shippingCost + tax;

  const validateStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.firstName || !formData.lastName ||
          !formData.address || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const initiatePayment = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            quantity: item.quantity,
            material: item.material,
          })),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await response.json();

      // Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Akaar 3D Printing",
        description: `Order - ${items.length} item(s)`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price,
                    quantity: item.quantity,
                    material: item.material,
                  })),
                  subtotal: totalPrice,
                  shippingCost,
                  tax,
                  total: orderTotal,
                  shippingMethod: selectedShipping?.name || "Standard",
                  shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                  },
                  email: formData.email,
                  phone: formData.phone,
                },
              }),
            });

            const result = await verifyResponse.json();

            if (result.success) {
              setOrderId(result.orderNumber);
              setOrderComplete(true);
              clearCart();
              toast.success("Payment successful! Order placed.");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Failed to verify payment");
          }
          setIsProcessing(false);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#00fff5",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Add some products to your cart before checking out.
            </p>
            <Link href="/products">
              <Button variant="primary">Browse Products</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-8 border border-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Thank you for your order. We've sent a confirmation email with your order details.
            </p>

            <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] mb-8">
              <p className="text-sm text-[var(--text-muted)] mb-2">Order Number</p>
              <p className="text-2xl font-mono text-[var(--accent)]">{orderId}</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 border border-[var(--border)] rounded-lg">
                <Truck className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {selectedShipping?.time}
                </p>
              </div>
              <div className="p-4 border border-[var(--border)] rounded-lg">
                <Package className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  Confirmation email sent
                </p>
              </div>
              <div className="p-4 border border-[var(--border)] rounded-lg">
                <Shield className="w-6 h-6 text-[var(--accent)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-secondary)]">
                  Quality guaranteed
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/account/orders">
                <Button variant="primary">View Order</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/products"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2 text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            {["Information", "Shipping", "Payment"].map((label, index) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step > index + 1
                      ? "text-[var(--accent)]"
                      : step === index + 1
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step > index + 1
                        ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                        : step === index + 1
                        ? "border-2 border-[var(--accent)] text-[var(--accent)]"
                        : "border border-[var(--border)]"
                    }`}
                  >
                    {step > index + 1 ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="hidden sm:block font-medium">{label}</span>
                </div>
                {index < 2 && (
                  <ChevronRight className="w-5 h-5 mx-4 text-[var(--text-muted)]" />
                )}
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {/* Step 1: Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
                    <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
                    <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Address *</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Apartment, suite, etc.</label>
                        <input
                          type="text"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">PIN Code *</label>
                        <input
                          type="text"
                          name="zip"
                          required
                          value={formData.zip}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                        >
                          <option>India</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {step === 2 && (
                <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
                  <h2 className="text-xl font-semibold mb-6">Shipping Method</h2>
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.shippingMethod === method.id
                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              formData.shippingMethod === method.id
                                ? "border-[var(--accent)]"
                                : "border-[var(--border)]"
                            }`}
                          >
                            {formData.shippingMethod === method.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-[var(--text-muted)]">{method.time}</p>
                          </div>
                        </div>
                        <span className="font-semibold">{formatPrice(method.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[var(--accent)]" />
                    Payment
                  </h2>

                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)]">
                      <h3 className="font-medium mb-4">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Subtotal</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">Shipping</span>
                          <span>{formatPrice(shippingCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--text-muted)]">GST (18%)</span>
                          <span>{formatPrice(tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-[var(--border)]">
                          <span>Total</span>
                          <span className="text-[var(--accent)]">{formatPrice(orderTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address Summary */}
                    <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)]">
                      <h3 className="font-medium mb-2">Shipping To</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {formData.firstName} {formData.lastName}<br />
                        {formData.address}{formData.apartment && `, ${formData.apartment}`}<br />
                        {formData.city}, {formData.state} {formData.zip}<br />
                        {formData.country}
                      </p>
                    </div>

                    <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)]">
                      <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                        <Shield className="w-5 h-5 text-[var(--accent)]" />
                        Secure payment powered by Razorpay. Your payment information is encrypted and secure.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={initiatePayment}
                    disabled={isProcessing || !razorpayLoaded}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {formatPrice(orderTotal)}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.material}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-[var(--text-muted)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        {item.material && (
                          <p className="text-xs text-[var(--text-muted)]">{item.material}</p>
                        )}
                        <p className="text-sm text-[var(--text-secondary)]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[var(--border)] pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Shipping</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-3 border-t border-[var(--border)]">
                    <span>Total</span>
                    <span className="text-[var(--accent)]">{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
