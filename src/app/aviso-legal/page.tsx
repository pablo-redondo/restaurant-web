import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Aviso legal',
  description: 'Aviso legal e información sobre el titular del sitio web de Restaurante Marqués.',
};

export default function AvisoLegalPage() {
  const year = new Date().getFullYear();
  return (
    <section className="bg-[#F1EFE9] px-5 sm:px-8 lg:px-[52px] py-16 sm:py-[88px]">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">Legal</p>
        <h1 className="font-heading font-bold text-[42px] tracking-[-0.5px] text-[#172E22] mb-10">
          Aviso legal
        </h1>

        <div className="space-y-8 text-[#5A6B60] text-[15px] leading-[1.8]">
          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">1. Datos identificativos</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:</p>
            <ul className="mt-3 space-y-1 ml-4 list-disc">
              <li><strong className="text-[#172E22]">Titular:</strong> Restaurante Marqués S.L.</li>
              <li><strong className="text-[#172E22]">CIF:</strong> B-00000000</li>
              <li><strong className="text-[#172E22]">Domicilio social:</strong> Calle Gran Vía, 45, 28013 Madrid</li>
              <li><strong className="text-[#172E22]">Email:</strong> info@marquesmadrid.es</li>
              <li><strong className="text-[#172E22]">Teléfono:</strong> +34 91 000 0000</li>
              <li><strong className="text-[#172E22]">Registro Mercantil:</strong> Madrid, Tomo 00000, Folio 00, Hoja M-000000</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">2. Objeto y ámbito de aplicación</h2>
            <p>El presente Aviso Legal regula el acceso y uso del sitio web de Restaurante Marqués. El acceso al mismo implica la aceptación plena y sin reservas de las presentes condiciones.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">3. Propiedad intelectual</h2>
            <p>Todos los contenidos del sitio web (textos, imágenes, diseño, logotipos) son propiedad de Restaurante Marqués S.L. o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa y por escrito.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">4. Exclusión de garantías y responsabilidad</h2>
            <p>Restaurante Marqués S.L. no garantiza la disponibilidad continua del sitio web ni la ausencia de errores en sus contenidos. La información sobre carta, horarios y precios puede variar sin previo aviso.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">5. Legislación aplicable</h2>
            <p>Este Aviso Legal se rige por la legislación española. Para cualquier controversia derivada del acceso o uso de este sitio, las partes se someten a los Juzgados y Tribunales de Madrid.</p>
          </div>

          <p className="text-[13px] text-[#8A9C90] border-t border-[#D8E2DC] pt-6">Última actualización: junio de {year}</p>
        </div>

        <div className="mt-12">
          <BackButton href="/" label="Volver al inicio" />
        </div>
      </div>
    </section>
  );
}
