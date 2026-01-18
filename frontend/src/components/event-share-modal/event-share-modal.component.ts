import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Event } from '../../models/event';
import * as QRCode from 'qrcode';

@Component({
    selector: 'app-event-share-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatSnackBarModule],
    templateUrl: './event-share-modal.html',
    styleUrl: './event-share-modal.css'
})
export class EventShareModalComponent implements OnChanges {
    @Input() event: Event | null = null;
    @Output() close = new EventEmitter<void>();

    readonly templateUrl = 'assets/img/LocandinaTemplate.png';

    downloading = false;
    posterPreviewUrl = '';

    private readonly posterWidth = 1080;
    private readonly posterHeight = 1350;
    private readonly infoArea = { x: 50, y: 190, width: 590 };
    private readonly qrSquare = { x: 325, y: 831, size: 430 };
    private previewToken = 0;

    constructor(private snackBar: MatSnackBar) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['event']) {
            this.buildPreview();
        }
    }

    getShareLink(event: Event | null = this.event): string {
        if (!event) return '';
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}/?event=${event.id}`;
    }

    getQrCodeUrl(size = 220, event: Event | null = this.event): string {
        const link = this.getShareLink(event);
        if (!link) return '';
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=${encodeURIComponent(link)}`;
    }

    private async buildPreview() {
        const token = ++this.previewToken;
        if (!this.event) {
            this.posterPreviewUrl = '';
            return;
        }
        try {
            const canvas = await this.renderPoster(this.event);
            if (token !== this.previewToken) return;
            this.posterPreviewUrl = canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Failed to generate poster preview', error);
            if (token === this.previewToken) {
                this.posterPreviewUrl = '';
            }
        }
    }

    async downloadPoster() {
        const event = this.event;
        if (!event || this.downloading) return;
        this.downloading = true;

        try {
            const canvas = await this.renderPoster(event);
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Unable to generate poster');

            const fileName = `lumo-event-${event.id}.png`;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        } catch (error) {
            console.error('Failed to download poster', error);
            this.showToast('Unable to generate the poster. You can share the link instead.', 'error');
        } finally {
            this.downloading = false;
        }
    }

    async shareLink() {
        const link = this.getShareLink();
        if (!link || !this.event) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.event.title,
                    text: 'Check out this event on Lumo',
                    url: link
                });
                return;
            } catch (error) {
                console.warn('Share cancelled or failed', error);
            }
        }

        this.copyShareLink();
    }

    copyShareLink() {
        const link = this.getShareLink();
        if (!link) return;

        navigator.clipboard.writeText(link).then(() => {
            this.showToast('Link copied to clipboard!');
        }).catch((err) => {
            console.error('Failed to copy link: ', err);
            this.showToast('Unable to copy the link.', 'error');
        });
    }

    private showToast(message: string, tone: 'default' | 'error' = 'default') {
        this.snackBar.open(message, undefined, {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: tone === 'error' ? ['toast-snackbar', 'toast-snackbar--error'] : ['toast-snackbar']
        });
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;
        return [datePart, timePart].filter(Boolean).join(' | ');
    }

    formatCost(event: Event): string {
        if (event.costPerPerson == null || event.costPerPerson === 0) return 'Free';
        return `€${event.costPerPerson} per person`;
    }

    private formatLocation(event: Event): string {
        return event.city || 'Location TBD';
    }

    private async ensureFontsLoaded() {
        if ('fonts' in document) {
            try {
                await (document as Document & { fonts: FontFaceSet }).fonts.ready;
            } catch (error) {
                console.warn('Fonts not ready', error);
            }
        }
    }

    private loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = src;
        });
    }

    private async renderPoster(event: Event): Promise<HTMLCanvasElement> {
        await this.ensureFontsLoaded();

        const canvas = document.createElement('canvas');
        canvas.width = this.posterWidth;
        canvas.height = this.posterHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Unable to render poster');

        const templateImg = await this.loadImage(this.templateUrl);
        ctx.drawImage(templateImg, 0, 0, this.posterWidth, this.posterHeight);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        const eventTitle = event.title || 'Lumo Event';
        const infoX = this.infoArea.x;
        const infoWidth = this.infoArea.width;
        let y = this.infoArea.y;

        ctx.fillStyle = '#FCC324';
        ctx.font = '700 56px "Stack Sans Headline", Arial, sans-serif';
        y = this.drawWrappedText(ctx, eventTitle, infoX, y, infoWidth, 64, 2);
        y += 12;

        const dateTime = this.formatDateTime(event);
        if (dateTime) {
            ctx.fillStyle = '#FCC324';
            ctx.font = '600 32px "Stack Sans Headline", Arial, sans-serif';
            ctx.fillText(dateTime, infoX, y);
            y += 40;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 30px "Stack Sans Headline", Arial, sans-serif';
        ctx.fillText(this.formatLocation(event), infoX, y);
        y += 38;
        ctx.fillText(this.formatCost(event), infoX, y);
        y += 38;

        if (event.organizerName) {
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '500 26px "Stack Sans Headline", Arial, sans-serif';
            ctx.fillText(`Eventer: ${event.organizerName}`, infoX, y);
            y += 32;
        }

        if (event.description) {
            ctx.fillStyle = '#B0B0B0';
            ctx.font = '400 24px "Stack Sans Headline", Arial, sans-serif';
            y = this.drawWrappedText(ctx, event.description, infoX, y + 6, infoWidth, 30, 3);
        }

        const qrOverflow = 20;
        const qrBorder = 12;
        const qrRadius = 24;
        const qrBgSize = this.qrSquare.size + qrOverflow * 2;
        const qrBgX = this.qrSquare.x - qrOverflow;
        const qrBgY = this.qrSquare.y - qrOverflow;
        const qrSize = qrBgSize - qrBorder * 2;
        const qrX = qrBgX + qrBorder;
        const qrY = qrBgY + qrBorder;

        const link = this.getShareLink(event);
        let qrDataUrl = '';
        try {
            qrDataUrl = await QRCode.toDataURL(link, {
                width: qrSize,
                margin: 0,
                color: { dark: '#000000', light: '#ffffff' }
            });
        } catch (e) {
            console.error('Local QR generation failed', e);
        }

        if (qrDataUrl) {
            const qrImg = await this.loadImage(qrDataUrl);
            ctx.save();
            this.drawRoundedRect(ctx, qrBgX, qrBgY, qrBgSize, qrBgSize, qrRadius);
            ctx.clip();
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
            ctx.restore();
        }

        return canvas;
    }

    private drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        const clamped = Math.max(0, Math.min(radius, width / 2, height / 2));
        ctx.beginPath();
        ctx.moveTo(x + clamped, y);
        ctx.arcTo(x + width, y, x + width, y + height, clamped);
        ctx.arcTo(x + width, y + height, x, y + height, clamped);
        ctx.arcTo(x, y + height, x, y, clamped);
        ctx.arcTo(x, y, x + width, y, clamped);
        ctx.closePath();
    }

    private drawWrappedText(
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number,
        maxLines: number
    ): number {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        for (const word of words) {
            const testLine = line ? `${line} ${word}` : word;
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth && line) {
                ctx.fillText(this.truncateToWidth(ctx, line, maxWidth, lineCount === maxLines - 1), x, y);
                line = word;
                y += lineHeight;
                lineCount += 1;
                if (lineCount >= maxLines) {
                    return y;
                }
            } else {
                line = testLine;
            }
        }

        if (line && lineCount < maxLines) {
            const shouldEllipsize = lineCount === maxLines - 1;
            ctx.fillText(this.truncateToWidth(ctx, line, maxWidth, shouldEllipsize), x, y);
            y += lineHeight;
        }

        return y;
    }

    private truncateToWidth(
        ctx: CanvasRenderingContext2D,
        text: string,
        maxWidth: number,
        ellipsize: boolean
    ): string {
        if (!ellipsize || ctx.measureText(text).width <= maxWidth) return text;

        let truncated = text;
        while (truncated.length > 0) {
            const test = `${truncated}...`;
            if (ctx.measureText(test).width <= maxWidth) return test;
            truncated = truncated.slice(0, -1);
        }

        return text;
    }
}
