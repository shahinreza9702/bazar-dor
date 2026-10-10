"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        style: {
          fontFamily: "var(--font-geist-sans), sans-serif",
          direction: "ltr",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
      }}
    />
  );
}
