import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import * as i0 from "@angular/core";
import * as i1 from "./collapse-config";
/**
 * A directive to provide a simple way of hiding and showing elements on the
 * page.
 */
export class NgbCollapse {
    constructor(_element, config, _zone) {
        this._element = _element;
        this._zone = _zone;
        /**
         * Flag used to track if the collapse setter is invoked during initialization
         * or not. This distinction is made in order to avoid running the transition during initialization.
         */
        this._afterInit = false;
        this._isCollapsed = false;
        this.ngbCollapseChange = new EventEmitter();
        /**
         * An event emitted when the collapse element is shown, after the transition.
         * It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapse element is hidden, after the transition.
         * It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
        this.horizontal = config.horizontal;
    }
    /**
     * If `true`, will collapse the element or show it otherwise.
     */
    set collapsed(isCollapsed) {
        if (this._isCollapsed !== isCollapsed) {
            this._isCollapsed = isCollapsed;
            if (this._afterInit) {
                this._runTransitionWithEvents(isCollapsed, this.animation);
            }
        }
    }
    ngOnInit() {
        this._runTransition(this._isCollapsed, false);
        this._afterInit = true;
    }
    /**
     * Triggers collapsing programmatically.
     *
     * If there is a collapsing transition running already, it will be reversed.
     * If the animations are turned off this happens synchronously.
     *
     * @since 8.0.0
     */
    toggle(open = this._isCollapsed) {
        this.collapsed = !open;
        this.ngbCollapseChange.next(this._isCollapsed);
    }
    _runTransition(collapsed, animation) {
        return ngbRunTransition(this._zone, this._element.nativeElement, ngbCollapsingTransition, {
            animation,
            runningTransition: 'stop',
            context: { direction: collapsed ? 'hide' : 'show', dimension: this.horizontal ? 'width' : 'height' },
        });
    }
    _runTransitionWithEvents(collapsed, animation) {
        this._runTransition(collapsed, animation).subscribe(() => {
            if (collapsed) {
                this.hidden.emit();
            }
            else {
                this.shown.emit();
            }
        });
    }
}
NgbCollapse.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbCollapse, deps: [{ token: i0.ElementRef }, { token: i1.NgbCollapseConfig }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
NgbCollapse.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbCollapse, isStandalone: true, selector: "[ngbCollapse]", inputs: { animation: "animation", collapsed: ["ngbCollapse", "collapsed"], horizontal: "horizontal" }, outputs: { ngbCollapseChange: "ngbCollapseChange", shown: "shown", hidden: "hidden" }, host: { properties: { "class.collapse-horizontal": "horizontal" } }, exportAs: ["ngbCollapse"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbCollapse, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbCollapse]',
                    exportAs: 'ngbCollapse',
                    standalone: true,
                    host: { '[class.collapse-horizontal]': 'horizontal' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgbCollapseConfig }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], collapsed: [{
                type: Input,
                args: ['ngbCollapse']
            }], ngbCollapseChange: [{
                type: Output
            }], horizontal: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGFwc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGFwc2UvY29sbGFwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFrQixNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMENBQTBDLENBQUM7OztBQUduRjs7O0dBR0c7QUFPSCxNQUFNLE9BQU8sV0FBVztJQXlEdkIsWUFBb0IsUUFBb0IsRUFBRSxNQUF5QixFQUFVLEtBQWE7UUFBdEUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFxQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBOUMxRjs7O1dBR0c7UUFDSyxlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRW5CLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBZW5CLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFTMUQ7Ozs7O1dBS0c7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUUzQzs7Ozs7V0FLRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDckMsQ0FBQztJQXpDRDs7T0FFRztJQUNILElBQ0ksU0FBUyxDQUFDLFdBQW9CO1FBQ2pDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxXQUFXLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUMzRDtTQUNEO0lBQ0YsQ0FBQztJQWdDRCxRQUFRO1FBQ1AsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE9BQWdCLElBQUksQ0FBQyxZQUFZO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVPLGNBQWMsQ0FBQyxTQUFrQixFQUFFLFNBQWtCO1FBQzVELE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSx1QkFBdUIsRUFBRTtZQUN6RixTQUFTO1lBQ1QsaUJBQWlCLEVBQUUsTUFBTTtZQUN6QixPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7U0FDcEcsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVPLHdCQUF3QixDQUFDLFNBQWtCLEVBQUUsU0FBa0I7UUFDdEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN4RCxJQUFJLFNBQVMsRUFBRTtnQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ25CO2lCQUFNO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbEI7UUFDRixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7O3dHQWhHVyxXQUFXOzRGQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFOdkIsU0FBUzttQkFBQztvQkFDVixRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixJQUFJLEVBQUUsRUFBRSw2QkFBNkIsRUFBRSxZQUFZLEVBQUU7aUJBQ3JEO3NKQVVTLFNBQVM7c0JBQWpCLEtBQUs7Z0JBY0YsU0FBUztzQkFEWixLQUFLO3VCQUFDLGFBQWE7Z0JBVVYsaUJBQWlCO3NCQUExQixNQUFNO2dCQU9FLFVBQVU7c0JBQWxCLEtBQUs7Z0JBUUksS0FBSztzQkFBZCxNQUFNO2dCQVFHLE1BQU07c0JBQWYsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgTmdab25lLCBPbkluaXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbmdiUnVuVHJhbnNpdGlvbiB9IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7IG5nYkNvbGxhcHNpbmdUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYkNvbGxhcHNlVHJhbnNpdGlvbic7XG5pbXBvcnQgeyBOZ2JDb2xsYXBzZUNvbmZpZyB9IGZyb20gJy4vY29sbGFwc2UtY29uZmlnJztcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwcm92aWRlIGEgc2ltcGxlIHdheSBvZiBoaWRpbmcgYW5kIHNob3dpbmcgZWxlbWVudHMgb24gdGhlXG4gKiBwYWdlLlxuICovXG5ARGlyZWN0aXZlKHtcblx0c2VsZWN0b3I6ICdbbmdiQ29sbGFwc2VdJyxcblx0ZXhwb3J0QXM6ICduZ2JDb2xsYXBzZScsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGhvc3Q6IHsgJ1tjbGFzcy5jb2xsYXBzZS1ob3Jpem9udGFsXSc6ICdob3Jpem9udGFsJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JDb2xsYXBzZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cdC8qKlxuXHQgKiBJZiBgdHJ1ZWAsIGNvbGxhcHNlIHdpbGwgYmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIEFuaW1hdGlvbiBpcyB0cmlnZ2VyZWQgb25seSB3aGVuIGNsaWNrZWQgb24gdHJpZ2dlcmluZyBlbGVtZW50XG5cdCAqIG9yIHZpYSB0aGUgYC50b2dnbGUoKWAgZnVuY3Rpb25cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRpb247XG5cblx0LyoqXG5cdCAqIEZsYWcgdXNlZCB0byB0cmFjayBpZiB0aGUgY29sbGFwc2Ugc2V0dGVyIGlzIGludm9rZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uXG5cdCAqIG9yIG5vdC4gVGhpcyBkaXN0aW5jdGlvbiBpcyBtYWRlIGluIG9yZGVyIHRvIGF2b2lkIHJ1bm5pbmcgdGhlIHRyYW5zaXRpb24gZHVyaW5nIGluaXRpYWxpemF0aW9uLlxuXHQgKi9cblx0cHJpdmF0ZSBfYWZ0ZXJJbml0ID0gZmFsc2U7XG5cblx0cHJpdmF0ZSBfaXNDb2xsYXBzZWQgPSBmYWxzZTtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIGNvbGxhcHNlIHRoZSBlbGVtZW50IG9yIHNob3cgaXQgb3RoZXJ3aXNlLlxuXHQgKi9cblx0QElucHV0KCduZ2JDb2xsYXBzZScpXG5cdHNldCBjb2xsYXBzZWQoaXNDb2xsYXBzZWQ6IGJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5faXNDb2xsYXBzZWQgIT09IGlzQ29sbGFwc2VkKSB7XG5cdFx0XHR0aGlzLl9pc0NvbGxhcHNlZCA9IGlzQ29sbGFwc2VkO1xuXHRcdFx0aWYgKHRoaXMuX2FmdGVySW5pdCkge1xuXHRcdFx0XHR0aGlzLl9ydW5UcmFuc2l0aW9uV2l0aEV2ZW50cyhpc0NvbGxhcHNlZCwgdGhpcy5hbmltYXRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdEBPdXRwdXQoKSBuZ2JDb2xsYXBzZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIGNvbGxhcHNlIGhvcml6b250YWxseS5cblx0ICpcblx0ICogQHNpbmNlIDEzLjEuMFxuXHQgKi9cblx0QElucHV0KCkgaG9yaXpvbnRhbDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzZSBlbGVtZW50IGlzIHNob3duLCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cblx0ICogSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbGxhcHNlIGVsZW1lbnQgaXMgaGlkZGVuLCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cblx0ICogSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBjb25maWc6IE5nYkNvbGxhcHNlQ29uZmlnLCBwcml2YXRlIF96b25lOiBOZ1pvbmUpIHtcblx0XHR0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG5cdFx0dGhpcy5ob3Jpem9udGFsID0gY29uZmlnLmhvcml6b250YWw7XG5cdH1cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLl9ydW5UcmFuc2l0aW9uKHRoaXMuX2lzQ29sbGFwc2VkLCBmYWxzZSk7XG5cdFx0dGhpcy5fYWZ0ZXJJbml0ID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmlnZ2VycyBjb2xsYXBzaW5nIHByb2dyYW1tYXRpY2FsbHkuXG5cdCAqXG5cdCAqIElmIHRoZXJlIGlzIGEgY29sbGFwc2luZyB0cmFuc2l0aW9uIHJ1bm5pbmcgYWxyZWFkeSwgaXQgd2lsbCBiZSByZXZlcnNlZC5cblx0ICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0dG9nZ2xlKG9wZW46IGJvb2xlYW4gPSB0aGlzLl9pc0NvbGxhcHNlZCkge1xuXHRcdHRoaXMuY29sbGFwc2VkID0gIW9wZW47XG5cdFx0dGhpcy5uZ2JDb2xsYXBzZUNoYW5nZS5uZXh0KHRoaXMuX2lzQ29sbGFwc2VkKTtcblx0fVxuXG5cdHByaXZhdGUgX3J1blRyYW5zaXRpb24oY29sbGFwc2VkOiBib29sZWFuLCBhbmltYXRpb246IGJvb2xlYW4pIHtcblx0XHRyZXR1cm4gbmdiUnVuVHJhbnNpdGlvbih0aGlzLl96b25lLCB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5nYkNvbGxhcHNpbmdUcmFuc2l0aW9uLCB7XG5cdFx0XHRhbmltYXRpb24sXG5cdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdFx0Y29udGV4dDogeyBkaXJlY3Rpb246IGNvbGxhcHNlZCA/ICdoaWRlJyA6ICdzaG93JywgZGltZW5zaW9uOiB0aGlzLmhvcml6b250YWwgPyAnd2lkdGgnIDogJ2hlaWdodCcgfSxcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3J1blRyYW5zaXRpb25XaXRoRXZlbnRzKGNvbGxhcHNlZDogYm9vbGVhbiwgYW5pbWF0aW9uOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fcnVuVHJhbnNpdGlvbihjb2xsYXBzZWQsIGFuaW1hdGlvbikuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdGlmIChjb2xsYXBzZWQpIHtcblx0XHRcdFx0dGhpcy5oaWRkZW4uZW1pdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5zaG93bi5lbWl0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cbiJdfQ==