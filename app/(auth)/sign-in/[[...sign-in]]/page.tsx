import { SignIn } from "@clerk/nextjs";

export default function page() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <SignIn />
    </section>
  );
}
