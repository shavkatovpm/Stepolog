import { notFound } from "next/navigation";

// Mavjud bo'lmagan har qanday yo'l: tilga mos 404
export default function CatchAll() {
  notFound();
}
