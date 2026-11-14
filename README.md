# CampusFlow — Student Management System

A responsive CRUD application built with Next.js App Router, Tailwind CSS, MongoDB Atlas and Mongoose.

## Features
- Create, read, update and delete students
- Student fields: name, email, phone and department
- Search by name, email, phone or department
- Filter by department
- Dashboard statistics
- Server-side validation and duplicate-email prevention
- Responsive layout

## Requirements
- Node.js 20.9+
- npm
- MongoDB Atlas account (or local MongoDB)

## Setup
1. Install dependencies: `npm install`
2. Create `.env.local` in the project root.
3. Add your MongoDB connection string:
   `MONGODB_URI=mongodb+srv://...`
4. Run locally: `npm run dev`
5. Open `http://localhost:3000`

## API
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

## Notes
Do not commit `.env.local` or publish your MongoDB credentials. For deployment, add `MONGODB_URI` in your hosting provider's environment variables.
