import { Component, createRef } from 'react';
import { toHTMLImage } from '../../vacivida/src/image-processing/imageUtils.js';
import { OCR } from '../../vacivida/src/image-processing/ocr.js';

/**
 * The main OCR application class.
 */
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.resetState();

        this.ocr = new OCR();

        // Bind the handlePhoto method (needed to ensure that the event handlers work properly)
        this.handlePhoto = this.handlePhoto.bind(this);

        // A reference to the html canvas
        this.canvasRef = createRef();
    }

    resetState() {
        this.setState({ progress: 0, result: null, documentData: {} });
    }

    /**
     * Event handler for when a new file is added.
     */
    async handlePhoto(e) {
        // Reset the dom
        this.resetState();

        // Prepare the canvas and setup event handlers
        let canvas = this.canvasRef.current;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ocr.onWorkerProgress = (progress) => this.setState({ progress: progress });

        this.ocr.onPreprocessedImage = (postImg) => {
            // Draw pre-processed image on canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = postImg.width;
            canvas.height = postImg.height;
            ctx.drawImage(postImg, 0, 0);
        };

        this.ocr.onOCRResults = (result) => {
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
            console.log('worker.recognize(file)', result);
            this.setState({ result: result });
        };

        // Run OCR
        let img = await toHTMLImage(e.target.files[0]);
        let documentData = await this.ocr.processFile(img, [
            [1, 1],
            [2, 100],
            [100, 110],
            [110, 20],
        ]);
        this.setState({
            documentData: documentData,
        });

        // Remove event handlers
        this.ocr.onWorkerProgress = null;
        this.ocr.onPreprocessedImage = null;
        this.ocr.onOCRResults = null;
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
