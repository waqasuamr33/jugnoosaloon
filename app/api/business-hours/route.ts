import { NextResponse } from "next/server";

export interface BusinessHoursData {
  weekday_text: string[]; // e.g. ["Monday: 9:00 AM – 9:00 PM", ...]
  open_now: boolean | null;
  is_live: boolean;
}

const FALLBACK: BusinessHoursData = {
  weekday_text: ["Monday – Sunday: 9:00 AM – 9:00 PM"],
  open_now: null,
  is_live: false,
};

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (apiKey && placeId) {
    try {
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour (ISR)
      });

      if (response.ok) {
        const data = await response.json();

        if (data.status === "OK" && data.result?.opening_hours) {
          const oh = data.result.opening_hours;
          return NextResponse.json(
            {
              weekday_text: oh.weekday_text || FALLBACK.weekday_text,
              open_now: oh.open_now ?? null,
              is_live: true,
            } satisfies BusinessHoursData,
            {
              headers: {
                "Cache-Control":
                  "public, s-maxage=3600, stale-while-revalidate=86400",
              },
            }
          );
        }
      }
    } catch (err) {
      console.error("[business-hours] Google Places API error:", err);
    }
  }

  return NextResponse.json(FALLBACK);
}
