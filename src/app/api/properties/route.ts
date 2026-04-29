import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.property.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching properties count:", error);
    return NextResponse.json({ count: 0, error: "Failed to fetch count" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, zipCode = "00000" } = body;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    // Since Auth is deferred, find or create a dummy "Admin" user
    let user = await prisma.user.findFirst({ where: { email: "admin@lumenestate.local" } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: "admin@lumenestate.local" }
      });
    }

    const property = await prisma.property.create({
      data: {
        address,
        zipCode,
        userId: user.id,
      }
    });

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("Error saving property:", error);
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 });
  }
}
