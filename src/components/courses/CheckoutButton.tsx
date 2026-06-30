"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";

interface CheckoutButtonProps {
  courseId: string;
}

function createIdempotencyKey(): string {
  return crypto.randomUUID();
}


export function CheckoutButton({ courseId }: CheckoutButtonProps) {
  const [checkoutActive, setCheckoutActive] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Layer 4: stable key per checkout attempt; new key only after modal closes
  const idempotencyKeyRef = useRef<string>(createIdempotencyKey());
  const isProcessingRef = useRef(false);

  const releaseCheckout = useCallback(() => {
    isProcessingRef.current = false;
    setCheckoutActive(false);
    idempotencyKeyRef.current = createIdempotencyKey();
  }, []);

  const handleCheckout = useCallback(async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/courses/${courseId}`);
      return;
    }

    // Layer 4: block duplicate clicks before React re-renders
    if (isProcessingRef.current || checkoutActive) {
      return;
    }

    isProcessingRef.current = true;
    setCheckoutActive(true);

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to create order");
      }

      const { orderId, amount, currency, keyId } = data.data;

      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Yogshala LMS",
        description: "Course Enrollment",
        order_id: orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
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
              alert(
                verifyData.message ||
                  verifyData.error ||
                  "Payment verification failed"
              );
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error");
          } finally {
            releaseCheckout();
          }
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#059669",
        },
        modal: {
          ondismiss: () => {
            releaseCheckout();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: unknown) {
        const failed = response as { error?: { description?: string } };
        alert(failed.error?.description || "Payment failed");
        releaseCheckout();
      });
      rzp.open();
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      const message =
        error instanceof Error ? error.message : "Checkout failed";
      alert(message);
      releaseCheckout();
    }
  }, [checkoutActive, courseId, releaseCheckout, router, session]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button
        size="lg"
        className="w-full mb-4 text-base"
        onClick={handleCheckout}
        disabled={checkoutActive}
      >
        {checkoutActive ? "Processing..." : "Enroll Now"}
      </Button>
    </>
  );
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): {
    open: () => void;
    on: (event: string, handler: (response: unknown) => void) => void;
  };
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}
