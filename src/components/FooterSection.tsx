export default function FooterSection() {
  return (
    <footer className="mt-auto border-t border-[#e1e9e2] bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          <b className="text-gray-800">বাজার দর</b> — প্রয়োজনীয় পণ্যের
          দাম এক নজরে।
        </span>
        <span className="text-right">
          সব দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </span>
      </div>
    </footer>
  );
}
