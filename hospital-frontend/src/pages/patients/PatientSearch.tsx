import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyPatientService } from '@/core/services/patient/dummy-patient-service';
import { Avatar } from '@/shared/components/ui/Avatar';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import type { Patient } from '@/core/types';

export function PatientSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const data = await dummyPatientService.search(value);
    setResults(data);
    setSearched(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[28px] font-semibold text-neutral-900 tracking-tight">Buscar Paciente</h2>
      </div>

      <div className="mb-10">
        <SearchInput
          placeholder="Buscar por nombre, ID o tel&eacute;fono..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searched && results.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <tbody className="divide-y divide-neutral-200">
              {results.map((patient) => (
                <tr
                  key={patient.idPatient}
                  onClick={() => navigate(`/patients/${patient.idPatient}`)}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <Avatar name={patient.name} surname={patient.surname} id={patient.idPatient} size="md" />
                    <div>
                      <div className="text-base font-semibold text-neutral-900">{patient.name} {patient.surname}</div>
                      <div className="text-xs text-neutral-500">ID: {patient.idPatient}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call</span>
                        +52 {patient.phoneNumber}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mt-0.5">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mail</span>
                        {patient.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-semibold text-primary bg-primary-lighter rounded transition-all">
                      Ver Ficha
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searched && results.length === 0 && (
        <EmptyState icon="search_off" message="No se encontraron pacientes con ese criterio de b&uacute;squeda" />
      )}

      {!searched && (
        <EmptyState icon="manage_search" message="Ingrese un nombre o ID para buscar" />
      )}
    </div>
  );
}
