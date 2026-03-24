import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">Biblioteca</p>
        <CardTitle>Assets e playbooks</CardTitle>
        <CardDescription>Área pronta para templates, checklists e referências por caminho.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted-foreground)]">
          Vamos usar esta área para distribuir frameworks por perfil e por objetivo de crescimento.
        </p>
      </CardContent>
    </Card>
  );
}
