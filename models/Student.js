import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required."],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters."],
      maxlength: [80, "Name cannot exceed 80 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [120, "Email cannot exceed 120 characters."],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email."],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      minlength: [7, "Phone number is too short."],
      maxlength: [20, "Phone number is too long."],
    },
    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      enum: {
        values: ["Computer Science", "Electrical Engineering", "Business Administration", "Civil Engineering", "Mechanical Engineering", "Other"],
        message: "Please select a valid department.",
      },
    },
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
