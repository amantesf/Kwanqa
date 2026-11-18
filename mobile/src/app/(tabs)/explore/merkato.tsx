import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { amharicAudio } from '@/lib/amharicAudio';
import { MERKATO, STALLS, type Choice, type Line, type Offer } from '@/lib/merkato';
import { feel } from '@/haptics';
import { play, playEffect } from '@/components/sound';
import Speaker from '@/components/speaker';
import Walia from '@/components/walia';
import { siteUrl } from '@/site';
import { fonts, makeStyles } from '@/theme';

// Merkato, like the website's (/merkato): bargain your way through three
// market stalls. Ask the price, catch the number the seller says, ask for less
// (ቀንስልኝ to a man, ቀንሺልኝ to a woman), make a fair offer, and say thank you.

type Stage = 'start' | 'ask' | 'hear' | 'push' | 'offer' | 'thanks' | 'done' | 'basket';
type Said = { who: 'seller' | 'you'; line: Line };
type Bought = { item: string; paid: number; price: number };

function speak(line: Line) {
  const audio = amharicAudio(line.am);
  if (audio) play(audio);
}

export default function Merkato() {
  const styles = useStyles();
  const [stage, setStage] = useState<Stage>('start');
  const [stallIdx, setStallIdx] = useState(0);
  const [log, setLog] = useState<Said[]>([]);
  const [hint, setHint] = useState('');
  const [offers, setOffers] = useState<Offer[]>(STALLS[0].offers);
  const [bought, setBought] = useState<Bought[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const stall = STALLS[stallIdx];

  function sellerSays(line: Line, before: Said[] = []) {
    setLog(l => [...l, ...before, { who: 'seller', line }]);
    setTimeout(() => speak(line), before.length ? 500 : 0);
  }

  function openStall(i: number) {
    setStallIdx(i);
    setStage('ask');
    setOffers(STALLS[i].offers);
    setHint('');
    setLog([]);
    sellerSays(MERKATO.greeting);
  }

  function miss(why: string) {
    playEffect('wrong');
    setHint(why);
    setMistakes(m => m + 1);
  }

  function choose(choice: Choice, next: Stage, reply: Line) {
    if (!choice.right) return miss(choice.why ?? 'Not quite. Try another one.');
    playEffect('correct');
    setHint('');
    sellerSays(reply, [{ who: 'you', line: choice }]);
    setStage(next);
  }

  function makeOffer(o: Offer) {
    const you: Said = { who: 'you', line: o };
    if (o.kind === 'low') {
      playEffect('wrong');
      sellerSays(MERKATO.refuse, [you]);
      setOffers(list => list.filter(x => x !== o));
      setHint(`${o.value} birr is far too low for ${stall.seller}. Try a fairer offer.`);
      setMistakes(m => m + 1);
      return;
    }
    playEffect('correct');
    sellerSays(MERKATO.accept, [you]);
    setBought(b => [...b, { item: stall.item.en, paid: o.value, price: stall.price }]);
    setHint(o.kind === 'high' ? `Deal, but ${stall.seller} had already come down to ${stall.counter}. You offered more than ${stall.woman ? 'she' : 'he'} asked for!` : '');
    setStage('thanks');
  }

  if (stage === 'start') {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.awning} />
        <Text style={styles.heading}>Bargain at Merkato</Text>
        <Text style={styles.lead}>
          Merkato in Addis Ababa is one of Africa’s biggest open-air markets, and nobody pays the first price. Visit three
          stalls: ask the price, catch the number, ask for less, and make a fair offer.
        </Text>
        <View style={styles.items}>
          {STALLS.map(s => (
            <View key={s.seller} style={styles.item}>
              <Image source={{ uri: siteUrl(s.item.picture) }} style={styles.itemPicture} contentFit="contain" />
              <Text style={styles.itemAm}>{s.item.am}</Text>
              <Text style={styles.itemEn}>
                {s.item.en} · {s.seller}
              </Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => openStall(0)} style={({ pressed }) => [styles.button, pressed && styles.buttonDown]} accessibilityRole="button">
          <Text style={styles.buttonText}>Start shopping</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (stage === 'basket') {
    const paid = bought.reduce((n, b) => n + b.paid, 0);
    const saved = bought.reduce((n, b) => n + Math.max(0, b.price - b.paid), 0);
    return (
      <ScrollView contentContainerStyle={[styles.page, styles.center]}>
        <Walia pose="happy" size={100} />
        <Text style={styles.heading}>Your basket is full!</Text>
        <Text style={styles.lead}>
          You paid {paid} birr and saved {saved} birr{mistakes === 0 ? ', without a single slip.' : '.'}
        </Text>
        <View style={styles.receipt}>
          {bought.map(b => (
            <View key={b.item} style={styles.receiptRow}>
              <Text style={styles.receiptText}>{b.item}</Text>
              <Text style={styles.receiptText}>
                {b.paid} birr <Text style={styles.receiptAsked}>(asked {b.price})</Text>
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.small}>
          You used ስንት ነው? (how much?), ውድ ነው (it’s expensive), ቀንስልኝ / ቀንሺልኝ (lower it, to a man / a woman), and numbers up to ninety.
        </Text>
        <Pressable
          onPress={() => {
            setBought([]);
            setMistakes(0);
            openStall(0);
          }}
          style={({ pressed }) => [styles.button, pressed && styles.buttonDown]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Shop again</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.stall}>
        <View style={styles.awning} />
        <View style={styles.stallBody}>
          <Image source={{ uri: siteUrl(stall.item.picture) }} style={styles.stallPicture} contentFit="contain" />
          <View style={styles.flex}>
            <Text style={styles.stallName}>
              {stall.seller}’s stall · {stall.item.en}
            </Text>
            <Text style={styles.small}>
              Stall {stallIdx + 1} of {STALLS.length} · talking to a {stall.woman ? 'woman' : 'man'}
            </Text>
          </View>
        </View>
      </View>

      {log.map((said, i) => (
        <View key={i} style={[styles.line, said.who === 'you' && styles.lineYou]}>
          {said.who === 'seller' ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{stall.seller[0]}</Text>
            </View>
          ) : null}
          <View style={[styles.bubble, said.who === 'you' && styles.bubbleYou]}>
            <Text style={styles.am}>{said.line.am}</Text>
            <Text style={styles.tr}>{said.line.tr}</Text>
            <Text style={styles.en}>{said.line.en}</Text>
          </View>
          <Speaker onPress={() => speak(said.line)} label={`Hear ${said.line.en}`} />
        </View>
      ))}

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}

      {stage === 'ask' ? (
        <>
          <Text style={styles.task}>Ask how much the {stall.item.en} are.</Text>
          <Choices choices={stall.ask} onPick={c => choose(c, 'hear', stall.priceLine)} />
        </>
      ) : null}

      {stage === 'hear' ? (
        <>
          <Text style={styles.task}>How much did {stall.seller} say for a kilo?</Text>
          <View style={styles.numbers}>
            {stall.hear.map(n => (
              <Pressable
                key={n}
                onPress={() => {
                  feel('pick');
                  if (n !== stall.price) return miss(`Listen again: ${stall.priceLine.am} (${stall.priceLine.tr}). Tap the speaker to hear it.`);
                  playEffect('correct');
                  setHint('');
                  setStage('push');
                }}
                style={({ pressed }) => [styles.option, styles.number, pressed && styles.optionDown]}
                accessibilityRole="button"
              >
                <Text style={styles.numberText}>{n} birr</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {stage === 'push' ? (
        <>
          <Text style={styles.task}>
            {stall.price} birr is too much! Tell {stall.seller} and ask {stall.woman ? 'her' : 'him'} to lower it.
          </Text>
          <Choices choices={stall.push} onPick={c => choose(c, 'offer', stall.counterLine)} />
        </>
      ) : null}

      {stage === 'offer' ? (
        <>
          <Text style={styles.task}>
            {stall.seller} came down to {stall.counter}. Make your offer.
          </Text>
          {offers.map(o => (
            <Pressable
              key={o.value}
              onPress={() => {
                feel('pick');
                makeOffer(o);
              }}
              style={({ pressed }) => [styles.option, pressed && styles.optionDown]}
              accessibilityRole="button"
            >
              <Text style={styles.am}>{o.am}</Text>
              <Text style={styles.en}>
                {o.tr} · {o.en}
              </Text>
            </Pressable>
          ))}
        </>
      ) : null}

      {stage === 'thanks' ? (
        <>
          <Text style={styles.task}>You have a deal. What do you say?</Text>
          <Choices choices={MERKATO.thanks} onPick={c => choose(c, 'done', MERKATO.sellerThanks)} />
        </>
      ) : null}

      {stage === 'done' ? (
        <Pressable
          onPress={() => (stallIdx < STALLS.length - 1 ? openStall(stallIdx + 1) : setStage('basket'))}
          style={({ pressed }) => [styles.button, pressed && styles.buttonDown]}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{stallIdx < STALLS.length - 1 ? `On to ${STALLS[stallIdx + 1].seller}’s stall` : 'See your basket'}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function Choices({ choices, onPick }: { choices: Choice[]; onPick: (c: Choice) => void }) {
  const styles = useStyles();
  return (
    <>
      {choices.map(c => (
        <Pressable
          key={c.am}
          onPress={() => {
            feel('pick');
            onPick(c);
          }}
          style={({ pressed }) => [styles.option, pressed && styles.optionDown]}
          accessibilityRole="button"
        >
          <Text style={styles.am}>{c.am}</Text>
          <Text style={styles.en}>{c.tr}</Text>
        </Pressable>
      ))}
    </>
  );
}

const useStyles = makeStyles(c => ({
  page: { padding: 16, gap: 12, paddingBottom: 48 },
  center: { alignItems: 'center' },
  flex: { flex: 1 },
  awning: { height: 26, borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: c.primary, borderBottomWidth: 6, borderBottomColor: '#fff4e8' },
  heading: { fontFamily: fonts.black, fontSize: 28, color: c.ink, textAlign: 'center' },
  lead: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: c.muted, textAlign: 'center' },
  small: { fontFamily: fonts.bold, fontSize: 13, lineHeight: 18, color: c.muted },
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  item: { width: 104, alignItems: 'center', gap: 2, paddingVertical: 10, borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line },
  itemPicture: { width: 60, height: 60 },
  itemAm: { fontFamily: fonts.amharicBold, fontSize: 16, lineHeight: 24, color: c.ink },
  itemEn: { fontFamily: fonts.bold, fontSize: 11, color: c.muted },
  stall: { borderRadius: 16, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, overflow: 'hidden' },
  stallBody: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  stallPicture: { width: 60, height: 60 },
  stallName: { fontFamily: fonts.black, fontSize: 15, color: c.ink },
  line: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  lineYou: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.black, fontSize: 15, color: '#ffffff' },
  bubble: { flexShrink: 1, gap: 1, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 2, borderColor: c.line, backgroundColor: c.bg },
  bubbleYou: { borderBottomLeftRadius: 16, borderBottomRightRadius: 4, borderColor: '#bcd2f5', backgroundColor: '#e6eefb' },
  am: { fontFamily: fonts.amharicBold, fontSize: 18, lineHeight: 27, color: c.ink },
  tr: { fontFamily: fonts.bold, fontSize: 13, color: c.blue },
  en: { fontFamily: fonts.body, fontSize: 13, color: c.muted },
  hint: { padding: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff6dc', fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: '#6b5200' },
  task: { fontFamily: fonts.black, fontSize: 16, color: c.ink, marginTop: 6 },
  option: { gap: 2, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 2, borderBottomWidth: 4, borderColor: c.line, backgroundColor: c.bg },
  optionDown: { borderBottomWidth: 2, marginTop: 2 },
  numbers: { flexDirection: 'row', gap: 8 },
  number: { flex: 1, alignItems: 'center' },
  numberText: { fontFamily: fonts.black, fontSize: 18, color: c.ink },
  receipt: { alignSelf: 'stretch', padding: 14, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: c.line, gap: 6 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptText: { fontFamily: fonts.heavy, fontSize: 15, color: c.ink },
  receiptAsked: { fontFamily: fonts.bold, color: c.muted },
  button: { alignSelf: 'stretch', minHeight: 52, borderRadius: 16, borderBottomWidth: 5, borderBottomColor: c.primaryShadow, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonDown: { borderBottomWidth: 0, marginTop: 5 },
  buttonText: { fontFamily: fonts.black, fontSize: 16, color: '#ffffff' },
}));
