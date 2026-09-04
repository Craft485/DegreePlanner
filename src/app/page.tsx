import Link from "next/link";

export default function Home() {
  return (
    <div className="flex inset-0">
      <Link href="/planner">Go to Planner</Link>
    </div>
  );
}
