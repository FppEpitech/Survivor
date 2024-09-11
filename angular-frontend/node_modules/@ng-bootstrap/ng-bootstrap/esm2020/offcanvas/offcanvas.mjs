import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./offcanvas-stack";
import * as i2 from "./offcanvas-config";
/**
 * A service for opening an offcanvas.
 *
 * Creating an offcanvas is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 *
 * @since 12.1.0
 */
export class NgbOffcanvas {
    constructor(_injector, _offcanvasStack, _config) {
        this._injector = _injector;
        this._offcanvasStack = _offcanvasStack;
        this._config = _config;
    }
    /**
     * Opens a new offcanvas panel with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveOffcanvas` class. You can then
     * use `NgbActiveOffcanvas` methods to close / dismiss offcanvas from "inside" of your component.
     *
     * Also see the [`NgbOffcanvasOptions`](#/components/offcanvas/api#NgbOffcanvasOptions) for the list of supported
     * options.
     */
    open(content, options = {}) {
        const combinedOptions = { ...this._config, animation: this._config.animation, ...options };
        return this._offcanvasStack.open(this._injector, content, combinedOptions);
    }
    /**
     * Returns an observable that holds the active offcanvas instance.
     */
    get activeInstance() {
        return this._offcanvasStack.activeInstance;
    }
    /**
     * Dismisses the currently displayed offcanvas with the supplied reason.
     */
    dismiss(reason) {
        this._offcanvasStack.dismiss(reason);
    }
    /**
     * Indicates if there is currently an open offcanvas in the application.
     */
    hasOpenOffcanvas() {
        return this._offcanvasStack.hasOpenOffcanvas();
    }
}
NgbOffcanvas.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvas, deps: [{ token: i0.Injector }, { token: i1.NgbOffcanvasStack }, { token: i2.NgbOffcanvasConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvas.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvas, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvas, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i1.NgbOffcanvasStack }, { type: i2.NgbOffcanvasConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQzs7OztBQUtyRDs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLFlBQVk7SUFDeEIsWUFDUyxTQUFtQixFQUNuQixlQUFrQyxFQUNsQyxPQUEyQjtRQUYzQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ25CLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUNsQyxZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUNqQyxDQUFDO0lBRUo7Ozs7Ozs7OztPQVNHO0lBQ0gsSUFBSSxDQUFDLE9BQVksRUFBRSxVQUErQixFQUFFO1FBQ25ELE1BQU0sZUFBZSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBQzNGLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxjQUFjO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUM7SUFDNUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsT0FBTyxDQUFDLE1BQVk7UUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0JBQWdCO1FBQ2YsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDaEQsQ0FBQzs7eUdBekNXLFlBQVk7NkdBQVosWUFBWSxjQURDLE1BQU07MkZBQ25CLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYk9mZmNhbnZhc0NvbmZpZywgTmdiT2ZmY2FudmFzT3B0aW9ucyB9IGZyb20gJy4vb2ZmY2FudmFzLWNvbmZpZyc7XG5pbXBvcnQgeyBOZ2JPZmZjYW52YXNSZWYgfSBmcm9tICcuL29mZmNhbnZhcy1yZWYnO1xuaW1wb3J0IHsgTmdiT2ZmY2FudmFzU3RhY2sgfSBmcm9tICcuL29mZmNhbnZhcy1zdGFjayc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIGZvciBvcGVuaW5nIGFuIG9mZmNhbnZhcy5cbiAqXG4gKiBDcmVhdGluZyBhbiBvZmZjYW52YXMgaXMgc3RyYWlnaHRmb3J3YXJkOiBjcmVhdGUgYSBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhbmQgcGFzcyBpdCBhcyBhbiBhcmd1bWVudCB0b1xuICogdGhlIGAub3BlbigpYCBtZXRob2QuXG4gKlxuICogQHNpbmNlIDEyLjEuMFxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE5nYk9mZmNhbnZhcyB7XG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgX2luamVjdG9yOiBJbmplY3Rvcixcblx0XHRwcml2YXRlIF9vZmZjYW52YXNTdGFjazogTmdiT2ZmY2FudmFzU3RhY2ssXG5cdFx0cHJpdmF0ZSBfY29uZmlnOiBOZ2JPZmZjYW52YXNDb25maWcsXG5cdCkge31cblxuXHQvKipcblx0ICogT3BlbnMgYSBuZXcgb2ZmY2FudmFzIHBhbmVsIHdpdGggdGhlIHNwZWNpZmllZCBjb250ZW50IGFuZCBzdXBwbGllZCBvcHRpb25zLlxuXHQgKlxuXHQgKiBDb250ZW50IGNhbiBiZSBwcm92aWRlZCBhcyBhIGBUZW1wbGF0ZVJlZmAgb3IgYSBjb21wb25lbnQgdHlwZS4gSWYgeW91IHBhc3MgYSBjb21wb25lbnQgdHlwZSBhcyBjb250ZW50LFxuXHQgKiB0aGVuIGluc3RhbmNlcyBvZiB0aG9zZSBjb21wb25lbnRzIGNhbiBiZSBpbmplY3RlZCB3aXRoIGFuIGluc3RhbmNlIG9mIHRoZSBgTmdiQWN0aXZlT2ZmY2FudmFzYCBjbGFzcy4gWW91IGNhbiB0aGVuXG5cdCAqIHVzZSBgTmdiQWN0aXZlT2ZmY2FudmFzYCBtZXRob2RzIHRvIGNsb3NlIC8gZGlzbWlzcyBvZmZjYW52YXMgZnJvbSBcImluc2lkZVwiIG9mIHlvdXIgY29tcG9uZW50LlxuXHQgKlxuXHQgKiBBbHNvIHNlZSB0aGUgW2BOZ2JPZmZjYW52YXNPcHRpb25zYF0oIy9jb21wb25lbnRzL29mZmNhbnZhcy9hcGkjTmdiT2ZmY2FudmFzT3B0aW9ucykgZm9yIHRoZSBsaXN0IG9mIHN1cHBvcnRlZFxuXHQgKiBvcHRpb25zLlxuXHQgKi9cblx0b3Blbihjb250ZW50OiBhbnksIG9wdGlvbnM6IE5nYk9mZmNhbnZhc09wdGlvbnMgPSB7fSk6IE5nYk9mZmNhbnZhc1JlZiB7XG5cdFx0Y29uc3QgY29tYmluZWRPcHRpb25zID0geyAuLi50aGlzLl9jb25maWcsIGFuaW1hdGlvbjogdGhpcy5fY29uZmlnLmFuaW1hdGlvbiwgLi4ub3B0aW9ucyB9O1xuXHRcdHJldHVybiB0aGlzLl9vZmZjYW52YXNTdGFjay5vcGVuKHRoaXMuX2luamVjdG9yLCBjb250ZW50LCBjb21iaW5lZE9wdGlvbnMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSB0aGF0IGhvbGRzIHRoZSBhY3RpdmUgb2ZmY2FudmFzIGluc3RhbmNlLlxuXHQgKi9cblx0Z2V0IGFjdGl2ZUluc3RhbmNlKCkge1xuXHRcdHJldHVybiB0aGlzLl9vZmZjYW52YXNTdGFjay5hY3RpdmVJbnN0YW5jZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgb2ZmY2FudmFzIHdpdGggdGhlIHN1cHBsaWVkIHJlYXNvbi5cblx0ICovXG5cdGRpc21pc3MocmVhc29uPzogYW55KSB7XG5cdFx0dGhpcy5fb2ZmY2FudmFzU3RhY2suZGlzbWlzcyhyZWFzb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyBpZiB0aGVyZSBpcyBjdXJyZW50bHkgYW4gb3BlbiBvZmZjYW52YXMgaW4gdGhlIGFwcGxpY2F0aW9uLlxuXHQgKi9cblx0aGFzT3Blbk9mZmNhbnZhcygpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fb2ZmY2FudmFzU3RhY2suaGFzT3Blbk9mZmNhbnZhcygpO1xuXHR9XG59XG4iXX0=