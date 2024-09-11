import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./modal-stack";
import * as i2 from "./modal-config";
/**
 * A service for opening modal windows.
 *
 * Creating a modal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
export class NgbModal {
    constructor(_injector, _modalStack, _config) {
        this._injector = _injector;
        this._modalStack = _modalStack;
        this._config = _config;
    }
    /**
     * Opens a new modal window with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveModal` class. You can then
     * use `NgbActiveModal` methods to close / dismiss modals from "inside" of your component.
     *
     * Also see the [`NgbModalOptions`](#/components/modal/api#NgbModalOptions) for the list of supported options.
     */
    open(content, options = {}) {
        const combinedOptions = { ...this._config, animation: this._config.animation, ...options };
        return this._modalStack.open(this._injector, content, combinedOptions);
    }
    /**
     * Returns an observable that holds the active modal instances.
     */
    get activeInstances() {
        return this._modalStack.activeInstances;
    }
    /**
     * Dismisses all currently displayed modal windows with the supplied reason.
     *
     * @since 3.1.0
     */
    dismissAll(reason) {
        this._modalStack.dismissAll(reason);
    }
    /**
     * Indicates if there are currently any open modal windows in the application.
     *
     * @since 3.3.0
     */
    hasOpenModals() {
        return this._modalStack.hasOpenModals();
    }
}
NgbModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModal, deps: [{ token: i0.Injector }, { token: i1.NgbModalStack }, { token: i2.NgbModalConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModal.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModal, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbModal, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i1.NgbModalStack }, { type: i2.NgbModalConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQzs7OztBQU1yRDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxRQUFRO0lBQ3BCLFlBQW9CLFNBQW1CLEVBQVUsV0FBMEIsRUFBVSxPQUF1QjtRQUF4RixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWU7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFHLENBQUM7SUFFaEg7Ozs7Ozs7O09BUUc7SUFDSCxJQUFJLENBQUMsT0FBWSxFQUFFLFVBQTJCLEVBQUU7UUFDL0MsTUFBTSxlQUFlLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDM0YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLGVBQWU7UUFDbEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVUsQ0FBQyxNQUFZO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QyxDQUFDOztxR0F4Q1csUUFBUTt5R0FBUixRQUFRLGNBREssTUFBTTsyRkFDbkIsUUFBUTtrQkFEcEIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOZ2JNb2RhbE9wdGlvbnMsIE5nYk1vZGFsQ29uZmlnIH0gZnJvbSAnLi9tb2RhbC1jb25maWcnO1xuaW1wb3J0IHsgTmdiTW9kYWxSZWYgfSBmcm9tICcuL21vZGFsLXJlZic7XG5pbXBvcnQgeyBOZ2JNb2RhbFN0YWNrIH0gZnJvbSAnLi9tb2RhbC1zdGFjayc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIGZvciBvcGVuaW5nIG1vZGFsIHdpbmRvd3MuXG4gKlxuICogQ3JlYXRpbmcgYSBtb2RhbCBpcyBzdHJhaWdodGZvcndhcmQ6IGNyZWF0ZSBhIGNvbXBvbmVudCBvciBhIHRlbXBsYXRlIGFuZCBwYXNzIGl0IGFzIGFuIGFyZ3VtZW50IHRvXG4gKiB0aGUgYC5vcGVuKClgIG1ldGhvZC5cbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbCB7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgcHJpdmF0ZSBfbW9kYWxTdGFjazogTmdiTW9kYWxTdGFjaywgcHJpdmF0ZSBfY29uZmlnOiBOZ2JNb2RhbENvbmZpZykge31cblxuXHQvKipcblx0ICogT3BlbnMgYSBuZXcgbW9kYWwgd2luZG93IHdpdGggdGhlIHNwZWNpZmllZCBjb250ZW50IGFuZCBzdXBwbGllZCBvcHRpb25zLlxuXHQgKlxuXHQgKiBDb250ZW50IGNhbiBiZSBwcm92aWRlZCBhcyBhIGBUZW1wbGF0ZVJlZmAgb3IgYSBjb21wb25lbnQgdHlwZS4gSWYgeW91IHBhc3MgYSBjb21wb25lbnQgdHlwZSBhcyBjb250ZW50LFxuXHQgKiB0aGVuIGluc3RhbmNlcyBvZiB0aG9zZSBjb21wb25lbnRzIGNhbiBiZSBpbmplY3RlZCB3aXRoIGFuIGluc3RhbmNlIG9mIHRoZSBgTmdiQWN0aXZlTW9kYWxgIGNsYXNzLiBZb3UgY2FuIHRoZW5cblx0ICogdXNlIGBOZ2JBY3RpdmVNb2RhbGAgbWV0aG9kcyB0byBjbG9zZSAvIGRpc21pc3MgbW9kYWxzIGZyb20gXCJpbnNpZGVcIiBvZiB5b3VyIGNvbXBvbmVudC5cblx0ICpcblx0ICogQWxzbyBzZWUgdGhlIFtgTmdiTW9kYWxPcHRpb25zYF0oIy9jb21wb25lbnRzL21vZGFsL2FwaSNOZ2JNb2RhbE9wdGlvbnMpIGZvciB0aGUgbGlzdCBvZiBzdXBwb3J0ZWQgb3B0aW9ucy5cblx0ICovXG5cdG9wZW4oY29udGVudDogYW55LCBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMgPSB7fSk6IE5nYk1vZGFsUmVmIHtcblx0XHRjb25zdCBjb21iaW5lZE9wdGlvbnMgPSB7IC4uLnRoaXMuX2NvbmZpZywgYW5pbWF0aW9uOiB0aGlzLl9jb25maWcuYW5pbWF0aW9uLCAuLi5vcHRpb25zIH07XG5cdFx0cmV0dXJuIHRoaXMuX21vZGFsU3RhY2sub3Blbih0aGlzLl9pbmplY3RvciwgY29udGVudCwgY29tYmluZWRPcHRpb25zKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBob2xkcyB0aGUgYWN0aXZlIG1vZGFsIGluc3RhbmNlcy5cblx0ICovXG5cdGdldCBhY3RpdmVJbnN0YW5jZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGFsU3RhY2suYWN0aXZlSW5zdGFuY2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIERpc21pc3NlcyBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBtb2RhbCB3aW5kb3dzIHdpdGggdGhlIHN1cHBsaWVkIHJlYXNvbi5cblx0ICpcblx0ICogQHNpbmNlIDMuMS4wXG5cdCAqL1xuXHRkaXNtaXNzQWxsKHJlYXNvbj86IGFueSkge1xuXHRcdHRoaXMuX21vZGFsU3RhY2suZGlzbWlzc0FsbChyZWFzb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyBpZiB0aGVyZSBhcmUgY3VycmVudGx5IGFueSBvcGVuIG1vZGFsIHdpbmRvd3MgaW4gdGhlIGFwcGxpY2F0aW9uLlxuXHQgKlxuXHQgKiBAc2luY2UgMy4zLjBcblx0ICovXG5cdGhhc09wZW5Nb2RhbHMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGFsU3RhY2suaGFzT3Blbk1vZGFscygpO1xuXHR9XG59XG4iXX0=