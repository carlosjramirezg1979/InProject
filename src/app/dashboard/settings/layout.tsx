import { SettingsNav } from "@/components/settings-nav";

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
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
                <SettingsNav />
            </aside>
            <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
    </div>
  );
}
