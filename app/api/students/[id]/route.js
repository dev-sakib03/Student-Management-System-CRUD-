import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Student from "@/models/Student";

export const runtime = "nodejs";

function validId(id) {
  return mongoose.isValidObjectId(id);
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID." },
        { status: 400 }
      );
    }

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
    const duplicate = await Student.findOne({
      email: normalizedEmail,
      _id: { $ne: id },
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Another student already uses this email." },
        { status: 409 }
      );
    }

    const student = await Student.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        department: department.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student updated successfully.",
      data: student,
    });
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

    console.error("PUT /api/students/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid student ID." },
        { status: 400 }
      );
    }

    await dbConnect();
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/students/[id]:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete student." },
      { status: 500 }
    );
  }
}
