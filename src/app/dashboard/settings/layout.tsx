
export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight">Configuración</h1>
            <p className="text-muted-foreground">
                Gestiona la configuración de tu cuenta y de la aplicación.
            </p>
        </div>
        <div>
            {children}
        </div>
    </div>
  );
}
