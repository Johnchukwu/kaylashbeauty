import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <main className="orderConfirmation">
      <div>
        <p>Payment submitted</p>
        <h1>Thank you for your order.</h1>
        <span>
          We are confirming your payment securely. You will receive an email once your order is
          ready to be processed.
        </span>
        <Link href="/">Continue shopping</Link>
      </div>
    </main>
  );
}
