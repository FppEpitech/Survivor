import { DOCUMENT } from '@angular/common';
import { createComponent, EventEmitter, Inject, Injectable, Injector, TemplateRef, } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ngbFocusTrap } from '../util/focus-trap';
import { ContentRef } from '../util/popup';
import { isDefined, isString } from '../util/util';
import { NgbActiveOffcanvas, NgbOffcanvasRef } from './offcanvas-ref';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';
import * as i0 from "@angular/core";
import * as i1 from "../util/scrollbar";
export class NgbOffcanvasStack {
    constructor(_applicationRef, _injector, _document, _scrollBar, _ngZone) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._ngZone = _ngZone;
        this._activePanelCmptHasChanged = new Subject();
        this._scrollBarRestoreFn = null;
        this._backdropAttributes = ['animation', 'backdropClass'];
        this._panelAttributes = ['animation', 'ariaDescribedBy', 'ariaLabelledBy', 'keyboard', 'panelClass', 'position'];
        this._activeInstance = new EventEmitter();
        // Trap focus on active PanelCmpt
        this._activePanelCmptHasChanged.subscribe(() => {
            if (this._panelCmpt) {
                ngbFocusTrap(this._ngZone, this._panelCmpt.location.nativeElement, this._activePanelCmptHasChanged);
            }
        });
    }
    _restoreScrollBar() {
        const scrollBarRestoreFn = this._scrollBarRestoreFn;
        if (scrollBarRestoreFn) {
            this._scrollBarRestoreFn = null;
            scrollBarRestoreFn();
        }
    }
    _hideScrollBar() {
        if (!this._scrollBarRestoreFn) {
            this._scrollBarRestoreFn = this._scrollBar.hide();
        }
    }
    open(contentInjector, content, options) {
        const containerEl = options.container instanceof HTMLElement
            ? options.container
            : isDefined(options.container)
                ? this._document.querySelector(options.container)
                : this._document.body;
        if (!containerEl) {
            throw new Error(`The specified offcanvas container "${options.container || 'body'}" was not found in the DOM.`);
        }
        if (!options.scroll) {
            this._hideScrollBar();
        }
        const activeOffcanvas = new NgbActiveOffcanvas();
        const contentRef = this._getContentRef(options.injector || contentInjector, content, activeOffcanvas);
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(containerEl) : undefined;
        let panelCmptRef = this._attachWindowComponent(containerEl, contentRef.nodes);
        let ngbOffcanvasRef = new NgbOffcanvasRef(panelCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerOffcanvasRef(ngbOffcanvasRef);
        this._registerPanelCmpt(panelCmptRef);
        ngbOffcanvasRef.hidden.pipe(finalize(() => this._restoreScrollBar())).subscribe();
        activeOffcanvas.close = (result) => {
            ngbOffcanvasRef.close(result);
        };
        activeOffcanvas.dismiss = (reason) => {
            ngbOffcanvasRef.dismiss(reason);
        };
        this._applyPanelOptions(panelCmptRef.instance, options);
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
            backdropCmptRef.changeDetectorRef.detectChanges();
        }
        panelCmptRef.changeDetectorRef.detectChanges();
        return ngbOffcanvasRef;
    }
    get activeInstance() {
        return this._activeInstance;
    }
    dismiss(reason) {
        this._offcanvasRef?.dismiss(reason);
    }
    hasOpenOffcanvas() {
        return !!this._offcanvasRef;
    }
    _attachBackdrop(containerEl) {
        let backdropCmptRef = createComponent(NgbOffcanvasBackdrop, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
        });
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    _attachWindowComponent(containerEl, projectableNodes) {
        let panelCmptRef = createComponent(NgbOffcanvasPanel, {
            environmentInjector: this._applicationRef.injector,
            elementInjector: this._injector,
            projectableNodes,
        });
        this._applicationRef.attachView(panelCmptRef.hostView);
        containerEl.appendChild(panelCmptRef.location.nativeElement);
        return panelCmptRef;
    }
    _applyPanelOptions(windowInstance, options) {
        this._panelAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
        backdropInstance.static = options.backdrop === 'static';
    }
    _getContentRef(contentInjector, content, activeOffcanvas) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeOffcanvas);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(contentInjector, content, activeOffcanvas);
        }
    }
    _createFromTemplateRef(templateRef, activeOffcanvas) {
        const context = {
            $implicit: activeOffcanvas,
            close(result) {
                activeOffcanvas.close(result);
            },
            dismiss(reason) {
                activeOffcanvas.dismiss(reason);
            },
        };
        const viewRef = templateRef.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    _createFromString(content) {
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    _createFromComponent(contentInjector, componentType, context) {
        const elementInjector = Injector.create({
            providers: [{ provide: NgbActiveOffcanvas, useValue: context }],
            parent: contentInjector,
        });
        const componentRef = createComponent(componentType, {
            environmentInjector: this._applicationRef.injector,
            elementInjector,
        });
        const componentNativeEl = componentRef.location.nativeElement;
        this._applicationRef.attachView(componentRef.hostView);
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    }
    _registerOffcanvasRef(ngbOffcanvasRef) {
        const unregisterOffcanvasRef = () => {
            this._offcanvasRef = undefined;
            this._activeInstance.emit(this._offcanvasRef);
        };
        this._offcanvasRef = ngbOffcanvasRef;
        this._activeInstance.emit(this._offcanvasRef);
        ngbOffcanvasRef.result.then(unregisterOffcanvasRef, unregisterOffcanvasRef);
    }
    _registerPanelCmpt(ngbPanelCmpt) {
        this._panelCmpt = ngbPanelCmpt;
        this._activePanelCmptHasChanged.next();
        ngbPanelCmpt.onDestroy(() => {
            this._panelCmpt = undefined;
            this._activePanelCmptHasChanged.next();
        });
    }
}
NgbOffcanvasStack.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasStack, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }, { token: i1.ScrollBar }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvasStack.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasStack, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.ScrollBar }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFHTixlQUFlLEVBQ2YsWUFBWSxFQUNaLE1BQU0sRUFDTixVQUFVLEVBQ1YsUUFBUSxFQUVSLFdBQVcsR0FFWCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7OztBQUd0RCxNQUFNLE9BQU8saUJBQWlCO0lBUzdCLFlBQ1MsZUFBK0IsRUFDL0IsU0FBbUIsRUFDRCxTQUFjLEVBQ2hDLFVBQXFCLEVBQ3JCLE9BQWU7UUFKZixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFDL0IsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNELGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDaEMsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBYmhCLCtCQUEwQixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDakQsd0JB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Q0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVPLGtCQUFrQixDQUFDLFlBQTZDO1FBQ3ZFLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQy9CLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV2QyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztZQUM1QixJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDOzs4R0FoTlcsaUJBQWlCLHdFQVlwQixRQUFRO2tIQVpMLGlCQUFpQixjQURKLE1BQU07MkZBQ25CLGlCQUFpQjtrQkFEN0IsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQWEvQixNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuXHRBcHBsaWNhdGlvblJlZixcblx0Q29tcG9uZW50UmVmLFxuXHRjcmVhdGVDb21wb25lbnQsXG5cdEV2ZW50RW1pdHRlcixcblx0SW5qZWN0LFxuXHRJbmplY3RhYmxlLFxuXHRJbmplY3Rvcixcblx0Tmdab25lLFxuXHRUZW1wbGF0ZVJlZixcblx0VHlwZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmaW5hbGl6ZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgbmdiRm9jdXNUcmFwIH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7IENvbnRlbnRSZWYgfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7IFNjcm9sbEJhciB9IGZyb20gJy4uL3V0aWwvc2Nyb2xsYmFyJztcbmltcG9ydCB7IGlzRGVmaW5lZCwgaXNTdHJpbmcgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTmdiQWN0aXZlT2ZmY2FudmFzLCBOZ2JPZmZjYW52YXNSZWYgfSBmcm9tICcuL29mZmNhbnZhcy1yZWYnO1xuaW1wb3J0IHsgTmdiT2ZmY2FudmFzT3B0aW9ucyB9IGZyb20gJy4vb2ZmY2FudmFzLWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JPZmZjYW52YXNCYWNrZHJvcCB9IGZyb20gJy4vb2ZmY2FudmFzLWJhY2tkcm9wJztcbmltcG9ydCB7IE5nYk9mZmNhbnZhc1BhbmVsIH0gZnJvbSAnLi9vZmZjYW52YXMtcGFuZWwnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE5nYk9mZmNhbnZhc1N0YWNrIHtcblx0cHJpdmF0ZSBfYWN0aXZlUGFuZWxDbXB0SGFzQ2hhbmdlZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cdHByaXZhdGUgX3Njcm9sbEJhclJlc3RvcmVGbjogbnVsbCB8ICgoKSA9PiB2b2lkKSA9IG51bGw7XG5cdHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYW5pbWF0aW9uJywgJ2JhY2tkcm9wQ2xhc3MnXTtcblx0cHJpdmF0ZSBfb2ZmY2FudmFzUmVmPzogTmdiT2ZmY2FudmFzUmVmO1xuXHRwcml2YXRlIF9wYW5lbEF0dHJpYnV0ZXMgPSBbJ2FuaW1hdGlvbicsICdhcmlhRGVzY3JpYmVkQnknLCAnYXJpYUxhYmVsbGVkQnknLCAna2V5Ym9hcmQnLCAncGFuZWxDbGFzcycsICdwb3NpdGlvbiddO1xuXHRwcml2YXRlIF9wYW5lbENtcHQ/OiBDb21wb25lbnRSZWY8TmdiT2ZmY2FudmFzUGFuZWw+O1xuXHRwcml2YXRlIF9hY3RpdmVJbnN0YW5jZTogRXZlbnRFbWl0dGVyPE5nYk9mZmNhbnZhc1JlZiB8IHVuZGVmaW5lZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHJpdmF0ZSBfYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxuXHRcdHByaXZhdGUgX2luamVjdG9yOiBJbmplY3Rvcixcblx0XHRASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuXHRcdHByaXZhdGUgX3Njcm9sbEJhcjogU2Nyb2xsQmFyLFxuXHRcdHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuXHQpIHtcblx0XHQvLyBUcmFwIGZvY3VzIG9uIGFjdGl2ZSBQYW5lbENtcHRcblx0XHR0aGlzLl9hY3RpdmVQYW5lbENtcHRIYXNDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5fcGFuZWxDbXB0KSB7XG5cdFx0XHRcdG5nYkZvY3VzVHJhcCh0aGlzLl9uZ1pvbmUsIHRoaXMuX3BhbmVsQ21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLl9hY3RpdmVQYW5lbENtcHRIYXNDaGFuZ2VkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3Jlc3RvcmVTY3JvbGxCYXIoKSB7XG5cdFx0Y29uc3Qgc2Nyb2xsQmFyUmVzdG9yZUZuID0gdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuO1xuXHRcdGlmIChzY3JvbGxCYXJSZXN0b3JlRm4pIHtcblx0XHRcdHRoaXMuX3Njcm9sbEJhclJlc3RvcmVGbiA9IG51bGw7XG5cdFx0XHRzY3JvbGxCYXJSZXN0b3JlRm4oKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9oaWRlU2Nyb2xsQmFyKCkge1xuXHRcdGlmICghdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuKSB7XG5cdFx0XHR0aGlzLl9zY3JvbGxCYXJSZXN0b3JlRm4gPSB0aGlzLl9zY3JvbGxCYXIuaGlkZSgpO1xuXHRcdH1cblx0fVxuXG5cdG9wZW4oY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBvcHRpb25zOiBOZ2JPZmZjYW52YXNPcHRpb25zKTogTmdiT2ZmY2FudmFzUmVmIHtcblx0XHRjb25zdCBjb250YWluZXJFbCA9XG5cdFx0XHRvcHRpb25zLmNvbnRhaW5lciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG5cdFx0XHRcdD8gb3B0aW9ucy5jb250YWluZXJcblx0XHRcdFx0OiBpc0RlZmluZWQob3B0aW9ucy5jb250YWluZXIpXG5cdFx0XHRcdD8gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lcilcblx0XHRcdFx0OiB0aGlzLl9kb2N1bWVudC5ib2R5O1xuXHRcdGlmICghY29udGFpbmVyRWwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVGhlIHNwZWNpZmllZCBvZmZjYW52YXMgY29udGFpbmVyIFwiJHtvcHRpb25zLmNvbnRhaW5lciB8fCAnYm9keSd9XCIgd2FzIG5vdCBmb3VuZCBpbiB0aGUgRE9NLmApO1xuXHRcdH1cblxuXHRcdGlmICghb3B0aW9ucy5zY3JvbGwpIHtcblx0XHRcdHRoaXMuX2hpZGVTY3JvbGxCYXIoKTtcblx0XHR9XG5cblx0XHRjb25zdCBhY3RpdmVPZmZjYW52YXMgPSBuZXcgTmdiQWN0aXZlT2ZmY2FudmFzKCk7XG5cdFx0Y29uc3QgY29udGVudFJlZiA9IHRoaXMuX2dldENvbnRlbnRSZWYob3B0aW9ucy5pbmplY3RvciB8fCBjb250ZW50SW5qZWN0b3IsIGNvbnRlbnQsIGFjdGl2ZU9mZmNhbnZhcyk7XG5cblx0XHRsZXQgYmFja2Ryb3BDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiT2ZmY2FudmFzQmFja2Ryb3A+IHwgdW5kZWZpbmVkID1cblx0XHRcdG9wdGlvbnMuYmFja2Ryb3AgIT09IGZhbHNlID8gdGhpcy5fYXR0YWNoQmFja2Ryb3AoY29udGFpbmVyRWwpIDogdW5kZWZpbmVkO1xuXHRcdGxldCBwYW5lbENtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JPZmZjYW52YXNQYW5lbD4gPSB0aGlzLl9hdHRhY2hXaW5kb3dDb21wb25lbnQoY29udGFpbmVyRWwsIGNvbnRlbnRSZWYubm9kZXMpO1xuXHRcdGxldCBuZ2JPZmZjYW52YXNSZWY6IE5nYk9mZmNhbnZhc1JlZiA9IG5ldyBOZ2JPZmZjYW52YXNSZWYoXG5cdFx0XHRwYW5lbENtcHRSZWYsXG5cdFx0XHRjb250ZW50UmVmLFxuXHRcdFx0YmFja2Ryb3BDbXB0UmVmLFxuXHRcdFx0b3B0aW9ucy5iZWZvcmVEaXNtaXNzLFxuXHRcdCk7XG5cblx0XHR0aGlzLl9yZWdpc3Rlck9mZmNhbnZhc1JlZihuZ2JPZmZjYW52YXNSZWYpO1xuXHRcdHRoaXMuX3JlZ2lzdGVyUGFuZWxDbXB0KHBhbmVsQ21wdFJlZik7XG5cdFx0bmdiT2ZmY2FudmFzUmVmLmhpZGRlbi5waXBlKGZpbmFsaXplKCgpID0+IHRoaXMuX3Jlc3RvcmVTY3JvbGxCYXIoKSkpLnN1YnNjcmliZSgpO1xuXHRcdGFjdGl2ZU9mZmNhbnZhcy5jbG9zZSA9IChyZXN1bHQ6IGFueSkgPT4ge1xuXHRcdFx0bmdiT2ZmY2FudmFzUmVmLmNsb3NlKHJlc3VsdCk7XG5cdFx0fTtcblx0XHRhY3RpdmVPZmZjYW52YXMuZGlzbWlzcyA9IChyZWFzb246IGFueSkgPT4ge1xuXHRcdFx0bmdiT2ZmY2FudmFzUmVmLmRpc21pc3MocmVhc29uKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fYXBwbHlQYW5lbE9wdGlvbnMocGFuZWxDbXB0UmVmLmluc3RhbmNlLCBvcHRpb25zKTtcblxuXHRcdGlmIChiYWNrZHJvcENtcHRSZWYgJiYgYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLl9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuXHRcdFx0YmFja2Ryb3BDbXB0UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHR9XG5cdFx0cGFuZWxDbXB0UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblx0XHRyZXR1cm4gbmdiT2ZmY2FudmFzUmVmO1xuXHR9XG5cblx0Z2V0IGFjdGl2ZUluc3RhbmNlKCkge1xuXHRcdHJldHVybiB0aGlzLl9hY3RpdmVJbnN0YW5jZTtcblx0fVxuXG5cdGRpc21pc3MocmVhc29uPzogYW55KSB7XG5cdFx0dGhpcy5fb2ZmY2FudmFzUmVmPy5kaXNtaXNzKHJlYXNvbik7XG5cdH1cblxuXHRoYXNPcGVuT2ZmY2FudmFzKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMuX29mZmNhbnZhc1JlZjtcblx0fVxuXG5cdHByaXZhdGUgX2F0dGFjaEJhY2tkcm9wKGNvbnRhaW5lckVsOiBFbGVtZW50KTogQ29tcG9uZW50UmVmPE5nYk9mZmNhbnZhc0JhY2tkcm9wPiB7XG5cdFx0bGV0IGJhY2tkcm9wQ21wdFJlZiA9IGNyZWF0ZUNvbXBvbmVudChOZ2JPZmZjYW52YXNCYWNrZHJvcCwge1xuXHRcdFx0ZW52aXJvbm1lbnRJbmplY3RvcjogdGhpcy5fYXBwbGljYXRpb25SZWYuaW5qZWN0b3IsXG5cdFx0XHRlbGVtZW50SW5qZWN0b3I6IHRoaXMuX2luamVjdG9yLFxuXHRcdH0pO1xuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoYmFja2Ryb3BDbXB0UmVmLmhvc3RWaWV3KTtcblx0XHRjb250YWluZXJFbC5hcHBlbmRDaGlsZChiYWNrZHJvcENtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0cmV0dXJuIGJhY2tkcm9wQ21wdFJlZjtcblx0fVxuXG5cdHByaXZhdGUgX2F0dGFjaFdpbmRvd0NvbXBvbmVudChjb250YWluZXJFbDogRWxlbWVudCwgcHJvamVjdGFibGVOb2RlczogTm9kZVtdW10pOiBDb21wb25lbnRSZWY8TmdiT2ZmY2FudmFzUGFuZWw+IHtcblx0XHRsZXQgcGFuZWxDbXB0UmVmID0gY3JlYXRlQ29tcG9uZW50KE5nYk9mZmNhbnZhc1BhbmVsLCB7XG5cdFx0XHRlbnZpcm9ubWVudEluamVjdG9yOiB0aGlzLl9hcHBsaWNhdGlvblJlZi5pbmplY3Rvcixcblx0XHRcdGVsZW1lbnRJbmplY3RvcjogdGhpcy5faW5qZWN0b3IsXG5cdFx0XHRwcm9qZWN0YWJsZU5vZGVzLFxuXHRcdH0pO1xuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcocGFuZWxDbXB0UmVmLmhvc3RWaWV3KTtcblx0XHRjb250YWluZXJFbC5hcHBlbmRDaGlsZChwYW5lbENtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG5cdFx0cmV0dXJuIHBhbmVsQ21wdFJlZjtcblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5UGFuZWxPcHRpb25zKHdpbmRvd0luc3RhbmNlOiBOZ2JPZmZjYW52YXNQYW5lbCwgb3B0aW9uczogTmdiT2ZmY2FudmFzT3B0aW9ucyk6IHZvaWQge1xuXHRcdHRoaXMuX3BhbmVsQXR0cmlidXRlcy5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcblx0XHRcdGlmIChpc0RlZmluZWQob3B0aW9uc1tvcHRpb25OYW1lXSkpIHtcblx0XHRcdFx0d2luZG93SW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfYXBwbHlCYWNrZHJvcE9wdGlvbnMoYmFja2Ryb3BJbnN0YW5jZTogTmdiT2ZmY2FudmFzQmFja2Ryb3AsIG9wdGlvbnM6IE5nYk9mZmNhbnZhc09wdGlvbnMpOiB2b2lkIHtcblx0XHR0aGlzLl9iYWNrZHJvcEF0dHJpYnV0ZXMuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoaXNEZWZpbmVkKG9wdGlvbnNbb3B0aW9uTmFtZV0pKSB7XG5cdFx0XHRcdGJhY2tkcm9wSW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGJhY2tkcm9wSW5zdGFuY2Uuc3RhdGljID0gb3B0aW9ucy5iYWNrZHJvcCA9PT0gJ3N0YXRpYyc7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRDb250ZW50UmVmKFxuXHRcdGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0Y29udGVudDogVHlwZTxhbnk+IHwgVGVtcGxhdGVSZWY8YW55PiB8IHN0cmluZyxcblx0XHRhY3RpdmVPZmZjYW52YXM6IE5nYkFjdGl2ZU9mZmNhbnZhcyxcblx0KTogQ29udGVudFJlZiB7XG5cdFx0aWYgKCFjb250ZW50KSB7XG5cdFx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW10pO1xuXHRcdH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQsIGFjdGl2ZU9mZmNhbnZhcyk7XG5cdFx0fSBlbHNlIGlmIChpc1N0cmluZyhjb250ZW50KSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9jcmVhdGVGcm9tQ29tcG9uZW50KGNvbnRlbnRJbmplY3RvciwgY29udGVudCwgYWN0aXZlT2ZmY2FudmFzKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9jcmVhdGVGcm9tVGVtcGxhdGVSZWYodGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4sIGFjdGl2ZU9mZmNhbnZhczogTmdiQWN0aXZlT2ZmY2FudmFzKTogQ29udGVudFJlZiB7XG5cdFx0Y29uc3QgY29udGV4dCA9IHtcblx0XHRcdCRpbXBsaWNpdDogYWN0aXZlT2ZmY2FudmFzLFxuXHRcdFx0Y2xvc2UocmVzdWx0KSB7XG5cdFx0XHRcdGFjdGl2ZU9mZmNhbnZhcy5jbG9zZShyZXN1bHQpO1xuXHRcdFx0fSxcblx0XHRcdGRpc21pc3MocmVhc29uKSB7XG5cdFx0XHRcdGFjdGl2ZU9mZmNhbnZhcy5kaXNtaXNzKHJlYXNvbik7XG5cdFx0XHR9LFxuXHRcdH07XG5cdFx0Y29uc3Qgdmlld1JlZiA9IHRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyhjb250ZXh0KTtcblx0XHR0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHZpZXdSZWYpO1xuXHRcdHJldHVybiBuZXcgQ29udGVudFJlZihbdmlld1JlZi5yb290Tm9kZXNdLCB2aWV3UmVmKTtcblx0fVxuXG5cdHByaXZhdGUgX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudDogc3RyaW5nKTogQ29udGVudFJlZiB7XG5cdFx0Y29uc3QgY29tcG9uZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7Y29udGVudH1gKTtcblx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnRdXSk7XG5cdH1cblxuXHRwcml2YXRlIF9jcmVhdGVGcm9tQ29tcG9uZW50KFxuXHRcdGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsXG5cdFx0Y29tcG9uZW50VHlwZTogVHlwZTxhbnk+LFxuXHRcdGNvbnRleHQ6IE5nYkFjdGl2ZU9mZmNhbnZhcyxcblx0KTogQ29udGVudFJlZiB7XG5cdFx0Y29uc3QgZWxlbWVudEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcblx0XHRcdHByb3ZpZGVyczogW3sgcHJvdmlkZTogTmdiQWN0aXZlT2ZmY2FudmFzLCB1c2VWYWx1ZTogY29udGV4dCB9XSxcblx0XHRcdHBhcmVudDogY29udGVudEluamVjdG9yLFxuXHRcdH0pO1xuXHRcdGNvbnN0IGNvbXBvbmVudFJlZiA9IGNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRUeXBlLCB7XG5cdFx0XHRlbnZpcm9ubWVudEluamVjdG9yOiB0aGlzLl9hcHBsaWNhdGlvblJlZi5pbmplY3Rvcixcblx0XHRcdGVsZW1lbnRJbmplY3Rvcixcblx0XHR9KTtcblx0XHRjb25zdCBjb21wb25lbnROYXRpdmVFbCA9IGNvbXBvbmVudFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuXHRcdHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcblx0XHRyZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnROYXRpdmVFbF1dLCBjb21wb25lbnRSZWYuaG9zdFZpZXcsIGNvbXBvbmVudFJlZik7XG5cdH1cblxuXHRwcml2YXRlIF9yZWdpc3Rlck9mZmNhbnZhc1JlZihuZ2JPZmZjYW52YXNSZWY6IE5nYk9mZmNhbnZhc1JlZikge1xuXHRcdGNvbnN0IHVucmVnaXN0ZXJPZmZjYW52YXNSZWYgPSAoKSA9PiB7XG5cdFx0XHR0aGlzLl9vZmZjYW52YXNSZWYgPSB1bmRlZmluZWQ7XG5cdFx0XHR0aGlzLl9hY3RpdmVJbnN0YW5jZS5lbWl0KHRoaXMuX29mZmNhbnZhc1JlZik7XG5cdFx0fTtcblx0XHR0aGlzLl9vZmZjYW52YXNSZWYgPSBuZ2JPZmZjYW52YXNSZWY7XG5cdFx0dGhpcy5fYWN0aXZlSW5zdGFuY2UuZW1pdCh0aGlzLl9vZmZjYW52YXNSZWYpO1xuXHRcdG5nYk9mZmNhbnZhc1JlZi5yZXN1bHQudGhlbih1bnJlZ2lzdGVyT2ZmY2FudmFzUmVmLCB1bnJlZ2lzdGVyT2ZmY2FudmFzUmVmKTtcblx0fVxuXG5cdHByaXZhdGUgX3JlZ2lzdGVyUGFuZWxDbXB0KG5nYlBhbmVsQ21wdDogQ29tcG9uZW50UmVmPE5nYk9mZmNhbnZhc1BhbmVsPikge1xuXHRcdHRoaXMuX3BhbmVsQ21wdCA9IG5nYlBhbmVsQ21wdDtcblx0XHR0aGlzLl9hY3RpdmVQYW5lbENtcHRIYXNDaGFuZ2VkLm5leHQoKTtcblxuXHRcdG5nYlBhbmVsQ21wdC5vbkRlc3Ryb3koKCkgPT4ge1xuXHRcdFx0dGhpcy5fcGFuZWxDbXB0ID0gdW5kZWZpbmVkO1xuXHRcdFx0dGhpcy5fYWN0aXZlUGFuZWxDbXB0SGFzQ2hhbmdlZC5uZXh0KCk7XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==