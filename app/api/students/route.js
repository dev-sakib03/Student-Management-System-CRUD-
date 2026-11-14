import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error("GET /api/students:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load students." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, department } = body;

    if (![name, email, phone, department].every(
      (value) => typeof value === "string" && value.trim()
    )) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();
    const existingStudent = await Student.findOne({ email: normalizedEmail });

    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "A student with this email already exists." },
        { status: 409 }
      );
    }

    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      department: department.trim(),
    });

    return NextResponse.json(
      { success: true, message: "Student added successfully.", data: student },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "A student with this email already exists." },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0]?.message || "Invalid student data.";
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    console.error("POST /api/students:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create student." },
      { status: 500 }
    );
  }
}
