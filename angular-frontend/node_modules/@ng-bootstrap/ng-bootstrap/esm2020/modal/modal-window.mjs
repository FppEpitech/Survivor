import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { fromEvent, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { isString, reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbModalWindow {
    constructor(_document, _elRef, _zone) {
        this._document = _document;
        this._elRef = _elRef;
        this._zone = _zone;
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to modal opening
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    get fullscreenClass() {
        return this.fullscreen === true
            ? ' modal-fullscreen'
            : isString(this.fullscreen)
                ? ` modal-fullscreen-${this.fullscreen}-down`
                : '';
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
        const windowTransition$ = ngbRunTransition(this._zone, nativeElement, () => nativeElement.classList.remove('show'), context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        const transitions$ = zip(windowTransition$, dialogTransition$);
        transitions$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return transitions$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        const windowTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show');
        }, context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        zip(windowTransition$, dialogTransition$).subscribe(() => {
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
                            this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                        }
                    });
                }
                else if (this.backdrop === 'static') {
                    this._bumpBackdrop();
                }
            });
            // We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
            // inside the modal dialog and releasing it outside
            let preventClose = false;
            fromEvent(this._dialogEl.nativeElement, 'mousedown')
                .pipe(takeUntil(this._closed$), tap(() => (preventClose = false)), switchMap(() => fromEvent(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))), filter(({ target }) => nativeElement === target))
                .subscribe(() => {
                preventClose = true;
            });
            // We're listening to 'click' to dismiss modal on modal window click, except when:
            // 1. clicking on modal dialog itself
            // 2. closing was prevented by mousedown/up handlers
            // 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
            fromEvent(nativeElement, 'click')
                .pipe(takeUntil(this._closed$))
                .subscribe(({ target }) => {
                if (nativeElement === target) {
                    if (this.backdrop === 'static') {
                        this._bumpBackdrop();
                    }
                    else if (this.backdrop === true && !preventClose) {
                        this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
                    }
                }
                preventClose = false;
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
    _bumpBackdrop() {
        if (this.backdrop === 'static') {
            ngbRunTransition(this._zone, this._elRef.nativeElement, ({ classList }) => {
                classList.add('modal-static');
                return () => classList.remove('modal-static');
            }, { animation: this.animation, runningTransition: 'continue' });
        }
    }
}
NgbModalWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModalWindow, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbModalWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbModalWindow, isStandalone: true, selector: "ngb-modal-window", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", backdrop: "backdrop", centered: "centered", fullscreen: "fullscreen", keyboard: "keyboard", scrollable: "scrollable", size: "size", windowClass: "windowClass", modalDialogClass: "modalDialogClass" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"modal d-block\" + (windowClass ? \" \" + windowClass : \"\")", "class.fade": "animation", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, viewQueries: [{ propertyName: "_dialogEl", first: true, predicate: ["dialog"], descendants: true, static: true }], ngImport: i0, template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content></ng-content></div>
		</div>
	`, isInline: true, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModalWindow, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-modal-window', standalone: true, host: {
                        '[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
                        '[class.fade]': 'animation',
                        role: 'dialog',
                        tabindex: '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                    }, template: `
		<div
			#dialog
			[class]="
				'modal-dialog' +
				(size ? ' modal-' + size : '') +
				(centered ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass ? ' ' + modalDialogClass : '')
			"
			role="document"
		>
			<div class="modal-content"><ng-content></ng-content></div>
		</div>
	`, encapsulation: ViewEncapsulation.None, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { _dialogEl: [{
                type: ViewChild,
                args: ['dialog', { static: true }]
            }], animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], centered: [{
                type: Input
            }], fullscreen: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], size: [{
                type: Input
            }], windowClass: [{
                type: Input
            }], modalDialogClass: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtd2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNOLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFjLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBd0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFpQ2hELE1BQU0sT0FBTyxjQUFjO0lBdUIxQixZQUMyQixTQUFjLEVBQ2hDLE1BQStCLEVBQy9CLEtBQWE7UUFGSyxjQUFTLEdBQVQsU0FBUyxDQUFLO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQXlCO1FBQy9CLFVBQUssR0FBTCxLQUFLLENBQVE7UUF6QmQsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDL0IsaUJBQVksR0FBbUIsSUFBSSxDQUFDLENBQUMsaURBQWlEO1FBT3JGLGFBQVEsR0FBcUIsSUFBSSxDQUFDO1FBR2xDLGFB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OzswQkEyQm5DLE1BQU07MkJBQUMsUUFBUTswRkFwQjhCLFNBQVM7c0JBQXZELFNBQVM7dUJBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtnQkFFNUIsU0FBUztzQkFBakIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFFYSxZQUFZO3NCQUE5QixNQUFNO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuXHRDb21wb25lbnQsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0SW5qZWN0LFxuXHRJbnB1dCxcblx0Tmdab25lLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRWaWV3Q2hpbGQsXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCB6aXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQgeyBLZXkgfSBmcm9tICcuLi91dGlsL2tleSc7XG5pbXBvcnQgeyBNb2RhbERpc21pc3NSZWFzb25zIH0gZnJvbSAnLi9tb2RhbC1kaXNtaXNzLXJlYXNvbnMnO1xuaW1wb3J0IHsgbmdiUnVuVHJhbnNpdGlvbiwgTmdiVHJhbnNpdGlvbk9wdGlvbnMgfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQgeyBpc1N0cmluZywgcmVmbG93IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLW1vZGFsLXdpbmRvdycsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHtcblx0XHQnW2NsYXNzXSc6ICdcIm1vZGFsIGQtYmxvY2tcIiArICh3aW5kb3dDbGFzcyA/IFwiIFwiICsgd2luZG93Q2xhc3MgOiBcIlwiKScsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuXHRcdHJvbGU6ICdkaWFsb2cnLFxuXHRcdHRhYmluZGV4OiAnLTEnLFxuXHRcdCdbYXR0ci5hcmlhLW1vZGFsXSc6ICd0cnVlJyxcblx0XHQnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG5cdFx0J1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ2FyaWFEZXNjcmliZWRCeScsXG5cdH0sXG5cdHRlbXBsYXRlOiBgXG5cdFx0PGRpdlxuXHRcdFx0I2RpYWxvZ1xuXHRcdFx0W2NsYXNzXT1cIlxuXHRcdFx0XHQnbW9kYWwtZGlhbG9nJyArXG5cdFx0XHRcdChzaXplID8gJyBtb2RhbC0nICsgc2l6ZSA6ICcnKSArXG5cdFx0XHRcdChjZW50ZXJlZCA/ICcgbW9kYWwtZGlhbG9nLWNlbnRlcmVkJyA6ICcnKSArXG5cdFx0XHRcdGZ1bGxzY3JlZW5DbGFzcyArXG5cdFx0XHRcdChzY3JvbGxhYmxlID8gJyBtb2RhbC1kaWFsb2ctc2Nyb2xsYWJsZScgOiAnJykgK1xuXHRcdFx0XHQobW9kYWxEaWFsb2dDbGFzcyA/ICcgJyArIG1vZGFsRGlhbG9nQ2xhc3MgOiAnJylcblx0XHRcdFwiXG5cdFx0XHRyb2xlPVwiZG9jdW1lbnRcIlxuXHRcdD5cblx0XHRcdDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PlxuXHRcdDwvZGl2PlxuXHRgLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRzdHlsZVVybHM6IFsnLi9tb2RhbC5zY3NzJ10sXG59KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsV2luZG93IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXHRwcml2YXRlIF9jbG9zZWQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0cHJpdmF0ZSBfZWxXaXRoRm9jdXM6IEVsZW1lbnQgfCBudWxsID0gbnVsbDsgLy8gZWxlbWVudCB0aGF0IGlzIGZvY3VzZWQgcHJpb3IgdG8gbW9kYWwgb3BlbmluZ1xuXG5cdEBWaWV3Q2hpbGQoJ2RpYWxvZycsIHsgc3RhdGljOiB0cnVlIH0pIHByaXZhdGUgX2RpYWxvZ0VsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cdEBJbnB1dCgpIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xuXHRASW5wdXQoKSBiYWNrZHJvcDogYm9vbGVhbiB8IHN0cmluZyA9IHRydWU7XG5cdEBJbnB1dCgpIGNlbnRlcmVkOiBzdHJpbmc7XG5cdEBJbnB1dCgpIGZ1bGxzY3JlZW46IHN0cmluZyB8IGJvb2xlYW47XG5cdEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcblx0QElucHV0KCkgc2Nyb2xsYWJsZTogc3RyaW5nO1xuXHRASW5wdXQoKSBzaXplOiBzdHJpbmc7XG5cdEBJbnB1dCgpIHdpbmRvd0NsYXNzOiBzdHJpbmc7XG5cdEBJbnB1dCgpIG1vZGFsRGlhbG9nQ2xhc3M6IHN0cmluZztcblxuXHRAT3V0cHV0KCdkaXNtaXNzJykgZGlzbWlzc0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG5cdHNob3duID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblx0aGlkZGVuID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuXHRcdHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pixcblx0XHRwcml2YXRlIF96b25lOiBOZ1pvbmUsXG5cdCkge31cblxuXHRnZXQgZnVsbHNjcmVlbkNsYXNzKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuZnVsbHNjcmVlbiA9PT0gdHJ1ZVxuXHRcdFx0PyAnIG1vZGFsLWZ1bGxzY3JlZW4nXG5cdFx0XHQ6IGlzU3RyaW5nKHRoaXMuZnVsbHNjcmVlbilcblx0XHRcdD8gYCBtb2RhbC1mdWxsc2NyZWVuLSR7dGhpcy5mdWxsc2NyZWVufS1kb3duYFxuXHRcdFx0OiAnJztcblx0fVxuXG5cdGRpc21pc3MocmVhc29uKTogdm9pZCB7XG5cdFx0dGhpcy5kaXNtaXNzRXZlbnQuZW1pdChyZWFzb24pO1xuXHR9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdHRoaXMuX3pvbmUub25TdGFibGVcblx0XHRcdC5hc09ic2VydmFibGUoKVxuXHRcdFx0LnBpcGUodGFrZSgxKSlcblx0XHRcdC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9zaG93KCk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuX2Rpc2FibGVFdmVudEhhbmRsaW5nKCk7XG5cdH1cblxuXHRoaWRlKCk6IE9ic2VydmFibGU8YW55PiB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHRjb25zdCBjb250ZXh0OiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxhbnk+ID0geyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnIH07XG5cblx0XHRjb25zdCB3aW5kb3dUcmFuc2l0aW9uJCA9IG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHR0aGlzLl96b25lLFxuXHRcdFx0bmF0aXZlRWxlbWVudCxcblx0XHRcdCgpID0+IG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuXHRcdFx0Y29udGV4dCxcblx0XHQpO1xuXHRcdGNvbnN0IGRpYWxvZ1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbih0aGlzLl96b25lLCB0aGlzLl9kaWFsb2dFbC5uYXRpdmVFbGVtZW50LCAoKSA9PiB7fSwgY29udGV4dCk7XG5cblx0XHRjb25zdCB0cmFuc2l0aW9ucyQgPSB6aXAod2luZG93VHJhbnNpdGlvbiQsIGRpYWxvZ1RyYW5zaXRpb24kKTtcblx0XHR0cmFuc2l0aW9ucyQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuaGlkZGVuLm5leHQoKTtcblx0XHRcdHRoaXMuaGlkZGVuLmNvbXBsZXRlKCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLl9kaXNhYmxlRXZlbnRIYW5kbGluZygpO1xuXHRcdHRoaXMuX3Jlc3RvcmVGb2N1cygpO1xuXG5cdFx0cmV0dXJuIHRyYW5zaXRpb25zJDtcblx0fVxuXG5cdHByaXZhdGUgX3Nob3coKSB7XG5cdFx0Y29uc3QgY29udGV4dDogTmdiVHJhbnNpdGlvbk9wdGlvbnM8YW55PiA9IHsgYW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScgfTtcblxuXHRcdGNvbnN0IHdpbmRvd1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdHRoaXMuX3pvbmUsXG5cdFx0XHR0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhbmltYXRpb246IGJvb2xlYW4pID0+IHtcblx0XHRcdFx0aWYgKGFuaW1hdGlvbikge1xuXHRcdFx0XHRcdHJlZmxvdyhlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcblx0XHRcdH0sXG5cdFx0XHRjb250ZXh0LFxuXHRcdCk7XG5cdFx0Y29uc3QgZGlhbG9nVHJhbnNpdGlvbiQgPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2RpYWxvZ0VsLm5hdGl2ZUVsZW1lbnQsICgpID0+IHt9LCBjb250ZXh0KTtcblxuXHRcdHppcCh3aW5kb3dUcmFuc2l0aW9uJCwgZGlhbG9nVHJhbnNpdGlvbiQpLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLnNob3duLm5leHQoKTtcblx0XHRcdHRoaXMuc2hvd24uY29tcGxldGUoKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuX2VuYWJsZUV2ZW50SGFuZGxpbmcoKTtcblx0XHR0aGlzLl9zZXRGb2N1cygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfZW5hYmxlRXZlbnRIYW5kbGluZygpIHtcblx0XHRjb25zdCB7IG5hdGl2ZUVsZW1lbnQgfSA9IHRoaXMuX2VsUmVmO1xuXHRcdHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0ZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KG5hdGl2ZUVsZW1lbnQsICdrZXlkb3duJylcblx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0dGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLFxuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuXHRcdFx0XHRcdGZpbHRlcigoZSkgPT4gZS53aGljaCA9PT0gS2V5LkVzY2FwZSksXG5cdFx0XHRcdClcblx0XHRcdFx0LnN1YnNjcmliZSgoZXZlbnQpID0+IHtcblx0XHRcdFx0XHRpZiAodGhpcy5rZXlib2FyZCkge1xuXHRcdFx0XHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fem9uZS5ydW4oKCkgPT4gdGhpcy5kaXNtaXNzKE1vZGFsRGlzbWlzc1JlYXNvbnMuRVNDKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2J1bXBCYWNrZHJvcCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFdlJ3JlIGxpc3RlbmluZyB0byAnbW91c2Vkb3duJyBhbmQgJ21vdXNldXAnIHRvIHByZXZlbnQgbW9kYWwgZnJvbSBjbG9zaW5nIHdoZW4gcHJlc3NpbmcgdGhlIG1vdXNlXG5cdFx0XHQvLyBpbnNpZGUgdGhlIG1vZGFsIGRpYWxvZyBhbmQgcmVsZWFzaW5nIGl0IG91dHNpZGVcblx0XHRcdGxldCBwcmV2ZW50Q2xvc2UgPSBmYWxzZTtcblx0XHRcdGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9kaWFsb2dFbC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJylcblx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0dGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLFxuXHRcdFx0XHRcdHRhcCgoKSA9PiAocHJldmVudENsb3NlID0gZmFsc2UpKSxcblx0XHRcdFx0XHRzd2l0Y2hNYXAoKCkgPT4gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KG5hdGl2ZUVsZW1lbnQsICdtb3VzZXVwJykucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2VkJCksIHRha2UoMSkpKSxcblx0XHRcdFx0XHRmaWx0ZXIoKHsgdGFyZ2V0IH0pID0+IG5hdGl2ZUVsZW1lbnQgPT09IHRhcmdldCksXG5cdFx0XHRcdClcblx0XHRcdFx0LnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdFx0cHJldmVudENsb3NlID0gdHJ1ZTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFdlJ3JlIGxpc3RlbmluZyB0byAnY2xpY2snIHRvIGRpc21pc3MgbW9kYWwgb24gbW9kYWwgd2luZG93IGNsaWNrLCBleGNlcHQgd2hlbjpcblx0XHRcdC8vIDEuIGNsaWNraW5nIG9uIG1vZGFsIGRpYWxvZyBpdHNlbGZcblx0XHRcdC8vIDIuIGNsb3Npbmcgd2FzIHByZXZlbnRlZCBieSBtb3VzZWRvd24vdXAgaGFuZGxlcnNcblx0XHRcdC8vIDMuIGNsaWNraW5nIG9uIHNjcm9sbGJhciB3aGVuIHRoZSB2aWV3cG9ydCBpcyB0b28gc21hbGwgYW5kIG1vZGFsIGRvZXNuJ3QgZml0IChjbGljayBpcyBub3QgdHJpZ2dlcmVkIGF0IGFsbClcblx0XHRcdGZyb21FdmVudDxNb3VzZUV2ZW50PihuYXRpdmVFbGVtZW50LCAnY2xpY2snKVxuXHRcdFx0XHQucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2VkJCkpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKHsgdGFyZ2V0IH0pID0+IHtcblx0XHRcdFx0XHRpZiAobmF0aXZlRWxlbWVudCA9PT0gdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5iYWNrZHJvcCA9PT0gJ3N0YXRpYycpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYnVtcEJhY2tkcm9wKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuYmFja2Ryb3AgPT09IHRydWUgJiYgIXByZXZlbnRDbG9zZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLmRpc21pc3MoTW9kYWxEaXNtaXNzUmVhc29ucy5CQUNLRFJPUF9DTElDSykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHByZXZlbnRDbG9zZSA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2Rpc2FibGVFdmVudEhhbmRsaW5nKCkge1xuXHRcdHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuXHR9XG5cblx0cHJpdmF0ZSBfc2V0Rm9jdXMoKSB7XG5cdFx0Y29uc3QgeyBuYXRpdmVFbGVtZW50IH0gPSB0aGlzLl9lbFJlZjtcblx0XHRpZiAoIW5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcblx0XHRcdGNvbnN0IGF1dG9Gb2N1c2FibGUgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuZ2JBdXRvZm9jdXNdYCkgYXMgSFRNTEVsZW1lbnQ7XG5cdFx0XHRjb25zdCBmaXJzdEZvY3VzYWJsZSA9IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMobmF0aXZlRWxlbWVudClbMF07XG5cblx0XHRcdGNvbnN0IGVsZW1lbnRUb0ZvY3VzID0gYXV0b0ZvY3VzYWJsZSB8fCBmaXJzdEZvY3VzYWJsZSB8fCBuYXRpdmVFbGVtZW50O1xuXHRcdFx0ZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9yZXN0b3JlRm9jdXMoKSB7XG5cdFx0Y29uc3QgYm9keSA9IHRoaXMuX2RvY3VtZW50LmJvZHk7XG5cdFx0Y29uc3QgZWxXaXRoRm9jdXMgPSB0aGlzLl9lbFdpdGhGb2N1cztcblxuXHRcdGxldCBlbGVtZW50VG9Gb2N1cztcblx0XHRpZiAoZWxXaXRoRm9jdXMgJiYgZWxXaXRoRm9jdXNbJ2ZvY3VzJ10gJiYgYm9keS5jb250YWlucyhlbFdpdGhGb2N1cykpIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gZWxXaXRoRm9jdXM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGVsZW1lbnRUb0ZvY3VzID0gYm9keTtcblx0XHR9XG5cdFx0dGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IGVsZW1lbnRUb0ZvY3VzLmZvY3VzKCkpO1xuXHRcdFx0dGhpcy5fZWxXaXRoRm9jdXMgPSBudWxsO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfYnVtcEJhY2tkcm9wKCkge1xuXHRcdGlmICh0aGlzLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuXHRcdFx0bmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdFx0dGhpcy5fem9uZSxcblx0XHRcdFx0dGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0KHsgY2xhc3NMaXN0IH0pID0+IHtcblx0XHRcdFx0XHRjbGFzc0xpc3QuYWRkKCdtb2RhbC1zdGF0aWMnKTtcblx0XHRcdFx0XHRyZXR1cm4gKCkgPT4gY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtc3RhdGljJyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHsgYW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScgfSxcblx0XHRcdCk7XG5cdFx0fVxuXHR9XG59XG4iXX0=