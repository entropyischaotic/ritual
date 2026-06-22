"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { BookOpen, ChevronLeft, FlaskConical, Heart, Info, Menu, Moon, Plus, RotateCcw, Sparkles, Star, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { celestialBodies, objectLibrary, rituals, tarotCards } from "@/app/data";
import { getMoonData } from "@/app/lib/moon";
import { useRitualState } from "@/app/lib/storage";
import type { EntryType, GrimoireEntry, ObjectKind, PlacedObject, Section } from "@/app/types";
import { Modal } from "./Modal";
import { ObjectArt } from "./ObjectArt";

const sections: { id: Section; icon: typeof Moon }[] = [
  { id: "altar", icon: Sparkles }, { id: "cosmo lab", icon: Moon }, { id: "tarot", icon: Star },
  { id: "symbolic science", icon: FlaskConical }, { id: "ritual physics", icon: RotateCcw },
  { id: "inner apothecary", icon: Heart }, { id: "nervous system alchemy", icon: Moon }, { id: "grimoire", icon: BookOpen },
];

const symbolicModules = [
  ["why humans see patterns", "pattern detection helps us learn, predict, and orient. it can reveal useful structure, and it can also connect unrelated events. reflection benefits from holding both possibilities."],
  ["symbols as emotional language", "a symbol can compress memory, feeling, and value into one image. its meaning is made through culture and personal association, not hidden laboratory force."],
  ["myth as memory", "stories carry values and warnings across time. myth can preserve lived knowledge while remaining story rather than literal record."],
  ["astrology as archetype, not proof", "astrology is a historical and cultural interpretation system. it can offer a vocabulary for reflection, but evidence does not support it as a predictor of personality or fate."],
  ["tarot as a mirror, not a command", "chance images prompt associations that habitual thought may miss. the reader makes meaning; the card does not issue instructions or guarantee an outcome."],
  ["ritual objects as meaning containers", "repeated use lets an ordinary object gather memories and cues. its effect can live in attention, association, beauty, and behavior."],
  ["why beauty can support attention", "carefully shaped surroundings can invite approach, slow visual scanning, and make a chosen practice easier to return to."],
  ["take what resonates", "resonance is an invitation to examine, not proof that a claim is true. keep what supports honest reflection; leave what distorts, pressures, or diminishes you."],
];

const physicsModules = [
  ["attention and intention", "naming a focus narrows the field of possible action. intention is direction, not a guarantee."],
  ["repetition and habit cues", "a repeated opening gesture can make a behavior easier to begin by linking context with action."],
  ["sensory anchors", "texture, scent, sound, and light give wandering attention something immediate to notice."],
  ["environment design", "placing useful cues in view and reducing competing signals changes what is easiest to do."],
  ["breath and rhythm", "a gentle, unforced rhythm can support settling. comfort matters more than performing a perfect breath."],
  ["embodied action", "movement makes an abstract choice tangible: opening a book, lighting a digital candle, putting an object down."],
  ["memory and association", "contexts gather meaning through repetition. returning to the same cue can help recall the state or practice paired with it."],
  ["symbolic objects and focus", "an object can hold a question in view and reduce the effort of remembering what matters."],
  ["journaling and cognitive offloading", "writing moves thoughts out of working memory so they can be sorted, questioned, or left for later."],
  ["closing rituals", "a clear ending can help the body and attention shift between roles, spaces, and demands."],
];

const nervousModules = [
  ["fight, flight, freeze", "under perceived threat, the body may mobilize, escape, or become still.", "heat, urgency, racing thoughts, numbness, or feeling stuck", "name the room. press both feet down. let your eyes find three stable edges.", "what would signal one percent more safety right now?"],
  ["anxiety and body signals", "anxiety can amplify prediction and body monitoring even when danger is uncertain.", "tightness, restlessness, nausea, fast thoughts, or scanning", "touch one altar object and describe only its texture, temperature, and shape.", "what is present fact, and what is forecast?"],
  ["adhd and attention switching", "attention may be interest-led and switching can carry a real start-up cost.", "too many open loops, time blur, avoidance, or sudden hyperfocus", "hide all but one task. write its smallest visible action beside the silver key.", "what would make beginning easier to see?"],
  ["low mood and energy conservation", "low mood can make effort feel expensive and reduce the pull of future reward.", "heaviness, withdrawal, slowed thought, or flatness", "choose one action under two minutes and pair it with warmth, light, or music.", "what is a compassionate definition of enough today?"],
  ["dopamine and motivation", "dopamine is involved in learning, movement, attention, and anticipated reward; it is not a simple happiness meter.", "difficulty starting distant rewards or strong pull toward immediate novelty", "make progress visible with one mark, one object moved, or one finished line.", "which reward is too distant to feel real?"],
  ["breath and heart rate", "breathing and heart rhythm influence each other, while stress, movement, health, and context also matter.", "shallow breath, sighing, pounding, or holding", "let the exhale lengthen slightly only if that feels comfortable. do not force a deep breath.", "what pace feels supportive rather than performative?"],
  ["sensory grounding", "present sensory detail can compete with abstract spirals and help reorient attention.", "feeling far away, flooded, or caught in thought", "name one color, one sound, one pressure point, and one temperature.", "which sense feels easiest to return through?"],
  ["ritual as a habit cue", "repeated context can lower the effort of remembering and starting a chosen practice.", "knowing what helps but forgetting in the moment", "pair one tiny practice with an object you already see each day.", "what cue is already present when you need support?"],
  ["journaling as thought organization", "writing can separate observations, interpretations, needs, and next actions.", "mental looping, crowded thoughts, or difficulty prioritizing", "write three lines: what happened; what i feel; what is next.", "which thought needs a page instead of more rehearsal?"],
  ["symbolic objects as attention anchors", "a chosen object can make a value or intention perceptible in the environment.", "losing contact with priorities during stress", "hold or view one object and name the quality you assigned to it.", "what do you want this object to help you remember?"],
];

function newEntry(type: EntryType, title: string, body: string, moonPhase: string, mood?: string, meta?: string): GrimoireEntry {
  return { id: crypto.randomUUID(), type, title, body, createdAt: new Date().toISOString(), moonPhase, mood, meta };
}

export function RitualApp() {
  const store = useRitualState();
  const moon = useMemo(() => getMoonData(), []);
  const [section, setSection] = useState<Section>("altar");
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<PlacedObject | null>(null);
  const [intentionFor, setIntentionFor] = useState<PlacedObject | null>(null);
  const [tarotOpen, setTarotOpen] = useState(false);
  const [drawn, setDrawn] = useState<(typeof tarotCards)[number] | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const navigate = (next: Section) => { setSection(next); setMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="app-shell">
    <StarField />
    <Onboarding open={store.ready && !store.state.onboarded} finish={store.finishOnboarding} />
    <aside className={`sidebar ${menu ? "open" : ""}`}>
      <div className="brand"><span className="brand-sigil">☾</span><span>ritual</span></div>
      <button className="mobile-close" onClick={() => setMenu(false)} aria-label="close menu"><X size={18}/></button>
      <p className="eyebrow">a quiet instrument</p>
      <nav>{sections.map(({ id, icon: Icon }) => <button key={id} className={section === id ? "active" : ""} onClick={() => navigate(id)}><Icon size={15}/><span>{id}</span></button>)}</nav>
      <div className="sidebar-note"><span className="status-dot"/>stored on this device</div>
      <div className="creator">created by isa 🐇</div>
    </aside>
    {menu && <button className="menu-scrim" onClick={() => setMenu(false)} aria-label="close menu"/>}
    <main>
      <header className="topbar">
        <button className="menu-button" onClick={() => setMenu(true)} aria-label="open menu"><Menu size={19}/></button>
        <div><span className="eyebrow">current chamber</span><strong>{section}</strong></div>
        <div className="moon-chip"><span className="moon-mini"/>{moon.name}<small>{moon.illumination}% lit</small></div>
      </header>
      <AnimatePresence mode="wait"><motion.div key={section} className="page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .25 }}>
        {section === "altar" && <Altar store={store} moonPhase={moon.name} onSelect={setSelected} onIntention={setIntentionFor} onTarot={() => setTarotOpen(true)} onReset={() => setConfirmReset(true)}/>} 
        {section === "cosmo lab" && <CosmoLab moon={moon} addEntry={store.addEntry}/>} 
        {section === "tarot" && <TarotSection onDraw={() => setTarotOpen(true)}/>} 
        {section === "symbolic science" && <ModuleSection eyebrow="pattern cabinet / 01" title="symbolic science" intro="humans live in physical worlds and symbolic ones. this cabinet studies the difference without flattening either." modules={symbolicModules}/>} 
        {section === "ritual physics" && <ModuleSection eyebrow="practice cabinet / 02" title="ritual physics" intro="a ritual does not need to break the laws of physics to work. sometimes it works because it gives your attention somewhere to land." modules={physicsModules}/>} 
        {section === "inner apothecary" && <Apothecary favorites={store.state.favorites} entries={store.state.entries} addEntry={store.addEntry} moonPhase={moon.name}/>} 
        {section === "nervous system alchemy" && <NervousSystem/>} 
        {section === "grimoire" && <Grimoire entries={store.state.entries} addEntry={store.addEntry} updateEntry={store.updateEntry} deleteEntry={store.deleteEntry} moonPhase={moon.name}/>} 
      </motion.div></AnimatePresence>
      <footer><span>ritual is a reflection and grounding tool, not therapy, diagnosis, medical care, or crisis support.</span><span>created by isa 🐇</span></footer>
    </main>
    <ObjectDetail object={selected} close={() => setSelected(null)} note={(note) => { if (selected) store.updateObject(selected.id, { note }); }} remove={() => { if (selected) store.removeObject(selected.id); setSelected(null); }} favorite={(kind) => { if (!store.state.favorites.includes(kind)) store.addEntry(newEntry("favorite object", kind, objectLibrary[kind].grounded, moon.name)); store.toggleFavorite(kind); }} isFavorite={selected ? store.state.favorites.includes(selected.kind) : false}/>
    <IntentionModal object={intentionFor} close={() => setIntentionFor(null)} save={(body, mood) => { if (!intentionFor) return; store.updateObject(intentionFor.id, { active: true }); store.addEntry(newEntry("intention", `${intentionFor.kind} intention`, body, moon.name, mood)); setIntentionFor(null); }}/>
    <TarotModal open={tarotOpen} close={() => { setTarotOpen(false); setDrawn(null); }} card={drawn} draw={() => setDrawn(tarotCards[Math.floor(Math.random() * tarotCards.length)])} save={(note) => { if (!drawn) return; store.addEntry(newEntry("tarot", drawn.name, `${drawn.meaning}\n\n${note}`.trim(), moon.name, undefined, drawn.themes)); setTarotOpen(false); setDrawn(null); }}/>
    <Modal open={confirmReset} onClose={() => setConfirmReset(false)}><span className="eyebrow">clear the table</span><h2>reset your altar?</h2><p className="muted">this returns the altar to its starting arrangement. your grimoire stays untouched.</p><div className="modal-actions"><button className="text-button" onClick={() => setConfirmReset(false)}>keep it</button><button className="primary-button danger" onClick={() => { store.resetAltar(); setConfirmReset(false); }}>reset altar</button></div></Modal>
  </div>;
}

function StarField() { return <div className="starscape" aria-hidden>{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 97}%`, top: `${(i * 53) % 91}%`, animationDelay: `${(i % 7) * .7}s` }}/>)}</div>; }

function PageIntro({ eyebrow, title, children, action }: { eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{children}</p></div>{action}</div>;
}

function Altar({ store, onSelect, onIntention, onTarot, onReset }: { store: ReturnType<typeof useRitualState>; moonPhase: string; onSelect: (o: PlacedObject) => void; onIntention: (o: PlacedObject) => void; onTarot: () => void; onReset: () => void }) {
  const canvas = useRef<HTMLDivElement>(null);
  const kinds = Object.keys(objectLibrary) as ObjectKind[];
  const moved = useRef(false);
  const finishDrag = (item: PlacedObject, info: PanInfo) => {
    const box = canvas.current?.getBoundingClientRect();
    if (!box) return;
    moved.current = Math.abs(info.offset.x) + Math.abs(info.offset.y) > 4;
    store.updateObject(item.id, { x: Math.min(94, Math.max(6, item.x + info.offset.x / box.width * 100)), y: Math.min(88, Math.max(12, item.y + info.offset.y / box.height * 100)) });
  };
  const useObject = (item: PlacedObject) => { if (moved.current) { moved.current = false; return; } if (item.kind === "candle" || item.kind === "incense holder") onIntention(item); else if (item.kind === "tarot deck") onTarot(); else onSelect(item); };
  return <>
    <PageIntro eyebrow="your private table / 00" title="the altar" action={<button className="text-button" onClick={onReset}><RotateCcw size={14}/>reset altar</button>}>arrange a small field of attention. nothing here predicts or causes an outcome; each object is a cue you choose.</PageIntro>
    <div className="altar-layout">
      <section className="altar-canvas" ref={canvas}>
        <div className="altar-moon"/><div className="window-tracery"/><div className="altar-table"><span/><span/></div>
        {store.state.altar.map((item) => <motion.button drag dragMomentum={false} dragConstraints={canvas} whileDrag={{ scale: 1.07, zIndex: 20 }} key={item.id} className={`altar-object ${item.active ? "active" : ""}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onDragEnd={(_, info) => finishDrag(item, info)} onClick={() => useObject(item)} aria-label={`${item.kind}, drag to move or click to inspect`}>
          <ObjectArt kind={item.kind} active={item.active}/><span>{item.kind}</span>
        </motion.button>)}
        {!store.state.altar.length && <div className="altar-empty"><Moon size={25}/><p>the table is quiet.</p><small>choose an object from the cabinet.</small></div>}
      </section>
      <aside className="object-palette"><div className="palette-heading"><div><span className="eyebrow">object cabinet</span><h2>choose a vessel</h2></div><span className="count">{kinds.length}</span></div><div className="palette-grid">{kinds.map((kind) => <button key={kind} onClick={() => store.addObject(kind)}><ObjectArt kind={kind}/><span>{kind}</span><Plus size={12}/></button>)}</div></aside>
    </div>
  </>;
}

function ObjectDetail({ object, close, note, remove, favorite, isFavorite }: { object: PlacedObject | null; close: () => void; note: (n: string) => void; remove: () => void; favorite: (kind: ObjectKind) => void; isFavorite: boolean }) {
  const [draft, setDraft] = useState("");
  if (!object) return <Modal open={false} onClose={close}>{null}</Modal>;
  const data = objectLibrary[object.kind];
  return <Modal open onClose={close}><div className="detail-hero"><ObjectArt kind={object.kind}/><div><span className="eyebrow">altar object</span><h2>{object.kind}</h2></div></div><Detail label="symbolic meaning">{data.meaning}.</Detail><Detail label="grounded interpretation">{data.grounded}.</Detail><label className="field-label">your note<textarea defaultValue={object.note} onChange={(e) => setDraft(e.target.value)} placeholder="what does this hold for you?"/></label><div className="modal-actions split"><button className="icon-text danger-text" onClick={remove}><Trash2 size={14}/>remove</button><div><button className="text-button" onClick={() => favorite(object.kind)}>{isFavorite ? "unfavorite" : "favorite"}</button><button className="primary-button" onClick={() => { note(draft); close(); }}>save note</button></div></div></Modal>;
}

function IntentionModal({ object, close, save }: { object: PlacedObject | null; close: () => void; save: (body: string, mood: string) => void }) {
  const [body, setBody] = useState(""); const [mood, setMood] = useState("");
  return <Modal open={!!object} onClose={close}><span className="eyebrow">attention ritual</span><h2>set an intention</h2><p className="lead-small">what are you calling your attention back to?</p><textarea className="large-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="write one clear sentence…" autoFocus/><label className="field-label">mood tag <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="optional"/></label><div className="safety-note"><Info size={14}/><span>digital ritual only. if using real candles, never leave flames unattended.</span></div><p className="microcopy">the glow marks a beginning; it does not cause an outcome.</p><div className="modal-actions"><button className="text-button" onClick={close}>not now</button><button className="primary-button" disabled={!body.trim()} onClick={() => { save(body.trim(), mood.trim()); setBody(""); setMood(""); }}>light & save</button></div></Modal>;
}

function TarotModal({ open, close, card, draw, save }: { open: boolean; close: () => void; card: (typeof tarotCards)[number] | null; draw: () => void; save: (note: string) => void }) {
  const [note, setNote] = useState("");
  return <Modal open={open} onClose={close} wide><span className="eyebrow">one-card reflection</span><h2>{card ? card.name : "draw a card"}</h2><p className="muted">take what resonates, leave what doesn’t. this card is a mirror, not a command.</p>{!card ? <div className="draw-stage"><button className="tarot-card-back" onClick={draw}><span className="card-orbit"/><Moon size={36}/><small>touch to draw</small></button></div> : <div className="tarot-reading"><div className="drawn-card"><div className="card-stars">✦ · ✧ · ✦</div><Moon size={46}/><span>{card.name}</span><small>{card.visual}</small></div><div className="reading-copy"><Detail label="traditional themes">{card.themes}</Detail><Detail label="reflective meaning">{card.meaning}</Detail><Detail label="shadow side">{card.shadow}</Detail><Detail label="body check">{card.body}</Detail><Detail label="journal question">{card.journal}</Detail><Detail label="small action">{card.action}</Detail><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="leave a note with this pull…"/><div className="modal-actions"><button className="text-button" onClick={draw}>draw again</button><button className="primary-button" onClick={() => { save(note); setNote(""); }}>save to grimoire</button></div></div></div>}</Modal>;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) { return <div className="detail-row"><span>{label}</span><p>{children}</p></div>; }

function CosmoLab({ moon, addEntry }: { moon: ReturnType<typeof getMoonData>; addEntry: (e: GrimoireEntry) => void }) {
  const [reflection, setReflection] = useState("");
  return <><PageIntro eyebrow="observatory / 01" title="cosmo lab">astronomy describes celestial bodies and their motion. symbolic systems tell human stories about them. both can be studied without mistaking one for the other.</PageIntro>
    <section className="moon-dashboard"><div className="moon-visual"><div className="moon-disc" style={{ "--phase": `${moon.age / 29.53 * 360}deg` } as React.CSSProperties}/><span>approximate view</span></div><div className="moon-report"><span className="eyebrow">now above us</span><h2>{moon.name}</h2><div className="moon-stats"><div><strong>{moon.illumination}%</strong><span>illumination</span></div><div><strong>{moon.direction}</strong><span>light trend</span></div><div><strong>{moon.age.toFixed(1)}</strong><span>days into cycle</span></div></div><p>{moon.prompt}</p><div className="inline-journal"><input value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="leave a moon reflection…"/><button disabled={!reflection.trim()} onClick={() => { addEntry(newEntry("moon reflection", moon.name, reflection, moon.name)); setReflection(""); }}>save</button></div></div></section>
    <div className="science-grid"><ScienceCard index="01" title="why phases happen">half the moon is always lit by the sun. as the moon orbits earth, our viewing angle reveals a changing portion of that sunlit half.</ScienceCard><ScienceCard index="02" title="sun · earth · moon">new moon places the moon roughly sunward; full moon places earth roughly between sun and moon. the orbit is tilted, which is why eclipses are uncommon.</ScienceCard><ScienceCard index="03" title="tides & gravity">the moon’s gravity and the sun’s gravity create tidal patterns in earth’s oceans. local coastlines, depth, and weather shape the tides we observe.</ScienceCard><ScienceCard index="04" title="light, sleep & darkness">light exposure can influence circadian timing. moonlight is far dimmer than daylight, and evidence for consistent lunar effects on human sleep remains mixed.</ScienceCard></div>
    <section className="grounded-banner"><Moon/><div><span className="eyebrow">lunar language</span><h3>what people may mean by “lunar energy”</h3><p>visible light cycles, gravity and tides, agricultural calendars, cultural history, darkness and sleep cues, ritual timing, or personal meaning-making. it does not establish control over emotion, fate, or personality.</p></div></section>
    <Cabinet title="celestial library" subtitle="physical objects · inherited stories · present questions">{celestialBodies.map((body, i) => <article className="celestial-card" key={body.name}><div className="constellation-graphic"><span>{i % 2 ? "·  ✦      ·" : "✧    ·   ✦"}</span><i/><i/><i/></div><span className="eyebrow">catalogue {String(i + 1).padStart(2, "0")}</span><h3>{body.name}</h3><Detail label="astronomy">{body.science}.</Detail><Detail label="symbolism">{body.symbolism}.</Detail><p className="prompt">“{body.prompt}”</p></article>)}</Cabinet>
  </>;
}

function ScienceCard({ index, title, children }: { index: string; title: string; children: React.ReactNode }) { return <article className="science-card"><span>{index}</span><Moon size={17}/><h3>{title}</h3><p>{children}</p></article>; }

function TarotSection({ onDraw }: { onDraw: () => void }) { return <><PageIntro eyebrow="mirror room / 02" title="tarot">twenty-two archetypal images, redrawn as words. use chance to loosen a fixed perspective, then keep your own judgment.</PageIntro><section className="tarot-landing"><div className="tarot-stack"><div/><div/><button onClick={onDraw}><span>✦</span><Moon/><small>draw one card</small></button></div><div><span className="eyebrow">reflective, never predictive</span><h2>a mirror made of symbols</h2><p>the major arcana hold recurring themes: change, agency, attachment, hope, endings, repair. a card cannot know your future. it can offer a question you might not have chosen yourself.</p><button className="primary-button" onClick={onDraw}>begin a one-card reflection</button></div></section></>; }

function ModuleSection({ eyebrow, title, intro, modules }: { eyebrow: string; title: string; intro: string; modules: string[][] }) { return <><PageIntro eyebrow={eyebrow} title={title}>{intro}</PageIntro><div className="module-grid">{modules.map(([name, text], i) => <motion.article whileHover={{ y: -3 }} className="module-card" key={name}><span className="index">{String(i + 1).padStart(2, "0")}</span><div className="module-sigil">{i % 3 === 0 ? "☾" : i % 3 === 1 ? "✦" : "◇"}</div><h2>{name}</h2><p>{text}</p></motion.article>)}</div></>; }

function Apothecary({ favorites, entries, addEntry, moonPhase }: { favorites: ObjectKind[]; entries: GrimoireEntry[]; addEntry: (e: GrimoireEntry) => void; moonPhase: string }) {
  const [chosen, setChosen] = useState<(typeof rituals)[number] | null>(null); const [note, setNote] = useState("");
  const intentions = entries.filter((entry) => entry.type === "intention").slice(0, 3);
  return <><PageIntro eyebrow="personal cabinet / 05" title="inner apothecary">a collection of practices you can actually reach for. choose by present need, not by an ideal version of yourself.</PageIntro><div className="apothecary-summary"><section><span className="eyebrow">favorite objects</span><h2>your shelf</h2><div className="favorite-shelf">{favorites.length ? favorites.map((kind) => <div key={kind}><ObjectArt kind={kind}/><span>{kind}</span></div>) : <p className="empty-copy">favorite an altar object to place it here.</p>}</div></section><section><span className="eyebrow">recent intentions</span><h2>still in view</h2>{intentions.length ? intentions.map((e) => <p className="saved-line" key={e.id}>{e.body}<small>{formatDate(e.createdAt)}</small></p>) : <p className="empty-copy">light a digital candle to begin an intention.</p>}</section></div><Cabinet title="choose a ritual" subtitle="focus · calm · release · rest · courage · clarity · reset">{rituals.map((ritual) => <button className="ritual-drawer" key={ritual.name} onClick={() => setChosen(ritual)}><span className="drawer-pull"/><div><span className="eyebrow">{ritual.object}</span><h3>{ritual.name}</h3></div><ChevronLeft size={15}/></button>)}</Cabinet><Modal open={!!chosen} onClose={() => setChosen(null)}>{chosen && <><span className="eyebrow">a small sequence</span><h2>{chosen.name}</h2><ol className="ritual-steps"><li><span>01</span><p><strong>object</strong>{chosen.object}</p></li><li><span>02</span><p><strong>sensory action</strong>{chosen.sensory}</p></li><li><span>03</span><p><strong>breath cue</strong>{chosen.breath}</p></li><li><span>04</span><p><strong>journal line</strong>{chosen.journal}</p></li><li><span>05</span><p><strong>closing phrase</strong>“{chosen.closing}”</p></li></ol><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="what do you notice?"/><div className="modal-actions"><button className="text-button" onClick={() => setChosen(null)}>close</button><button className="primary-button" onClick={() => { addEntry(newEntry("grounding ritual", chosen.name, note || chosen.journal, moonPhase, undefined, chosen.closing)); setNote(""); setChosen(null); }}>complete & save</button></div></>}</Modal></>;
}

function NervousSystem() { return <><PageIntro eyebrow="body notes / 06" title="nervous system alchemy">gentle orientation for moments when the body is loud or attention is scattered. these are possibilities, not diagnoses.</PageIntro><div className="care-note"><Info/><div><strong>scope of care</strong><p>ritual is not therapy, diagnosis, medical care, or crisis support. it does not replace professional care or advise changes to medication.</p></div></div><div className="nervous-list">{nervousModules.map(([name, explanation, feels, ritual, prompt], i) => <details key={name} open={i === 0}><summary><span>{String(i + 1).padStart(2, "0")}</span><h2>{name}</h2><Plus size={16}/></summary><div className="nervous-content"><Detail label="simple explanation">{explanation}</Detail><Detail label="what it can feel like">{feels}</Detail><Detail label="grounding ritual">{ritual}</Detail><p className="prompt">“{prompt}”</p></div></details>)}</div></>; }

function Grimoire({ entries, addEntry, updateEntry, deleteEntry, moonPhase }: { entries: GrimoireEntry[]; addEntry: (e: GrimoireEntry) => void; updateEntry: (id: string, p: Partial<GrimoireEntry>) => void; deleteEntry: (id: string) => void; moonPhase: string }) {
  const [filter, setFilter] = useState<EntryType | "all">("all"); const [writing, setWriting] = useState(false); const [body, setBody] = useState(""); const [mood, setMood] = useState(""); const [editing, setEditing] = useState<GrimoireEntry | null>(null);
  const types: (EntryType | "all")[] = ["all", "intention", "tarot", "note", "moon reflection", "grounding ritual", "favorite object"];
  const shown = filter === "all" ? entries : entries.filter((e) => e.type === filter);
  return <><PageIntro eyebrow="private archive / 07" title="grimoire" action={<button className="primary-button" onClick={() => setWriting(true)}><Plus size={14}/>add note</button>}>a dated record of what you noticed, chose, questioned, and returned to. everything stays in this browser.</PageIntro><div className="filter-row">{types.map((type) => <button key={type} className={filter === type ? "active" : ""} onClick={() => setFilter(type)}>{type}</button>)}</div><div className="entry-list">{shown.length ? shown.map((entry) => <article key={entry.id} className="entry-card"><div className="entry-meta"><span className={`entry-type type-${entry.type.replaceAll(" ", "-")}`}>{entry.type}</span><time>{formatDate(entry.createdAt)}</time></div><h2>{entry.title}</h2><p>{entry.body}</p>{entry.meta && <small className="entry-extra">{entry.meta}</small>}<div className="entry-foot"><span><Moon size={12}/>{entry.moonPhase}{entry.mood ? ` · ${entry.mood}` : ""}</span><div><button onClick={() => setEditing(entry)}>edit</button><button onClick={() => deleteEntry(entry.id)}>delete</button></div></div></article>) : <div className="empty-grimoire"><BookOpen/><h2>the page is waiting.</h2><p>save an intention, draw a card, or write what you notice.</p><button className="text-button" onClick={() => setWriting(true)}>write the first line</button></div>}</div><NoteModal open={writing} close={() => setWriting(false)} body={body} setBody={setBody} mood={mood} setMood={setMood} save={() => { addEntry(newEntry("note", "field note", body, moonPhase, mood)); setBody(""); setMood(""); setWriting(false); }}/><EditModal entry={editing} close={() => setEditing(null)} save={(text) => { if (editing) updateEntry(editing.id, { body: text }); setEditing(null); }}/></>;
}

function NoteModal({ open, close, body, setBody, mood, setMood, save }: { open: boolean; close: () => void; body: string; setBody: (v: string) => void; mood: string; setMood: (v: string) => void; save: () => void }) { return <Modal open={open} onClose={close}><span className="eyebrow">new page</span><h2>field note</h2><textarea className="large-input" value={body} onChange={(e) => setBody(e.target.value)} placeholder="what is present?" autoFocus/><label className="field-label">mood tag<input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="optional"/></label><div className="modal-actions"><button className="text-button" onClick={close}>close</button><button className="primary-button" disabled={!body.trim()} onClick={save}>save note</button></div></Modal>; }
function EditModal({ entry, close, save }: { entry: GrimoireEntry | null; close: () => void; save: (v: string) => void }) { const [text, setText] = useState(""); useEffect(() => setText(entry?.body ?? ""), [entry]); return <Modal open={!!entry} onClose={close}><span className="eyebrow">revise page</span><h2>edit entry</h2><textarea className="large-input" value={text} onChange={(e) => setText(e.target.value)}/><div className="modal-actions"><button className="text-button" onClick={close}>close</button><button className="primary-button" onClick={() => save(text)}>save changes</button></div></Modal>; }

function Cabinet({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className="cabinet"><div className="cabinet-heading"><div><span className="eyebrow">open cabinet</span><h2>{title}</h2></div><p>{subtitle}</p></div><div className="cabinet-grid">{children}</div></section>; }

function Onboarding({ open, finish }: { open: boolean; finish: () => void }) { return <Modal open={open} onClose={finish} wide><div className="onboarding"><div className="onboarding-moon"><span/><span/><Moon/></div><span className="eyebrow">welcome to your table</span><h1>ritual</h1><p>build an altar. set an intention. study the sky. pull a card. ground your nervous system. take what resonates, leave what doesn’t.</p><button className="primary-button" onClick={finish}>enter the altar</button><small>created by isa 🐇</small></div></Modal>; }

function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)).toLowerCase(); }
