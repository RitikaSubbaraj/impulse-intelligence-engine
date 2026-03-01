import React, { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    time_gap: "",
    spend_deviation: "",
    hour: "",
    is_weekend: "",
    late_night: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      form.time_gap === "" ||
      form.spend_deviation === "" ||
      form.hour === "" ||
      form.is_weekend === "" ||
      form.late_night === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        time_gap: Number(form.time_gap),
        spend_deviation: Number(form.spend_deviation),
        hour: Number(form.hour),
        is_weekend: Number(form.is_weekend),
        late_night: Number(form.late_night)
      });

      setResult(response.data.impulse_probability);
    } catch {
      alert("Prediction failed.");
    }

    setLoading(false);
  };

  const getRiskColor = () => {
    if (!result) return "bg-gray-700";
    if (result < 30) return "bg-green-500";
    if (result < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskLabel = () => {
    if (!result) return "";
    if (result < 30) return "Low Behavioral Risk";
    if (result < 60) return "Moderate Behavioral Risk";
    return "High Impulse Vulnerability";
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Floating gradient orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10">

        {/* HERO */}
        <section className="text-center pt-24 pb-12 px-6">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Impulse Intelligence Engine
          </h1>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto text-lg">
            A real-time behavioral financial risk detection system designed to identify
            impulse-driven purchase vulnerability. Built for fintech, digital banking,
            and risk intelligence platforms.
          </p>
        </section>

        {/* MAIN CARD */}
        <section className="flex justify-center px-6 pb-24">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-16 w-full max-w-3xl">

            <h2 className="text-3xl font-bold mb-8 text-center">
              Behavioral Risk Simulator
            </h2>

            <p className="text-gray-400 mb-10 text-center">
              Input behavioral signals to simulate impulse vulnerability detection.
              The model evaluates time compression, spending deviation, circadian effects,
              and contextual behavior.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input type="number" name="time_gap" placeholder="Time Gap (hours)"
                value={form.time_gap} onChange={handleChange}
                className="p-4 rounded-xl bg-black/40 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />

              <input type="number" name="spend_deviation" placeholder="Spend Deviation"
                value={form.spend_deviation} onChange={handleChange}
                className="p-4 rounded-xl bg-black/40 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />

              <input type="number" name="hour" placeholder="Hour (0-23)"
                value={form.hour} onChange={handleChange}
                className="p-4 rounded-xl bg-black/40 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />

              <input type="number" name="is_weekend" placeholder="Weekend (0/1)"
                value={form.is_weekend} onChange={handleChange}
                className="p-4 rounded-xl bg-black/40 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />

              <input type="number" name="late_night" placeholder="Late Night (0/1)"
                value={form.late_night} onChange={handleChange}
                className="p-4 rounded-xl bg-black/40 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2" />

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-10 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300 p-4 rounded-xl font-semibold text-lg"
            >
              {loading ? "Analyzing Behavioral Signal..." : "Run Risk Analysis"}
            </button>

            {result !== null && (
              <div className="mt-16">

                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Impulse Vulnerability Score</span>
                  <span className="font-bold">{getRiskLabel()}</span>
                </div>

                <div className="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${getRiskColor()}`}
                    style={{ width: `${result}%` }}
                  ></div>
                </div>

                <div className="text-center mt-8">
                  <h3 className="text-5xl font-bold">{result}%</h3>
                  <p className="text-gray-400 mt-3 max-w-xl mx-auto">
                    This score reflects the probability of impulse-driven financial behavior
                    under the given behavioral conditions.
                  </p>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 pb-24 text-center">
          <h3 className="text-3xl font-bold mb-6">How The Engine Works</h3>
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The system models behavioral compression patterns, abnormal spending spikes,
            circadian vulnerability signals, and contextual decision fatigue indicators.
            These features are processed through a calibrated predictive model to estimate
            real-time impulse risk probability.
          </p>
        </section>

      </div>
    </div>
  );
}

export default App;