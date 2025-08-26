import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;
  const token = req.headers.get("authorization")?.split(" ")[1];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const id = params.id;
  const token = req.headers.get("authorization")?.split(" ")[1];
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const id = params.id;
  const token = req.headers.get("authorization")?.split(" ")[1];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}