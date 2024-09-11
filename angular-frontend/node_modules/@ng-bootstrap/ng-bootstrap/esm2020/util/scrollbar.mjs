import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * Utility to handle the scrollbar.
 *
 * It allows to hide the scrollbar and compensate the lack of a vertical scrollbar
 * by adding an equivalent padding on the right of the body, and to revert this change.
 */
export class ScrollBar {
    constructor(_document) {
        this._document = _document;
    }
    /**
     * To be called to hide a potential vertical scrollbar:
     * - if a scrollbar is there and has a width greater than 0, adds some compensation
     * padding to the body to keep the same layout as when the scrollbar is there
     * - adds overflow: hidden
     *
     * @return a callback used to revert the change
     */
    hide() {
        const scrollbarWidth = Math.abs(window.innerWidth - this._document.documentElement.clientWidth);
        const body = this._document.body;
        const bodyStyle = body.style;
        const { overflow, paddingRight } = bodyStyle;
        if (scrollbarWidth > 0) {
            const actualPadding = parseFloat(window.getComputedStyle(body).paddingRight);
            bodyStyle.paddingRight = `${actualPadding + scrollbarWidth}px`;
        }
        bodyStyle.overflow = 'hidden';
        return () => {
            if (scrollbarWidth > 0) {
                bodyStyle.paddingRight = paddingRight;
            }
            bodyStyle.overflow = overflow;
        };
    }
}
ScrollBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ScrollBar, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ScrollBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ScrollBar, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: ScrollBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWwvc2Nyb2xsYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLM0M7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUNyQixZQUFzQyxTQUFjO1FBQWQsY0FBUyxHQUFULFNBQVMsQ0FBSztJQUFHLENBQUM7SUFFeEQ7Ozs7Ozs7T0FPRztJQUNILElBQUk7UUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEcsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM3QixNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUM3QyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM3RSxTQUFTLENBQUMsWUFBWSxHQUFHLEdBQUcsYUFBYSxHQUFHLGNBQWMsSUFBSSxDQUFDO1NBQy9EO1FBQ0QsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDOUIsT0FBTyxHQUFHLEVBQUU7WUFDWCxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLFNBQVMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO2FBQ3RDO1lBQ0QsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDL0IsQ0FBQyxDQUFDO0lBQ0gsQ0FBQzs7c0dBM0JXLFNBQVMsa0JBQ0QsUUFBUTswR0FEaEIsU0FBUyxjQURJLE1BQU07MkZBQ25CLFNBQVM7a0JBRHJCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFFcEIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKiBUeXBlIGZvciB0aGUgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIHNjcm9sbGJhci4gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbGJhclJldmVydGVyID0gKCkgPT4gdm9pZDtcblxuLyoqXG4gKiBVdGlsaXR5IHRvIGhhbmRsZSB0aGUgc2Nyb2xsYmFyLlxuICpcbiAqIEl0IGFsbG93cyB0byBoaWRlIHRoZSBzY3JvbGxiYXIgYW5kIGNvbXBlbnNhdGUgdGhlIGxhY2sgb2YgYSB2ZXJ0aWNhbCBzY3JvbGxiYXJcbiAqIGJ5IGFkZGluZyBhbiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LCBhbmQgdG8gcmV2ZXJ0IHRoaXMgY2hhbmdlLlxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEJhciB7XG5cdGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHt9XG5cblx0LyoqXG5cdCAqIFRvIGJlIGNhbGxlZCB0byBoaWRlIGEgcG90ZW50aWFsIHZlcnRpY2FsIHNjcm9sbGJhcjpcblx0ICogLSBpZiBhIHNjcm9sbGJhciBpcyB0aGVyZSBhbmQgaGFzIGEgd2lkdGggZ3JlYXRlciB0aGFuIDAsIGFkZHMgc29tZSBjb21wZW5zYXRpb25cblx0ICogcGFkZGluZyB0byB0aGUgYm9keSB0byBrZWVwIHRoZSBzYW1lIGxheW91dCBhcyB3aGVuIHRoZSBzY3JvbGxiYXIgaXMgdGhlcmVcblx0ICogLSBhZGRzIG92ZXJmbG93OiBoaWRkZW5cblx0ICpcblx0ICogQHJldHVybiBhIGNhbGxiYWNrIHVzZWQgdG8gcmV2ZXJ0IHRoZSBjaGFuZ2Vcblx0ICovXG5cdGhpZGUoKTogU2Nyb2xsYmFyUmV2ZXJ0ZXIge1xuXHRcdGNvbnN0IHNjcm9sbGJhcldpZHRoID0gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSB0aGlzLl9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xuXHRcdGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuXHRcdGNvbnN0IGJvZHlTdHlsZSA9IGJvZHkuc3R5bGU7XG5cdFx0Y29uc3QgeyBvdmVyZmxvdywgcGFkZGluZ1JpZ2h0IH0gPSBib2R5U3R5bGU7XG5cdFx0aWYgKHNjcm9sbGJhcldpZHRoID4gMCkge1xuXHRcdFx0Y29uc3QgYWN0dWFsUGFkZGluZyA9IHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoYm9keSkucGFkZGluZ1JpZ2h0KTtcblx0XHRcdGJvZHlTdHlsZS5wYWRkaW5nUmlnaHQgPSBgJHthY3R1YWxQYWRkaW5nICsgc2Nyb2xsYmFyV2lkdGh9cHhgO1xuXHRcdH1cblx0XHRib2R5U3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0aWYgKHNjcm9sbGJhcldpZHRoID4gMCkge1xuXHRcdFx0XHRib2R5U3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0O1xuXHRcdFx0fVxuXHRcdFx0Ym9keVN0eWxlLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG5cdFx0fTtcblx0fVxufVxuIl19