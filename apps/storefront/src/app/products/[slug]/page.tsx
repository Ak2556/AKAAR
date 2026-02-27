"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Heart, Share2, Check, Truck, Shield, RefreshCw } from "lucide-react";
import { ProductViewer3D } from "@/components/products/ProductViewer3D";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

// Mock product data - replace with actual data fetching
const mockProduct = {
  id: "1",
  name: "Precision Gear Assembly",
  slug: "precision-gear-assembly",
  category: "Industrial",
  price: 149,
  description: "High-precision gear system designed for industrial machinery. Manufactured using advanced 3D printing technology with tight tolerances and exceptional durability.",
  features: [
    "Tolerance: ±0.05mm",
    "Material: Nylon PA12",
    "Surface finish: Smooth",
    "Operating temp: -40°C to 120°C",
  ],
  specifications: [
    { label: "Dimensions", value: "50mm x 50mm x 25mm" },
    { label: "Weight", value: "45g" },
    { label: "Material", value: "Nylon PA12" },
    { label: "Color", value: "Natural / Custom" },
    { label: "Lead Time", value: "3-5 business days" },
    { label: "Min Order", value: "1 unit" },
  ],
  materials: ["Nylon PA12", "ABS", "PETG", "Resin"],
};

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedMaterial, setSelectedMaterial] = useState(mockProduct.materials[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const toast = useToast();

  const isWishlisted = isInWishlist(mockProduct.id);

  const handleAddToCart = () => {
    addItem({
      id: `${mockProduct.id}-${selectedMaterial}`,
      name: mockProduct.name,
      slug: mockProduct.slug,
      price: mockProduct.price,
      material: selectedMaterial,
    }, quantity);
    toast.success(`Added ${quantity} ${mockProduct.name} to cart`);
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: mockProduct.id,
      name: mockProduct.name,
      slug: mockProduct.slug,
      price: mockProduct.price,
      category: mockProduct.category,
    });
    if (isWishlisted) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = mockProduct.name;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm mb-8"
        >
          <Link href="/products" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-secondary)]">{mockProduct.category}</span>
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--accent)]">{mockProduct.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProductViewer3D />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
                {mockProduct.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {mockProduct.name}
              </h1>
              <p className="text-[var(--text-secondary)] mt-4">
                {mockProduct.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[var(--accent)]">
                ${mockProduct.price}
              </span>
              <span className="text-[var(--text-muted)]">per unit</span>
            </div>

            {/* Material Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Material</label>
              <div className="flex flex-wrap gap-3">
                {mockProduct.materials.map((material) => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                      selectedMaterial === material
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-[var(--text-muted)] text-sm">
                  Total: ${(mockProduct.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={isWishlisted ? "border-red-500 text-red-500 hover:bg-red-500/10" : ""}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-[var(--border)] pt-8">
              <h3 className="font-semibold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <Check className="w-5 h-5 text-[var(--accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-4 border border-[var(--border)] rounded-lg">
                <Truck className="w-6 h-6 text-[var(--accent)] mb-2" />
                <span className="text-xs text-[var(--text-secondary)]">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 border border-[var(--border)] rounded-lg">
                <Shield className="w-6 h-6 text-[var(--accent)] mb-2" />
                <span className="text-xs text-[var(--text-secondary)]">Quality Guaranteed</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 border border-[var(--border)] rounded-lg">
                <RefreshCw className="w-6 h-6 text-[var(--accent)] mb-2" />
                <span className="text-xs text-[var(--text-secondary)]">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8">Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProduct.specifications.map((spec, index) => (
              <div
                key={index}
                className="p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]"
              >
                <span className="text-sm text-[var(--text-muted)]">{spec.label}</span>
                <p className="font-medium mt-1">{spec.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
