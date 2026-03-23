import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root element not found");
}

root.innerHTML = `
  <main class="redirect-shell" aria-live="polite">
    <section class="redirect-card">
      <p class="redirect-label">Misskey</p>
      <h1>misskey.io を WebView で開いています</h1>
      <p class="redirect-copy">読み込みが終わるまで少し待ってください。</p>
    </section>
  </main>
`;
