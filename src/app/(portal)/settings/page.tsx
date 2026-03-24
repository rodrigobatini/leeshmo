import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Preferências do app Leeshmo e atalhos para a sua conta.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conta e segurança</CardTitle>
          <CardDescription>E-mail, senha e perfil público são gerenciados pelo Clerk: use o menu do seu avatar (canto superior direito).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aqui vão entrar preferências do workspace (idioma, notificações, integrações). Por enquanto, tudo passa pelo avatar.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
