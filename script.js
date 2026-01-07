// 防呆檢查：確保 sweph 載入
if (typeof sweph === "undefined") {
  alert("⚠️ 錯誤：找不到 sweph 模組。請重新整理或檢查網路。");
  throw new Error("sweph module not defined");
}

async function generateReport(date, time, place) {
  try {
    // 組合日期時間
    const [yyyy, mm, dd] = date.split("-").map(Number);
    const [hh, mi] = time.split(":").map(Number);

    // 示範：生成十顆行星經度
    const jd = sweph.swe_julday(yyyy, mm, dd, hh + mi / 60, sweph.SE_GREG_CAL);
    let output = `📅 日期時間：${yyyy}/${mm}/${dd}  ${hh}:${mi}\n📍 地點：${place}\n\n🪐 行星位置（示例）:\n`;

    const planets = [
      "☉ 太陽",
      "☽ 月亮",
      "☿ 水星",
      "♀ 金星",
      "♂ 火星",
      "♃ 木星",
      "♄ 土星",
      "♅ 天王星",
      "♆ 海王星",
      "♇ 冥王星"
    ];

    for (let i = 0; i <= 9; i++) {
      const result = sweph.swe_calc_ut(jd, i, sweph.SEFLG_SWIEPH);
      const lon = result.x[0].toFixed(2);
      output += `${planets[i]}：${lon}°\n`;
    }

    return output;
  } catch (err) {
    return "❌ 錯誤：" + err.message;
  }
}

document.getElementById("astroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = document.getElementById("birthDate").value;
  const time = document.getElementById("birthTime").value;
  const place = document.getElementById("birthPlace").value || "(未知)";

  document.getElementById("report").textContent = "生成中，請稍候...";

  const text = await generateReport(date, time, place);
  document.getElementById("report").textContent = text;
});