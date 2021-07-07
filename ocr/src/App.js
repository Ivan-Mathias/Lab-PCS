import Tesseract from 'tesseract.js';
import { Component, createRef } from 'react';
import { ocrKeyLookup } from './ocr.js';
import { IJStoImage, fileToImage, preprocessDocumentImage } from './imageUtils.js';

const alphaLower = 'aáãàâbcçdeêéfghiíîjklmnoôóöpqrstuúüvwxyz';
const alphaUpper = alphaLower.toUpperCase();
const num = '0123456789';
const punct = '.:-/';
const space = ' ';
const VALID_CHARS = alphaLower + alphaUpper + num + punct + space;

/**
 * The main OCS application class.
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      result: null,
      documentData: {},
    };

    // Bind the handlePhoto method (needed to ensure that the event handlers work properly)
    this.handlePhoto = this.handlePhoto.bind(this);

    // Create the tesseract worker and configure the worker.
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

    // A reference to the html canvas
    this.canvasRef = createRef();
  }

  /**
   * Event handler for when a new file is added.
   */
  async handlePhoto(e) {
    // Reset the dom
    this.setState({ progress: 0, result: null, documentData: {} });
    
    let canvas = this.canvasRef.current;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Wait until the worker is ready
    await this.workerReady;

    // Load and pre-process the image file
    let img = await fileToImage(e.target.files[0]);
    let postImg = preprocessDocumentImage(img);

    // Draw pre-processed image
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

    this.setState({
      documentData: {
        Nome: ocrKeyLookup(result.data.blocks, 'Nome', 1)[0],
        CPF: ocrKeyLookup(result.data.blocks, 'CPF', 1)[0],
        Filiacao: ocrKeyLookup(result.data.blocks, 'Filiação', 2).join(' e '),
        'Data de Nascimento': ocrKeyLookup(result.data.blocks, 'Data de Nascimento', 1)[0],
      },
    });
  }

  /**
   * Renders the OCR results.
   */
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
