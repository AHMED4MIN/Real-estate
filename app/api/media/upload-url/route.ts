import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const imageTypes = new Set(["image/avif", "image/jpeg", "image/png", "image/webp"]);
const videoTypes = new Set(["video/mp4", "video/quicktime", "video/webm"]);
type R2Settings = { accessKeyId: string; secretAccessKey: string; bucket: string; endpoint: string; publicUrl: string; supabaseUrl: string; supabaseKey: string };
type R2Configuration = R2Settings | { missing: string[] };

function config(): R2Configuration {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET ?? process.env.R2_BUCKET_NAME;
  const endpoint = process.env.R2_ENDPOINT?.replace(/\/$/, "") ?? (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
  const publicUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL)?.replace(/\/$/, "");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missing = [
    !accessKeyId && "R2_ACCESS_KEY_ID",
    !secretAccessKey && "R2_SECRET_ACCESS_KEY",
    !bucket && "R2_BUCKET_NAME (or R2_BUCKET)",
    !endpoint && "R2_ENDPOINT (or R2_ACCOUNT_ID)",
    !publicUrl && "NEXT_PUBLIC_R2_PUBLIC_URL",
    !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !supabaseKey && "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean) as string[];
  if (missing.length > 0) return { missing };
  return { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey!, bucket: bucket!, endpoint: endpoint!, publicUrl: publicUrl!, supabaseUrl: supabaseUrl!, supabaseKey: supabaseKey! };
}

export async function POST(request: NextRequest) {
  const settings = config();
  if ("missing" in settings) return NextResponse.json({ error: `R2 setup is incomplete. Add: ${settings.missing.join(", ")}.`, missing: settings.missing }, { status: 503 });

  const accessToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!accessToken) return NextResponse.json({ error: "Sign in as an administrator first." }, { status: 401 });

  const auth = createClient(settings.supabaseUrl, settings.supabaseKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user }, error: userError } = await auth.auth.getUser(accessToken);
  if (userError || !user) return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });

  const { data: profile } = await auth.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });

  const body = await request.json() as { name?: string; contentType?: string; kind?: "image" | "video" };
  const allowedTypes = body.kind === "video" ? videoTypes : imageTypes;
  if (!body.name || !body.contentType || !body.kind || !allowedTypes.has(body.contentType)) {
    return NextResponse.json({ error: "This file type is not allowed." }, { status: 400 });
  }

  const extension = body.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "file";
  const key = `properties/${body.kind}s/${crypto.randomUUID()}.${extension}`;
  const client = new S3Client({
    region: "auto",
    endpoint: settings.endpoint,
    credentials: { accessKeyId: settings.accessKeyId, secretAccessKey: settings.secretAccessKey },
  });
  const uploadUrl = await getSignedUrl(client, new PutObjectCommand({
    Bucket: settings.bucket,
    Key: key,
    ContentType: body.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }), { expiresIn: 300 });

  return NextResponse.json({ uploadUrl, publicUrl: `${settings.publicUrl}/${key}` });
}
