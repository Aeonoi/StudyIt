"use client";
import Navbar from "@/components/Navbar";
export default function Home() {
	return (
		<div
			className=" items-center justify-items-center 
      min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
		>
			<Navbar />
			<div className="underline font-bold text-red-100">This is a test</div>
			<p>This is a next.js project</p>
		</div>
	);
}
