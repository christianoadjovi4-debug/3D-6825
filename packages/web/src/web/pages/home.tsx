import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowDown, ArrowRight, Menu, X, MoveHorizontal, Rotate3D } from 'lucide-react';
import CarScene from '../components/car-scene';

const finishes = [{ name: 'Acid Yellow', hex: '#d5e935', code: '01' }, { name: 'Glacier Silver', hex: '#b9c4c5', code: '02' }, { name: 'Rosso Corsa', hex: '#a81322', code: '03' }, { name: 'Obsidian Black', hex: '#23282a', code: '04' }];
const reveal = { initial: { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .8 } };

export default function Home() {
  const [color, setColor] = useState(0);
  const [menu, setMenu] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [details, setDetails] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const titleOpacity = useTransform(scrollYProgress, [0, .16, .25], [1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0, .25], [0, -90]);
  useEffect(() => scrollYProgress.on('change', p => setChapter(p < .28 ? 0 : p < .68 ? 1 : 2)), [scrollYProgress]);
  const navigate = () => setMenu(false);
  return <>
    <header className="header"><a href="#experience" className="logo" aria-label="APEX accueil">APEX<span>®</span></a><nav className={menu ? 'nav open' : 'nav'}><a href="#experience" onClick={navigate}>L’expérience</a><a href="#design" onClick={navigate}>Le design</a><a href="#performance" onClick={navigate}>La performance</a></nav><a className="header-cta" href="#atelier">Créer votre signature <ArrowUpRight size={15} /></a><button className="menu-button" aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></header>
    <main>
    <section className="experience" id="experience" ref={ref}>
      <div className="stage">
        <div className="circuit-lines">{[0,1,2,3,4,5].map(i => <span key={i} style={{ right: `${i * 38}px` }} />)}</div>
        <div className="stage-grain" />
        <motion.div className="hero-heading" style={{ opacity: titleOpacity, y: titleY }}><div className="eyebrow"><span className="status-dot" /> L’EXTRAORDINAIRE N’ATTEND PAS.</div><h1>AU-DELÀ<br /><span>DES LIMITES.</span></h1><p>Plus qu’une supercar.<br />Une autre idée de la liberté.</p></motion.div>
        <div className="hero-car"><CarScene color={finishes[color].hex} /></div>
        <div className={`chapter-copy ${chapter === 1 ? 'visible' : ''}`}><span className="eyebrow">01 / UNE PRÉSENCE. AUCUN COMPROMIS.</span><h2>LA FORME<br />SUIT <em>L’INSTINCT.</em></h2><p>Chaque courbe capte la lumière.<br />Chaque ligne fend l’air.</p></div>
        <div className={`chapter-copy final-copy ${chapter === 2 ? 'visible' : ''}`}><span className="eyebrow">02 / L’ADRÉNALINE, À L’ÉTAT PUR.</span><h2>NE PAS SUIVRE.<br /><em>OUVRIR LA VOIE.</em></h2><p>Une mécanique de précision.<br />Une émotion sans filtre.</p></div>
        <div className="car-model"><span>APEX / 01</span><span>CONCEPT SERIES</span></div>
        <div className="stage-bottom"><a href="#design" className="scroll-hint"><span className="scroll-icon"><ArrowDown size={16} /></span><span>SCROLLEZ POUR<br />RESSENTIR LA DIFFÉRENCE</span></a><div className="chapter-indicator"><span>0{chapter + 1}</span><span className="progress-track"><motion.i style={{ scaleX: scrollYProgress }} /></span><span>03</span></div><div className="scene-label"><span className="status-dot" /> EXPÉRIENCE 3D EN TEMPS RÉEL</div></div>
      </div>
    </section>
    <section className="manifesto" id="design"><div className="section-meta"><span>01 — L’ADN APEX</span><span>CONÇUE POUR RESSENTIR.</span></div><motion.h2 {...reveal}>CERTAINES VOITURES<br />VOUS EMMÈNENT.<br /><span>CELLE-CI VOUS EMPORTE.</span></motion.h2><div className="manifesto-bottom"><p>Nous ne créons pas simplement une voiture.<br />Nous dessinons ce moment où la route disparaît,<br />où il ne reste que vous. Et l’essentiel.</p><a className="line-link" href="#performance">Découvrir la philosophie APEX <ArrowUpRight size={22} /></a></div><div className="manifesto-line" /></section>
    <section className="performance" id="performance"><div className="section-meta"><span>02 — LA PERFORMANCE</span><span>L’ÉMOTION SE MESURE AUSSI.</span></div><motion.div className="performance-heading" {...reveal}><h2>L’INSTINCT.<br /><span>LA PRÉCISION.</span></h2><p>La puissance n’est rien sans maîtrise.<br />Un équilibre absolu entre ingénierie<br />et sensations.</p></motion.div><div className="metrics">{[{v:'2,8',u:'s',l:'DE 0 À 100 KM/H'},{v:'720',u:'ch',l:'PUISSANCE PURE'},{v:'340',u:'km/h',l:'VITESSE MAXIMALE'}].map((m,i) => <motion.div className="metric" {...reveal} transition={{duration:.7,delay:i*.12}} key={m.l}><span className="metric-index">0{i+1} /</span><div>{m.v}<small>{m.u}</small></div><span>{m.l}</span></motion.div>)}</div><div className="technical-row"><span>CHIFFRES INDICATIFS DU CONCEPT APEX / 01 — NON HOMOLOGUÉ</span><button className="line-link" onClick={() => setDetails(!details)} aria-expanded={details}>{details ? 'Fermer les détails' : 'Explorer le concept'} <ArrowUpRight size={18} /></button></div>{details && <div className="concept-details"><h3>Un concept, une vision.</h3><p>APEX est une expérience de design fictive. Les valeurs présentées illustrent notre vision d’une supercar : propulsion, aérodynamique active et monocoque carbone. Elles ne décrivent pas le véhicule 3D de démonstration et ne constituent pas des caractéristiques commerciales.</p></div>}</section>
    <section className="atelier" id="atelier"><div className="section-meta"><span>03 — VOTRE SIGNATURE</span><span>UNIQUE. COMME VOUS.</span></div><div className="atelier-grid"><motion.div className="atelier-copy" {...reveal}><h2>VOTRE INSTINCT.<br /><span>VOTRE APEX.</span></h2><p>Une silhouette iconique.<br />Une finition qui vous ressemble.<br />Choisissez votre expression.</p><div className="finish-label"><span>FINITION EXTÉRIEURE</span><span>{finishes[color].code} / 04</span></div><div className="swatches">{finishes.map((finish,i) => <button key={finish.hex} className={color === i ? 'swatch selected' : 'swatch'} style={{'--swatch':finish.hex} as React.CSSProperties} aria-label={`Finition ${finish.name}`} aria-pressed={color === i} onClick={() => setColor(i)} />)}</div><div className="finish-name">{finishes[color].name}<ArrowRight size={18} /></div></motion.div><div className="config-scene"><CarScene color={finishes[color].hex} interactive /><span className="drag-label"><MoveHorizontal size={16} /> GLISSEZ POUR EXPLORER À 360°</span><Rotate3D className="rotate-icon" size={25} /></div></div></section>
    <footer><div className="footer-top"><span className="eyebrow">LE PROCHAIN CHAPITRE COMMENCE ICI.</span><a href="#experience">NE SUIVEZ PAS<br />LA ROUTE.<br /><span>RÉINVENTEZ-LA.</span><ArrowUpRight /></a></div><div className="footer-bottom"><a className="logo" href="#experience">APEX<span>®</span></a><p>© {new Date().getFullYear()} APEX. Expérience conceptuelle indépendante.<br />Modèle 3D Ferrari 458 Italia : vicent091036, via three.js.</p><a href="#experience">RETOUR AU SOMMET ↑</a></div></footer>
    </main>
  </>;
}