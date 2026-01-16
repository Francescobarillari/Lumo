import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'CropImagePopup',
    standalone: true,
    imports: [CommonModule, MatIconModule],
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

    scale = 1;
    offsetX = 0;
    offsetY = 0;
    isDragging = false;
    lastX = 0;
    lastY = 0;

    readonly VIEWPORT_SIZE = 300;
    readonly OUTPUT_SIZE = 128;

    ngAfterViewInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;

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
        const scaleX = this.VIEWPORT_SIZE / this.image.width;
        const scaleY = this.VIEWPORT_SIZE / this.image.height;
        this.scale = Math.max(scaleX, scaleY);

        this.offsetX = (this.VIEWPORT_SIZE - this.image.width * this.scale) / 2;
        this.offsetY = (this.VIEWPORT_SIZE - this.image.height * this.scale) / 2;
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.VIEWPORT_SIZE, this.VIEWPORT_SIZE);

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
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = this.OUTPUT_SIZE;
        outputCanvas.height = this.OUTPUT_SIZE;
        const outputCtx = outputCanvas.getContext('2d')!;

        // Mappa la finestra di ritaglio da coordinate schermo a coordinate immagine.
        const sourceX = (0 - this.offsetX) / this.scale;
        const sourceY = (0 - this.offsetY) / this.scale;
        const sourceWidth = this.VIEWPORT_SIZE / this.scale;
        const sourceHeight = this.VIEWPORT_SIZE / this.scale;

        outputCtx.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, this.OUTPUT_SIZE, this.OUTPUT_SIZE
        );

        outputCanvas.toBlob((blob) => {
            if (blob) {
                this.imageCropped.emit(blob);
            }
        }, 'image/jpeg', 0.9);
    }
}
