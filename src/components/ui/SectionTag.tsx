import { sectionIndex, type SectionId } from "@/lib/data";

export function SectionTag({ id, label, className = "" }: { id: SectionId; label: string; className?: string }) {
  return (
    <p className={`tag ${className}`}>
      <b>{sectionIndex(id)}</b>
      <i aria-hidden="true" />
      {label}
    </p>
  );
}
