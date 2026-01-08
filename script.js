<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌌 星盤分析系統 Web 版</title>
  <link rel="stylesheet" href="./style.css">

  <!-- ✅ 使用可用的官方 CDN -->
  <script src="https://cdn.jsdelivr.net/gh/andrmoel/SwissEphemerisJS/sweph.js"></script>
</head>

<body>
  <div class="container">
    <h2>🌟 星盤分析系統 Web 版</h2>
    <form id="astroForm">
      <label for="birthDate">出生日期：</label>
      <input type="date" id="birthDate" required>

      <label for="birthTime">出生時間：</label>
      <input type="time" id="birthTime" required>

      <label for="birthPlace">地點：</label>
      <input type="text" id="birthPlace" placeholder="例如：香港" required>

      <button type="submit">產生報告</button>
    </form>

    <pre id="report"></pre>
  </div>

  <script>
    // ======== sweph 模組安全等待程式 ========
    function waitForSweph(callback, retries = 0) {
      if (typeof window.sweph !== "undefined") {
        console.log("✅ sweph 載入成功！");
        callback();
      } else if (retries < 10) {
        console.log(`🔄 重試 sweph 載入中... (${retries + 1}/10)`);
        setTimeout(() => waitForSweph(callback, retries + 1), 1000);
      } else {
        alert("⚠️ 無法載入 sweph 模組，請重新整理頁面。");
      }
    }

    // ======== 主程式：當 sweph 載入後啟動 ========
    waitForSweph(() => {
      async function generateReport(date, time, place) {
        try {
          const [yyyy, mm, dd] = date.split("-").map(Number);
          const [hh, mi] = time.split(":").map(Number);
          const jd = sweph.swe_julday(yyyy, mm, dd, hh + mi / 60, sweph.SE_GREG_CAL);

          const planetCodes = [
            sweph.SE_SUN, sweph.SE_MOON, sweph.SE_MERCURY, sweph.SE_VENUS, sweph.SE_MARS,
            sweph.SE_JUPITER, sweph.SE_SATURN, sweph.SE_URANUS, sweph.SE_NEPTUNE, sweph.SE_PLUTO
          ];
          const planetNames = ["太陽 ☉","月亮 ☽","水星 ☿","金星 ♀","火星 ♂",
                               "木星 ♃","土星 ♄","天王星 ♅","海王星 ♆","冥王星 ♇"];
          const zodiacs = ["牡羊座","金牛座","雙子座","巨蟹座","獅子座","處女座",
                           "天秤座","天蠍座","射手座","摩羯座","水瓶座","雙魚座"];

          let output = `📅 日期：${yyyy}/${mm}/${dd}\n🕒 時間：${hh}:${mi.toString().padStart(2,"0")}\n📍 地點：${place}\n\n=== 行星位置 ===\n`;

          // 計算每個行星的位置
          for (let i = 0; i < planetCodes.length; i++) {
            const result = sweph.swe_calc_ut(jd, planetCodes[i], sweph.SEFLG_SWIEPH);
            const lon = result.longitude;
            const sign = zodiacs[Math.floor(lon / 30)];
            const deg = (lon % 30).toFixed(2);
            output += `${planetNames[i]}：${sign} ${deg}°\n`;
          }

          return output;
        } catch (err) {
          return `⚠️ 發生錯誤：${err.message}`;
        }
      }

      // ======== 綁定表單提交事件 ========
      document.getElementById("astroForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const date = document.getElementById("birthDate").value;
        const time = document.getElementById("birthTime").value;
        const place = document.getElementById("birthPlace").value;
        const report = document.getElementById("report");

        report.textContent = "🧮 星盤計算中，請稍候...";
        const text = await generateReport(date, time, place);
        report.textContent = text;
      });
    });
  </script>
</body>
</html>
