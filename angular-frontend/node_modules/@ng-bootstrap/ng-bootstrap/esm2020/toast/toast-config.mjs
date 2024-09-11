import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * Configuration service for the NgbToast component. You can inject this service, typically in your root component,
 * and customize the values of its properties in order to provide default values for all the toasts used in the
 * application.
 *
 * @since 5.0.0
 */
export class NgbToastConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.autohide = true;
        this.delay = 5000;
        this.ariaLive = 'polite';
    }
    get animation() {
        return this._animation === undefined ? this._ngbConfig.animation : this._animation;
    }
    set animation(animation) {
        this._animation = animation;
    }
}
NgbToastConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToastConfig, deps: [{ token: i1.NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbToastConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToastConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbToastConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.NgbConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RvYXN0L3RvYXN0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUE4QjNDOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxjQUFjO0lBTzFCLFlBQW9CLFVBQXFCO1FBQXJCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFOekMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsYUFBUSxHQUF1QixRQUFRLENBQUM7SUFJSSxDQUFDO0lBRTdDLElBQUksU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3BGLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxTQUFrQjtRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDOzsyR0FkVyxjQUFjOytHQUFkLGNBQWMsY0FERCxNQUFNOzJGQUNuQixjQUFjO2tCQUQxQixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYkNvbmZpZyB9IGZyb20gJy4uL25nYi1jb25maWcnO1xuXG4vKipcbiAqIEludGVyZmFjZSB1c2VkIHRvIHR5cGUgYWxsIHRvYXN0IGNvbmZpZyBvcHRpb25zLiBTZWUgYE5nYlRvYXN0Q29uZmlnYC5cbiAqXG4gKiBAc2luY2UgNS4wLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JUb2FzdE9wdGlvbnMge1xuXHQvKipcblx0ICogU3BlY2lmeSBpZiB0aGUgdG9hc3QgY29tcG9uZW50IHNob3VsZCBlbWl0IHRoZSBgaGlkZSgpYCBvdXRwdXRcblx0ICogYWZ0ZXIgYSBjZXJ0YWluIGBkZWxheWAgaW4gbXMuXG5cdCAqL1xuXHRhdXRvaGlkZT86IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIERlbGF5IGluIG1zIGFmdGVyIHdoaWNoIHRoZSBgaGlkZSgpYCBvdXRwdXQgc2hvdWxkIGJlIGVtaXR0ZWQuXG5cdCAqL1xuXHRkZWxheT86IG51bWJlcjtcblxuXHQvKipcblx0ICogVHlwZSBvZiBhcmlhLWxpdmUgYXR0cmlidXRlIHRvIGJlIHVzZWQuXG5cdCAqXG5cdCAqIENvdWxkIGJlIG9uZSBvZiB0aGVzZSAyIHZhbHVlcyAoYXMgc3RyaW5nKTpcblx0ICogLSBgcG9saXRlYCAoZGVmYXVsdClcblx0ICogLSBgYWxlcnRgXG5cdCAqL1xuXHRhcmlhTGl2ZT86ICdwb2xpdGUnIHwgJ2FsZXJ0Jztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JUb2FzdCBjb21wb25lbnQuIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsXG4gKiBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW4gb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSB0b2FzdHMgdXNlZCBpbiB0aGVcbiAqIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBzaW5jZSA1LjAuMFxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE5nYlRvYXN0Q29uZmlnIGltcGxlbWVudHMgTmdiVG9hc3RPcHRpb25zIHtcblx0YXV0b2hpZGUgPSB0cnVlO1xuXHRkZWxheSA9IDUwMDA7XG5cdGFyaWFMaXZlOiAncG9saXRlJyB8ICdhbGVydCcgPSAncG9saXRlJztcblxuXHRwcml2YXRlIF9hbmltYXRpb246IGJvb2xlYW47XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBfbmdiQ29uZmlnOiBOZ2JDb25maWcpIHt9XG5cblx0Z2V0IGFuaW1hdGlvbigpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uID09PSB1bmRlZmluZWQgPyB0aGlzLl9uZ2JDb25maWcuYW5pbWF0aW9uIDogdGhpcy5fYW5pbWF0aW9uO1xuXHR9XG5cdHNldCBhbmltYXRpb24oYW5pbWF0aW9uOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuXHR9XG59XG4iXX0=