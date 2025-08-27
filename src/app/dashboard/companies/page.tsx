
'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { CompanyCard } from "@/components/company-card";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Company } from "@/types";
import { Loader2 } from "lucide-react";

export default function CompaniesPage() {
  const { user, userProfile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      if (!user || !userProfile?.companyIds || userProfile.companyIds.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(collection(db, "companies"), where("id", "in", userProfile.companyIds));
        const querySnapshot = await getDocs(q);
        const userCompanies = querySnapshot.docs.map(doc => doc.data() as Company);
        setCompanies(userCompanies);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [user, userProfile]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Mis Empresas</h1>
          <p className="text-muted-foreground">
            Seleccione una empresa para ver sus proyectos o para crear uno nuevo.
          </p>
        </div>
      </div>

       {loading ? (
         <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
            <h2 className="text-xl font-semibold">No se encontraron empresas</h2>
            <p className="text-muted-foreground mt-2">Póngase en contacto con el administrador para que le asigne a una empresa.</p>
        </div>
      )}
    </div>
  );
}
