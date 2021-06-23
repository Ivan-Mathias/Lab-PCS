import Tesseract from 'tesseract.js';

async function handlePhoto(e) {
  const worker = Tesseract.createWorker({
    logger: m => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage('por');
  await worker.initialize('por');

  let file = e.target.files[0];
  console.log('worker.detect(file)', await worker.detect(file));
  console.log('worker.recognize(file)', await worker.recognize(file));

  await worker.terminate();
}

function App() {
  return (
    <div className="App">
      <input type="file" id="file-input" onChange={handlePhoto} accept="image/png, image/jpg" />
    </div>
  );
}

export default App;
