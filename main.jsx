import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight, Heart, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { content as c } from './content.js';
import './style.css';

const asset = (path) => `${import.meta.env.BASE_URL}${path.split('/').pop()}`;

function App() {
  const [opened, setOpened] = useState(false);
  const [blown, setBlown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [albumPage, setAlbumPage] = useState(0);
  const [tripPick, setTripPick] = useState(null);
  const [drawingTrip, setDrawingTrip] = useState(false);
  const audioContext = useRef(null);
  const musicTimer = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [opened]);

  const playBirthdayPhrase = () => {
    const ctx = audioContext.current;
    if (!ctx || ctx.state !== 'running') return;
    const melody = [
      [261.63,.42],[261.63,.22],[293.66,.68],[261.63,.68],[349.23,.68],[329.63,1.15],
      [261.63,.42],[261.63,.22],[293.66,.68],[261.63,.68],[392,.68],[349.23,1.15],
      [261.63,.42],[261.63,.22],[523.25,.68],[440,.68],[349.23,.68],[329.63,.68],[293.66,1.1],
      [466.16,.42],[466.16,.22],[440,.68],[349.23,.68],[392,.68],[349.23,1.25],
    ];
    let start = ctx.currentTime + .08;
    melody.forEach(([frequency, duration]) => {
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const tone = ctx.createGain();
      osc.type = 'sine'; overtone.type = 'triangle'; osc.frequency.value = frequency; overtone.frequency.value = frequency * 2;
      gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(.11, start + .025); gain.gain.exponentialRampToValueAtTime(.0001, start + duration * .92);
      tone.gain.value = .13; osc.connect(gain); overtone.connect(tone); tone.connect(gain); gain.connect(ctx.destination);
      osc.start(start); overtone.start(start); osc.stop(start + duration); overtone.stop(start + duration);
      start += duration * .78;
    });
  };
  const toggleMusic = async () => {
    if (playing) {
      window.clearInterval(musicTimer.current);
      musicTimer.current = null;
      await audioContext.current?.suspend();
      setPlaying(false);
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext.current ??= new AudioCtx();
    await audioContext.current.resume();
    playBirthdayPhrase();
    musicTimer.current = window.setInterval(playBirthdayPhrase, 13500);
    setPlaying(true);
  };

  useEffect(() => () => { window.clearInterval(musicTimer.current); audioContext.current?.close(); }, []);

  const turnPage = (direction) => setAlbumPage((page) => (page + direction + c.memories.length) % c.memories.length);
  const drawTrip = () => {
    if (drawingTrip) return;
    setDrawingTrip(true);
    const options = c.travelMachine.places.filter((_, index) => index !== tripPick);
    const chosen = options[Math.floor(Math.random() * options.length)];
    window.setTimeout(() => {
      setTripPick(c.travelMachine.places.indexOf(chosen));
      setDrawingTrip(false);
    }, 900);
  };

  return <>
    <style>{`:root{--star-tile-image:url("${asset('/images/star-tiles.jpg')}");--postcard-paper-image:url("${asset('/images/postcard-paper.jpg')}")}`}</style>
    <header className="topbar"><a href="#home" className="wordmark">OUR LITTLE STORY <span>✳</span></a><nav><a href="#memories">回忆</a><a href="#letter">给你的信</a><a href="#wish">许愿</a></nav><button className="music" onClick={toggleMusic} aria-label={playing ? '暂停生日快乐钢琴曲' : c.musicLabel}>{playing ? <Volume2 size={16}/> : <VolumeX size={16}/>}<span>{playing ? '生日歌播放中' : c.musicLabel}</span></button></header>

    <main>
      <section className={`hero greeting-hero ${opened ? 'card-opened' : ''}`} id="home">
        <div className="hero-grain" />
        <div className="greeting-card-wrap">
          <div className="greeting-card">
            <span className="card-topline">A LITTLE GREETING CARD &nbsp; · &nbsp; {c.age} YEARS OF YOU</span>
            <span className="card-postmark">HAPPY<br/>BIRTHDAY</span>
            <img className="card-sticker-strip" src={asset(c.heroSticker)} alt="复古花朵贴纸装饰"/>
            <div className="portrait-frame"><img src={asset(c.heroPortrait)} alt="陈亦雯的生日贺卡大头照"/><span className="portrait-heart">♡</span></div>
            <p className="eyebrow card-eyebrow"><span className="line"/>{c.eyebrow}<span className="line"/></p>
            <h1>{c.heroTitle[0]}<br/><em>{c.heroTitle[1]}</em></h1>
            <p className="hero-sub">{c.heroSubtitle}</p>
            <button className="primary-btn" onClick={() => { setOpened(true); document.querySelector('#intro').scrollIntoView({behavior:'smooth'}); }}>{c.heroButton}<ArrowUpRight size={16}/></button>
            <div className="card-signature"><span>MADE WITH LOVE</span><b>陈亦雯</b></div>
            <span className="card-serial">NO. 046 &nbsp; / &nbsp; ONE OF A KIND</span>
          </div>
        </div>
        <a className="scroll-cue" href="#intro"><span>SCROLL TO OPEN</span><ArrowDown size={16}/></a>
        <span className="edge-note">A DAY TO CELEBRATE YOU</span>
      </section>

      <section className="intro section" id="intro"><div className="intro-grid"><div className="intro-side reveal"><span className="tiny-label">FIG. 01 — A PORTRAIT OF YOU</span><div className="mini-frame"><img src={asset('/images/IMG_8131.jpg')}/><span>HOME IS WHERE YOU ARE</span></div><img className="intro-sticker" src={asset('/images/sweet-treat.jpg')}/></div><div className="intro-copy reveal"><p className="eyebrow left">{c.introKicker}</p><h2>{c.introTitle}</h2><p>{c.introText}</p><div className="signature">With love, always <span>♡</span></div></div></div></section>

      <section id="memories" className="memories section">
        <div className="section-heading reveal"><p className="eyebrow">CHAPTER ONE &nbsp; / &nbsp; THE ALBUM</p><h2>{c.memoriesTitle}</h2><p>{c.memoriesSubtitle}</p><span className="heading-flower">✳</span></div>
        <div className="album-book reveal" onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStartX.current === null) return; const distance = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(distance) > 45) turnPage(distance < 0 ? 1 : -1); touchStartX.current = null; }}>
          <div className="album-spread">
            <div className="album-left-page"><span className="book-kicker">OUR FAMILY ALBUM</span><div className="book-emblem">✳</div><span className="book-left-title">珍藏的<br/><em>小日子</em></span><span className="book-scribble">每一页，都是我最喜欢的你。</span><div className="book-stamp">LOVE<br/>YOU<br/>ALWAYS</div><span className="book-page-number">— {String(albumPage * 2 + 1).padStart(2, '0')} —</span></div>
            <div className="album-right-page" key={albumPage}><div className="album-photo-mat"><img src={asset(c.memories[albumPage].image)} alt={c.memories[albumPage].title}/><span className="album-photo-date">{c.memories[albumPage].year} &nbsp;·&nbsp; {String(albumPage + 1).padStart(2, '0')}</span></div><div className="album-caption"><span>{c.memories[albumPage].tag}</span><h3>{c.memories[albumPage].title}</h3><p>{c.memories[albumPage].caption}</p></div><span className="album-corner" onClick={() => turnPage(1)} role="button" aria-label="翻到下一页">↗</span><span className="book-page-number">— {String(albumPage * 2 + 2).padStart(2, '0')} —</span></div>
          </div>
          <div className="album-controls"><button onClick={() => turnPage(-1)} aria-label="上一张回忆"><ArrowLeft size={17}/><span>上一页</span></button><div className="album-dots" aria-label="选择回忆页">{c.memories.map((memory, index) => <button key={memory.year + memory.title} onClick={() => setAlbumPage(index)} className={albumPage === index ? 'active' : ''} aria-label={`第 ${index + 1} 页：${memory.title}`}/>)}</div><span className="album-counter">{String(albumPage + 1).padStart(2,'0')} <i>/</i> {String(c.memories.length).padStart(2,'0')}</span><button onClick={() => turnPage(1)} aria-label="下一张回忆"><span>下一页</span><ArrowRight size={17}/></button></div>
          <p className="album-hint">点击页角，或在手机上左右滑动，翻看下一段回忆</p>
        </div>
        <div className="album-end reveal"><span>✳</span> TO BE CONTINUED, ALWAYS <span>✳</span></div>
      </section>

      <section className="travel-machine-section section" id="trips"><div className="section-heading reveal"><p className="eyebrow">{c.travelMachine.kicker}</p><h2>{c.travelMachine.title}</h2><p>{c.travelMachine.subtitle}</p></div><div className={`vending-machine reveal ${drawingTrip ? 'drawing' : ''}`}><div className="machine-top"><span>THE MEMORY POST</span><span>EST. WITH LOVE</span></div><div className="machine-sign">ONE COIN <i>✳</i> ONE MEMORY</div><div className="machine-body"><div className="machine-window"><div className="machine-window-inner">{tripPick === null ? <div className="machine-placeholder"><span className="machine-sun">✳</span><span>{c.travelMachine.prompt}</span><small>2019 — 2026</small></div> : <div className={`trip-ticket ${drawingTrip ? 'ticket-shake' : 'ticket-show'}`} key={tripPick}><div className="ticket-photo"><img src={asset(c.travelMachine.places[tripPick].image)} alt={`${c.travelMachine.places[tripPick].year} ${c.travelMachine.places[tripPick].place}旅行回忆`}/><span>TRAVEL MEMORY · No.{String(tripPick + 1).padStart(2,'0')}</span></div><div className="ticket-copy"><span className="ticket-year">{c.travelMachine.places[tripPick].year}</span><h3>{c.travelMachine.places[tripPick].place}</h3><p>{c.travelMachine.places[tripPick].caption}</p><span className="ticket-stamp">KEEPSAKE<br/>FOR MOM</span></div></div>}</div><div className="machine-glint"/></div><div className="machine-controls"><div className="coin-slot"><span>COIN</span><i/></div><button className="machine-lever" onClick={drawTrip} disabled={drawingTrip}><span className="lever-knob"/><span className="lever-base"/><span className="lever-label">{drawingTrip ? c.travelMachine.loading : tripPick === null ? c.travelMachine.button : c.travelMachine.againButton}</span></button><div className="coin-return"><span>✦</span></div></div></div><div className="machine-footer"><span>TAKE A LITTLE MEMORY WITH YOU</span><span>{String(c.travelMachine.places.length).padStart(2,'0')} ORIGINAL TRAVEL MOMENTS</span></div></div><p className="machine-note reveal">每次抽取都会从旅行照片里随机选一张 · 文件名里的年份和地点已整理好</p></section>

      <section className={`wish section ${blown ? 'is-blown' : ''}`} id="wish"><div className="wish-inner reveal"><p className="eyebrow">CHAPTER THREE &nbsp; / &nbsp; MAKE A WISH</p><h2>{blown ? '愿望已经出发。' : c.candleTitle}</h2><p>{blown ? c.finale : c.candleText}</p><button className={`candle-button ${blown ? 'done' : ''}`} onClick={() => setBlown(!blown)} aria-label={c.candleButton} aria-pressed={blown}><span className="birthday-cake" aria-hidden="true"><span className="cake-candles">{Array.from({length:c.candleAge},(_,i)=><span className="cake-candle" key={i} style={{'--i':i}}><i className="cake-flame">✦</i></span>)}</span><span className="cake-top"/><span className="cake-body"><i/><i/><i/></span><span className="cake-plate"/></span><span className="button-label">{blown ? '再点亮一次' : c.candleButton}</span></button>{blown && <div className="wish-heart"><Heart fill="currentColor" size={17}/> <Sparkles size={16}/> <Heart fill="currentColor" size={17}/></div>}<div className="wish-date">18 CANDLES &nbsp; · &nbsp; A DAY THAT IS ALL YOURS</div></div></section>

      <section className="letter section" id="letter"><div className="letter-paper reveal"><div className="letter-top"><span>{c.letterLabel}</span><span>✳ &nbsp; WITH LOVE &nbsp; ✳</span></div><div className="letter-layout"><div className="letter-body"><h2>{c.letterTitle}</h2>{c.letterParagraphs.map((p,i)=><p key={i}>{p}</p>)}<p className="signoff">{c.signoff}<span>♡</span></p></div><div className="letter-aside"><div className="letter-photo"><img src={asset(c.letterPhoto)}/></div><span className="letter-photo-caption">A MOMENT I KEEP CLOSE</span><div className="postmark">MADE<br/>WITH<br/>LOVE</div></div></div><div className="letter-bottom"><span>POSTED WITH LOVE, FROM YOUR LITTLE GIRL</span><span>2026 · 11 · 09</span></div></div><img className="letter-vinyl" src={asset('/images/vinyl-mood.jpg')}/></section>
      <footer className="maker-footer"><img src={asset(c.makerImage)} alt="陈亦雯的表情包"/><p>{c.makerCaption}</p></footer>
    </main>
    <footer><span>{c.footer}</span><a href="#home">BACK TO THE BEGINNING ↑</a></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);

