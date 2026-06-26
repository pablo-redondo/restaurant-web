import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Política de privacidad y protección de datos de Restaurante Marqués conforme al RGPD y la LOPD.',
};

export default function PrivacidadPage() {
  const year = new Date().getFullYear();
  return (
    <section className="bg-[#F1EFE9] px-[52px] py-[88px]">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#172E22] text-[10px] font-bold tracking-[2.5px] uppercase mb-4">Legal</p>
        <h1 className="font-heading font-bold text-[42px] tracking-[-0.5px] text-[#172E22] mb-10">
          Política de privacidad
        </h1>

        <div className="prose-custom space-y-8 text-[#5A6B60] text-[15px] leading-[1.8]">
          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">1. Responsable del tratamiento</h2>
            <p>Restaurante Marqués S.L. · Calle Gran Vía, 45, 28013 Madrid · CIF: B-00000000 · Email: info@marquesmadrid.es · Teléfono: +34 91 000 0000.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">2. Datos que recogemos</h2>
            <p>Recogemos únicamente los datos necesarios para gestionar las reservas y tu cuenta: nombre, apellidos, dirección de correo electrónico, teléfono y preferencias de visita. No recogemos datos de pago en esta web.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">3. Finalidad y base legal</h2>
            <p>Tus datos se tratan para: (a) gestionar tu reserva y comunicarte cambios — base legal: ejecución de un contrato; (b) enviarte información sobre nuestra carta y eventos si nos das tu consentimiento explícito — base legal: consentimiento.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">4. Conservación de datos</h2>
            <p>Conservamos tus datos mientras mantengamos una relación contractual contigo y durante los plazos legalmente exigidos (máximo 5 años para datos de reservas conforme a la normativa fiscal).</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">5. Tus derechos</h2>
            <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a info@marquesmadrid.es, adjuntando copia de tu DNI. Tienes derecho a reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">6. Cookies</h2>
            <p>Esta web utiliza exclusivamente cookies técnicas imprescindibles para su funcionamiento (sesión de usuario). No utilizamos cookies de seguimiento ni publicitarias.</p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-[20px] text-[#172E22] mb-3">7. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o divulgación. La transmisión de datos se realiza siempre mediante conexión cifrada (HTTPS).</p>
          </div>

          <p className="text-[13px] text-[#8A9C90] border-t border-[#D8E2DC] pt-6">Última actualización: junio de {year}</p>
        </div>

        <div className="mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[#172E22] font-bold text-[12px] tracking-[1.5px] uppercase border-b-2 border-[#C8DC2E] pb-[3px] hover:text-[#8A9C1E] transition">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
