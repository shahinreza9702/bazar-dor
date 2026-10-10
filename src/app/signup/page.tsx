import type { Metadata } from "next";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = {
  title: "রেজিস্টার | বাজার দর",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
