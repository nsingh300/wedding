import { db } from '@/lib/supabase-server';
import { BUCKET } from '@/lib/upload-rules';
import { wedding } from '@/config/wedding';

export type GuestPhoto = {
  id: string;
  url: string;
  guestName: string;
  eventId: string | null;
};

export type GuestPhotoGroup = {
  id: string;
  name: string;
  photos: GuestPhoto[];
};

export async function getGuestPhotos(): Promise<GuestPhoto[]> {
  try {
    const client = db();
    const { data, error } = await client
      .from('guest_photos')
      .select('id, guest_name, event_id, storage_path')
      .neq('moderation_status', 'rejected')
      .order('uploaded_at', { ascending: false });
    if (error || !data?.length) return [];

    const { data: signed, error: signErr } = await client.storage
      .from(BUCKET)
      .createSignedUrls(data.map((row) => row.storage_path), 60 * 60 * 24);
    if (signErr || !signed) return [];

    const urlByPath = new Map(signed.flatMap((item) => (item.signedUrl && item.path ? [[item.path, item.signedUrl] as const] : [])));
    return data.flatMap((row) => {
      const url = urlByPath.get(row.storage_path);
      if (!url) return [];
      return [{ id: row.id, url, guestName: row.guest_name, eventId: row.event_id ?? null }];
    });
  } catch {
    return [];
  }
}

export function groupGuestPhotos(photos: GuestPhoto[]): GuestPhotoGroup[] {
  const byEvent = new Map<string, GuestPhoto[]>();
  for (const photo of photos) {
    const key = photo.eventId ?? 'general';
    const list = byEvent.get(key) ?? [];
    list.push(photo);
    byEvent.set(key, list);
  }
  const groups = wedding.events
    .map((event) => ({ id: event.id, name: event.name, photos: byEvent.get(event.id) ?? [] }))
    .filter((group) => group.photos.length > 0);
  const general = byEvent.get('general') ?? [];
  if (general.length) groups.push({ id: 'general', name: 'General', photos: general });
  return groups;
}
