import { createElement, useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SITE } from '@/site';

// The drawing square for writing the ፊደል, like the website's Write tab
// (components/FidelWrite.tsx): Hanzi Writer (MIT) with Kwanqa's own stroke data
// from kwanqa.com/fidel-strokes/. Hanzi Writer needs a web page, so it runs in a
// web view (an iframe in the browser preview) and reports back to the app:
// how many strokes, what to say, and when the letter is written.

// 'lesson' is a lesson's "Trace the new letter": it shows how once, then you trace.
export type Mode = 'watch' | 'trace' | 'memory' | 'lesson';
export type WriterEvent =
  | { t: 'strokes'; n: number }
  | { t: 'message'; text: string }
  | { t: 'correct' }
  | { t: 'wrong' }
  | { t: 'done'; mistakes: number }
  /** this letter's strokes couldn't load, so there's nothing to write */
  | { t: 'missing' };

function page(char: string, mode: Mode) {
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
  html, body { margin: 0; height: 100%; overflow: hidden; background: transparent; touch-action: none; -webkit-user-select: none; }
  #box { width: 100vw; height: 100vw; max-height: 100vh; max-width: 100vh; margin: 0 auto; }
</style>
<script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.3/dist/hanzi-writer.min.js"></script>
</head><body><div id="box"></div>
<script>
  var CHAR = ${JSON.stringify(char)}, MODE = ${JSON.stringify(mode)}, SITE = ${JSON.stringify(SITE)};
  function send(e) {
    var s = JSON.stringify(e);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(s);
    else if (window.parent !== window) window.parent.postMessage({ kwanqaWriter: s }, '*');
  }
  // fidel families sit in blocks of eight code points; the first is the base letter
  var code = CHAR.codePointAt(0), base = code - ((code - 0x1200) % 8);
  var family = fetch(SITE + '/fidel-strokes/' + base.toString(16) + '.json').then(function (r) { return r.json(); });
  family.then(function (f) { send(f[CHAR] ? { t: 'strokes', n: f[CHAR].strokes.length } : { t: 'missing' }); }, function () { send({ t: 'missing' }); });
  var box = document.getElementById('box');
  var size = Math.min(window.innerWidth, window.innerHeight);
  var w = HanziWriter.create(box, CHAR, {
    width: size, height: size, padding: Math.round(size * 0.08),
    charDataLoader: function (c, onLoad, onError) { family.then(function (f) { f[c] ? onLoad(f[c]) : onError(new Error('no strokes')); }).catch(onError); },
    showOutline: true, strokeColor: '#3c3c3c', outlineColor: '#e8e2dc', highlightColor: '#d2582e', drawingColor: '#1f5bd0',
    drawingWidth: Math.max(14, Math.round(size / 22)), strokeAnimationSpeed: 0.9, delayBetweenStrokes: 450,
    showHintAfterMisses: 2, leniency: 1.4,
  });
  function quiz() {
    (MODE === 'memory' ? w.hideOutline() : w.showOutline());
    w.hideCharacter();
    send({ t: 'message', text: MODE === 'memory' ? 'Write it from memory, stroke 1 first.' : 'Trace stroke 1 over the outline.' });
    w.quiz({
      onCorrectStroke: function (s) { send({ t: 'message', text: s.strokesRemaining ? 'Good. Now stroke ' + (s.strokeNum + 2) + '.' : '' }); },
      onMistake: function (s) {
        send({ t: 'wrong' });
        send({ t: 'message', text: s.mistakesOnStroke >= 2 ? 'Follow the highlighted stroke ' + (s.strokeNum + 1) + '.' : 'Not quite. Try stroke ' + (s.strokeNum + 1) + ' again, in the right direction.' });
      },
      onComplete: function (r) { send({ t: 'correct' }); send({ t: 'done', mistakes: r.totalMistakes }); },
    });
  }
  if (MODE === 'watch') {
    send({ t: 'message', text: 'Watch the order, then try tracing it.' });
    w.animateCharacter();
  } else if (MODE === 'lesson') {
    send({ t: 'message', text: 'Watch first, then trace stroke 1.' });
    w.animateCharacter({ onComplete: quiz });
  } else {
    quiz();
  }
</script></body></html>`;
}

export default function Writer({ char, mode, round, onEvent }: { char: string; mode: Mode; round: number; onEvent: (e: WriterEvent) => void }) {
  // a new page for each letter, mode and try, so it always starts fresh
  const html = useMemo(() => page(char, mode), [char, mode, round]); // eslint-disable-line react-hooks/exhaustive-deps

  // the browser preview gets messages from its iframe
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const listener = (e: MessageEvent) => {
      if (e.data?.kwanqaWriter) onEvent(JSON.parse(e.data.kwanqaWriter));
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [onEvent]);

  return (
    <View style={styles.paper}>
      {/* copybook guides: a cross through the middle */}
      <View style={styles.across} pointerEvents="none" />
      <View style={styles.down} pointerEvents="none" />
      {Platform.OS === 'web' ? (
        createElement('iframe', { key: html, srcDoc: html, style: { border: 0, width: '100%', height: '100%', background: 'transparent' }, title: 'Write the letter' })
      ) : (
        <WebView
          key={html}
          source={{ html, baseUrl: SITE }}
          originWhitelist={['*']}
          onMessage={e => onEvent(JSON.parse(e.nativeEvent.data))}
          scrollEnabled={false}
          bounces={false}
          style={styles.web}
          containerStyle={styles.web}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { width: '100%', aspectRatio: 1, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#ecd9c8', backgroundColor: '#fffaf5', overflow: 'hidden' },
  across: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, marginTop: -1, backgroundColor: '#f0e6dc' },
  down: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, marginLeft: -1, backgroundColor: '#f0e6dc' },
  web: { flex: 1, backgroundColor: 'transparent' },
});
