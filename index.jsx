import { useState } from "react";

const COMMANDS = {
  "App Control": [
    { cmd: "launch", label: "Launch App", params: [{ name: "package", placeholder: "com.sec.android.app.camera", label: "Package Name" }] },
    { cmd: "key back", label: "Key Back", params: [] },
    { cmd: "key home", label: "Key Home", params: [] },
    { cmd: "rotate landscape", label: "Rotate Landscape", params: [] },
    { cmd: "rotate portrait", label: "Rotate Portrait", params: [] },
  ],
  "Tap Actions": [
    { cmd: "click text", label: "Click Text", params: [{ name: "text", placeholder: "Take picture", label: "UI Text" }] },
    { cmd: "click id", label: "Click ID", params: [{ name: "id", placeholder: "com.sec.android.app.camera:id/btn_capture", label: "Resource ID" }] },
    { cmd: "long press text", label: "Long Press Text", params: [{ name: "text", placeholder: "Shutter", label: "UI Text" }] },
  ],
  "Gestures": [
    { cmd: "swipe left", label: "Swipe Left", params: [] },
    { cmd: "swipe right", label: "Swipe Right", params: [] },
    { cmd: "swipe up", label: "Swipe Up", params: [] },
    { cmd: "swipe down", label: "Swipe Down", params: [] },
    { cmd: "swipe", label: "Swipe (coords)", params: [
      { name: "x1", placeholder: "100", label: "X1" },
      { name: "y1", placeholder: "500", label: "Y1" },
      { name: "x2", placeholder: "900", label: "X2" },
      { name: "y2", placeholder: "500", label: "Y2" },
      { name: "duration", placeholder: "300", label: "Duration (ms)" }
    ]},
    { cmd: "drag", label: "Drag (coords)", params: [
      { name: "x1", placeholder: "540", label: "X1" },
      { name: "y1", placeholder: "960", label: "Y1" },
      { name: "x2", placeholder: "700", label: "X2" },
      { name: "y2", placeholder: "960", label: "Y2" },
      { name: "duration", placeholder: "500", label: "Duration (ms)" }
    ]},
    { cmd: "scroll down", label: "Scroll Down", params: [] },
    { cmd: "scroll up", label: "Scroll Up", params: [] },
    { cmd: "scroll text", label: "Scroll To Text", params: [{ name: "text", placeholder: "Settings", label: "UI Text" }] },
    { cmd: "pinch in", label: "Pinch In (Zoom Out)", params: [] },
    { cmd: "pinch out", label: "Pinch Out (Zoom In)", params: [] },
  ],
  "Timing": [
    { cmd: "delay", label: "Delay", params: [{ name: "ms", placeholder: "2000", label: "Milliseconds" }] },
  ],
  "Assertions": [
    { cmd: "assert text", label: "Assert Text Visible", params: [{ name: "text", placeholder: "Done", label: "UI Text" }] },
    { cmd: "assert id", label: "Assert ID Exists", params: [{ name: "id", placeholder: "resource-id", label: "Resource ID" }] },
    { cmd: "wait text", label: "Wait For Text", params: [
      { name: "text", placeholder: "Processing", label: "UI Text" },
      { name: "timeout", placeholder: "5000", label: "Timeout (ms)" }
    ]},
  ],
  "Media": [
    { cmd: "take screenshot", label: "Take Screenshot", params: [{ name: "filename", placeholder: "capture_result", label: "Filename" }] },
    { cmd: "set text", label: "Set Text", params: [
      { name: "field", placeholder: "search_field", label: "Field" },
      { name: "value", placeholder: "value", label: "Value" }
    ]},
  ],
};

const TEMPLATES = {
  "Photo Capture": [
    { cmd: "launch", params: { package: "com.sec.android.app.camera" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "click text", params: { text: "Take picture" } },
    { cmd: "delay", params: { ms: "2000" } },
    { cmd: "assert text", params: { text: "Done" } },
    { cmd: "take screenshot", params: { filename: "photo_capture_result" } },
    { cmd: "key back", params: {} },
  ],
  "Front/Rear Switch": [
    { cmd: "launch", params: { package: "com.sec.android.app.camera" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "click text", params: { text: "Switch Camera" } },
    { cmd: "delay", params: { ms: "1500" } },
    { cmd: "assert text", params: { text: "Take picture" } },
    { cmd: "take screenshot", params: { filename: "front_camera" } },
    { cmd: "click text", params: { text: "Take picture" } },
    { cmd: "delay", params: { ms: "2000" } },
    { cmd: "key back", params: {} },
  ],
  "Video Recording": [
    { cmd: "launch", params: { package: "com.sec.android.app.camera" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "click text", params: { text: "Video" } },
    { cmd: "delay", params: { ms: "1000" } },
    { cmd: "click text", params: { text: "Record" } },
    { cmd: "delay", params: { ms: "5000" } },
    { cmd: "click text", params: { text: "Stop" } },
    { cmd: "delay", params: { ms: "2000" } },
    { cmd: "assert text", params: { text: "Done" } },
    { cmd: "take screenshot", params: { filename: "video_result" } },
  ],
  "Zoom In/Out": [
    { cmd: "launch", params: { package: "com.sec.android.app.camera" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "pinch out", params: {} },
    { cmd: "delay", params: { ms: "1000" } },
    { cmd: "take screenshot", params: { filename: "zoom_in" } },
    { cmd: "pinch in", params: {} },
    { cmd: "delay", params: { ms: "1000" } },
    { cmd: "take screenshot", params: { filename: "zoom_out" } },
    { cmd: "click text", params: { text: "Take picture" } },
    { cmd: "delay", params: { ms: "2000" } },
    { cmd: "key back", params: {} },
  ],
  "Burst Shot": [
    { cmd: "launch", params: { package: "com.sec.android.app.camera" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "long press text", params: { text: "Take picture" } },
    { cmd: "delay", params: { ms: "3000" } },
    { cmd: "assert text", params: { text: "Done" } },
    { cmd: "take screenshot", params: { filename: "burst_result" } },
    { cmd: "key back", params: {} },
  ],
};

const CATEGORY_COLORS = {
  "App Control": "#3b82f6",
  "Tap Actions": "#10b981",
  "Gestures": "#f59e0b",
  "Timing": "#8b5cf6",
  "Assertions": "#ef4444",
  "Media": "#ec4899",
};

function buildScriptLine(step) {
  const p = step.params || {};
  switch (step.cmd) {
    case "launch": return `launch "${p.package || "com.sec.android.app.camera"}"`;
    case "delay": return `delay ${p.ms || "1000"}`;
    case "click text": return `click text "${p.text || ""}"`;
    case "click id": return `click id "${p.id || ""}"`;
    case "long press text": return `long press text "${p.text || ""}"`;
    case "swipe": return `swipe ${p.x1} ${p.y1} ${p.x2} ${p.y2} ${p.duration}`;
    case "drag": return `drag ${p.x1} ${p.y1} ${p.x2} ${p.y2} ${p.duration}`;
    case "scroll text": return `scroll text "${p.text || ""}"`;
    case "assert text": return `assert text "${p.text || ""}"`;
    case "assert id": return `assert id "${p.id || ""}"`;
    case "wait text": return `wait text "${p.text || ""}" ${p.timeout || "5000"}`;
    case "take screenshot": return `take screenshot "${p.filename || "screenshot"}"`;
    case "set text": return `set text "${p.field || ""}" "${p.value || ""}"`;
    default: return step.cmd;
  }
}

let idCounter = 1;
const makeId = () => idCounter++;

export default function App() {
  const [steps, setSteps] = useState([]);
  const [activeCategory, setActiveCategory] = useState("App Control");
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [testName, setTestName] = useState("CameraTest_001");

  const script = steps.map(s => buildScriptLine(s)).join("\n");

  const addStep = (cmdDef) => {
    const defaultParams = {};
    cmdDef.params.forEach(p => { defaultParams[p.name] = p.placeholder || ""; });
    const newStep = { id: makeId(), cmd: cmdDef.cmd, params: defaultParams, cmdDef };
    setSteps(s => [...s, newStep]);
    setEditingId(newStep.id);
  };

  const loadTemplate = (name) => {
    const tSteps = TEMPLATES[name].map(t => {
      const allCmds = Object.values(COMMANDS).flat();
      const cmdDef = allCmds.find(c => c.cmd === t.cmd) || { cmd: t.cmd, params: [] };
      return { id: makeId(), cmd: t.cmd, params: { ...t.params }, cmdDef };
    });
    setSteps(tSteps);
    setTestName(name.replace(/\//g, "_").replace(/\s+/g, "_") + "_Test");
    setEditingId(null);
  };

  const updateParam = (id, key, val) => {
    setSteps(s => s.map(step => step.id === id ? { ...step, params: { ...step.params, [key]: val } } : step));
  };

  const moveStep = (idx, dir) => {
    const newSteps = [...steps];
    const swap = idx + dir;
    if (swap < 0 || swap >= newSteps.length) return;
    [newSteps[idx], newSteps[swap]] = [newSteps[swap], newSteps[idx]];
    setSteps(newSteps);
  };

  const deleteStep = (id) => setSteps(s => s.filter(st => st.id !== id));

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${testName}.txt`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #0f2744)", padding: "14px 20px", borderBottom: "1px solid #1e3a5f", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#3b82f6", borderRadius: 8, padding: "6px 8px", fontSize: 18 }}>📷</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>Camera Test Script Builder</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Samsung R&D · UI Automator 2</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input value={testName} onChange={e => setTestName(e.target.value)}
            style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "5px 10px", color: "#e2e8f0", fontSize: 12, width: 180 }} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 58px)" }}>
        {/* Left: Command Palette */}
        <div style={{ width: 210, background: "#161b27", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Templates */}
          <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Templates</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.keys(TEMPLATES).map(t => (
                <button key={t} onClick={() => loadTemplate(t)}
                  style={{ padding: "5px 8px", background: "#1e293b", border: "1px solid #334155", borderRadius: 5, color: "#94a3b8", fontSize: 11, cursor: "pointer", textAlign: "left" }}>
                  ⚡ {t}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div style={{ padding: "10px 12px 6px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Commands</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Object.keys(COMMANDS).map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{ padding: "5px 8px", border: "none", borderRadius: 5, cursor: "pointer", textAlign: "left", fontSize: 11, fontWeight: 500,
                    background: activeCategory === cat ? CATEGORY_COLORS[cat] + "22" : "transparent",
                    color: activeCategory === cat ? CATEGORY_COLORS[cat] : "#64748b",
                    borderLeft: `2px solid ${activeCategory === cat ? CATEGORY_COLORS[cat] : "transparent"}` }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Command list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
            {COMMANDS[activeCategory].map(cmd => (
              <button key={cmd.cmd} onClick={() => addStep(cmd)}
                style={{ width: "100%", padding: "7px 10px", marginBottom: 4, background: "#1e293b",
                  border: `1px solid ${CATEGORY_COLORS[activeCategory]}33`,
                  borderRadius: 6, color: "#cbd5e1", fontSize: 11, cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: CATEGORY_COLORS[activeCategory], fontWeight: 700 }}>+</span>
                {cmd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Step Builder */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            Test Steps {steps.length > 0 && <span style={{ color: "#3b82f6" }}>({steps.length})</span>}
          </div>

          {steps.length === 0 && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#475569", gap: 10, paddingTop: 60 }}>
              <div style={{ fontSize: 36 }}>🧩</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Add steps from the left panel</div>
              <div style={{ fontSize: 12 }}>or load a template to get started</div>
            </div>
          )}

          {steps.map((step, idx) => {
            const cat = Object.keys(COMMANDS).find(c => COMMANDS[c].find(x => x.cmd === step.cmd));
            const color = CATEGORY_COLORS[cat] || "#64748b";
            const isEditing = editingId === step.id;
            return (
              <div key={step.id} style={{ background: "#1e293b", border: `1px solid ${isEditing ? color : "#334155"}`, borderRadius: 8, overflow: "hidden" }}>
                {/* Step header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", cursor: "pointer" }}
                  onClick={() => setEditingId(isEditing ? null : step.id)}>
                  <span style={{ background: color + "22", color, borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{idx + 1}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" }}>{buildScriptLine(step)}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); moveStep(idx, -1); }}
                      style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "0 3px" }}>▲</button>
                    <button onClick={e => { e.stopPropagation(); moveStep(idx, 1); }}
                      style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "0 3px" }}>▼</button>
                    <button onClick={e => { e.stopPropagation(); deleteStep(step.id); }}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, padding: "0 3px" }}>✕</button>
                  </div>
                </div>

                {/* Params editor */}
                {isEditing && step.cmdDef?.params?.length > 0 && (
                  <div style={{ padding: "8px 12px 10px", borderTop: `1px solid ${color}33`, display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {step.cmdDef.params.map(p => (
                      <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <label style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{p.label}</label>
                        <input value={step.params[p.name] || ""}
                          onChange={e => updateParam(step.id, p.name, e.target.value)}
                          placeholder={p.placeholder}
                          style={{ background: "#0d1117", border: "1px solid #334155", borderRadius: 5, padding: "4px 8px", color: "#e2e8f0", fontSize: 12, width: 160, fontFamily: "monospace" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Script Preview */}
        <div style={{ width: 280, background: "#0d1117", borderLeft: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>Script Preview</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={copy}
                style={{ padding: "4px 10px", background: copied ? "#14532d" : "#1e293b", border: `1px solid ${copied ? "#16a34a" : "#334155"}`,
                  borderRadius: 5, color: copied ? "#86efac" : "#94a3b8", fontSize: 11, cursor: "pointer" }}>
                {copied ? "✓" : "Copy"}
              </button>
              <button onClick={download}
                style={{ padding: "4px 10px", background: "#1e293b", border: "1px solid #334155", borderRadius: 5, color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
                ↓
              </button>
            </div>
          </div>
          <pre style={{ flex: 1, margin: 0, padding: 14, overflowY: "auto", fontSize: 12, color: "#a5f3a5", fontFamily: "monospace", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {script || <span style={{ color: "#334155", fontStyle: "italic" }}>Script will appear here...</span>}
          </pre>
          {steps.length > 0 && (
            <div style={{ padding: "8px 14px", borderTop: "1px solid #1e293b", fontSize: 11, color: "#475569" }}>
              {steps.length} steps · {script.split("\n").length} lines
            </div>
          )}
        </div>
      </div>
    </div>
  );
}