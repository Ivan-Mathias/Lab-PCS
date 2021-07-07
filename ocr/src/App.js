import Tesseract from 'tesseract.js';
import { Component, createRef } from 'react';
import * as IJS from 'image-js';

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
      });
    })();

    this.canvasRef = createRef();
  }

  preprocessImage(img) {
    img = img.grey().resize({ height: 500, preserveAspectRatio: true });
    let arr = [...Array(7).keys()].map(() => 1);
    let bg = img.dilate({ kernel: arr.map(() => arr) }).blurFilter({ radius: 2 });
    let withoutBg = bg.subtractImage(img).invert().level({ min: 0, max: 255 });
    withoutBg.subtract(withoutBg.getMin());
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
                  <tr key={'block' + i}>
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
