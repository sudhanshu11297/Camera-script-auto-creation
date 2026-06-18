import { useState, useRef } from "react";

const FEATURES = [
  "Photo Capture", "Video Recording", "Front/Rear Switch",
  "Zoom In/Out", "Night Mode", "HDR", "Flash Control",
  "Burst Shot", "Portrait Mode", "Pro Mode", "Panorama",
  "Timer", "Grid Lines", "Aspect Ratio Change", "Scene Optimizer"
];

const SYSTEM_PROMPT = `You are an expert in Samsung camera UI automation testing. You generate test scripts in a custom plain-text DSL used with UI Automator 2.

Available commands (infer realistic ones from these patterns):
- launch "package.name" — launches an app
- delay <ms> — waits for milliseconds
- click text "Label" — taps a UI element by visible text
- click id "resource-id" — taps element by resource ID
- long press text "Label" — long press on element
- scroll down / scroll up — scrolls the screen
- scroll text "Label" — scrolls until element is visible
- drag <x1> <y1> <x2> <y2> <duration_ms> — drag gesture (use for zoom/burst)
- swipe left / swipe right / swipe up / swipe down — swipe gestures
- swipe <x1> <y1> <x2> <y2> <duration_ms> — precise swipe
- pinch in / pinch out — pinch zoom gestures
- key back — press back button
- key home — press home button
- assert text "Label" — assert element is visible
- assert id "resource-id" — assert element exists
- wait text "Label" <timeout_ms> — wait until element appears
- take screenshot "filename" — capture screenshot
- set text "field" "value" — enter text into field
- rotate landscape / rotate portrait — change orientation

Rules:
- Always start with: launch "com.sec.android.app.camera"
- Add delay 3000 after launch to let camera initialize
- Use realistic delays (1000-3000ms for UI transitions, 500ms for minor actions)
- Add assert or wait steps to validate outcomes
- Add take screenshot at key validation points
- Group logically with comment lines starting with #
- Keep scripts clean, readable, and production-ready
- Return ONLY the raw script, no explanation, no markdown, no backticks`;

export default function App() {
  const [feature, setFeature] = useState("");
  const [description, setDescription] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeHistory, setActiveHistory] = useState(null);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const generate = async () => {
    if (!description.trim() && !feature) {
      setError("Please select a feature or describe the test scenario.");
      return;
    }
    setError("");
    setLoading(true);
    setScript("");
    setActiveHistory(null);

    const prompt = `Generate a Samsung camera test script for the following:
${feature ? `Feature: ${feature}` : ""}
${description.trim() ? `Scenario: ${description.trim()}` : ""}

Generate a complete, accurate test script using the DSL command format.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const output = data.content?.map(b => b.text || "").join("\n").trim();
      setScript(output);
      const entry = {
        id: Date.now(),
        feature: feature || "Custom",
        description: description.trim() || feature,
        script: output
      };
      setHistory(h => [entry, ...h.slice(0, 9)]);
    } catch (e) {
      setError("Failed to generate. Please try again.");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(feature || "test").replace(/\s+/g, "_").toLowerCase()}_script.txt`;
    a.click();
  };

  const loadHistory = (entry) => {
    setActiveHistory(entry.id);
    setScript(entry.script);
    setFeature(entry.feature === "Custom" ? "" : entry.feature);
    setDescription(entry.description);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)", padding: "20px 24px", borderBottom: "1px solid #1e3a5f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#3b82f6", borderRadius: 10, padding: "8px 10px", fontSize: 20 }}>📷</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Samsung Camera Test Generator</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>AI-powered UI Automator 2 script generation</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar - History */}
        <div style={{ width: 200, background: "#161b27", borderRight: "1px solid #1e293b", padding: "16px 12px", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>History</div>
          {history.length === 0 && <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>No scripts yet</div>}
          {history.map(h => (
            <div key={h.id} onClick={() => loadHistory(h)}
              style={{ padding: "8px 10px", borderRadius: 6, marginBottom: 6, cursor: "pointer", fontSize: 12,
                background: activeHistory === h.id ? "#1e3a5f" : "#1e293b",
                border: `1px solid ${activeHistory === h.id ? "#3b82f6" : "transparent"}`,
                color: "#cbd5e1" }}>
              <div style={{ fontWeight: 600, marginBottom: 2, color: "#e2e8f0" }}>{h.feature}</div>
              <div style={{ color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.description}</div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Feature selector */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8 }}>CAMERA FEATURE</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FEATURES.map(f => (
                <button key={f} onClick={() => setFeature(feature === f ? "" : f)}
                  style={{ padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid",
                    borderColor: feature === f ? "#3b82f6" : "#334155",
                    background: feature === f ? "#1e3a5f" : "#1e293b",
                    color: feature === f ? "#93c5fd" : "#94a3b8",
                    fontWeight: feature === f ? 600 : 400 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 8 }}>DESCRIBE THE TEST SCENARIO</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Open camera, switch to front camera, zoom in 2x, take a photo, verify it appears in gallery, then go back..."
              rows={4}
              style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
                padding: "12px 14px", color: "#e2e8f0", fontSize: 13, resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }}
            />
          </div>

          {error && <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fca5a5" }}>{error}</div>}

          {/* Generate button */}
          <button onClick={generate} disabled={loading}
            style={{ padding: "12px 28px", background: loading ? "#1e3a5f" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, alignSelf: "flex-start" }}>
            {loading ? (
              <>
                <span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #93c5fd", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Generating...
              </>
            ) : "⚡ Generate Test Script"}
          </button>

          {/* Output */}
          {script && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>GENERATED SCRIPT</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={copy}
                    style={{ padding: "6px 14px", background: copied ? "#14532d" : "#1e293b", border: `1px solid ${copied ? "#16a34a" : "#334155"}`,
                      borderRadius: 6, color: copied ? "#86efac" : "#94a3b8", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button onClick={download}
                    style={{ padding: "6px 14px", background: "#1e293b", border: "1px solid #334155",
                      borderRadius: 6, color: "#94a3b8", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                    ↓ Download
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={script}
                onChange={e => setScript(e.target.value)}
                rows={20}
                style={{ width: "100%", background: "#0d1117", border: "1px solid #334155", borderRadius: 8,
                  padding: "16px", color: "#a5f3a5", fontSize: 13, fontFamily: "monospace",
                  resize: "vertical", outline: "none", lineHeight: 1.7, boxSizing: "border-box" }}
              />
              <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>✏️ You can directly edit the script above</div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}