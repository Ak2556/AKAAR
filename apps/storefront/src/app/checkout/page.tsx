"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Lock,
  Package,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldBlock, MetricTile, SummaryRow } from "@/components/ui/storefront-primitives";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";
import { useRuntimeCapabilities } from "@/context/RuntimeCapabilitiesContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const shippingMethods = [
  { id: "standard", name: "Standard Shipping", price: 99,  time: "5-7 business days" },
  { id: "express",  name: "Express Shipping",  price: 199, time: "2-3 business days" },
  { id: "overnight",name: "Priority Shipping", price: 399, time: "1-2 business days" },
];

const steps = ["Information", "Shipping", "Payment"];

const reassuranceNotes = [
  "Reviewed manufacturing flow",
  "Encrypted Razorpay checkout",
  "Clear delivery method before payment",
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const toast = useToast();
  const { formatPrice } = useSettings();
  const { localDataMode } = useRuntimeCapabilities();

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedShipping = shippingMethods.find((method) => method.id === formData.shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const tax = Math.round(totalPrice * 0.18);
  const orderTotal = totalPrice + shippingCost + tax;
  const featuredCartItem = items[0];

  const validateStep = () => {
    if (step === 1) {
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zip
      ) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep()) {
      setStep((current) => current + 1);
    }
  };

  const finalizeOrder = async (paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderData: {
            items: items.map((item) => ({
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
        toast.success(
          localDataMode
            ? "Local test payment completed. Order placed."
            : "Payment successful. Order placed."
        );
      } else {
        toast.error("Payment verification failed");
      }
    } catch {
      toast.error("Failed to verify payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = async () => {
    if (!razorpayLoaded && !localDataMode) {
      toast.error("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          items: items.map((item) => ({
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

      if (orderData.paymentMode === "mock") {
        await finalizeOrder({
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: `localpay_${Date.now()}`,
          razorpay_signature: "local-dev-signature",
        });
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AKAAR",
        description: `Order - ${items.length} item(s)`,
        order_id: orderData.orderId,
        handler: async function(response: any) {
          await finalizeOrder(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#d6b272",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="luxury-card rounded-[2.2rem] px-8 py-12 text-center">
            <Package className="mx-auto h-16 w-16 text-[var(--text-muted)]" />
            <h1 className="display-font mt-6 text-3xl text-[var(--text-primary)]">Your cart is empty</h1>
            <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">
              Add products to your cart before entering checkout.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)]"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="luxury-card rounded-[2.2rem] px-8 py-12 text-center"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
              <CheckCircle className="h-10 w-10 text-[var(--accent)]" />
            </div>
            <span className="luxury-kicker mt-8 block">Order confirmed</span>
            <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)]">Your build is in motion.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              We&apos;ve recorded the order and sent a confirmation email with the next production milestone.
            </p>
            <div className="mx-auto mt-8 max-w-sm rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-6">
              <p className="luxury-metric-label">Order number</p>
              <p className="mt-3 font-mono text-2xl text-[var(--accent)]">{orderId}</p>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
              <ConfirmMetric icon={Truck} text={selectedShipping?.time || "Shipping selected"} />
              <ConfirmMetric icon={Package} text="Confirmation email sent" />
              <ConfirmMetric icon={Shield} text="Quality review included" />
            </div>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/account/orders">
                <Button>View Order</Button>
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setRazorpayLoaded(true)} />
      <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue shopping
            </Link>
          </div>

          <section className="luxury-panel relative overflow-hidden rounded-[2.35rem] px-6 py-8 sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.12),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,199,0.1),transparent_24%)]" />
            <div className="relative z-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="flex flex-col justify-between gap-8">
                <div className="space-y-5">
                  <span className="luxury-kicker">Checkout</span>
                  <div className="space-y-2">
                    <p className="hero-wordmark text-[var(--text-primary)]">Secure</p>
                    <p className="hero-wordmark -mt-2 text-[var(--text-primary)]/18">Final</p>
                    <p className="hero-wordmark -mt-3 text-[var(--accent)]">Review</p>
                  </div>
                  <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                    This should feel like the last calm step before production starts. Confirm the destination, choose the delivery pace, and keep the full order context visible while you pay.
                  </p>
                </div>

                <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                  <HeroMetric label="Items" value={`${items.length}`} />
                  <HeroMetric label="Delivery" value={selectedShipping?.time || "Pending"} />
                  <HeroMetric label="Total" value={formatPrice(orderTotal)} />
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] xl:grid-cols-[1.08fr_0.92fr]">
                <div className="luxury-stage relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/8 p-5">
                  <p className="pointer-events-none absolute left-5 right-5 top-5 overflow-hidden text-[clamp(3rem,7vw,5rem)] font-semibold uppercase tracking-[-0.09em] text-white/[0.08]">
                    {featuredCartItem?.name || "Order"}
                  </p>
                  {featuredCartItem?.image ? (
                    <img
                      src={featuredCartItem.image}
                      alt={featuredCartItem.name}
                      className="hero-image-shadow absolute inset-x-5 bottom-5 top-16 h-[calc(100%-5.25rem)] w-[calc(100%-2.5rem)] rounded-[1.6rem] object-contain"
                    />
                  ) : (
                    <div className="absolute inset-x-5 bottom-5 top-16 overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[linear-gradient(145deg,#14171c_0%,#232a33_52%,#101114_100%)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(214,178,114,0.18),transparent_28%),radial-gradient(circle_at_78%_76%,rgba(125,211,199,0.12),transparent_28%)]" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2">
                    <MetricGlass
                      label="Lead item"
                      value={featuredCartItem?.name || "Cart review"}
                    />
                    <MetricGlass
                      label="Checkout mode"
                      value={localDataMode ? "Local test flow" : "Live payment"}
                    />
                  </div>
                </div>

                <div className="luxury-card rounded-[2rem] p-6">
                  <span className="luxury-kicker">Payment confidence</span>
                  <div className="mt-5 space-y-4">
                    {reassuranceNotes.map((note) => (
                      <div key={note} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <p className="text-sm leading-6 text-[var(--text-primary)]">{note}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-5">
                    <p className="luxury-metric-label">Step flow</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {steps.map((label, index) => {
                        const stepNumber = index + 1;
                        const complete = step > stepNumber;
                        const active = step === stepNumber;
                        return (
                          <div
                            key={label}
                            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${
                              complete
                                ? "border-[var(--accent)] bg-[var(--surface-highlight)] text-[var(--text-primary)]"
                                : active
                                  ? "border-[var(--text-primary)] text-[var(--text-primary)]"
                                  : "border-[var(--border)] text-[var(--text-muted)]"
                            }`}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current">
                              {complete ? <CheckCircle className="h-3.5 w-3.5" /> : stepNumber}
                            </span>
                            <span className="font-medium uppercase tracking-[0.14em]">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <section className="space-y-8">
              {step === 1 ? (
                <>
                  <CheckoutPanel title="Contact" kicker="Information" description="Use the best email and phone number for order confirmation, production clarifications, and dispatch updates.">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Email *">
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <FormField label="Phone">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                    </div>
                  </CheckoutPanel>

                  <CheckoutPanel title="Shipping address" kicker="Delivery" description="This is where the parts will actually go, so keep the address crisp and complete.">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="First Name *">
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <FormField label="Last Name *">
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <div className="sm:col-span-2">
                        <FormField label="Address *">
                          <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="luxury-input w-full rounded-full px-5 py-3"
                          />
                        </FormField>
                      </div>
                      <div className="sm:col-span-2">
                        <FormField label="Apartment, suite, etc.">
                          <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                            className="luxury-input w-full rounded-full px-5 py-3"
                          />
                        </FormField>
                      </div>
                      <FormField label="City *">
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <FormField label="State *">
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <FormField label="PIN Code *">
                        <input
                          type="text"
                          name="zip"
                          required
                          value={formData.zip}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        />
                      </FormField>
                      <FormField label="Country">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="luxury-input w-full rounded-full px-5 py-3"
                        >
                          <option>India</option>
                        </select>
                      </FormField>
                    </div>
                  </CheckoutPanel>
                </>
              ) : null}

              {step === 2 ? (
                <CheckoutPanel title="Shipping method" kicker="Speed" description="Choose the delivery pace that matches the urgency of the build.">
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-[1.4rem] border px-4 py-4 transition-all ${
                          formData.shippingMethod === method.id
                            ? "border-[var(--accent)] bg-[var(--surface-highlight)]"
                            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-accent)]"
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
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              formData.shippingMethod === method.id
                                ? "border-[var(--accent)]"
                                : "border-[var(--border-accent)]"
                            }`}
                          >
                            {formData.shippingMethod === method.id ? (
                              <div className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                            ) : null}
                          </div>
                          <div>
                            <p className="display-font text-2xl text-[var(--text-primary)]">{method.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{method.time}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{formatPrice(method.price)}</span>
                      </label>
                    ))}
                  </div>
                </CheckoutPanel>
              ) : null}

              {step === 3 ? (
                <CheckoutPanel title="Payment" kicker="Secure" description="The order summary stays visible while you finish payment so there are no hidden surprises.">
                  <div className="space-y-6">
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                          <Lock className="h-4 w-4 text-[var(--accent)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">Protected payment</p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">
                            Payments are processed through Razorpay with encrypted checkout.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                      <SummaryCell
                        label="Ship to"
                        value={`${formData.firstName} ${formData.lastName}`}
                        secondary={`${formData.address}${formData.apartment ? `, ${formData.apartment}` : ""}, ${formData.city}, ${formData.state} ${formData.zip}`}
                      />
                      <SummaryCell
                        label="Shipping"
                        value={selectedShipping?.name || "Standard"}
                        secondary={selectedShipping?.time || ""}
                      />
                    </div>
                  </div>
                </CheckoutPanel>
              ) : null}

              <div className="flex items-center justify-between gap-4">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep((current) => current - 1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <Button type="button" size="lg" onClick={handleContinue}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    onClick={initiatePayment}
                    disabled={isProcessing || (!razorpayLoaded && !localDataMode)}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay {formatPrice(orderTotal)}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </section>

            <aside className="xl:pl-2">
              <div className="sticky top-28 space-y-6">
                <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
                  <span className="luxury-kicker">Order summary</span>
                  <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Final review</h2>

                  <div className="mt-6 space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.id}-${item.material}`}
                        className="flex gap-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4"
                      >
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[var(--bg-primary)]">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-[var(--text-muted)]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="display-font text-xl text-[var(--text-primary)]">{item.name}</p>
                          {item.material ? (
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                              {item.material}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs text-[var(--text-secondary)]">Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--border)]">
                    <TotalRow label="Subtotal" value={formatPrice(totalPrice)} />
                    <TotalRow label="Shipping" value={formatPrice(shippingCost)} />
                    <TotalRow label="GST (18%)" value={formatPrice(tax)} />
                    <div className="flex items-center justify-between bg-[var(--bg-secondary)] px-4 py-5">
                      <span className="text-sm font-medium text-[var(--text-primary)]">Total</span>
                      <span className="text-lg font-semibold text-[var(--text-primary)]">{formatPrice(orderTotal)}</span>
                    </div>
                  </div>
                </section>

                <section className="luxury-card rounded-[2rem] p-6">
                  <span className="luxury-kicker">Need changes?</span>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    If the part still needs a different material, altered quantity, or a reviewed recommendation before payment, step back into the quote flow instead of forcing the purchase.
                  </p>
                  <Link href="/quote" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                    Return to quote review
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

function CheckoutPanel({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
      <span className="luxury-kicker">{kicker}</span>
      <h2 className="display-font mt-3 text-4xl text-[var(--text-primary)]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <FieldBlock label={label}>{children}</FieldBlock>;
}

function ConfirmMetric({ icon: Icon, text }: { icon: typeof Truck; text: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] px-5 py-5 text-center">
      <Icon className="mx-auto h-5 w-5 text-[var(--accent)]" />
      <p className="mt-3 text-sm text-[var(--text-primary)]">{text}</p>
    </div>
  );
}

function SummaryCell({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary: string;
}) {
  return <SummaryRow label={label} value={value} secondary={secondary} />;
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between bg-[var(--bg-secondary)] px-4 py-4">
      <span className="luxury-metric-label">{label}</span>
      <span className="luxury-summary-value">{value}</span>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <MetricTile label={label} value={value} />;
}

function MetricGlass({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
      <p className="luxury-metric-label text-white/42">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
