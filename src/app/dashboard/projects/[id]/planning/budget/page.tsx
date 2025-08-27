import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BudgetPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Presupuesto y Costos</CardTitle>
        <CardDescription>
          Estimación y gestión de los costos y el presupuesto del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenido del presupuesto y costos...</p>
      </CardContent>
    </Card>
  );
}
