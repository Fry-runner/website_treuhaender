import { motion } from 'motion/react';
import { ActiveView } from '../types';
import { Mail, Phone, CalendarRange, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface AboutProps {
  onNavigate: (view: ActiveView) => void;
  onOpenConsultation: () => void;
}

// Custom modern Swiss Minimalist portrait/image representation tile
const TeamPortrait = ({ initials, name, highlight = false }: { initials: string; name: string; highlight?: boolean }) => {
  return (
    <div className={`relative aspect-[4/5] w-full max-w-[280px] mx-auto lg:mx-0 bg-transparent border rounded-[3px] overflow-hidden group select-none flex flex-col justify-between p-6 transition-all duration-700 ${
      highlight ? 'border-brand-violet/80 shadow-[0_8px_24px_rgba(217,26,33,0.02)]' : 'border-brand-gray-light'
    }`}>
      {/* Decorative architectural grid background / fine lines in Swiss Treuhand style */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-40">
        <div className="w-full h-px bg-brand-gray-light" />
        <div className="w-full flex justify-between h-px bg-brand-gray-light" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-brand-gray-light" />
        <div className="absolute right-8 top-0 bottom-0 w-px bg-brand-gray-light" />
      </div>

      {/* Modern abstract fine-line graphics within card */}
      <div className="absolute inset-x-0 top-1/3 flex justify-center pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100" className={`transition-all duration-700 ${
          highlight ? 'text-brand-violet/25' : 'text-brand-gray-light/30 group-hover:text-brand-violet/25'
        }`}>
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.75" fill="none" />
          <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Top identification label */}
      <span className="font-mono text-[9px] tracking-widest text-brand-gray-medium font-semibold">
        PORTRAET // {initials === 'LQ' ? 'FOUNDER' : 'EXPERT'}
      </span>

      {/* Center Initials Graphic portrait placeholder */}
      <div className="relative z-10 flex items-center justify-center my-auto">
        <span className={`font-display font-light text-5xl md:text-6xl tracking-tighter transition-all duration-700 ${
          highlight ? 'scale-105 text-brand-violet text-glow' : 'text-brand-graphite/90 group-hover:scale-105 group-hover:text-brand-violet'
        }`}>
          {initials}
        </span>
      </div>

      {/* Bottom info signature overlay inside portrait cards */}
      <div className="relative z-10">
        <div className={`w-6 h-[1.5px] mb-2 transition-colors duration-700 ${
          highlight ? 'bg-brand-violet' : 'bg-brand-gray-light group-hover:bg-brand-violet'
        }`} />
        <p className="font-sans text-[8px] uppercase tracking-widest text-brand-gray-medium font-black leading-none">
          MANDATSFUEHRUNG
        </p>
        <p className="font-mono text-[9px] text-brand-graphite mt-1 uppercase">
          {initials === 'LQ' ? 'Laura Quabba · 1993' : 'Laura Keiser · Treuhand'}
        </p>
      </div>
    </div>
  );
};
export default function About({ onNavigate, onOpenConsultation }: AboutProps) {
  const [secIntroRef, secIntroInView] = useInView();
  const [secTeamRef, secTeamInView] = useInView();
  const [secStandardsRef, secStandardsInView] = useInView();
  const [secQualitiesRef, secQualitiesInView] = useInView();

  const qualities = [
    {
      num: '01',
      title: 'Langjährige Kontinuität',
      desc: 'Seit 1993 erfolgreich in der Betreuung Schweizer KMUs sowie anspruchsvoller privater Mandate im Herzen von Zürich.'
    },
    {
      num: '02',
      title: 'Direkter & persönlicher Kontakt',
      desc: 'Keine wechselnden Sachbearbeiter oder anonyme Abteilungen. Verlässlicher Dialogue auf Augenhöhe direkt mit der Inhaberin.'
    },
    {
      num: '03',
      title: 'Starke Spezialisten-Allianz',
      desc: 'Bei komplexen Rechts-, Revisions- oder Steuerfragen greifen wir gezielt auf unser bewährtes Zürcher Expertennetzwerk zurück.'
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* TOP INTRO BLOCK (About Us Core) */}
        <div ref={secIntroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch mb-20 md:mb-28">
          
          {/* Left Column: Ultra-Minimalist Editorial Info Card */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-brand-gray-light p-8 md:p-10 rounded-[3px] bg-white transition-all duration-700">
            <div>
              <span className={`font-sans text-[10px] uppercase tracking-[0.25em] font-black block mb-1 transition-colors duration-700 ${secIntroInView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
                KANZLEIDATEN
              </span>
              <h3 className="font-display font-black text-3xl text-brand-graphite leading-none mt-2">
                1993
              </h3>
              <p className="font-sans text-xs text-brand-gray-medium mt-1">
                Gründung in Zürich-Wipkingen
              </p>
              
              <div className="h-px bg-brand-gray-light my-8" />
              
              <p className="font-sans text-sm text-brand-gray-medium leading-relaxed mb-6">
                Unsere Strukturen sind bewusst schlank und effizient gehalten. Wir verzichten auf repräsentatives Prestige und investieren unsere Energie direkt in die präzise Betreuung Ihrer Mandate.
              </p>
            </div>

            <div className="mt-8">
              <div className="h-px bg-brand-gray-light mb-8" />
              <div className="flex flex-col gap-3">
                <a 
                  href="mailto:office@quabba.ch" 
                  className="flex items-center gap-3 font-sans text-xs text-brand-graphite hover:text-brand-violet transition-colors group"
                >
                  <span className="p-2 bg-brand-gray-light/30 group-hover:bg-brand-violet/5 rounded-sm transition-colors text-brand-gray-medium group-hover:text-brand-violet">
                    <Mail className="w-4 h-4" />
                  </span>
                  office@quabba.ch
                </a>
                <a 
                  href="tel:+41443653000" 
                  className="flex items-center gap-3 font-sans text-xs text-brand-graphite hover:text-brand-violet transition-colors group"
                >
                  <span className="p-2 bg-brand-gray-light/30 group-hover:bg-brand-violet/5 rounded-sm transition-colors text-brand-gray-medium group-hover:text-brand-violet">
                    <Phone className="w-4 h-4" />
                  </span>
                  +41 44 365 30 00
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Key Editorial Textual Content */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start">
            <span className={`font-sans text-[11px] uppercase tracking-[0.2em] font-black mb-2 transition-colors duration-700 ${secIntroInView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
              KANZLEIPROFIL
            </span>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-brand-graphite tracking-tight mb-6">
              Über uns
            </h2>
            
            <p className="font-sans text-brand-gray-medium text-lg leading-relaxed mb-6">
              Wir sind fest von einem Grundsatz überzeugt: Wirkungsvolles Treuhandwesen geht weit über das sture Ausfüllen von Formularen und Buchen von Belegen hinaus. Es erfordert echtes Verständnis für die individuellen wirtschaftlichen und privaten Hintergründe. Diesen klaren Blick für das Ganze pflegen wir mit unseren Mandanten seit der Gründung des Einzelunternehmens im Jahr 1993.
            </p>

            <p className="font-sans text-brand-gray-medium leading-relaxed text-sm">
              Für Sie bedeutet dies: Kurze Entscheidungswege, ehrliche Worte und eine Partnerin, die das Vertrauen in sie durch absolute Fehlerlosigkeit und zeitnahe Bearbeitung rechtfertigt.
            </p>
          </div>

        </div>

        {/* TEAM MEMBERS SEGMENT (Extremely Large & Prominent Team Profile Rows) */}
        <div ref={secTeamRef} className="border-t border-brand-gray-light pt-16 md:pt-24 mb-20 animate-fade-in">
          <span className={`font-sans text-[10px] uppercase tracking-[0.25em] font-black block mb-12 text-center lg:text-left transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
            PARTNER & EXPERTEN
          </span>

          <div className="flex flex-col gap-24 md:gap-32">
            
            {/* EMPLOYEE Row 1: Laura Quabba (Exactly as prominent as About Us Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left Side: Elegant Minimalist Image Tile (Bildkachel) */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <TeamPortrait initials="LQ" name="Laura Quabba" highlight={secTeamInView} />
              </div>
              
              {/* Right Side: Detailed Profile Content */}
              <div className="lg:col-span-8 flex flex-col justify-start items-start">
                <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
                  GESCHÄFTSFÜHRUNG
                </span>
                <h3 className="font-display font-bold text-3xl lg:text-4xl text-brand-graphite tracking-tight mb-4">
                  Laura Quabba
                </h3>
                <p className="font-sans text-xs text-brand-gray-medium font-bold uppercase tracking-wider mb-6">
                  Inhaberin seit 1993
                </p>

                {/* Highly prominent narrative bio, matching About Us size */}
                <p className="font-sans text-brand-gray-medium text-lg leading-relaxed mb-6">
                  Als Gründerin und strategische Seele von Quabba Treuhand prägt Laura Quabba seit mehr als 30 Jahren das Gesicht unserer Kanzlei in Zürich-Wipkingen. Mit unkomplizierter Direktheit steht sie für erstklassiges Treuhandwesen auf Augenhöhe.
                </p>
                <p className="font-sans text-brand-gray-medium leading-relaxed text-sm mb-8">
                  Ihre Arbeit zeichnet sich durch die fundierte persönliche Rundumbetreuung von klein- und mittelständischen Schweizer Unternehmen (KMU) aus, um Inhabern maximale Entlastung und verlässliche Entscheidungsstrukturen zu bieten.
                </p>

                {/* Core areas of expertise for Laura Quabba */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-brand-gray-light">
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Beratung und Führung von Kundenbuchhaltungen</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Administrative Organisation & Prozesssteuerung</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Coaching für Geschäftsführer und Inhabende</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Strategischer Sparringspartner für Schweizer KMUs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* EMPLOYEE Row 2: Laura Keiser (Exactly as prominent as About Us Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 border-t border-brand-gray-light">
              {/* Left Side: Elegant Minimalist Image Tile (Bildkachel) */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <TeamPortrait initials="LK" name="Laura Keiser" highlight={secTeamInView} />
              </div>
              
              {/* Right Side: Detailed Profile Content */}
              <div className="lg:col-span-8 flex flex-col justify-start items-start">
                <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-medium'}`}>
                  KANZLEIORGANISATION & ASSISTENZ
                </span>
                <h3 className="font-display font-bold text-3xl lg:text-4xl text-brand-graphite tracking-tight mb-4">
                  Laura Keiser
                </h3>
                <p className="font-sans text-xs text-brand-gray-medium font-bold uppercase tracking-wider mb-6">
                  In Ausbildung zur Kauffrau mit eidg. Fachausweis
                </p>

                {/* Highly prominent narrative bio, matching About Us size */}
                <p className="font-sans text-brand-gray-medium text-lg leading-relaxed mb-6">
                  Mit grossem Engagement unterstützt Laura Keiser unsere tägliche Mandatsarbeit und sichert die hohe administrative Zuverlässigkeit, die unsere anspruchsvollen Kunden gewohnt sind.
                </p>
                <p className="font-sans text-brand-gray-medium leading-relaxed text-sm mb-8">
                  Konzentriert, strukturiert und serviceorientiert managt sie die ersten Kontaktpunkte unserer Kanzlei und begleitet laufende Prozesse verlässlich im Hintergrund.
                </p>

                {/* Core areas of expertise for Laura Keiser */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-brand-gray-light">
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Mithilfe bei Monats-, Quartals- und Jahresabschlüssen</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Administrative Arbeiten & Mandatsunterstützung</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Telefonischer Erstkontakt & Mandantenbetreuung</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-700 ${secTeamInView ? 'text-brand-violet' : 'text-brand-gray-light/80'}`} />
                    <span className="font-sans text-xs text-brand-graphite font-semibold">Empfang & Vorbereitung von Kundenterminen</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SWISS QUALITY STANDARDS & ACCREDITATION GRID (Point 3 & 4: Swiss Minimalist Grid Symmetry & Regulatory Trust) */}
        <div ref={secStandardsRef} className="border-t border-brand-gray-light pt-16 md:pt-24 mb-20 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className={`font-sans text-[10px] uppercase tracking-[0.25em] font-black block mb-2 transition-colors duration-700 ${secStandardsInView ? 'text-brand-violet text-glow' : 'text-brand-gray-medium'}`}>
                QUALITÄT & MANDATSSICHERHEIT
              </span>
              <h3 className="font-display font-semibold text-2xl md:text-3xl text-brand-graphite tracking-tight">
                Schweizer Standards, lückenlos gelebt.
              </h3>
            </div>
            <div className="max-w-md">
              <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                Als inhabergeführte Kanzlei unterstehen wir den strengen gesetzlichen Verordnungen und bewährten Standesregeln des Schweizer Treuhandwesens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-gray-light border border-brand-gray-light rounded-[3px] overflow-hidden">
            {/* Standard 1 */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-between transition-colors duration-500">
              <div>
                <span className={`font-mono text-[10px] tracking-widest font-semibold block mb-4 transition-colors duration-700 ${secStandardsInView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>
                  01 // CONFORMITY
                </span>
                <h4 className="font-heading font-black text-sm text-brand-graphite mb-3 uppercase tracking-wider">
                  Gesetzliche Konformität (OR)
                </h4>
                <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                  Strikte Einhaltung aller rechtlichen Vorgaben des Schweizerischen Obligationenrechts (OR) sowie der aktuellen Richtlinien der Eidgenössischen Steuerverwaltung (ESTV). Jedes uns anvertraute Mandat wird rechtssicher, sauber dokumentiert und revisionsbereit strukturiert.
                </p>
              </div>
            </div>

            {/* Standard 2 */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-between transition-colors duration-500">
              <div>
                <span className={`font-mono text-[10px] tracking-widest font-semibold block mb-4 transition-colors duration-700 ${secStandardsInView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>
                  02 // COMPETENCE
                </span>
                <h4 className="font-heading font-black text-sm text-brand-graphite mb-3 uppercase tracking-wider">
                  Berufliche Weiterbildungspflicht
                </h4>
                <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                  Das schweizerische Steuerrecht und Sozialversicherungssystem unterliegen stetigem Wandel. Durch kontinuierliche Absolvierung fachspezifischer Fortbildungen gewährleisten wir absolute Aktualität unseres Wissens und eine strategisch vorausschauende Begleitung.
                </p>
              </div>
            </div>

            {/* Standard 3 */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-between transition-colors duration-500">
              <div>
                <span className={`font-mono text-[10px] tracking-widest font-semibold block mb-4 transition-colors duration-700 ${secStandardsInView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>
                  03 // EXPERT ALLIANCE
                </span>
                <h4 className="font-heading font-black text-sm text-brand-graphite mb-3 uppercase tracking-wider">
                  Interdisziplinäres Netzwerk
                </h4>
                <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                  Dank unserer über 30-jährigen Präsenz verfügen wir über ein verlässliches, eingespieltes Netzwerk aus zugelassenen Wirtschaftsprüfern, Steuerexperten und Notaren im gesamten Kanton Zürich. Komplexe steuerliche oder gesellschaftsrechtliche Spezialfragen lösen wir gezielt an Ihrer Seite.
                </p>
              </div>
            </div>

            {/* Standard 4 */}
            <div className="bg-white p-8 md:p-10 flex flex-col justify-between transition-colors duration-500">
              <div>
                <span className={`font-mono text-[10px] tracking-widest font-semibold block mb-4 transition-colors duration-700 ${secStandardsInView ? 'text-brand-violet' : 'text-[#7C868C]'}`}>
                  04 // DATENSCHUTZ (nDSG)
                </span>
                <h4 className="font-heading font-black text-sm text-brand-graphite mb-3 uppercase tracking-wider">
                  Schweizer Server & Diskretion
                </h4>
                <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                  Ihre wirtschaftlichen Daten sind höchst vertraulich. Wir speichern sämtliche Unterlagen ausschliesslich in hochsicheren Schweizer Rechenzentren unter Einhaltung des neuen Datenschutzgesetzes (nDSG). Ihre Finanzdaten verbleiben unter voller physischer und gesetzlicher Schweizer Kontrolle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS/QUALITIES ROW */}
        <div ref={secQualitiesRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 w-full pt-12 border-t border-brand-gray-light">
          {qualities.map((q) => (
            <div key={q.num} className="flex flex-col items-start">
              <span className={`font-display font-black text-lg mb-2 transition-colors duration-700 ${secQualitiesInView ? 'text-brand-violet text-glow' : 'text-brand-gray-medium'}`}>
                {q.num}
              </span>
              <h4 className="font-heading font-bold text-[13px] text-brand-graphite mb-1">
                {q.title}
              </h4>
              <p className="font-sans text-xs text-brand-gray-medium leading-relaxed">
                {q.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Fast Trigger Call-to-actions */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pt-6 justify-center">
          <button
            id="about-cta-consultation"
            onClick={onOpenConsultation}
            className={`flex items-center justify-center gap-2 border-[1.5px] px-6 py-3.5 rounded-[2px] font-bold text-xs uppercase tracking-widest cursor-pointer transition-all duration-500 ${
              secQualitiesInView 
                ? 'bg-brand-violet border-brand-violet text-white hover:bg-brand-coral hover:border-brand-coral'
                : 'bg-transparent border-brand-graphite text-brand-graphite hover:border-brand-gray-medium hover:text-brand-gray-medium'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            Gespräch vereinbaren
          </button>
          
          <button
            id="about-cta-referenzen"
            onClick={() => onNavigate('references')}
            className={`flex items-center justify-center gap-1.5 font-sans text-xs font-bold uppercase tracking-wider py-3.5 cursor-pointer transition-colors duration-700 ${
              secQualitiesInView ? 'text-brand-violet hover:text-brand-coral' : 'text-brand-gray-medium hover:text-brand-graphite'
            }`}
          >
            Unsere Referenzen sichten
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}
