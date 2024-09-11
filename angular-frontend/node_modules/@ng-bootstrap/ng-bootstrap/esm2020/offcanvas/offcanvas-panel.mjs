import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbOffcanvasPanel {
    constructor(_document, _elRef, _zone) {
        this._document = _document;
        this._elRef = _elRef;
        this._zone = _zone;
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to offcanvas opening
        this.keyboard = true;
        this.position = 'start';
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    dismiss(reason) {
        this.dismissEvent.emit(reason);
    }
    ngOnInit() {
        this._elWithFocus = this._document.activeElement;
        this._zone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
            this._show();
        });
    }
    ngOnDestroy() {
        this._disableEventHandling();
    }
    hide() {
        const { nativeElement } = this._elRef;
        const context = { animation: this.animation, runningTransition: 'stop' };
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element) => {
            nativeElement.classList.remove('showing');
            nativeElement.classList.add('hiding');
            return () => nativeElement.classList.remove('show', 'hiding');
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return offcanvasTransition$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show', 'showing');
            return () => element.classList.remove('showing');
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.shown.next();
            this.shown.complete();
        });
        this._enableEventHandling();
        this._setFocus();
    }
    _enableEventHandling() {
        const { nativeElement } = this._elRef;
        this._zone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'keydown')
                .pipe(takeUntil(this._closed$), 
            /* eslint-disable-next-line deprecation/deprecation */
            filter((e) => e.which === Key.Escape))
                .subscribe((event) => {
                if (this.keyboard) {
                    requestAnimationFrame(() => {
                        if (!event.defaultPrevented) {
                            this._zone.run(() => this.dismiss(OffcanvasDismissReasons.ESC));
                        }
                    });
                }
            });
        });
    }
    _disableEventHandling() {
        this._closed$.next();
    }
    _setFocus() {
        const { nativeElement } = this._elRef;
        if (!nativeElement.contains(document.activeElement)) {
            const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`);
            const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];
            const elementToFocus = autoFocusable || firstFocusable || nativeElement;
            elementToFocus.focus();
        }
    }
    _restoreFocus() {
        const body = this._document.body;
        const elWithFocus = this._elWithFocus;
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        this._zone.runOutsideAngular(() => {
            setTimeout(() => elementToFocus.focus());
            this._elWithFocus = null;
        });
    }
}
NgbOffcanvasPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasPanel, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbOffcanvasPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbOffcanvasPanel, isStandalone: true, selector: "ngb-offcanvas-panel", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", keyboard: "keyboard", panelClass: "panelClass", position: "position" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"offcanvas offcanvas-\" + position  + (panelClass ? \" \" + panelClass : \"\")", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasPanel, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-offcanvas-panel', standalone: true, template: '<ng-content></ng-content>', encapsulation: ViewEncapsulation.None, host: {
                        '[class]': '"offcanvas offcanvas-" + position  + (panelClass ? " " + panelClass : "")',
                        role: 'dialog',
                        tabindex: '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                    } }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], position: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTixTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUNOLGlCQUFpQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0RCxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBd0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQWlCdEMsTUFBTSxPQUFPLGlCQUFpQjtJQWdCN0IsWUFDMkIsU0FBYyxFQUNoQyxNQUErQixFQUMvQixLQUFhO1FBRkssY0FBUyxHQUFULFNBQVMsQ0FBSztRQUNoQyxXQUFNLEdBQU4sTUFBTSxDQUF5QjtRQUMvQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBbEJkLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQW1CLElBQUksQ0FBQyxDQUFDLHFEQUFxRDtRQUt6RixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBRWhCLGFBQVEsR0FBdUMsT0FBTyxDQUFDO1FBRTdDLGlCQUFZLEdBQUcsSUFB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MkJBQUMsUUFBUTswRkFiUixTQUFTO3NCQUFqQixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFFYSxZQUFZO3NCQUE5QixNQUFNO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuXHRDb21wb25lbnQsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0SW5qZWN0LFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCB0YWtlLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMgfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHsgS2V5IH0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHsgT2ZmY2FudmFzRGlzbWlzc1JlYXNvbnMgfSBmcm9tICcuL29mZmNhbnZhcy1kaXNtaXNzLXJlYXNvbnMnO1xuaW1wb3J0IHsgbmdiUnVuVHJhbnNpdGlvbiwgTmdiVHJhbnNpdGlvbk9wdGlvbnMgfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQgeyByZWZsb3cgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2Itb2ZmY2FudmFzLXBhbmVsJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0dGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+Jyxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0c3R5bGVVcmxzOiBbXSxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3NdJzogJ1wib2ZmY2FudmFzIG9mZmNhbnZhcy1cIiArIHBvc2l0aW9uICArIChwYW5lbENsYXNzID8gXCIgXCIgKyBwYW5lbENsYXNzIDogXCJcIiknLFxuXHRcdHJvbGU6ICdkaWFsb2cnLFxuXHRcdHRhYmluZGV4OiAnLTEnLFxuXHRcdCdbYXR0ci5hcmlhLW1vZGFsXSc6ICd0cnVlJyxcblx0XHQnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG5cdFx0J1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ2FyaWFEZXNjcmliZWRCeScsXG5cdH0sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk9mZmNhbnZhc1BhbmVsIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXHRwcml2YXRlIF9jbG9zZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfZWxXaXRoRm9jdXM6IEVsZW1lbnQgfCBudWxsID0gbnVsbDsgLy8gZWxlbWVudCB0aGF0IGlzIGZvY3VzZWQgcHJpb3IgdG8gb2ZmY2FudmFzIG9wZW5pbmdcblxuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nO1xuXHRASW5wdXQoKSBhcmlhRGVzY3JpYmVkQnk/OiBzdHJpbmc7XG5cdEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcblx0QElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nO1xuXHRASW5wdXQoKSBwb3NpdGlvbjogJ3N0YXJ0JyB8ICdlbmQnIHwgJ3RvcCcgfCAnYm90dG9tJyA9ICdzdGFydCc7XG5cblx0QE91dHB1dCgnZGlzbWlzcycpIGRpc21pc3NFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRzaG93biA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cdGhpZGRlbiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0QEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcblx0XHRwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG5cdFx0cHJpdmF0ZSBfem9uZTogTmdab25lLFxuXHQpIHt9XG5cblx0ZGlzbWlzcyhyZWFzb24pOiB2b2lkIHtcblx0XHR0aGlzLmRpc21pc3NFdmVudC5lbWl0KHJlYXNvbik7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdFx0dGhpcy5fem9uZS5vblN0YWJsZVxuXHRcdFx0LmFzT2JzZXJ2YWJsZSgpXG5cdFx0XHQucGlwZSh0YWtlKDEpKVxuXHRcdFx0LnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXMuX3Nob3coKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0dGhpcy5fZGlzYWJsZUV2ZW50SGFuZGxpbmcoKTtcblx0fVxuXG5cdGhpZGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX2VsUmVmO1xuXHRcdGNvbnN0IGNvbnRleHQ6IE5nYlRyYW5zaXRpb25PcHRpb25zPGFueT4gPSB7IGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcgfTtcblxuXHRcdGNvbnN0IG9mZmNhbnZhc1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdHRoaXMuX3pvbmUsXG5cdFx0XHR0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0KGVsZW1lbnQpID0+IHtcblx0XHRcdFx0bmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XG5cdFx0XHRcdG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkaW5nJyk7XG5cdFx0XHRcdHJldHVybiAoKSA9PiBuYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnLCAnaGlkaW5nJyk7XG5cdFx0XHR9LFxuXHRcdFx0Y29udGV4dCxcblx0XHQpO1xuXG5cdFx0b2ZmY2FudmFzVHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZGVuLm5leHQoKTtcblx0XHRcdHRoaXMuaGlkZGVuLmNvbXBsZXRlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kaXNhYmxlRXZlbnRIYW5kbGluZygpO1xuXHRcdHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuXG5cdFx0cmV0dXJuIG9mZmNhbnZhc1RyYW5zaXRpb24kO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2hvdygpIHtcblx0XHRjb25zdCBjb250ZXh0OiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxhbnk+ID0geyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyB9O1xuXG5cdFx0Y29uc3Qgb2ZmY2FudmFzVHJhbnNpdGlvbiQgPSBuZ2JSdW5UcmFuc2l0aW9uKFxuXHRcdFx0dGhpcy5fem9uZSxcblx0XHRcdHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsXG5cdFx0XHQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGFuaW1hdGlvbjogYm9vbGVhbikgPT4ge1xuXHRcdFx0XHRpZiAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0cmVmbG93KGVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycsICdzaG93aW5nJyk7XG5cdFx0XHRcdHJldHVybiAoKSA9PiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3dpbmcnKTtcblx0XHRcdH0sXG5cdFx0XHRjb250ZXh0LFxuXHRcdCk7XG5cblx0XHRvZmZjYW52YXNUcmFuc2l0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5zaG93bi5uZXh0KCk7XG5cdFx0XHR0aGlzLnNob3duLmNvbXBsZXRlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9lbmFibGVFdmVudEhhbmRsaW5nKCk7XG5cdFx0dGhpcy5fc2V0Rm9jdXMoKTtcblx0fVxuXG5cdHByaXZhdGUgX2VuYWJsZUV2ZW50SGFuZGxpbmcoKSB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHR0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblx0XHRcdGZyb21FdmVudDxLZXlib2FyZEV2ZW50PihuYXRpdmVFbGVtZW50LCAna2V5ZG93bicpXG5cdFx0XHRcdC5waXBlKFxuXHRcdFx0XHRcdHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSxcblx0XHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24gKi9cblx0XHRcdFx0XHRmaWx0ZXIoKGUpID0+IGUud2hpY2ggPT09IEtleS5Fc2NhcGUpLFxuXHRcdFx0XHQpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG5cdFx0XHRcdFx0aWYgKHRoaXMua2V5Ym9hcmQpIHtcblx0XHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICghZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuZGlzbWlzcyhPZmZjYW52YXNEaXNtaXNzUmVhc29ucy5FU0MpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2Rpc2FibGVFdmVudEhhbmRsaW5nKCkge1xuXHRcdHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2V0Rm9jdXMoKSB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHRpZiAoIW5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcblx0XHRcdGNvbnN0IGF1dG9Gb2N1c2FibGUgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuZ2JBdXRvZm9jdXNdYCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBmaXJzdEZvY3VzYWJsZSA9IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMobmF0aXZlRWxlbWVudClbMF07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRUb0ZvY3VzID0gYXV0b0ZvY3VzYWJsZSB8fCBmaXJzdEZvY3VzYWJsZSB8fCBuYXRpdmVFbGVtZW50O1xuXHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG5cdFx0Y29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG5cdFx0Y29uc3QgZWxXaXRoRm9jdXMgPSB0aGlzLl9lbFdpdGhGb2N1cztcblxuXHRcdGxldCBlbGVtZW50VG9Gb2N1cztcblx0XHRpZiAoZWxXaXRoRm9jdXMgJiYgZWxXaXRoRm9jdXNbJ2ZvY3VzJ10gJiYgYm9keS5jb250YWlucyhlbFdpdGhGb2N1cykpIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gZWxXaXRoRm9jdXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gYm9keTtcblx0XHR9XG5cdFx0dGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IGVsZW1lbnRUb0ZvY3VzLmZvY3VzKCkpO1xuXHRcdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=