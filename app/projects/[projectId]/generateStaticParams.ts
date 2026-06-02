import { MEDIA_ITEMS } from "@/lib/data";

export function generateStaticParams() {
    return MEDIA_ITEMS.map((item) => ({
        projectId: item.projectId,
    }));
}