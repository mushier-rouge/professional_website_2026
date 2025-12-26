import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { uploadAvatar, deleteAvatar } from "@/lib/storage/upload";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    // Check authentication
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided." },
        { status: 400 }
      );
    }

    // Verify user is uploading their own avatar
    if (userId !== userData.user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only upload your own avatar." },
        { status: 403 }
      );
    }

    // Upload the avatar
    const result = await uploadAvatar(file, userId);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    // Update profile with avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: result.url })
      .eq("user_id", userId);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: "Failed to update profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    // Check authentication
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = body.userId as string;

    // Verify user is deleting their own avatar
    if (userId !== userData.user.id) {
      return NextResponse.json(
        { ok: false, error: "You can only delete your own avatar." },
        { status: 403 }
      );
    }

    // Delete the avatar
    const result = await deleteAvatar(userId);

    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("user_id", userId);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: "Failed to update profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
