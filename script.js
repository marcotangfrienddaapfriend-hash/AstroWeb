// === Star Report Web Version ===
(async () => {
  const swe = await sweph();
  console.log("✅ Swiss Ephemeris 初始化完成");

  const signNames = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const signTranslate = {
    Aries: "白羊", Taurus: "金牛", Gemini: "雙子", Cancer: "巨蟹",
    Leo: "獅子", Virgo: "處女", Libra: "天秤", Scorpio: "天蠍",
    Sagittarius: "射手", Capricorn: "山羊", Aquarius: "水瓶", Pisces: "雙魚"
  };

  const zodiacInfo = {
    Aries: ["火", "開創"], Taurus: ["土", "固定"], Gemini: ["風", "變動"], Cancer: ["水", "開創"],
    Leo: ["火", "固定"], Virgo: ["土", "變動"], Libra: ["風", "開創"], Scorpio: ["水", "固定"],
    Sagittarius: ["火", "變動"], Capricorn: ["土", "開創"], Aquarius: ["風", "固定"], Pisces: ["水", "變動"]
  };

  function getSign(lon) {
    const idx = Math.floor(((lon % 360) / 30));
    const eng = signNames[idx];
    const chi = signTranslate[eng];
    return { eng, chi };
  }

  function getHouse(lon, cusp) {
    for (let i = 1; i <= 12; i++) {
      const next = (i % 12) + 1;
      const s = cusp[i], e = cusp[next];
      if (s < e ? (lon >= s && lon < e) : (lon >= s || lon < e)) return i;
    }
    return 1;
  }

  document.getElementById("astroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dateStr = document.getElementById("birthDate").value;
    const timeStr = document.getElementById("birthTime").value;
    const place = document.getElementById("birthPlace").value;

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    const jd = swe.julday(year, month, day, hour + minute / 60 - 8, swe.GREG_CAL);

    const lat = 22.3, lon = 114.1; // 香港座標
    const cusp = Array(13).fill(0);
    const ascmc = Array(10).fill(0);
    swe.houses(jd, lat, lon, 'P', cusp, ascmc);

    const planetList = [
      ["太陽", swe.SUN],
      ["月亮", swe.MOON],
      ["水星", swe.MERCURY],
      ["金星", swe.VENUS],
      ["火星", swe.MARS],
      ["木星", swe.JUPITER],
      ["土星", swe.SATURN]
    ];

    let reportText = `
<h3>📅 出生資訊</h3>
<p>${dateStr} ${timeStr} | ${place}</p>
<h3>🌟 星體分佈</h3>
`;

    let elementCount = { 火: 0, 土: 0, 風: 0, 水: 0 };
    let modeCount    = { 開創: 0, 固定: 0, 變動: 0 };

    for (const [name, pid] of planetList) {
      const lon = swe.calc_ut(jd, pid)[0][0];
      const { eng, chi } = getSign(lon);
      const house = getHouse(lon, cusp);
      const [elem, mode] = zodiacInfo[eng];
      elementCount[elem]++; modeCount[mode]++;
      reportText += `<p>${name.padEnd(4)}│ ${chi} ${(lon % 30).toFixed(2)}° │ 第${house}宮</p>`;
    }

    // 四元素分佈圖
    reportText += `<h3>🔥 元素分佈</h3>`;
    for (const eKey in elementCount) {
      const val = elementCount[eKey];
      const width = val * 60;
      reportText += `
        <div style="margin:4px 0;">
          <b>${eKey}</b> (${val}) 
          <div style="display:inline-block;height:14px;width:${width}px;background-color:#6ea8fe;border-radius:4px;margin-left:6px;"></div>
        </div>`;
    }

    // 模式分佈
    reportText += `<h3>🌈 行動特質</h3>`;
    for (const mKey in modeCount) {
      const val = modeCount[mKey];
      const width = val * 60;
      reportText += `
        <div style="margin:4px 0;">
          <b>${mKey}</b> (${val}) 
          <div style="display:inline-block;height:14px;width:${width}px;background-color:#ffe699;border-radius:4px;margin-left:6px;"></div>
        </div>`;
    }

    const reportDiv = document.getElementById("report");
    reportDiv.innerHTML = `
      <h2>🌠 Astro Combined Report v9.2 Web 版</h2>
      ${reportText}
      <hr>
      <p>🕓 報告生成時間：${new Date().toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" })}</p>
    `;
  });
})();

