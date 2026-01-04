body {
  font-family: "Noto Sans TC", sans-serif;
  background: #eef3f7;
  color: #222;
  margin: 0;
}
.container {
  max-width: 800px;
  background: #fff;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
form label { margin-right: 1rem; }
button {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
}
button:hover { background: #2070a0; }
.result {
  background: #f8fbff;
  border-left: 4px solid #74b9ff;
  padding: 1rem;
  margin-top: 1rem;
}
.chart {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
.bar div {
  width: 40px;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  background: #74b9ff;
  transition: height 0.5s;
}