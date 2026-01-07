const { julian, planetposition, solar, data } = astron; // 由 CDN 引入的全域物件

document.getElementById("astroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const dateStr = document.getElementById("birthDate").value; // e.g. 1996-08-28
  const timeStr = document.getElementById("birthTime").value; // 07:35
  const place = document.getElementById("birthPlace").value;
  
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  // 🔹 轉為儒略日 (Julian Day)
  const jd = julian.CalendarToJD(new julian.Calendar(year, month, day, hour + minute/60));

  // 🔹 載入內建行星星曆資料（簡化）
  const earth = new planetposition.Planet(data.earth);
  const jupiter = new planetposition.Planet(data.jupiter);
  const mars = new planetposition.Planet(data.mars);

  // 🔹 計算太陽視黃經（Ecliptic longitude）
  const sun = solar.apparentVSOP87(earth, jd);
  const lonSun = sun.lon * 180 / Math.PI;

  // 🔹 行星例子
  const lonJup = jupiter.position(jd).lon * 180 / Math.PI;
  const lonMars = mars.position(jd).lon * 180 / Math.PI;

  // 🔹 對應星座
  const zodiacSigns = [
    "白羊", "金牛", "雙子", "巨蟹", "獅子", "處女",
    "天秤", "天蠍", "射手", "山羊", "水瓶", "雙魚"
  ];
  const getSign = (lon) => zodiacSigns[Math.floor(((lon % 360) / 30))];

  // 🔹 輸出報告
  const now = new Date().toLocaleString("zh-HK", { timeZone: "Asia/Hong_Kong" });
  const container = document.getElementById("report");
  container.innerHTML = `
    <div class="result">
      <h3>📅 出生日期時間：</h3>
      <p>${dateStr} ${timeStr} (UTC+08:00)</p>
      <h3>📍 出生地點：</h3>
      <p>${place}</p>
      <h3>🗓️ 報告生成時間：</h3>
      <p>${now}</p>
      <hr>
      <h3>🌠 行星示例（版本 A）</h3>
      <p>☉ 太陽在 ${getSign(lonSun)}（${lonSun.toFixed(2)}°）</p>
      <p>♂ 火星在 ${getSign(lonMars)}（${lonMars.toFixed(2)}°）</p>
      <p>♃ 木星在 ${getSign(lonJup)}（${lonJup.toFixed(2)}°）</p>
    </div>
  `;
});
