/**
 * Component-scoped CSS. React 19 hoists and dedupes <style href precedence>.
 * Rules go into @layer components so Tailwind utilities always win; the layer
 * order statement guarantees that even if this tag lands before globals.css.
 */
export function Style({ id, css }: { id: string; css: string }) {
  return (
    <style href={`c-${id}`} precedence="default">
      {`@layer theme, base, components, utilities;@layer components{${css}}`}
    </style>
  );
}
