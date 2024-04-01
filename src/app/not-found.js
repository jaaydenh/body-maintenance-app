import Link from "next/link";

export const metadata = {
  title: "404 Not found",
};

export default function NotFound() {
  return (
    <div className="mt-20 text-center">
      <h1 className="mb-10 text-3xl font-extrabold">404 Not Found</h1>
      <p className="mb-20 text-xl">
        This page does not exist. Please check the URL and try again.
      </p>
      <Link className="mt-10 text-lg hover:underline" href="/">
        Return Home
      </Link>
    </div>
  );
}
