import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const onlyPublished = req.nextUrl.searchParams.get("published") === "true";
  const filter = onlyPublished ? { published: true } : {};
  const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.slug) {
    body.slug = body.title
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  const post = await BlogPost.create(body);
  return NextResponse.json(post, { status: 201 });
}
