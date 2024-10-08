"use client";
import { useEffect } from "react";

export default function Page({ params }: { params: { hashId: string } }) {
  const fetchUrl = async () => {
    try {
      const response = await fetch(`/api/shortner?hashedId=${params.hashId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch URL");
      }
      const data = await response.json();
      return data.longUrl;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUrl().then((url) => {
      window.location.href = url;
    });
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-violet-50 to-indigo-50">
      <div className="loader bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
        <label>Redirecting...</label>
        <div className="loading"></div>
      </div>
    </div>
  );
}
