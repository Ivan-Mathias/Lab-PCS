import Tesseract from 'tesseract.js';
import { Component, createRef } from 'react';
import * as IJS from 'image-js';

const MAX_SENT_DISTANCE = 100;

const alphaLower = 'aáãàâbcçdeêéfghiíîjklmnoôópqrstuúüvwxyz';
const alphaUpper = alphaLower.toUpperCase();
const num = '0123456789';
const punct = '.:-/';
const space = ' ';
const VALID_CHARS = alphaLower + alphaUpper + num + punct + space;

async function fileToImage(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      resolve(IJS.Image.load(readerEvent.target.result));
    };
    reader.readAsDataURL(file);
  });
}

async function IJStoImage(ijsImg) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = ijsImg.toDataURL();
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      result: null,
      documentData: {},
    };
    this.handlePhoto = this.handlePhoto.bind(this);

    this.worker = Tesseract.createWorker({
      logger: (m) => {
        // Track progress through log messages
        if (m.status === 'recognizing text') {
          this.setState({ progress: m.progress });
        }
      },
      // cacheMethod: 'none',
    });

    this.workerReady = (async () => {
      await this.worker.load();
      await this.worker.loadLanguage('por');
      await this.worker.initialize('por');
      await this.worker.setParameters({
        user_defined_dpi: '70',
        tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
        tessedit_char_whitelist: VALID_CHARS,
      });
    })();

    this.canvasRef = createRef();
  }

  preprocessImage(img) {
    img = img.grey().resize({ height: 500, preserveAspectRatio: true });
    let arr = [...Array(7).keys()].map(() => 1);
    let bg = img.dilate({ kernel: arr.map(() => arr) }).blurFilter({ radius: 2 });
    let withoutBg = bg.subtractImage(img).invert().level({ min: 0, max: 255 });
    let min = withoutBg.getMin();
    if (min > 0) withoutBg.subtract(min);
    withoutBg.multiply(255 / withoutBg.getMax());
    return withoutBg;
  }

  async handlePhoto(e) {
    this.setState({ progress: 0 });
    await this.workerReady;

    // Load and draw original image
    let img = await fileToImage(e.target.files[0]);

    // Pre-process image
    let postImg = this.preprocessImage(img);

    // Draw pre-processed image
    let canvas = this.canvasRef.current;
    let ctx = canvas.getContext('2d');
    canvas.width = postImg.width;
    canvas.height = postImg.height;
    ctx.drawImage(await IJStoImage(postImg), 0, 0);

    // Get OCR result
    let result = await this.worker.recognize(await IJStoImage(postImg));
    console.log('worker.recognize(file)', result);
    this.setState({ result: result });

    // Draw boxes
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.textBaseline = 'bottom';
    ctx.font = '16 px sans-serif';
    for (let block of result.data.blocks) {
      let bbox = block.bbox;
      ctx.strokeRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
      ctx.fillText('[' + block.confidence.toFixed(0) + '] ' + block.text, bbox.x0, bbox.y0);
    }

    let documentData = {};
    for (let key of ['Nome', 'CPF', 'Filiacao', 'Data de Nascimento']) {
      documentData[key] = this.lookup(result.data.blocks, key) || '';
    }
    this.setState({ documentData: documentData });
  }

  lookup(blocks, key) {
    for (let b of blocks) {
      if (b.text.toLowerCase().trim() === key.toLowerCase()) {
        let sameLine = [];
        let nextLine = [];
        for (let bb of blocks) {
          if (b.bbox.x1 < bb.bbox.x0 && b.bbox.y0 < bb.bbox.y1 && bb.bbox.y0 < b.bbox.y1) {
            sameLine.push(bb);
          } else if (
            b.bbox.x0 <= bb.bbox.x0 &&
            b.bbox.y1 < bb.bbox.y0 &&
            bb.bbox.y0 < b.bbox.y1 + 2 * (b.bbox.y1 - b.bbox.y0)
          ) {
            nextLine.push(bb);
          }
        }
        let compareFn = (x, y) => (x.bbox.x0 < y.bbox.x0 ? -1 : x.bbox.x0 === y.bbox.x0 ? 1 : 0);
        sameLine.sort(compareFn);
        nextLine.sort(compareFn);

        console.log(
          key,
          sameLine.map((x) => x.text),
          nextLine.map((x) => x.text)
        );

        let lastx = b.bbox.x1;
        let result = [];
        for (let a of sameLine) {
          if (a.bbox.x0 - lastx > MAX_SENT_DISTANCE) break;
          result.push(a);
          lastx = a.bbox.x1;
        }
        if (result.length > 0) return result.map((x) => x.text).join(' ');

        if (nextLine[0].bbox.x0 > b.bbox.x1) {
          continue;
        }

        lastx = b.bbox.x1;
        for (let a of nextLine) {
          if (a.bbox.x0 - lastx > MAX_SENT_DISTANCE) break;
          result.push(a);
          lastx = a.bbox.x1;
        }
        if (result.length > 0) return result.map((x) => x.text).join(' ');
      }
    }
  }

  render() {
    return (
      <div className="App">
        <input type="file" id="file-input" onChange={this.handlePhoto} accept="image/png, image/jpg" />
        <progress min="0" max="1" value={this.state.progress}></progress> <br />
        <canvas ref={this.canvasRef} />
        {this.state.result != null && (
          <div>
            {this.state.result.jobId} <br />
            Confidence: {this.state.result.data.confidence.toFixed(1)}% <br />
            Dados:
            <ul>
              {Object.entries(this.state.documentData).map(([key, value]) => (
                <li key={'doc/' + key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
            <table style={{ border: '1px solid black' }}>
              <tbody>
                <tr>
                  <th>Confidence</th>
                  <th>Text</th>
                  <th>x0</th>
                  <th>y0</th>
                  <th>x1</th>
                  <th>y1</th>
                </tr>
                {this.state.result.data.blocks.map((block, i) => (
                  <tr key={'block/' + i}>
                    <td>{block.confidence.toFixed(1)}%</td>
                    <td>{block.text}</td>
                    <td>{block.bbox.x0}</td>
                    <td>{block.bbox.y0}</td>
                    <td>{block.bbox.x1}</td>
                    <td>{block.bbox.y1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default App;
