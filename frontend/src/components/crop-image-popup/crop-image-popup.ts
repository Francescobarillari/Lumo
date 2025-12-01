import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'CropImagePopup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './crop-image-popup.html',
    styleUrl: './crop-image-popup.css'
})
export class CropImagePopup implements AfterViewInit {
    @Input() imageFile!: File;
    @Output() close = new EventEmitter<void>();
    @Output() imageCropped = new EventEmitter<Blob>();

    @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
    private image = new Image();

    // State for pan and zoom
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    lastX = 0;
    lastY = 0;

    // Viewport size (the crop area)
    readonly VIEWPORT_SIZE = 300;
    readonly OUTPUT_SIZE = 128;

    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;

        // Load image
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.image.src = e.target.result;
            this.image.onload = () => {
                this.resetView();
                this.draw();
            };
        };
        reader.readAsDataURL(this.imageFile);
    }

    resetView() {
        // Fit image to viewport initially
        const scaleX = this.VIEWPORT_SIZE / this.image.width;
        const scaleY = this.VIEWPORT_SIZE / this.image.height;
        this.scale = Math.max(scaleX, scaleY); // Cover strategy

        // Center image
        this.offsetX = (this.VIEWPORT_SIZE - this.image.width * this.scale) / 2;
        this.offsetY = (this.VIEWPORT_SIZE - this.image.height * this.scale) / 2;
    }

    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);

        // Draw background (dark)
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);

        // Draw image with transforms
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.drawImage(this.image, 0, 0);
        this.ctx.restore();
    }

    onMouseDown(e: MouseEvent) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    onMouseMove(e: MouseEvent) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;

        this.offsetX += deltaX;
        this.offsetY += deltaY;

        this.lastX = e.clientX;
        this.lastY = e.clientY;

        this.draw();
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onWheel(e: WheelEvent) {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const newScale = this.scale - e.deltaY * zoomSpeed;

        if (newScale > 0.1) {
            // Zoom towards center logic could be added here, but simple zoom is fine for now
            // Adjust offset to keep center roughly stable or just zoom
            this.scale = newScale;
            this.draw();
        }
    }

    onZoomChange(event: any) {
        this.scale = parseFloat(event.target.value);
        this.draw();
    }

    zoomIn() {
        this.scale = Math.min(this.scale + 0.1, 5);
        this.draw();
    }

    zoomOut() {
        this.scale = Math.max(this.scale - 0.1, 0.1);
        this.draw();
    }

    crop() {
        // Create a temporary canvas for the final output
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = this.OUTPUT_SIZE;
        outputCanvas.height = this.OUTPUT_SIZE;
        const outputCtx = outputCanvas.getContext('2d')!;

        // Draw the visible portion of the image into the output canvas
        // We need to map the viewport coordinates to the image coordinates

        // The viewport shows a 300x300 area. We want to capture exactly what's in there, 
        // but scaled down to 128x128.

        // Easier approach: Draw exactly what we see on the main canvas (300x300) into the output canvas (128x128)
        // But we must redraw it at high quality.

        // Actually, we can just use the draw logic but with a different scale factor.
        // Let's calculate the source rectangle on the image that corresponds to the viewport.

        // Inverse transform:
        // ScreenX = ImageX * scale + offsetX
        // ImageX = (ScreenX - offsetX) / scale

        const sourceX = (0 - this.offsetX) / this.scale;
        const sourceY = (0 - this.offsetY) / this.scale;
        const sourceWidth = this.VIEWPORT_SIZE / this.scale;
        const sourceHeight = this.VIEWPORT_SIZE / this.scale;

        outputCtx.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight, // Source rect
            0, 0, this.OUTPUT_SIZE, this.OUTPUT_SIZE     // Dest rect
        );

        outputCanvas.toBlob((blob) => {
            if (blob) {
                this.imageCropped.emit(blob);
            }
        }, 'image/jpeg', 0.9);
    }
}
