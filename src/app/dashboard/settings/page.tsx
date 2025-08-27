import { SettingsNav } from "@/components/settings-nav";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SettingsNav />
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Perfil</h3>
                            <p className="text-sm text-muted-foreground">
                                Actualiza la información de tu perfil.
                            </p>
                        </div>
                        <Separator />
                        <p>Selecciona una opción del menú para empezar.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
