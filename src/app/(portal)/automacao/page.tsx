import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutomacaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Automação</h1>
        <p className="mt-1 text-sm text-muted-foreground">Fluxos e gatilhos para publicar com menos atrito.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Em breve</CardTitle>
          <CardDescription>Estamos preparando integrações e sequências automáticas no mesmo estilo do painel Lovable.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Por enquanto use o calendário e a biblioteca para organizar seu ritmo. Esta área vai conectar disparos, lembretes e republicação.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
