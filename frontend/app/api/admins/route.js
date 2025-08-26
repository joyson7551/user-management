import { NextResponse } from "next/server";
import { auth } from "./auth"; // Optional: add authentication here if needed

export async function GET(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}