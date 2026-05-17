"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";

interface CheckoutButtonProps {
  courseId: string;
}

export function CheckoutButton({ courseId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to create order");
      }

      const { orderId, amount, currency, keyId } = data.data;

      // 2. Open Razorpay modal
      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Yogshala LMS",
        description: "Course Enrollment",
        order_id: orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              alert("Payment successful! You are now enrolled.");
              router.push("/dashboard");
            } else {
              alert(verifyData.message || verifyData.error || "Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error");
          }
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#059669", // Brand color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(response.error.description || "Payment failed");
      });
      rzp.open();

    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button 
        size="lg" 
        className="w-full mb-4 text-base" 
        onClick={handleCheckout} 
        disabled={loading}
      >
        {loading ? "Processing..." : "Enroll Now"}
      </Button>
    </>
  );
}
