export default function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
      <span style={{ fontSize: 10, color: "var(--m-text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
        {label}
      </span>
      <span style={{ fontSize: 12, color: "var(--m-text2)", lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}
