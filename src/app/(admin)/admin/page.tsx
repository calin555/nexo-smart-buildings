import { requireUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireUser();
  return <main className="panel"><p className="eyebrow">Administrare</p><h1 className="mt-2 text-3xl font-semibold">Spațiu intern protejat</h1><p className="mt-4 text-slate">Permisiuni active pentru {user.name}. Modulele operaționale vor fi adăugate în milestone-urile următoare.</p></main>;
}
