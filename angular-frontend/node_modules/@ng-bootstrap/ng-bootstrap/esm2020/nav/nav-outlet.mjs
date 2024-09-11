import { ChangeDetectionStrategy, Component, Directive, Input, ViewChildren, ViewEncapsulation, } from '@angular/core';
import { distinctUntilChanged, skip, startWith, takeUntil } from 'rxjs/operators';
import { ngbNavFadeInTransition, ngbNavFadeOutTransition } from './nav-transition';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
export class NgbNavPane {
    constructor(elRef) {
        this.elRef = elRef;
    }
}
NgbNavPane.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavPane, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavPane.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbNavPane, isStandalone: true, selector: "[ngbNavPane]", inputs: { item: "item", nav: "nav", role: "role" }, host: { properties: { "id": "item.panelDomId", "class.fade": "nav.animation", "attr.role": "role ? role : nav.roles ? \"tabpanel\" : undefined", "attr.aria-labelledby": "item.domId" }, classAttribute: "tab-pane" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavPane, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavPane]',
                    standalone: true,
                    host: {
                        '[id]': 'item.panelDomId',
                        class: 'tab-pane',
                        '[class.fade]': 'nav.animation',
                        '[attr.role]': 'role ? role : nav.roles ? "tabpanel" : undefined',
                        '[attr.aria-labelledby]': 'item.domId',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { item: [{
                type: Input
            }], nav: [{
                type: Input
            }], role: [{
                type: Input
            }] } });
/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
export class NgbNavOutlet {
    constructor(_cd, _ngZone) {
        this._cd = _cd;
        this._ngZone = _ngZone;
        this._activePane = null;
    }
    isPanelTransitioning(item) {
        return this._activePane?.item === item;
    }
    ngAfterViewInit() {
        // initial display
        this._updateActivePane();
        // this will be emitted for all 3 types of nav changes: .select(), [activeId] or (click)
        this.nav.navItemChange$
            .pipe(takeUntil(this.nav.destroy$), startWith(this._activePane?.item || null), distinctUntilChanged(), skip(1))
            .subscribe((nextItem) => {
            const options = { animation: this.nav.animation, runningTransition: 'stop' };
            // next panel we're switching to will only appear in DOM after the change detection is done
            // and `this._panes` will be updated
            this._cd.detectChanges();
            // fading out
            if (this._activePane) {
                ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeOutTransition, options).subscribe(() => {
                    const activeItem = this._activePane?.item;
                    this._activePane = this._getPaneForItem(nextItem);
                    // mark for check when transition finishes as outlet or parent containers might be OnPush
                    // without this the panes that have "faded out" will stay in DOM
                    this._cd.markForCheck();
                    // fading in
                    if (this._activePane) {
                        // we have to add the '.active' class before running the transition,
                        // because it should be in place before `ngbRunTransition` does `reflow()`
                        this._activePane.elRef.nativeElement.classList.add('active');
                        ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeInTransition, options).subscribe(() => {
                            if (nextItem) {
                                nextItem.shown.emit();
                                this.nav.shown.emit(nextItem.id);
                            }
                        });
                    }
                    if (activeItem) {
                        activeItem.hidden.emit();
                        this.nav.hidden.emit(activeItem.id);
                    }
                });
            }
            else {
                this._updateActivePane();
            }
        });
    }
    _updateActivePane() {
        this._activePane = this._getActivePane();
        this._activePane?.elRef.nativeElement.classList.add('show');
        this._activePane?.elRef.nativeElement.classList.add('active');
    }
    _getPaneForItem(item) {
        return (this._panes && this._panes.find((pane) => pane.item === item)) || null;
    }
    _getActivePane() {
        return (this._panes && this._panes.find((pane) => pane.item.active)) || null;
    }
}
NgbNavOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavOutlet, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbNavOutlet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbNavOutlet, isStandalone: true, selector: "[ngbNavOutlet]", inputs: { paneRole: "paneRole", nav: ["ngbNavOutlet", "nav"] }, host: { properties: { "class.tab-content": "true" } }, viewQueries: [{ propertyName: "_panes", predicate: NgbNavPane, descendants: true }], ngImport: i0, template: `
		<ng-template ngFor let-item [ngForOf]="nav.items">
			<div
				ngbNavPane
				*ngIf="item.isPanelInDom() || isPanelTransitioning(item)"
				[item]="item"
				[nav]="nav"
				[role]="paneRole"
			>
				<ng-template
					[ngTemplateOutlet]="item.contentTpl?.templateRef || null"
					[ngTemplateOutletContext]="{ $implicit: item.active || isPanelTransitioning(item) }"
				></ng-template>
			</div>
		</ng-template>
	`, isInline: true, dependencies: [{ kind: "directive", type: NgbNavPane, selector: "[ngbNavPane]", inputs: ["item", "nav", "role"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbNavOutlet, decorators: [{
            type: Component,
            args: [{
                    selector: '[ngbNavOutlet]',
                    standalone: true,
                    imports: [NgbNavPane, NgFor, NgIf, NgTemplateOutlet],
                    host: { '[class.tab-content]': 'true' },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `
		<ng-template ngFor let-item [ngForOf]="nav.items">
			<div
				ngbNavPane
				*ngIf="item.isPanelInDom() || isPanelTransitioning(item)"
				[item]="item"
				[nav]="nav"
				[role]="paneRole"
			>
				<ng-template
					[ngTemplateOutlet]="item.contentTpl?.templateRef || null"
					[ngTemplateOutletContext]="{ $implicit: item.active || isPanelTransitioning(item) }"
				></ng-template>
			</div>
		</ng-template>
	`,
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { _panes: [{
                type: ViewChildren,
                args: [NgbNavPane]
            }], paneRole: [{
                type: Input
            }], nav: [{
                type: Input,
                args: ['ngbNavOutlet']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LW91dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uYXYvbmF2LW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRU4sdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxTQUFTLEVBRVQsS0FBSyxFQUdMLFlBQVksRUFDWixpQkFBaUIsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkYsT0FBTyxFQUFFLGdCQUFnQixFQUF3QixNQUFNLGtDQUFrQyxDQUFDO0FBRTFGLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBYWhFLE1BQU0sT0FBTyxVQUFVO0lBS3RCLFlBQW1CLEtBQThCO1FBQTlCLFVBQUssR0FBTCxLQUFLLENBQXlCO0lBQUcsQ0FBQzs7dUdBTHpDLFVBQVU7MkZBQVYsVUFBVTsyRkFBVixVQUFVO2tCQVh0QixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxjQUFjO29CQUN4QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFO3dCQUNMLE1BQU0sRUFBRSxpQkFBaUI7d0JBQ3pCLEtBQUssRUFBRSxVQUFVO3dCQUNqQixjQUFjLEVBQUUsZUFBZTt3QkFDL0IsYUFBYSxFQUFFLGtEQUFrRDt3QkFDakUsd0JBQXdCLEVBQUUsWUFBWTtxQkFDdEM7aUJBQ0Q7aUdBRVMsSUFBSTtzQkFBWixLQUFLO2dCQUNHLEdBQUc7c0JBQVgsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7O0FBS1A7Ozs7R0FJRztBQXlCSCxNQUFNLE9BQU8sWUFBWTtJQWV4QixZQUFvQixHQUFzQixF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LFFBQVE7c0JBQWhCLEtBQUs7Z0JBS2lCLEdBQUc7c0JBQXpCLEtBQUs7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEFmdGVyVmlld0luaXQsXG5cdENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuXHRDaGFuZ2VEZXRlY3RvclJlZixcblx0Q29tcG9uZW50LFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdElucHV0LFxuXHROZ1pvbmUsXG5cdFF1ZXJ5TGlzdCxcblx0Vmlld0NoaWxkcmVuLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgc2tpcCwgc3RhcnRXaXRoLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IG5nYk5hdkZhZGVJblRyYW5zaXRpb24sIG5nYk5hdkZhZGVPdXRUcmFuc2l0aW9uIH0gZnJvbSAnLi9uYXYtdHJhbnNpdGlvbic7XG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uLCBOZ2JUcmFuc2l0aW9uT3B0aW9ucyB9IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7IE5nYk5hdiwgTmdiTmF2SXRlbSB9IGZyb20gJy4vbmF2JztcbmltcG9ydCB7IE5nRm9yLCBOZ0lmLCBOZ1RlbXBsYXRlT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG5cdHNlbGVjdG9yOiAnW25nYk5hdlBhbmVdJyxcblx0c3RhbmRhbG9uZTogdHJ1ZSxcblx0aG9zdDoge1xuXHRcdCdbaWRdJzogJ2l0ZW0ucGFuZWxEb21JZCcsXG5cdFx0Y2xhc3M6ICd0YWItcGFuZScsXG5cdFx0J1tjbGFzcy5mYWRlXSc6ICduYXYuYW5pbWF0aW9uJyxcblx0XHQnW2F0dHIucm9sZV0nOiAncm9sZSA/IHJvbGUgOiBuYXYucm9sZXMgPyBcInRhYnBhbmVsXCIgOiB1bmRlZmluZWQnLFxuXHRcdCdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2l0ZW0uZG9tSWQnLFxuXHR9LFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZQYW5lIHtcblx0QElucHV0KCkgaXRlbTogTmdiTmF2SXRlbTtcblx0QElucHV0KCkgbmF2OiBOZ2JOYXY7XG5cdEBJbnB1dCgpIHJvbGU6IHN0cmluZztcblxuXHRjb25zdHJ1Y3RvcihwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxufVxuXG4vKipcbiAqIFRoZSBvdXRsZXQgd2hlcmUgY3VycmVudGx5IGFjdGl2ZSBuYXYgY29udGVudCB3aWxsIGJlIGRpc3BsYXllZC5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnW25nYk5hdk91dGxldF0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRpbXBvcnRzOiBbTmdiTmF2UGFuZSwgTmdGb3IsIE5nSWYsIE5nVGVtcGxhdGVPdXRsZXRdLFxuXHRob3N0OiB7ICdbY2xhc3MudGFiLWNvbnRlbnRdJzogJ3RydWUnIH0sXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHR0ZW1wbGF0ZTogYFxuXHRcdDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtaXRlbSBbbmdGb3JPZl09XCJuYXYuaXRlbXNcIj5cblx0XHRcdDxkaXZcblx0XHRcdFx0bmdiTmF2UGFuZVxuXHRcdFx0XHQqbmdJZj1cIml0ZW0uaXNQYW5lbEluRG9tKCkgfHwgaXNQYW5lbFRyYW5zaXRpb25pbmcoaXRlbSlcIlxuXHRcdFx0XHRbaXRlbV09XCJpdGVtXCJcblx0XHRcdFx0W25hdl09XCJuYXZcIlxuXHRcdFx0XHRbcm9sZV09XCJwYW5lUm9sZVwiXG5cdFx0XHQ+XG5cdFx0XHRcdDxuZy10ZW1wbGF0ZVxuXHRcdFx0XHRcdFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0uY29udGVudFRwbD8udGVtcGxhdGVSZWYgfHwgbnVsbFwiXG5cdFx0XHRcdFx0W25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBpdGVtLmFjdGl2ZSB8fCBpc1BhbmVsVHJhbnNpdGlvbmluZyhpdGVtKSB9XCJcblx0XHRcdFx0PjwvbmctdGVtcGxhdGU+XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L25nLXRlbXBsYXRlPlxuXHRgLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZPdXRsZXQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblx0cHJpdmF0ZSBfYWN0aXZlUGFuZTogTmdiTmF2UGFuZSB8IG51bGwgPSBudWxsO1xuXG5cdEBWaWV3Q2hpbGRyZW4oTmdiTmF2UGFuZSkgcHJpdmF0ZSBfcGFuZXM6IFF1ZXJ5TGlzdDxOZ2JOYXZQYW5lPjtcblxuXHQvKipcblx0ICogQSByb2xlIHRvIHNldCBvbiB0aGUgbmF2IHBhbmVcblx0ICovXG5cdEBJbnB1dCgpIHBhbmVSb2xlO1xuXG5cdC8qKlxuXHQgKiBSZWZlcmVuY2UgdG8gdGhlIGBOZ2JOYXZgXG5cdCAqL1xuXHRASW5wdXQoJ25nYk5hdk91dGxldCcpIG5hdjogTmdiTmF2O1xuXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cblx0aXNQYW5lbFRyYW5zaXRpb25pbmcoaXRlbTogTmdiTmF2SXRlbSkge1xuXHRcdHJldHVybiB0aGlzLl9hY3RpdmVQYW5lPy5pdGVtID09PSBpdGVtO1xuXHR9XG5cblx0bmdBZnRlclZpZXdJbml0KCkge1xuXHRcdC8vIGluaXRpYWwgZGlzcGxheVxuXHRcdHRoaXMuX3VwZGF0ZUFjdGl2ZVBhbmUoKTtcblxuXHRcdC8vIHRoaXMgd2lsbCBiZSBlbWl0dGVkIGZvciBhbGwgMyB0eXBlcyBvZiBuYXYgY2hhbmdlczogLnNlbGVjdCgpLCBbYWN0aXZlSWRdIG9yIChjbGljaylcblx0XHR0aGlzLm5hdi5uYXZJdGVtQ2hhbmdlJFxuXHRcdFx0LnBpcGUodGFrZVVudGlsKHRoaXMubmF2LmRlc3Ryb3kkKSwgc3RhcnRXaXRoKHRoaXMuX2FjdGl2ZVBhbmU/Lml0ZW0gfHwgbnVsbCksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHNraXAoMSkpXG5cdFx0XHQuc3Vic2NyaWJlKChuZXh0SXRlbSkgPT4ge1xuXHRcdFx0XHRjb25zdCBvcHRpb25zOiBOZ2JUcmFuc2l0aW9uT3B0aW9uczx1bmRlZmluZWQ+ID0geyBhbmltYXRpb246IHRoaXMubmF2LmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdzdG9wJyB9O1xuXG5cdFx0XHRcdC8vIG5leHQgcGFuZWwgd2UncmUgc3dpdGNoaW5nIHRvIHdpbGwgb25seSBhcHBlYXIgaW4gRE9NIGFmdGVyIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGlzIGRvbmVcblx0XHRcdFx0Ly8gYW5kIGB0aGlzLl9wYW5lc2Agd2lsbCBiZSB1cGRhdGVkXG5cdFx0XHRcdHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcblxuXHRcdFx0XHQvLyBmYWRpbmcgb3V0XG5cdFx0XHRcdGlmICh0aGlzLl9hY3RpdmVQYW5lKSB7XG5cdFx0XHRcdFx0bmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdFx0XHRcdHRoaXMuX25nWm9uZSxcblx0XHRcdFx0XHRcdHRoaXMuX2FjdGl2ZVBhbmUuZWxSZWYubmF0aXZlRWxlbWVudCxcblx0XHRcdFx0XHRcdG5nYk5hdkZhZGVPdXRUcmFuc2l0aW9uLFxuXHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHQpLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBhY3RpdmVJdGVtID0gdGhpcy5fYWN0aXZlUGFuZT8uaXRlbTtcblx0XHRcdFx0XHRcdHRoaXMuX2FjdGl2ZVBhbmUgPSB0aGlzLl9nZXRQYW5lRm9ySXRlbShuZXh0SXRlbSk7XG5cblx0XHRcdFx0XHRcdC8vIG1hcmsgZm9yIGNoZWNrIHdoZW4gdHJhbnNpdGlvbiBmaW5pc2hlcyBhcyBvdXRsZXQgb3IgcGFyZW50IGNvbnRhaW5lcnMgbWlnaHQgYmUgT25QdXNoXG5cdFx0XHRcdFx0XHQvLyB3aXRob3V0IHRoaXMgdGhlIHBhbmVzIHRoYXQgaGF2ZSBcImZhZGVkIG91dFwiIHdpbGwgc3RheSBpbiBET01cblx0XHRcdFx0XHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHRcdFx0XHQvLyBmYWRpbmcgaW5cblx0XHRcdFx0XHRcdGlmICh0aGlzLl9hY3RpdmVQYW5lKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHdlIGhhdmUgdG8gYWRkIHRoZSAnLmFjdGl2ZScgY2xhc3MgYmVmb3JlIHJ1bm5pbmcgdGhlIHRyYW5zaXRpb24sXG5cdFx0XHRcdFx0XHRcdC8vIGJlY2F1c2UgaXQgc2hvdWxkIGJlIGluIHBsYWNlIGJlZm9yZSBgbmdiUnVuVHJhbnNpdGlvbmAgZG9lcyBgcmVmbG93KClgXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2FjdGl2ZVBhbmUuZWxSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblx0XHRcdFx0XHRcdFx0bmdiUnVuVHJhbnNpdGlvbihcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9uZ1pvbmUsXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWN0aXZlUGFuZS5lbFJlZi5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRcdG5nYk5hdkZhZGVJblRyYW5zaXRpb24sXG5cdFx0XHRcdFx0XHRcdFx0b3B0aW9ucyxcblx0XHRcdFx0XHRcdFx0KS5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChuZXh0SXRlbSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0bmV4dEl0ZW0uc2hvd24uZW1pdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5uYXYuc2hvd24uZW1pdChuZXh0SXRlbS5pZCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGFjdGl2ZUl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0YWN0aXZlSXRlbS5oaWRkZW4uZW1pdCgpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLm5hdi5oaWRkZW4uZW1pdChhY3RpdmVJdGVtLmlkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVBY3RpdmVQYW5lKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBfdXBkYXRlQWN0aXZlUGFuZSgpIHtcblx0XHR0aGlzLl9hY3RpdmVQYW5lID0gdGhpcy5fZ2V0QWN0aXZlUGFuZSgpO1xuXHRcdHRoaXMuX2FjdGl2ZVBhbmU/LmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdHRoaXMuX2FjdGl2ZVBhbmU/LmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRQYW5lRm9ySXRlbShpdGVtOiBOZ2JOYXZJdGVtIHwgbnVsbCkge1xuXHRcdHJldHVybiAodGhpcy5fcGFuZXMgJiYgdGhpcy5fcGFuZXMuZmluZCgocGFuZSkgPT4gcGFuZS5pdGVtID09PSBpdGVtKSkgfHwgbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgX2dldEFjdGl2ZVBhbmUoKTogTmdiTmF2UGFuZSB8IG51bGwge1xuXHRcdHJldHVybiAodGhpcy5fcGFuZXMgJiYgdGhpcy5fcGFuZXMuZmluZCgocGFuZSkgPT4gcGFuZS5pdGVtLmFjdGl2ZSkpIHx8IG51bGw7XG5cdH1cbn1cbiJdfQ==