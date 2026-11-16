'use client';

// Merkato: bargain your way through three market stalls (lib/merkato.ts).
// Each stall is a short chat with the seller: ask the price, catch the number
// they say, push back, make an offer, and say thank you. Wrong answers explain
// themselves and let you try again; good offers save birr.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Mascot from '@/components/Mascot';
import SayButton, { say } from '@/components/SayButton';
import { MERKATO, STALLS, type Choice, type Line, type Offer } from '@/lib/merkato';

type Stage = 'ask' | 'hear' | 'push' | 'offer' | 'thanks' | 'done';
type Said = { who: 'seller' | 'you'; line: Line };
type Bought = { item: string; paid: number; price: number };

function Bubble({ said, seller }: { said: Said; seller: string }) {
  const theirs = said.who === 'seller';
  return (
    <div className={`mk-bubble ${said.who}`}>
      {theirs && (
        <span className="mk-avatar" aria-hidden>
          {seller[0]}
        </span>
      )}
      <div className="mk-bubble-body">
        <span className="mk-am" lang="am">
          {said.line.am}
        </span>
        <span className="mk-tr">{said.line.tr}</span>
        <span className="mk-en">{said.line.en}</span>
      </div>
      <SayButton text={said.line.am} track="amharic" size={15} className="mk-say" />
    </div>
  );
}

export default function Merkato() {
  const [started, setStarted] = useState(false);
  const [stallIdx, setStallIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('ask');
  const [log, setLog] = useState<Said[]>([]);
  const [hint, setHint] = useState('');
  const [wrong, setWrong] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>(STALLS[0].offers);
  const [bought, setBought] = useState<Bought[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [basket, setBasket] = useState(false); // the end screen
  const end = useRef<HTMLDivElement>(null);

  const stall = STALLS[stallIdx];

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [log, stage]);

  function sellerSays(line: Line, also: Said[] = []) {
    setLog(l => [...l, ...also, { who: 'seller', line }]);
    // let the learner's own line land first
    window.setTimeout(() => say(line.am, 'amharic'), also.length ? 500 : 0);
  }

  function miss(key: string, why: string) {
    setWrong(key);
    setHint(why);
    setMistakes(m => m + 1);
    window.setTimeout(() => setWrong(null), 450);
  }

  function openStall(i: number) {
    setStallIdx(i);
    setStage('ask');
    setOffers(STALLS[i].offers);
    setHint('');
    setLog([]);
    sellerSays(MERKATO.greeting);
  }

  function choose(choice: Choice, next: Stage, reply: Line) {
    if (!choice.right) return miss(choice.am, choice.why ?? 'Not quite. Try another one.');
    setHint('');
    sellerSays(reply, [{ who: 'you', line: choice }]);
    setStage(next);
  }

  function hear(n: number) {
    if (n !== stall.price) return miss(String(n), `Listen again: ${stall.priceLine.am} (${stall.priceLine.tr}). Tap the speaker to hear it.`);
    setHint('');
    setStage('push');
  }

  function makeOffer(o: Offer) {
    const you: Said = { who: 'you', line: o };
    if (o.kind === 'low') {
      sellerSays(MERKATO.refuse, [you]);
      setOffers(list => list.filter(x => x !== o));
      setHint(`${o.value} birr is far too low for ${stall.seller}. Try a fairer offer.`);
      setMistakes(m => m + 1);
      return;
    }
    sellerSays(MERKATO.accept, [you]);
    setBought(b => [...b, { item: stall.item.en, paid: o.value, price: stall.price }]);
    setHint(
      o.kind === 'high'
        ? `Deal, but ${stall.seller} had already come down to ${stall.counter}. You offered more than ${stall.woman ? 'she' : 'he'} asked for!`
        : '',
    );
    setStage('thanks');
  }

  if (!started) {
    return (
      <div className="mk-intro">
        <div className="mk-awning" aria-hidden />
        <h1>Bargain at Merkato</h1>
        <p className="lead">
          Merkato in Addis Ababa is one of Africa’s biggest open-air markets, and nobody pays the first price. Visit
          three stalls: ask the price, catch the number, ask for less, and make a fair offer.
        </p>
        <ul className="mk-items">
          {STALLS.map(s => (
            <li key={s.seller}>
              {/* eslint-disable-next-line @next/next/no-img-element -- small local pictures */}
              <img src={s.item.picture} alt="" width={72} height={72} />
              <span lang="am">{s.item.am}</span>
              <small>
                {s.item.en} · {s.seller}
              </small>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setStarted(true);
            openStall(0);
          }}
        >
          Start shopping
        </button>
      </div>
    );
  }

  if (basket) {
    const paid = bought.reduce((n, b) => n + b.paid, 0);
    const saved = bought.reduce((n, b) => n + Math.max(0, b.price - b.paid), 0);
    return (
      <div className="mk-intro mk-done">
        <Mascot pose="happy" size={110} />
        <h1>Your basket is full!</h1>
        <p className="lead">
          You paid {paid} birr and saved <strong>{saved} birr</strong>
          {mistakes === 0 ? ', without a single slip.' : '.'}
        </p>
        <ul className="mk-receipt">
          {bought.map(b => (
            <li key={b.item}>
              <span>{b.item}</span>
              <span>
                {b.paid} birr <small>(asked {b.price})</small>
              </span>
            </li>
          ))}
        </ul>
        <p className="muted">
          You used ስንት ነው? (how much?), ውድ ነው (it’s expensive), ቀንስልኝ / ቀንሺልኝ (lower it, to a man / a woman), and
          numbers up to ninety.
        </p>
        <div className="row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setBought([]);
              setMistakes(0);
              setBasket(false);
              openStall(0);
            }}
          >
            Shop again
          </button>
          <Link href="/courses/amharic-beginner-3?lesson=3" className="btn">
            Back to the market lesson
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mk">
      <div className="mk-stall">
        <div className="mk-awning" aria-hidden />
        <div className="mk-stall-body">
          {/* eslint-disable-next-line @next/next/no-img-element -- small local pictures */}
          <img src={stall.item.picture} alt="" width={84} height={84} />
          <div>
            <p className="mk-stall-name">
              {stall.seller}’s stall · <span lang="am">{stall.item.am}</span> ({stall.item.en})
            </p>
            <p className="faint small">
              Stall {stallIdx + 1} of {STALLS.length} · talking to a {stall.woman ? 'woman' : 'man'}
            </p>
          </div>
          {bought.length > stallIdx && <span className="mk-tag">{bought[stallIdx].paid} birr</span>}
        </div>
      </div>

      <div className="mk-chat" aria-live="polite">
        {log.map((said, i) => (
          <Bubble key={i} said={said} seller={stall.seller} />
        ))}
        <div ref={end} />
      </div>

      <div className="mk-turn">
        {hint && (
          <p className="mk-hint" role="status">
            {hint}
          </p>
        )}

        {stage === 'ask' && (
          <>
            <p className="mk-task">Ask how much the {stall.item.en} are.</p>
            <Choices choices={stall.ask} wrong={wrong} onPick={c => choose(c, 'hear', stall.priceLine)} />
          </>
        )}

        {stage === 'hear' && (
          <>
            <p className="mk-task">How much did {stall.seller} say for a kilo?</p>
            <div className="mk-numbers">
              {stall.hear.map(n => (
                <button key={n} type="button" className={`mk-choice mk-number${wrong === String(n) ? ' wrong' : ''}`} onClick={() => hear(n)}>
                  {n} birr
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'push' && (
          <>
            <p className="mk-task">
              {stall.price} birr is too much! Tell {stall.seller} and ask {stall.woman ? 'her' : 'him'} to lower it.
            </p>
            <Choices choices={stall.push} wrong={wrong} onPick={c => choose(c, 'offer', stall.counterLine)} />
          </>
        )}

        {stage === 'offer' && (
          <>
            <p className="mk-task">
              {stall.seller} came down to {stall.counter}. Make your offer.
            </p>
            <div className="mk-choices">
              {offers.map(o => (
                <button key={o.value} type="button" className="mk-choice" onClick={() => makeOffer(o)}>
                  <span lang="am">{o.am}</span>
                  <small>
                    {o.tr} · {o.en}
                  </small>
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'thanks' && (
          <>
            <p className="mk-task">You have a deal. What do you say?</p>
            <Choices choices={MERKATO.thanks} wrong={wrong} onPick={c => choose(c, 'done', MERKATO.sellerThanks)} />
          </>
        )}

        {stage === 'done' && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (stallIdx < STALLS.length - 1) openStall(stallIdx + 1);
              else setBasket(true);
            }}
          >
            {stallIdx < STALLS.length - 1 ? `On to ${STALLS[stallIdx + 1].seller}’s stall` : 'See your basket'}
          </button>
        )}
      </div>
    </div>
  );
}

function Choices({ choices, wrong, onPick }: { choices: Choice[]; wrong: string | null; onPick: (c: Choice) => void }) {
  return (
    <div className="mk-choices">
      {choices.map(c => (
        <button key={c.am} type="button" className={`mk-choice${wrong === c.am ? ' wrong' : ''}`} onClick={() => onPick(c)}>
          <span lang="am">{c.am}</span>
          <small>{c.tr}</small>
        </button>
      ))}
    </div>
  );
}
