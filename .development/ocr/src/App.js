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

        // Bind the event handlers (needed to ensure that they work properly)
        // this.onPhotoInput = this.onPhotoInput.bind(this);
        // this.onClick = this.onClick.bind(this);

        // A reference to the html canvas
        this.originalRef = createRef();
        this.overlayRef = createRef();
        this.postRef = createRef();
        this.overlayDrag = null;

        this.corners = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
        ];
    }

    resetState() {
        this.setState({ progress: 0, result: null, documentData: {}, originalHeight: 0 });
    }

    drawOverlay() {
        if (this.corners == null) return;

        let overlay = this.overlayRef.current;
        let overlayCtx = overlay.getContext('2d');
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

        // Draw the corners
        overlayCtx.strokeStyle = 'blue';
        overlayCtx.fillStyle = 'blue';
        for (let i = 0; i < 4; i++) {
            overlayCtx.beginPath();
            overlayCtx.ellipse(...this.corners[i], 5, 5, 0, 0, 360);
            overlayCtx.fill();
        }

        // Draw the edges
        overlayCtx.beginPath();
        overlayCtx.moveTo(...this.corners[3]);
        for (let i = 0; i < 4; i++) {
            overlayCtx.lineTo(...this.corners[i]);
        }
        overlayCtx.stroke();
    }

    onMouseOverlayDown(e) {
        let minDist = Infinity;
        for (let i = 0; i < 4; i++) {
            let dx = e.clientX - this.corners[i][0];
            let dy = e.clientY - this.corners[i][1];
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                this.overlayDrag = { x: e.clientX, y: e.clientY, i: i };
            }
        }
    }

    onMouseOverlayMove(e) {
        if (this.overlayDrag == null) return;

        let { x, y, i } = this.overlayDrag;
        this.corners[i][0] += e.clientX - x;
        this.corners[i][1] += e.clientY - y;
        this.overlayDrag.x = e.clientX;
        this.overlayDrag.y = e.clientY;
        this.drawOverlay();
    }

    async onPhotoInput(e) {
        // Get the image
        let img = await toHTMLImage(e.target.files[0]);
        this.img = img;

        // Scale the canvases
        let scale = 500 / img.height;

        let original = this.originalRef.current;
        let originalCtx = original.getContext('2d');
        original.width = Math.round(img.width * scale);
        original.height = Math.round(img.height * scale);
        originalCtx.resetTransform();
        originalCtx.scale(scale, scale);

        let overlay = this.overlayRef.current;
        overlay.width = original.width;
        overlay.height = original.height;

        this.setState({ originalHeight: original.height });

        // Draw the photo
        originalCtx.drawImage(img, 0, 0);

        // Draw the overlay
        this.corners = [
            [0, 0],
            [0, overlay.height - 1],
            [overlay.width - 1, overlay.height - 1],
            [overlay.width - 1, 0],
        ];
        this.drawOverlay();
    }

    async onClick(e) {
        this.setState({ progress: 0, result: null, documentData: {} });

        // Prepare the canvas and setup event handlers
        let canvas = this.postRef.current;
        let ctx = canvas.getContext('2d');
        canvas.width = this.originalRef.current.width;
        canvas.height = this.originalRef.current.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.ocr.onWorkerProgress = (progress) => this.setState({ progress: progress });

        this.ocr.onPreprocessedImage = (postImg) => {
            // Draw pre-processed image on canvas
            ctx.scale(canvas.width / postImg.width, canvas.height / postImg.height);
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
        let scale = this.img.width / this.overlayRef.current.width;
        let documentData = await this.ocr.processFile(
            this.img,
            this.corners.map((xy) => xy.map((w) => w * scale))
        );
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
                <input type="file" id="file-input" onChange={(e) => this.onPhotoInput(e)} accept="image/png, image/jpg" />
                <div style={{ position: 'relative', height: this.state.originalHeight }}>
                    <canvas ref={this.originalRef} style={{ position: 'absolute', zIndex: 1 }} />
                    <canvas
                        ref={this.overlayRef}
                        style={{ position: 'absolute', zIndex: 2 }}
                        onMouseDown={(e) => this.onMouseOverlayDown(e)}
                        onMouseUp={() => (this.overlayDrag = null)}
                        onMouseMove={(e) => this.onMouseOverlayMove(e)}
                    />
                </div>
                <br />
                <button onClick={(e) => this.onClick(e)}>Process</button>
                <progress min="0" max="1" value={this.state.progress}></progress>
                <span>
                    {Number.isNaN(this.state.progress) || this.state.progress == null
                        ? ''
                        : (this.state.progress * 100).toFixed(1) + '%'}
                </span>
                <br />
                <canvas ref={this.postRef} />
                {this.state.result != null && (
                    <div>
                        {this.state.result.jobId} <br />
                        Confidence: {this.state.result.data.confidence.toFixed(1)}% <br />
                        {this.state.documentData != null && (
                            <div>
                                Dados:
                                <ul>
                                    {Object.entries(this.state.documentData).map(([key, value]) => (
                                        <li key={'doc/' + key}>
                                            {key}: {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
