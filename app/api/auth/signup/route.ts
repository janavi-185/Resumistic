import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;
    console.log("Signup Request:", {
      email,
      username,
      passwordLength: password?.length,
    });

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const { data: existingUsers, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (selectError) {
      console.error("Supabase Select Error:", selectError);
      return NextResponse.json(
        { error: "Database connection failed", details: selectError.message },
        { status: 500 },
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          username: username || email.split("@")[0],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase User Creation Error:", error);
      return NextResponse.json(
        {
          error: "Failed to create user",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
