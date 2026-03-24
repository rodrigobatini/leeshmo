type OtherTextFieldProps = {
  /** Mostrar campo quando "Outro" / slug equivalente estiver selecionado */
  show: boolean;
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
};

export default function OtherTextField({
  show,
  value,
  onChange,
  label = "Descreva (obrigatorio ao escolher Outro)",
  placeholder = "Ex.: ...",
  maxLength = 200,
}: OtherTextFieldProps) {
  if (!show) return null;

  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
      <p className="mt-1 text-right text-xs text-muted-foreground">{value.length}/{maxLength}</p>
    </div>
  );
}
