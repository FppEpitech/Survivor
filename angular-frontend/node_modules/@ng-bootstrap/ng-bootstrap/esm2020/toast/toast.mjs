import { Attribute, Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { take } from 'rxjs/operators';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbToastFadeInTransition, ngbToastFadeOutTransition } from './toast-transition';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./toast-config";
/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
export class NgbToastHeader {
}
NgbToastHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToastHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbToastHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbToastHeader, isStandalone: true, selector: "[ngbToastHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToastHeader, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbToastHeader]', standalone: true }]
        }] });
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
export class NgbToast {
    constructor(ariaLive, config, _zone, _element) {
        this.ariaLive = ariaLive;
        this._zone = _zone;
        this._element = _element;
        /**
         * A template like `<ng-template ngbToastHeader></ng-template>` can be
         * used in the projected content to allow markup usage.
         */
        this.contentHeaderTpl = null;
        /**
         * An event fired after the animation triggered by calling `.show()` method has finished.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event fired after the animation triggered by calling `.hide()` method has finished.
         *
         * It can only occur in 2 different scenarios:
         * - `autohide` timeout fires
         * - user clicks on a closing cross
         *
         * Additionally this output is purely informative. The toast won't be removed from DOM automatically, it's up
         * to the user to take care of that.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        if (this.ariaLive == null) {
            this.ariaLive = config.ariaLive;
        }
        this.delay = config.delay;
        this.autohide = config.autohide;
        this.animation = config.animation;
    }
    ngAfterContentInit() {
        this._zone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
            this._init();
            this.show();
        });
    }
    ngOnChanges(changes) {
        if ('autohide' in changes) {
            this._clearTimeout();
            this._init();
        }
    }
    /**
     * Triggers toast closing programmatically.
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(hidden)` output
     *
     * @since 8.0.0
     */
    hide() {
        this._clearTimeout();
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeOutTransition, {
            animation: this.animation,
            runningTransition: 'stop',
        });
        transition.subscribe(() => {
            this.hidden.emit();
        });
        return transition;
    }
    /**
     * Triggers toast opening programmatically.
     *
     * The returned observable will emit and be completed once the opening transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(shown)` output
     *
     * @since 8.0.0
     */
    show() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeInTransition, {
            animation: this.animation,
            runningTransition: 'continue',
        });
        transition.subscribe(() => {
            this.shown.emit();
        });
        return transition;
    }
    _init() {
        if (this.autohide && !this._timeoutID) {
            this._timeoutID = setTimeout(() => this.hide(), this.delay);
        }
    }
    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
}
NgbToast.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToast, deps: [{ token: 'aria-live', attribute: true }, { token: i1.NgbToastConfig }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgbToast.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbToast, isStandalone: true, selector: "ngb-toast", inputs: { animation: "animation", delay: "delay", autohide: "autohide", header: "header" }, outputs: { shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "alert", "aria-atomic": "true" }, properties: { "attr.aria-live": "ariaLive", "class.fade": "animation" }, classAttribute: "toast" }, queries: [{ propertyName: "contentHeaderTpl", first: true, predicate: NgbToastHeader, descendants: true, read: TemplateRef, static: true }], exportAs: ["ngbToast"], usesOnChanges: true, ngImport: i0, template: `
		<ng-template #headerTpl>
			<strong class="me-auto">{{ header }}</strong>
		</ng-template>
		<ng-template [ngIf]="contentHeaderTpl || header">
			<div class="toast-header">
				<ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					i18n-aria-label="@@ngb.toast.close-aria"
					(click)="hide()"
				>
				</button>
			</div>
		</ng-template>
		<div class="toast-body">
			<ng-content></ng-content>
		</div>
	`, isInline: true, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToast, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-toast', exportAs: 'ngbToast', standalone: true, imports: [NgIf, NgTemplateOutlet], encapsulation: ViewEncapsulation.None, host: {
                        role: 'alert',
                        '[attr.aria-live]': 'ariaLive',
                        'aria-atomic': 'true',
                        class: 'toast',
                        '[class.fade]': 'animation',
                    }, template: `
		<ng-template #headerTpl>
			<strong class="me-auto">{{ header }}</strong>
		</ng-template>
		<ng-template [ngIf]="contentHeaderTpl || header">
			<div class="toast-header">
				<ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
				<button
					type="button"
					class="btn-close"
					aria-label="Close"
					i18n-aria-label="@@ngb.toast.close-aria"
					(click)="hide()"
				>
				</button>
			</div>
		</ng-template>
		<div class="toast-body">
			<ng-content></ng-content>
		</div>
	`, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }, { type: i1.NgbToastConfig }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, propDecorators: { animation: [{
                type: Input
            }], delay: [{
                type: Input
            }], autohide: [{
                type: Input
            }], header: [{
                type: Input
            }], contentHeaderTpl: [{
                type: ContentChild,
                args: [NgbToastHeader, { read: TemplateRef, static: true }]
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdG9hc3QvdG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEdBR2pCLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd0QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN6RixPQUFPLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQUV6RDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFEMUIsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFOztBQUc3RDs7Ozs7R0FLRztBQXFDSCxNQUFNLE9BQU8sUUFBUTtJQXlEcEIsWUFDZ0MsUUFBZ0IsRUFDL0MsTUFBc0IsRUFDZCxLQUFhLEVBQ2IsUUFBb0I7UUFIRyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBRXZDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBL0I3Qjs7O1dBR0c7UUFDZ0UscUJBQWdCLEdBQTRCLElBQUksQ0FBQztRQUVwSDs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFFM0M7Ozs7Ozs7Ozs7O1dBV0c7UUFDTyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQVEzQyxJQUFJLElB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LElBQUksRUFBRSxPQUFPO3dCQUNiLGtCQUFrQixFQUFFLFVBQVU7d0JBQzlCLGFBQWEsRUFBRSxNQUFNO3dCQUNyQixLQUFLLEVBQUUsT0FBTzt3QkFDZCxjQUFjLEVBQUUsV0FBVztxQkFDM0IsWUFDUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvQlQ7OzBCQTZEQyxTQUFTOzJCQUFDLFdBQVc7dUhBbERkLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsS0FBSztzQkFBYixLQUFLO2dCQU1HLFFBQVE7c0JBQWhCLEtBQUs7Z0JBTUcsTUFBTTtzQkFBZCxLQUFLO2dCQU02RCxnQkFBZ0I7c0JBQWxGLFlBQVk7dUJBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQU92RCxLQUFLO3NCQUFkLE1BQU07Z0JBY0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0QXR0cmlidXRlLFxuXHRDb21wb25lbnQsXG5cdENvbnRlbnRDaGlsZCxcblx0RGlyZWN0aXZlLFxuXHRFdmVudEVtaXR0ZXIsXG5cdElucHV0LFxuXHRPbkNoYW5nZXMsXG5cdE91dHB1dCxcblx0U2ltcGxlQ2hhbmdlcyxcblx0VGVtcGxhdGVSZWYsXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxuXHRFbGVtZW50UmVmLFxuXHROZ1pvbmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOZ2JUb2FzdENvbmZpZyB9IGZyb20gJy4vdG9hc3QtY29uZmlnJztcbmltcG9ydCB7IG5nYlJ1blRyYW5zaXRpb24gfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQgeyBuZ2JUb2FzdEZhZGVJblRyYW5zaXRpb24sIG5nYlRvYXN0RmFkZU91dFRyYW5zaXRpb24gfSBmcm9tICcuL3RvYXN0LXRyYW5zaXRpb24nO1xuaW1wb3J0IHsgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgYWxsb3dzIHRoZSB1c2FnZSBvZiBIVE1MIG1hcmt1cCBvciBvdGhlciBkaXJlY3RpdmVzXG4gKiBpbnNpZGUgb2YgdGhlIHRvYXN0J3MgaGVhZGVyLlxuICpcbiAqIEBzaW5jZSA1LjAuMFxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmdiVG9hc3RIZWFkZXJdJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlRvYXN0SGVhZGVyIHt9XG5cbi8qKlxuICogVG9hc3RzIHByb3ZpZGUgZmVlZGJhY2sgbWVzc2FnZXMgYXMgbm90aWZpY2F0aW9ucyB0byB0aGUgdXNlci5cbiAqIEdvYWwgaXMgdG8gbWltaWMgdGhlIHB1c2ggbm90aWZpY2F0aW9ucyBhdmFpbGFibGUgYm90aCBvbiBtb2JpbGUgYW5kIGRlc2t0b3Agb3BlcmF0aW5nIHN5c3RlbXMuXG4gKlxuICogQHNpbmNlIDUuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25nYi10b2FzdCcsXG5cdGV4cG9ydEFzOiAnbmdiVG9hc3QnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRpbXBvcnRzOiBbTmdJZiwgTmdUZW1wbGF0ZU91dGxldF0sXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdGhvc3Q6IHtcblx0XHRyb2xlOiAnYWxlcnQnLFxuXHRcdCdbYXR0ci5hcmlhLWxpdmVdJzogJ2FyaWFMaXZlJyxcblx0XHQnYXJpYS1hdG9taWMnOiAndHJ1ZScsXG5cdFx0Y2xhc3M6ICd0b2FzdCcsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuXHR9LFxuXHR0ZW1wbGF0ZTogYFxuXHRcdDxuZy10ZW1wbGF0ZSAjaGVhZGVyVHBsPlxuXHRcdFx0PHN0cm9uZyBjbGFzcz1cIm1lLWF1dG9cIj57eyBoZWFkZXIgfX08L3N0cm9uZz5cblx0XHQ8L25nLXRlbXBsYXRlPlxuXHRcdDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJjb250ZW50SGVhZGVyVHBsIHx8IGhlYWRlclwiPlxuXHRcdFx0PGRpdiBjbGFzcz1cInRvYXN0LWhlYWRlclwiPlxuXHRcdFx0XHQ8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudEhlYWRlclRwbCB8fCBoZWFkZXJUcGxcIj48L25nLXRlbXBsYXRlPlxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0Y2xhc3M9XCJidG4tY2xvc2VcIlxuXHRcdFx0XHRcdGFyaWEtbGFiZWw9XCJDbG9zZVwiXG5cdFx0XHRcdFx0aTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IudG9hc3QuY2xvc2UtYXJpYVwiXG5cdFx0XHRcdFx0KGNsaWNrKT1cImhpZGUoKVwiXG5cdFx0XHRcdD5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L25nLXRlbXBsYXRlPlxuXHRcdDxkaXYgY2xhc3M9XCJ0b2FzdC1ib2R5XCI+XG5cdFx0XHQ8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cdFx0PC9kaXY+XG5cdGAsXG5cdHN0eWxlVXJsczogWycuL3RvYXN0LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiVG9hc3QgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMge1xuXHQvKipcblx0ICogSWYgYHRydWVgLCB0b2FzdCBvcGVuaW5nIGFuZCBjbG9zaW5nIHdpbGwgYmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIEFuaW1hdGlvbiBpcyB0cmlnZ2VyZWQgb25seSB3aGVuIHRoZSBgLmhpZGUoKWAgb3IgYC5zaG93KClgIGZ1bmN0aW9ucyBhcmUgY2FsbGVkXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXG5cdHByaXZhdGUgX3RpbWVvdXRJRDtcblxuXHQvKipcblx0ICogRGVsYXkgYWZ0ZXIgd2hpY2ggdGhlIHRvYXN0IHdpbGwgaGlkZSAobXMpLlxuXHQgKiBkZWZhdWx0OiBgNTAwYCAobXMpIChpbmhlcml0ZWQgZnJvbSBOZ2JUb2FzdENvbmZpZylcblx0ICovXG5cdEBJbnB1dCgpIGRlbGF5OiBudW1iZXI7XG5cblx0LyoqXG5cdCAqIEF1dG8gaGlkZSB0aGUgdG9hc3QgYWZ0ZXIgYSBkZWxheSBpbiBtcy5cblx0ICogZGVmYXVsdDogYHRydWVgIChpbmhlcml0ZWQgZnJvbSBOZ2JUb2FzdENvbmZpZylcblx0ICovXG5cdEBJbnB1dCgpIGF1dG9oaWRlOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBUZXh0IHRvIGJlIHVzZWQgYXMgdG9hc3QncyBoZWFkZXIuXG5cdCAqIElnbm9yZWQgaWYgYSBDb250ZW50Q2hpbGQgdGVtcGxhdGUgaXMgc3BlY2lmaWVkIGF0IHRoZSBzYW1lIHRpbWUuXG5cdCAqL1xuXHRASW5wdXQoKSBoZWFkZXI6IHN0cmluZztcblxuXHQvKipcblx0ICogQSB0ZW1wbGF0ZSBsaWtlIGA8bmctdGVtcGxhdGUgbmdiVG9hc3RIZWFkZXI+PC9uZy10ZW1wbGF0ZT5gIGNhbiBiZVxuXHQgKiB1c2VkIGluIHRoZSBwcm9qZWN0ZWQgY29udGVudCB0byBhbGxvdyBtYXJrdXAgdXNhZ2UuXG5cdCAqL1xuXHRAQ29udGVudENoaWxkKE5nYlRvYXN0SGVhZGVyLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgY29udGVudEhlYWRlclRwbDogVGVtcGxhdGVSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBmaXJlZCBhZnRlciB0aGUgYW5pbWF0aW9uIHRyaWdnZXJlZCBieSBjYWxsaW5nIGAuc2hvdygpYCBtZXRob2QgaGFzIGZpbmlzaGVkLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZmlyZWQgYWZ0ZXIgdGhlIGFuaW1hdGlvbiB0cmlnZ2VyZWQgYnkgY2FsbGluZyBgLmhpZGUoKWAgbWV0aG9kIGhhcyBmaW5pc2hlZC5cblx0ICpcblx0ICogSXQgY2FuIG9ubHkgb2NjdXIgaW4gMiBkaWZmZXJlbnQgc2NlbmFyaW9zOlxuXHQgKiAtIGBhdXRvaGlkZWAgdGltZW91dCBmaXJlc1xuXHQgKiAtIHVzZXIgY2xpY2tzIG9uIGEgY2xvc2luZyBjcm9zc1xuXHQgKlxuXHQgKiBBZGRpdGlvbmFsbHkgdGhpcyBvdXRwdXQgaXMgcHVyZWx5IGluZm9ybWF0aXZlLiBUaGUgdG9hc3Qgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIERPTSBhdXRvbWF0aWNhbGx5LCBpdCdzIHVwXG5cdCAqIHRvIHRoZSB1c2VyIHRvIHRha2UgY2FyZSBvZiB0aGF0LlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0QEF0dHJpYnV0ZSgnYXJpYS1saXZlJykgcHVibGljIGFyaWFMaXZlOiBzdHJpbmcsXG5cdFx0Y29uZmlnOiBOZ2JUb2FzdENvbmZpZyxcblx0XHRwcml2YXRlIF96b25lOiBOZ1pvbmUsXG5cdFx0cHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZixcblx0KSB7XG5cdFx0aWYgKHRoaXMuYXJpYUxpdmUgPT0gbnVsbCkge1xuXHRcdFx0dGhpcy5hcmlhTGl2ZSA9IGNvbmZpZy5hcmlhTGl2ZTtcblx0XHR9XG5cdFx0dGhpcy5kZWxheSA9IGNvbmZpZy5kZWxheTtcblx0XHR0aGlzLmF1dG9oaWRlID0gY29uZmlnLmF1dG9oaWRlO1xuXHRcdHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcblx0fVxuXG5cdG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcblx0XHR0aGlzLl96b25lLm9uU3RhYmxlXG5cdFx0XHQuYXNPYnNlcnZhYmxlKClcblx0XHRcdC5waXBlKHRha2UoMSkpXG5cdFx0XHQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdFx0XHR0aGlzLnNob3coKTtcblx0XHRcdH0pO1xuXHR9XG5cblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuXHRcdGlmICgnYXV0b2hpZGUnIGluIGNoYW5nZXMpIHtcblx0XHRcdHRoaXMuX2NsZWFyVGltZW91dCgpO1xuXHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUcmlnZ2VycyB0b2FzdCBjbG9zaW5nIHByb2dyYW1tYXRpY2FsbHkuXG5cdCAqXG5cdCAqIFRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBhbmQgYmUgY29tcGxldGVkIG9uY2UgdGhlIGNsb3NpbmcgdHJhbnNpdGlvbiBoYXMgZmluaXNoZWQuXG5cdCAqIElmIHRoZSBhbmltYXRpb25zIGFyZSB0dXJuZWQgb2ZmIHRoaXMgaGFwcGVucyBzeW5jaHJvbm91c2x5LlxuXHQgKlxuXHQgKiBBbHRlcm5hdGl2ZWx5IHlvdSBjb3VsZCBsaXN0ZW4gb3Igc3Vic2NyaWJlIHRvIHRoZSBgKGhpZGRlbilgIG91dHB1dFxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGhpZGUoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0dGhpcy5fY2xlYXJUaW1lb3V0KCk7XG5cdFx0Y29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24odGhpcy5fem9uZSwgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBuZ2JUb2FzdEZhZGVPdXRUcmFuc2l0aW9uLCB7XG5cdFx0XHRhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLFxuXHRcdFx0cnVubmluZ1RyYW5zaXRpb246ICdzdG9wJyxcblx0XHR9KTtcblx0XHR0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLmhpZGRlbi5lbWl0KCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRyYW5zaXRpb247XG5cdH1cblxuXHQvKipcblx0ICogVHJpZ2dlcnMgdG9hc3Qgb3BlbmluZyBwcm9ncmFtbWF0aWNhbGx5LlxuXHQgKlxuXHQgKiBUaGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW5kIGJlIGNvbXBsZXRlZCBvbmNlIHRoZSBvcGVuaW5nIHRyYW5zaXRpb24gaGFzIGZpbmlzaGVkLlxuXHQgKiBJZiB0aGUgYW5pbWF0aW9ucyBhcmUgdHVybmVkIG9mZiB0aGlzIGhhcHBlbnMgc3luY2hyb25vdXNseS5cblx0ICpcblx0ICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgbGlzdGVuIG9yIHN1YnNjcmliZSB0byB0aGUgYChzaG93bilgIG91dHB1dFxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdHNob3coKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0Y29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24odGhpcy5fem9uZSwgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBuZ2JUb2FzdEZhZGVJblRyYW5zaXRpb24sIHtcblx0XHRcdGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG5cdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyxcblx0XHR9KTtcblx0XHR0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLnNob3duLmVtaXQoKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gdHJhbnNpdGlvbjtcblx0fVxuXG5cdHByaXZhdGUgX2luaXQoKSB7XG5cdFx0aWYgKHRoaXMuYXV0b2hpZGUgJiYgIXRoaXMuX3RpbWVvdXRJRCkge1xuXHRcdFx0dGhpcy5fdGltZW91dElEID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGUoKSwgdGhpcy5kZWxheSk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBfY2xlYXJUaW1lb3V0KCkge1xuXHRcdGlmICh0aGlzLl90aW1lb3V0SUQpIHtcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0SUQpO1xuXHRcdFx0dGhpcy5fdGltZW91dElEID0gbnVsbDtcblx0XHR9XG5cdH1cbn1cbiJdfQ==