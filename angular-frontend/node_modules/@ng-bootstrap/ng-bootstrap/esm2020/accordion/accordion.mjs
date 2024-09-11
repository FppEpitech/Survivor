/* eslint-disable deprecation/deprecation */
import { Component, ContentChildren, Directive, EventEmitter, Host, Input, Optional, Output, ViewEncapsulation, Inject, forwardRef, } from '@angular/core';
import { isString } from '../util/util';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import { take } from 'rxjs/operators';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./accordion-config";
let nextId = 0;
/**
 * A directive that wraps an accordion panel header with any HTML markup and a toggling button
 * marked with [`NgbPanelToggle`](#/components/accordion/api#NgbPanelToggle).
 * See the [header customization demo](#/components/accordion/examples#header) for more details.
 *
 * You can also use [`NgbPanelTitle`](#/components/accordion/api#NgbPanelTitle) to customize only the panel title.
 *
 * @since 4.1.0
 * @deprecated 14.1.0
 */
export class NgbPanelHeader {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelHeader, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbPanelHeader, isStandalone: true, selector: "ng-template[ngbPanelHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelHeader, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelHeader]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps only the panel title with HTML markup inside.
 *
 * You can also use [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader) to customize the full panel header.
 *
 * @deprecated 14.1.0
 */
export class NgbPanelTitle {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelTitle, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbPanelTitle, isStandalone: true, selector: "ng-template[ngbPanelTitle]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelTitle, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelTitle]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps the accordion panel content.
 *
 * @deprecated 14.1.0
 */
export class NgbPanelContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelContent, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbPanelContent, isStandalone: true, selector: "ng-template[ngbPanelContent]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelContent]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps an individual accordion panel with title and collapsible content.
 *
 * @deprecated 14.1.0
 */
export class NgbPanel {
    constructor() {
        /**
         *  If `true`, the panel is disabled an can't be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel that must be unique on the page.
         *
         *  If not provided, it will be auto-generated in the `ngb-panel-xxx` format.
         */
        this.id = `ngb-panel-${nextId++}`;
        this.isOpen = false;
        /* A flag to specified that the transition panel classes have been initialized */
        this.initClassDone = false;
        /* A flag to specified if the panel is currently being animated, to ensure its presence in the dom */
        this.transitionRunning = false;
        /**
         * An event emitted when the panel is shown, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the panel is hidden, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
    }
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.headerTpl = this.headerTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbPanel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbPanel, isStandalone: true, selector: "ngb-panel", inputs: { disabled: "disabled", id: "id", title: "title", type: "type", cardClass: "cardClass" }, outputs: { shown: "shown", hidden: "hidden" }, queries: [{ propertyName: "titleTpls", predicate: NgbPanelTitle }, { propertyName: "headerTpls", predicate: NgbPanelHeader }, { propertyName: "contentTpls", predicate: NgbPanelContent }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanel, decorators: [{
            type: Directive,
            args: [{ selector: 'ngb-panel', standalone: true }]
        }], propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], title: [{
                type: Input
            }], type: [{
                type: Input
            }], cardClass: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], titleTpls: [{
                type: ContentChildren,
                args: [NgbPanelTitle, { descendants: false }]
            }], headerTpls: [{
                type: ContentChildren,
                args: [NgbPanelHeader, { descendants: false }]
            }], contentTpls: [{
                type: ContentChildren,
                args: [NgbPanelContent, { descendants: false }]
            }] } });
export class NgbRefDirective {
    constructor(_El) {
        this._El = _El;
        this.ngbRef = new EventEmitter();
    }
    ngOnInit() {
        this.ngbRef.emit(this._El.nativeElement);
    }
    ngOnDestroy() {
        this.ngbRef.emit(null);
    }
}
NgbRefDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbRefDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbRefDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbRefDirective, isStandalone: true, selector: "[ngbRef]", outputs: { ngbRef: "ngbRef" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbRefDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbRef]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ngbRef: [{
                type: Output
            }] } });
/**
 * A directive to put on a button that toggles panel opening and closing.
 *
 * To be used inside the [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader)
 *
 * @since 4.1.0
 * @deprecated 14.1.0
 */
export class NgbPanelToggle {
    constructor(accordion, panel) {
        this.accordion = accordion;
        this.panel = panel;
    }
    set ngbPanelToggle(panel) {
        if (panel) {
            this.panel = panel;
        }
    }
}
NgbPanelToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelToggle, deps: [{ token: forwardRef(() => NgbAccordion) }, { token: NgbPanel, host: true, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbPanelToggle, isStandalone: true, selector: "button[ngbPanelToggle]", inputs: { ngbPanelToggle: "ngbPanelToggle" }, host: { attributes: { "type": "button" }, listeners: { "click": "accordion.toggle(panel.id)" }, properties: { "disabled": "panel.disabled", "class.collapsed": "!panel.isOpen", "attr.aria-expanded": "panel.isOpen", "attr.aria-controls": "panel.id" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbPanelToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbPanelToggle]',
                    standalone: true,
                    host: {
                        type: 'button',
                        '[disabled]': 'panel.disabled',
                        '[class.collapsed]': '!panel.isOpen',
                        '[attr.aria-expanded]': 'panel.isOpen',
                        '[attr.aria-controls]': 'panel.id',
                        '(click)': 'accordion.toggle(panel.id)',
                    },
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordion, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbAccordion)]
                }] }, { type: NgbPanel, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }] }]; }, propDecorators: { ngbPanelToggle: [{
                type: Input
            }] } });
/**
 * Accordion is a collection of collapsible panels (bootstrap cards).
 *
 * It can ensure only one panel is opened at a time and allows to customize panel
 * headers.
 *
 * @deprecated 14.1.0
 */
export class NgbAccordion {
    constructor(config, _ngZone, _changeDetector) {
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        /**
         * An array or comma separated strings of panel ids that should be opened **initially**.
         *
         * For subsequent changes use methods like `expand()`, `collapse()`, etc. and
         * the `(panelChange)` event.
         */
        this.activeIds = [];
        /**
         * If `true`, panel content will be detached from DOM and not simply hidden when the panel is collapsed.
         */
        this.destroyOnHide = true;
        /**
         * Event emitted right before the panel toggle happens.
         *
         * See [NgbPanelChangeEvent](#/components/accordion/api#NgbPanelChangeEvent) for payload details.
         */
        this.panelChange = new EventEmitter();
        /**
         * An event emitted when the expanding animation is finished on the panel. The payload is the panel id.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapsing animation is finished on the panel, and before the panel element is removed.
         * The payload is the panel id.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Checks if a panel with a given id is expanded.
     */
    isExpanded(panelId) {
        return this.activeIds.indexOf(panelId) > -1;
    }
    /**
     * Expands a panel with a given id.
     *
     * Has no effect if the panel is already expanded or disabled.
     */
    expand(panelId) {
        this._changeOpenState(this._findPanelById(panelId), true);
    }
    /**
     * Expands all panels, if `[closeOthers]` is `false`.
     *
     * If `[closeOthers]` is `true`, it will expand the first panel, unless there is already a panel opened.
     */
    expandAll() {
        if (this.closeOtherPanels) {
            if (this.activeIds.length === 0 && this.panels.length) {
                this._changeOpenState(this.panels.first, true);
            }
        }
        else {
            this.panels.forEach((panel) => this._changeOpenState(panel, true));
        }
    }
    /**
     * Collapses a panel with the given id.
     *
     * Has no effect if the panel is already collapsed or disabled.
     */
    collapse(panelId) {
        this._changeOpenState(this._findPanelById(panelId), false);
    }
    /**
     * Collapses all opened panels.
     */
    collapseAll() {
        this.panels.forEach((panel) => {
            this._changeOpenState(panel, false);
        });
    }
    /**
     * Toggles a panel with the given id.
     *
     * Has no effect if the panel is disabled.
     */
    toggle(panelId) {
        const panel = this._findPanelById(panelId);
        if (panel) {
            this._changeOpenState(panel, !panel.isOpen);
        }
    }
    ngAfterContentChecked() {
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        // update panels open states
        this.panels.forEach((panel) => {
            panel.isOpen = !panel.disabled && this.activeIds.indexOf(panel.id) > -1;
        });
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0], false);
            this._updateActiveIds();
        }
        // Setup the initial classes here
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.panels.forEach((panel) => {
                const panelElement = panel.panelDiv;
                if (panelElement) {
                    if (!panel.initClassDone) {
                        panel.initClassDone = true;
                        ngbRunTransition(this._ngZone, panelElement, ngbCollapsingTransition, {
                            animation: false,
                            runningTransition: 'continue',
                            context: { direction: panel.isOpen ? 'show' : 'hide', dimension: 'height' },
                        });
                    }
                }
                else {
                    // Classes must be initialized next time it will be in the dom
                    panel.initClassDone = false;
                }
            });
        });
    }
    _changeOpenState(panel, nextState) {
        if (panel != null && !panel.disabled && panel.isOpen !== nextState) {
            let defaultPrevented = false;
            this.panelChange.emit({
                panelId: panel.id,
                nextState: nextState,
                preventDefault: () => {
                    defaultPrevented = true;
                },
            });
            if (!defaultPrevented) {
                panel.isOpen = nextState;
                panel.transitionRunning = true;
                if (nextState && this.closeOtherPanels) {
                    this._closeOthers(panel.id);
                }
                this._updateActiveIds();
                this._runTransitions(this.animation);
            }
        }
    }
    _closeOthers(panelId, enableTransition = true) {
        this.panels.forEach((panel) => {
            if (panel.id !== panelId && panel.isOpen) {
                panel.isOpen = false;
                panel.transitionRunning = enableTransition;
            }
        });
    }
    _findPanelById(panelId) {
        return this.panels.find((p) => p.id === panelId) || null;
    }
    _updateActiveIds() {
        this.activeIds = this.panels.filter((panel) => panel.isOpen && !panel.disabled).map((panel) => panel.id);
    }
    _runTransitions(animation) {
        // detectChanges is performed to ensure that all panels are in the dom (via transitionRunning = true)
        // before starting the animation
        this._changeDetector.detectChanges();
        this.panels.forEach((panel) => {
            // When panel.transitionRunning is true, the transition needs to be started OR reversed,
            // The direction (show or hide) is choosen by each panel.isOpen state
            if (panel.transitionRunning) {
                const panelElement = panel.panelDiv;
                ngbRunTransition(this._ngZone, panelElement, ngbCollapsingTransition, {
                    animation,
                    runningTransition: 'stop',
                    context: { direction: panel.isOpen ? 'show' : 'hide', dimension: 'height' },
                }).subscribe(() => {
                    panel.transitionRunning = false;
                    const { id } = panel;
                    if (panel.isOpen) {
                        panel.shown.emit();
                        this.shown.emit(id);
                    }
                    else {
                        panel.hidden.emit();
                        this.hidden.emit(id);
                    }
                });
            }
        });
    }
}
NgbAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordion, deps: [{ token: i1.NgbAccordionConfig }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
NgbAccordion.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbAccordion, isStandalone: true, selector: "ngb-accordion", inputs: { animation: "animation", activeIds: "activeIds", closeOtherPanels: ["closeOthers", "closeOtherPanels"], destroyOnHide: "destroyOnHide", type: "type" }, outputs: { panelChange: "panelChange", shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "tablist" }, properties: { "attr.aria-multiselectable": "!closeOtherPanels" }, classAttribute: "accordion" }, queries: [{ propertyName: "panels", predicate: NgbPanel }], exportAs: ["ngbAccordion"], ngImport: i0, template: `
		<ng-template #t ngbPanelHeader let-panel>
			<button class="accordion-button" [ngbPanelToggle]="panel">
				{{ panel.title }}
				<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
			</button>
		</ng-template>
		<ng-template ngFor let-panel [ngForOf]="panels">
			<div [class]="'accordion-item ' + (panel.cardClass || '')">
				<div
					role="tab"
					id="{{ panel.id }}-header"
					[class]="'accordion-header ' + (panel.type ? 'bg-' + panel.type : type ? 'bg-' + type : '')"
				>
					<ng-template
						[ngTemplateOutlet]="panel.headerTpl?.templateRef || t"
						[ngTemplateOutletContext]="{ $implicit: panel, opened: panel.isOpen }"
					></ng-template>
				</div>
				<div
					id="{{ panel.id }}"
					(ngbRef)="panel.panelDiv = $event"
					role="tabpanel"
					[attr.aria-labelledby]="panel.id + '-header'"
					*ngIf="!destroyOnHide || panel.isOpen || panel.transitionRunning"
				>
					<div class="accordion-body">
						<ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef || null"></ng-template>
					</div>
				</div>
			</div>
		</ng-template>
	`, isInline: true, dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgbPanelToggle, selector: "button[ngbPanelToggle]", inputs: ["ngbPanelToggle"] }, { kind: "directive", type: NgbRefDirective, selector: "[ngbRef]", outputs: ["ngbRef"] }, { kind: "directive", type: NgbPanelHeader, selector: "ng-template[ngbPanelHeader]" }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbAccordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-accordion',
                    exportAs: 'ngbAccordion',
                    standalone: true,
                    imports: [NgFor, NgTemplateOutlet, NgbPanelToggle, NgbRefDirective, NgbPanelHeader, NgIf],
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'accordion', role: 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                    template: `
		<ng-template #t ngbPanelHeader let-panel>
			<button class="accordion-button" [ngbPanelToggle]="panel">
				{{ panel.title }}
				<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
			</button>
		</ng-template>
		<ng-template ngFor let-panel [ngForOf]="panels">
			<div [class]="'accordion-item ' + (panel.cardClass || '')">
				<div
					role="tab"
					id="{{ panel.id }}-header"
					[class]="'accordion-header ' + (panel.type ? 'bg-' + panel.type : type ? 'bg-' + type : '')"
				>
					<ng-template
						[ngTemplateOutlet]="panel.headerTpl?.templateRef || t"
						[ngTemplateOutletContext]="{ $implicit: panel, opened: panel.isOpen }"
					></ng-template>
				</div>
				<div
					id="{{ panel.id }}"
					(ngbRef)="panel.panelDiv = $event"
					role="tabpanel"
					[attr.aria-labelledby]="panel.id + '-header'"
					*ngIf="!destroyOnHide || panel.isOpen || panel.transitionRunning"
				>
					<div class="accordion-body">
						<ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef || null"></ng-template>
					</div>
				</div>
			</div>
		</ng-template>
	`,
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbAccordionConfig }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { panels: [{
                type: ContentChildren,
                args: [NgbPanel]
            }], animation: [{
                type: Input
            }], activeIds: [{
                type: Input
            }], closeOtherPanels: [{
                type: Input,
                args: ['closeOthers']
            }], destroyOnHide: [{
                type: Input
            }], type: [{
                type: Input
            }], panelChange: [{
                type: Output
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FjY29yZGlvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNENBQTRDO0FBQzVDLE9BQU8sRUFHTixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFFVCxZQUFZLEVBQ1osSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUdOLGlCQUFpQixFQUlqQixNQUFNLEVBQ04sVUFBVSxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHeEMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDbkYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQUVoRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFlZjs7Ozs7Ozs7O0dBU0c7QUFFSCxNQUFNLE9BQU8sY0FBYztJQUMxQixZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7SUFBRyxDQUFDOzsyR0FEeEMsY0FBYzsrRkFBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsNkJBQTZCLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTs7QUFLeEU7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFDekIsWUFBbUIsV0FBNkI7UUFBN0IsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO0lBQUcsQ0FBQzs7MEdBRHhDLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixTQUFTO21CQUFDLEVBQUUs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O3FCQUNyQjtnQkFDRixDQUFDLENBQUMsQ0FBQzthQUNIO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDOzt5R0ExT1csWUFBWTs2RkFBWixZQUFZLHdkQUNQLFFBQVEseURBbkNmOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWdDVCw0REFuQ1MsS0FBSyxtSEFBRSxnQkFBZ0Isb0pBNUJyQixjQUFjLCtGQWpDZCxlQUFlLDBFQXRJZixjQUFjLHdFQW1NMEQsSUFBSTsyRkFxQzVFLFlBQVk7a0JBekN4QixTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsY0FBYztvQkFDeEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUM7b0JBQ3pGLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsNkJBQTZCLEVBQUUsbUJBQW1CLEVBQUU7b0JBQ2pHLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQ1Q7aUJBQ0Q7OEpBRTJCLE1BQU07c0JBQWhDLGVBQWU7dUJBQUMsUUFBUTtnQkFPaEIsU0FBUztzQkFBakIsS0FBSztnQkFRRyxTQUFTO3NCQUFqQixLQUFLO2dCQU9nQixnQkFBZ0I7c0JBQXJDLEtBQUs7dUJBQUMsYUFBYTtnQkFLWCxhQUFhO3NCQUFyQixLQUFLO2dCQVFHLElBQUk7c0JBQVosS0FBSztnQkFPSSxXQUFXO3NCQUFwQixNQUFNO2dCQU9HLEtBQUs7c0JBQWQsTUFBTTtnQkFRRyxNQUFNO3NCQUFmLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50Q2hlY2tlZCxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdENvbXBvbmVudCxcblx0Q29udGVudENoaWxkcmVuLFxuXHREaXJlY3RpdmUsXG5cdEVsZW1lbnRSZWYsXG5cdEV2ZW50RW1pdHRlcixcblx0SG9zdCxcblx0SW5wdXQsXG5cdE9wdGlvbmFsLFxuXHRPdXRwdXQsXG5cdFF1ZXJ5TGlzdCxcblx0VGVtcGxhdGVSZWYsXG5cdFZpZXdFbmNhcHN1bGF0aW9uLFxuXHROZ1pvbmUsXG5cdE9uSW5pdCxcblx0T25EZXN0cm95LFxuXHRJbmplY3QsXG5cdGZvcndhcmRSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IE5nYkFjY29yZGlvbkNvbmZpZyB9IGZyb20gJy4vYWNjb3JkaW9uLWNvbmZpZyc7XG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgbmdiQ29sbGFwc2luZ1RyYW5zaXRpb24gfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiQ29sbGFwc2VUcmFuc2l0aW9uJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOZ0ZvciwgTmdJZiwgTmdUZW1wbGF0ZU91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIFRoZSBjb250ZXh0IGZvciB0aGUgW05nYlBhbmVsSGVhZGVyXSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FwaSNOZ2JQYW5lbEhlYWRlcikgdGVtcGxhdGVcbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqIEBkZXByZWNhdGVkIDE0LjEuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhbmVsSGVhZGVyQ29udGV4dCB7XG5cdC8qKlxuXHQgKiBgVHJ1ZWAgaWYgY3VycmVudCBwYW5lbCBpcyBvcGVuZWRcblx0ICovXG5cdG9wZW5lZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIGFuIGFjY29yZGlvbiBwYW5lbCBoZWFkZXIgd2l0aCBhbnkgSFRNTCBtYXJrdXAgYW5kIGEgdG9nZ2xpbmcgYnV0dG9uXG4gKiBtYXJrZWQgd2l0aCBbYE5nYlBhbmVsVG9nZ2xlYF0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiUGFuZWxUb2dnbGUpLlxuICogU2VlIHRoZSBbaGVhZGVyIGN1c3RvbWl6YXRpb24gZGVtb10oIy9jb21wb25lbnRzL2FjY29yZGlvbi9leGFtcGxlcyNoZWFkZXIpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSBbYE5nYlBhbmVsVGl0bGVgXSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FwaSNOZ2JQYW5lbFRpdGxlKSB0byBjdXN0b21pemUgb25seSB0aGUgcGFuZWwgdGl0bGUuXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKiBAZGVwcmVjYXRlZCAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFuZWxIZWFkZXJdJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsSGVhZGVyIHtcblx0Y29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgb25seSB0aGUgcGFuZWwgdGl0bGUgd2l0aCBIVE1MIG1hcmt1cCBpbnNpZGUuXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSBbYE5nYlBhbmVsSGVhZGVyYF0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiUGFuZWxIZWFkZXIpIHRvIGN1c3RvbWl6ZSB0aGUgZnVsbCBwYW5lbCBoZWFkZXIuXG4gKlxuICogQGRlcHJlY2F0ZWQgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhbmVsVGl0bGVdJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsVGl0bGUge1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyB0aGUgYWNjb3JkaW9uIHBhbmVsIGNvbnRlbnQuXG4gKlxuICogQGRlcHJlY2F0ZWQgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhbmVsQ29udGVudF0nLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgTmdiUGFuZWxDb250ZW50IHtcblx0Y29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgYW4gaW5kaXZpZHVhbCBhY2NvcmRpb24gcGFuZWwgd2l0aCB0aXRsZSBhbmQgY29sbGFwc2libGUgY29udGVudC5cbiAqXG4gKiBAZGVwcmVjYXRlZCAxNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmdiLXBhbmVsJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG5cdC8qKlxuXHQgKiAgSWYgYHRydWVgLCB0aGUgcGFuZWwgaXMgZGlzYWJsZWQgYW4gY2FuJ3QgYmUgdG9nZ2xlZC5cblx0ICovXG5cdEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cblx0LyoqXG5cdCAqICBBbiBvcHRpb25hbCBpZCBmb3IgdGhlIHBhbmVsIHRoYXQgbXVzdCBiZSB1bmlxdWUgb24gdGhlIHBhZ2UuXG5cdCAqXG5cdCAqICBJZiBub3QgcHJvdmlkZWQsIGl0IHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQgaW4gdGhlIGBuZ2ItcGFuZWwteHh4YCBmb3JtYXQuXG5cdCAqL1xuXHRASW5wdXQoKSBpZCA9IGBuZ2ItcGFuZWwtJHtuZXh0SWQrK31gO1xuXG5cdGlzT3BlbiA9IGZhbHNlO1xuXG5cdC8qIEEgZmxhZyB0byBzcGVjaWZpZWQgdGhhdCB0aGUgdHJhbnNpdGlvbiBwYW5lbCBjbGFzc2VzIGhhdmUgYmVlbiBpbml0aWFsaXplZCAqL1xuXHRpbml0Q2xhc3NEb25lID0gZmFsc2U7XG5cblx0LyogQSBmbGFnIHRvIHNwZWNpZmllZCBpZiB0aGUgcGFuZWwgaXMgY3VycmVudGx5IGJlaW5nIGFuaW1hdGVkLCB0byBlbnN1cmUgaXRzIHByZXNlbmNlIGluIHRoZSBkb20gKi9cblx0dHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcblxuXHQvKipcblx0ICogIFRoZSBwYW5lbCB0aXRsZS5cblx0ICpcblx0ICogIFlvdSBjYW4gYWx0ZXJuYXRpdmVseSB1c2UgW2BOZ2JQYW5lbFRpdGxlYF0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiUGFuZWxUaXRsZSkgdG8gc2V0IHBhbmVsIHRpdGxlLlxuXHQgKi9cblx0QElucHV0KCkgdGl0bGU6IHN0cmluZztcblxuXHQvKipcblx0ICogVHlwZSBvZiB0aGUgY3VycmVudCBwYW5lbC5cblx0ICpcblx0ICogQm9vdHN0cmFwIHByb3ZpZGVzIHN0eWxlcyBmb3IgdGhlIGZvbGxvd2luZyB0eXBlczogYCdzdWNjZXNzJ2AsIGAnaW5mbydgLCBgJ3dhcm5pbmcnYCwgYCdkYW5nZXInYCwgYCdwcmltYXJ5J2AsXG5cdCAqIGAnc2Vjb25kYXJ5J2AsIGAnbGlnaHQnYCBhbmQgYCdkYXJrJ2AuXG5cdCAqL1xuXHRASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEFuIG9wdGlvbmFsIGNsYXNzIGFwcGxpZWQgdG8gdGhlIGFjY29yZGlvbiBjYXJkIGVsZW1lbnQgdGhhdCB3cmFwcyBib3RoIHBhbmVsIHRpdGxlIGFuZCBjb250ZW50LlxuXHQgKlxuXHQgKiBAc2luY2UgNS4zLjBcblx0ICovXG5cdEBJbnB1dCgpIGNhcmRDbGFzczogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHBhbmVsIGlzIHNob3duLCBhZnRlciB0aGUgdHJhbnNpdGlvbi4gSXQgaGFzIG5vIHBheWxvYWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHBhbmVsIGlzIGhpZGRlbiwgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uIEl0IGhhcyBubyBwYXlsb2FkLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblx0dGl0bGVUcGw/OiBOZ2JQYW5lbFRpdGxlO1xuXHRoZWFkZXJUcGw/OiBOZ2JQYW5lbEhlYWRlcjtcblx0Y29udGVudFRwbD86IE5nYlBhbmVsQ29udGVudDtcblx0cGFuZWxEaXY6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuXHRAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsVGl0bGUsIHsgZGVzY2VuZGFudHM6IGZhbHNlIH0pIHRpdGxlVHBsczogUXVlcnlMaXN0PE5nYlBhbmVsVGl0bGU+O1xuXHRAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsSGVhZGVyLCB7IGRlc2NlbmRhbnRzOiBmYWxzZSB9KSBoZWFkZXJUcGxzOiBRdWVyeUxpc3Q8TmdiUGFuZWxIZWFkZXI+O1xuXHRAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsQ29udGVudCwgeyBkZXNjZW5kYW50czogZmFsc2UgfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbENvbnRlbnQ+O1xuXG5cdG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcblx0XHQvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250ZW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG5cdFx0Ly8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG5cdFx0Ly8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuXHRcdHRoaXMudGl0bGVUcGwgPSB0aGlzLnRpdGxlVHBscy5maXJzdDtcblx0XHR0aGlzLmhlYWRlclRwbCA9IHRoaXMuaGVhZGVyVHBscy5maXJzdDtcblx0XHR0aGlzLmNvbnRlbnRUcGwgPSB0aGlzLmNvbnRlbnRUcGxzLmZpcnN0O1xuXHR9XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdG9nZ2xpbmcgYW4gYWNjb3JkaW9uIHBhbmVsLlxuICpcbiAqIEBkZXByZWNhdGVkIDE0LjEuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhbmVsQ2hhbmdlRXZlbnQge1xuXHQvKipcblx0ICogVGhlIGlkIG9mIHRoZSBhY2NvcmRpb24gcGFuZWwgYmVpbmcgdG9nZ2xlZC5cblx0ICovXG5cdHBhbmVsSWQ6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIG5leHQgc3RhdGUgb2YgdGhlIHBhbmVsLlxuXHQgKlxuXHQgKiBgdHJ1ZWAgaWYgaXQgd2lsbCBiZSBvcGVuZWQsIGBmYWxzZWAgaWYgY2xvc2VkLlxuXHQgKi9cblx0bmV4dFN0YXRlOiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gd2lsbCBwcmV2ZW50IHBhbmVsIHRvZ2dsaW5nLlxuXHQgKi9cblx0cHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZ2JSZWZdJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlJlZkRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblx0QE91dHB1dCgpIG5nYlJlZiA9IG5ldyBFdmVudEVtaXR0ZXI8SFRNTEVsZW1lbnQgfCBudWxsPigpO1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9FbDogRWxlbWVudFJlZikge31cblxuXHRuZ09uSW5pdCgpIHtcblx0XHR0aGlzLm5nYlJlZi5lbWl0KHRoaXMuX0VsLm5hdGl2ZUVsZW1lbnQpO1xuXHR9XG5cblx0bmdPbkRlc3Ryb3koKSB7XG5cdFx0dGhpcy5uZ2JSZWYuZW1pdChudWxsKTtcblx0fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHB1dCBvbiBhIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgcGFuZWwgb3BlbmluZyBhbmQgY2xvc2luZy5cbiAqXG4gKiBUbyBiZSB1c2VkIGluc2lkZSB0aGUgW2BOZ2JQYW5lbEhlYWRlcmBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYlBhbmVsSGVhZGVyKVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICogQGRlcHJlY2F0ZWQgMTQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuXHRzZWxlY3RvcjogJ2J1dHRvbltuZ2JQYW5lbFRvZ2dsZV0nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRob3N0OiB7XG5cdFx0dHlwZTogJ2J1dHRvbicsXG5cdFx0J1tkaXNhYmxlZF0nOiAncGFuZWwuZGlzYWJsZWQnLFxuXHRcdCdbY2xhc3MuY29sbGFwc2VkXSc6ICchcGFuZWwuaXNPcGVuJyxcblx0XHQnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAncGFuZWwuaXNPcGVuJyxcblx0XHQnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncGFuZWwuaWQnLFxuXHRcdCcoY2xpY2spJzogJ2FjY29yZGlvbi50b2dnbGUocGFuZWwuaWQpJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiUGFuZWxUb2dnbGUge1xuXHRzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbmdiUGFuZWxUb2dnbGU6IE5nYlBhbmVsIHwgJyc7XG5cblx0QElucHV0KClcblx0c2V0IG5nYlBhbmVsVG9nZ2xlKHBhbmVsOiBOZ2JQYW5lbCkge1xuXHRcdGlmIChwYW5lbCkge1xuXHRcdFx0dGhpcy5wYW5lbCA9IHBhbmVsO1xuXHRcdH1cblx0fVxuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JBY2NvcmRpb24pKSBwdWJsaWMgYWNjb3JkaW9uOiBOZ2JBY2NvcmRpb24sXG5cdFx0QE9wdGlvbmFsKCkgQEhvc3QoKSBwdWJsaWMgcGFuZWw6IE5nYlBhbmVsLFxuXHQpIHt9XG59XG5cbi8qKlxuICogQWNjb3JkaW9uIGlzIGEgY29sbGVjdGlvbiBvZiBjb2xsYXBzaWJsZSBwYW5lbHMgKGJvb3RzdHJhcCBjYXJkcykuXG4gKlxuICogSXQgY2FuIGVuc3VyZSBvbmx5IG9uZSBwYW5lbCBpcyBvcGVuZWQgYXQgYSB0aW1lIGFuZCBhbGxvd3MgdG8gY3VzdG9taXplIHBhbmVsXG4gKiBoZWFkZXJzLlxuICpcbiAqIEBkZXByZWNhdGVkIDE0LjEuMFxuICovXG5AQ29tcG9uZW50KHtcblx0c2VsZWN0b3I6ICduZ2ItYWNjb3JkaW9uJyxcblx0ZXhwb3J0QXM6ICduZ2JBY2NvcmRpb24nLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRpbXBvcnRzOiBbTmdGb3IsIE5nVGVtcGxhdGVPdXRsZXQsIE5nYlBhbmVsVG9nZ2xlLCBOZ2JSZWZEaXJlY3RpdmUsIE5nYlBhbmVsSGVhZGVyLCBOZ0lmXSxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0aG9zdDogeyBjbGFzczogJ2FjY29yZGlvbicsIHJvbGU6ICd0YWJsaXN0JywgJ1thdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXSc6ICchY2xvc2VPdGhlclBhbmVscycgfSxcblx0dGVtcGxhdGU6IGBcblx0XHQ8bmctdGVtcGxhdGUgI3QgbmdiUGFuZWxIZWFkZXIgbGV0LXBhbmVsPlxuXHRcdFx0PGJ1dHRvbiBjbGFzcz1cImFjY29yZGlvbi1idXR0b25cIiBbbmdiUGFuZWxUb2dnbGVdPVwicGFuZWxcIj5cblx0XHRcdFx0e3sgcGFuZWwudGl0bGUgfX1cblx0XHRcdFx0PG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLnRpdGxlVHBsPy50ZW1wbGF0ZVJlZlwiPjwvbmctdGVtcGxhdGU+XG5cdFx0XHQ8L2J1dHRvbj5cblx0XHQ8L25nLXRlbXBsYXRlPlxuXHRcdDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcGFuZWwgW25nRm9yT2ZdPVwicGFuZWxzXCI+XG5cdFx0XHQ8ZGl2IFtjbGFzc109XCInYWNjb3JkaW9uLWl0ZW0gJyArIChwYW5lbC5jYXJkQ2xhc3MgfHwgJycpXCI+XG5cdFx0XHRcdDxkaXZcblx0XHRcdFx0XHRyb2xlPVwidGFiXCJcblx0XHRcdFx0XHRpZD1cInt7IHBhbmVsLmlkIH19LWhlYWRlclwiXG5cdFx0XHRcdFx0W2NsYXNzXT1cIidhY2NvcmRpb24taGVhZGVyICcgKyAocGFuZWwudHlwZSA/ICdiZy0nICsgcGFuZWwudHlwZSA6IHR5cGUgPyAnYmctJyArIHR5cGUgOiAnJylcIlxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PG5nLXRlbXBsYXRlXG5cdFx0XHRcdFx0XHRbbmdUZW1wbGF0ZU91dGxldF09XCJwYW5lbC5oZWFkZXJUcGw/LnRlbXBsYXRlUmVmIHx8IHRcIlxuXHRcdFx0XHRcdFx0W25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBwYW5lbCwgb3BlbmVkOiBwYW5lbC5pc09wZW4gfVwiXG5cdFx0XHRcdFx0PjwvbmctdGVtcGxhdGU+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0aWQ9XCJ7eyBwYW5lbC5pZCB9fVwiXG5cdFx0XHRcdFx0KG5nYlJlZik9XCJwYW5lbC5wYW5lbERpdiA9ICRldmVudFwiXG5cdFx0XHRcdFx0cm9sZT1cInRhYnBhbmVsXCJcblx0XHRcdFx0XHRbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwicGFuZWwuaWQgKyAnLWhlYWRlcidcIlxuXHRcdFx0XHRcdCpuZ0lmPVwiIWRlc3Ryb3lPbkhpZGUgfHwgcGFuZWwuaXNPcGVuIHx8IHBhbmVsLnRyYW5zaXRpb25SdW5uaW5nXCJcblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tYm9keVwiPlxuXHRcdFx0XHRcdFx0PG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmIHx8IG51bGxcIj48L25nLXRlbXBsYXRlPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdDwvbmctdGVtcGxhdGU+XG5cdGAsXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuXHRAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsKSBwYW5lbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbD47XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgYWNjb3JkaW9uIHdpbGwgYmUgYW5pbWF0ZWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QElucHV0KCkgYW5pbWF0aW9uO1xuXG5cdC8qKlxuXHQgKiBBbiBhcnJheSBvciBjb21tYSBzZXBhcmF0ZWQgc3RyaW5ncyBvZiBwYW5lbCBpZHMgdGhhdCBzaG91bGQgYmUgb3BlbmVkICoqaW5pdGlhbGx5KiouXG5cdCAqXG5cdCAqIEZvciBzdWJzZXF1ZW50IGNoYW5nZXMgdXNlIG1ldGhvZHMgbGlrZSBgZXhwYW5kKClgLCBgY29sbGFwc2UoKWAsIGV0Yy4gYW5kXG5cdCAqIHRoZSBgKHBhbmVsQ2hhbmdlKWAgZXZlbnQuXG5cdCAqL1xuXHRASW5wdXQoKSBhY3RpdmVJZHM6IHN0cmluZyB8IHJlYWRvbmx5IHN0cmluZ1tdID0gW107XG5cblx0LyoqXG5cdCAqICBJZiBgdHJ1ZWAsIG9ubHkgb25lIHBhbmVsIGNvdWxkIGJlIG9wZW5lZCBhdCBhIHRpbWUuXG5cdCAqXG5cdCAqICBPcGVuaW5nIGEgbmV3IHBhbmVsIHdpbGwgY2xvc2Ugb3RoZXJzLlxuXHQgKi9cblx0QElucHV0KCdjbG9zZU90aGVycycpIGNsb3NlT3RoZXJQYW5lbHM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgcGFuZWwgY29udGVudCB3aWxsIGJlIGRldGFjaGVkIGZyb20gRE9NIGFuZCBub3Qgc2ltcGx5IGhpZGRlbiB3aGVuIHRoZSBwYW5lbCBpcyBjb2xsYXBzZWQuXG5cdCAqL1xuXHRASW5wdXQoKSBkZXN0cm95T25IaWRlID0gdHJ1ZTtcblxuXHQvKipcblx0ICogVHlwZSBvZiBwYW5lbHMuXG5cdCAqXG5cdCAqIEJvb3RzdHJhcCBwcm92aWRlcyBzdHlsZXMgZm9yIHRoZSBmb2xsb3dpbmcgdHlwZXM6IGAnc3VjY2VzcydgLCBgJ2luZm8nYCwgYCd3YXJuaW5nJ2AsIGAnZGFuZ2VyJ2AsIGAncHJpbWFyeSdgLFxuXHQgKiBgJ3NlY29uZGFyeSdgLCBgJ2xpZ2h0J2AgYW5kIGAnZGFyaydgLlxuXHQgKi9cblx0QElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBFdmVudCBlbWl0dGVkIHJpZ2h0IGJlZm9yZSB0aGUgcGFuZWwgdG9nZ2xlIGhhcHBlbnMuXG5cdCAqXG5cdCAqIFNlZSBbTmdiUGFuZWxDaGFuZ2VFdmVudF0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiUGFuZWxDaGFuZ2VFdmVudCkgZm9yIHBheWxvYWQgZGV0YWlscy5cblx0ICovXG5cdEBPdXRwdXQoKSBwYW5lbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiUGFuZWxDaGFuZ2VFdmVudD4oKTtcblxuXHQvKipcblx0ICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBleHBhbmRpbmcgYW5pbWF0aW9uIGlzIGZpbmlzaGVkIG9uIHRoZSBwYW5lbC4gVGhlIHBheWxvYWQgaXMgdGhlIHBhbmVsIGlkLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbGxhcHNpbmcgYW5pbWF0aW9uIGlzIGZpbmlzaGVkIG9uIHRoZSBwYW5lbCwgYW5kIGJlZm9yZSB0aGUgcGFuZWwgZWxlbWVudCBpcyByZW1vdmVkLlxuXHQgKiBUaGUgcGF5bG9hZCBpcyB0aGUgcGFuZWwgaWQuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0QE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG5cdGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiQWNjb3JkaW9uQ29uZmlnLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmKSB7XG5cdFx0dGhpcy5hbmltYXRpb24gPSBjb25maWcuYW5pbWF0aW9uO1xuXHRcdHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuXHRcdHRoaXMuY2xvc2VPdGhlclBhbmVscyA9IGNvbmZpZy5jbG9zZU90aGVycztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYSBwYW5lbCB3aXRoIGEgZ2l2ZW4gaWQgaXMgZXhwYW5kZWQuXG5cdCAqL1xuXHRpc0V4cGFuZGVkKHBhbmVsSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsSWQpID4gLTE7XG5cdH1cblxuXHQvKipcblx0ICogRXhwYW5kcyBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZC5cblx0ICpcblx0ICogSGFzIG5vIGVmZmVjdCBpZiB0aGUgcGFuZWwgaXMgYWxyZWFkeSBleHBhbmRlZCBvciBkaXNhYmxlZC5cblx0ICovXG5cdGV4cGFuZChwYW5lbElkOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLl9jaGFuZ2VPcGVuU3RhdGUodGhpcy5fZmluZFBhbmVsQnlJZChwYW5lbElkKSwgdHJ1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogRXhwYW5kcyBhbGwgcGFuZWxzLCBpZiBgW2Nsb3NlT3RoZXJzXWAgaXMgYGZhbHNlYC5cblx0ICpcblx0ICogSWYgYFtjbG9zZU90aGVyc11gIGlzIGB0cnVlYCwgaXQgd2lsbCBleHBhbmQgdGhlIGZpcnN0IHBhbmVsLCB1bmxlc3MgdGhlcmUgaXMgYWxyZWFkeSBhIHBhbmVsIG9wZW5lZC5cblx0ICovXG5cdGV4cGFuZEFsbCgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5jbG9zZU90aGVyUGFuZWxzKSB7XG5cdFx0XHRpZiAodGhpcy5hY3RpdmVJZHMubGVuZ3RoID09PSAwICYmIHRoaXMucGFuZWxzLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLl9jaGFuZ2VPcGVuU3RhdGUodGhpcy5wYW5lbHMuZmlyc3QsIHRydWUpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4gdGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCB0cnVlKSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbGxhcHNlcyBhIHBhbmVsIHdpdGggdGhlIGdpdmVuIGlkLlxuXHQgKlxuXHQgKiBIYXMgbm8gZWZmZWN0IGlmIHRoZSBwYW5lbCBpcyBhbHJlYWR5IGNvbGxhcHNlZCBvciBkaXNhYmxlZC5cblx0ICovXG5cdGNvbGxhcHNlKHBhbmVsSWQ6IHN0cmluZykge1xuXHRcdHRoaXMuX2NoYW5nZU9wZW5TdGF0ZSh0aGlzLl9maW5kUGFuZWxCeUlkKHBhbmVsSWQpLCBmYWxzZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29sbGFwc2VzIGFsbCBvcGVuZWQgcGFuZWxzLlxuXHQgKi9cblx0Y29sbGFwc2VBbGwoKSB7XG5cdFx0dGhpcy5wYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHtcblx0XHRcdHRoaXMuX2NoYW5nZU9wZW5TdGF0ZShwYW5lbCwgZmFsc2UpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgYSBwYW5lbCB3aXRoIHRoZSBnaXZlbiBpZC5cblx0ICpcblx0ICogSGFzIG5vIGVmZmVjdCBpZiB0aGUgcGFuZWwgaXMgZGlzYWJsZWQuXG5cdCAqL1xuXHR0b2dnbGUocGFuZWxJZDogc3RyaW5nKSB7XG5cdFx0Y29uc3QgcGFuZWwgPSB0aGlzLl9maW5kUGFuZWxCeUlkKHBhbmVsSWQpO1xuXHRcdGlmIChwYW5lbCkge1xuXHRcdFx0dGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCAhcGFuZWwuaXNPcGVuKTtcblx0XHR9XG5cdH1cblxuXHRuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG5cdFx0Ly8gYWN0aXZlIGlkIHVwZGF0ZXNcblx0XHRpZiAoaXNTdHJpbmcodGhpcy5hY3RpdmVJZHMpKSB7XG5cdFx0XHR0aGlzLmFjdGl2ZUlkcyA9IHRoaXMuYWN0aXZlSWRzLnNwbGl0KC9cXHMqLFxccyovKTtcblx0XHR9XG5cblx0XHQvLyB1cGRhdGUgcGFuZWxzIG9wZW4gc3RhdGVzXG5cdFx0dGhpcy5wYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHtcblx0XHRcdHBhbmVsLmlzT3BlbiA9ICFwYW5lbC5kaXNhYmxlZCAmJiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsLmlkKSA+IC0xO1xuXHRcdH0pO1xuXG5cdFx0Ly8gY2xvc2VPdGhlcnMgdXBkYXRlc1xuXHRcdGlmICh0aGlzLmFjdGl2ZUlkcy5sZW5ndGggPiAxICYmIHRoaXMuY2xvc2VPdGhlclBhbmVscykge1xuXHRcdFx0dGhpcy5fY2xvc2VPdGhlcnModGhpcy5hY3RpdmVJZHNbMF0sIGZhbHNlKTtcblx0XHRcdHRoaXMuX3VwZGF0ZUFjdGl2ZUlkcygpO1xuXHRcdH1cblxuXHRcdC8vIFNldHVwIHRoZSBpbml0aWFsIGNsYXNzZXMgaGVyZVxuXHRcdHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHR0aGlzLnBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuXHRcdFx0XHRjb25zdCBwYW5lbEVsZW1lbnQgPSBwYW5lbC5wYW5lbERpdjtcblx0XHRcdFx0aWYgKHBhbmVsRWxlbWVudCkge1xuXHRcdFx0XHRcdGlmICghcGFuZWwuaW5pdENsYXNzRG9uZSkge1xuXHRcdFx0XHRcdFx0cGFuZWwuaW5pdENsYXNzRG9uZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX25nWm9uZSwgcGFuZWxFbGVtZW50LCBuZ2JDb2xsYXBzaW5nVHJhbnNpdGlvbiwge1xuXHRcdFx0XHRcdFx0XHRhbmltYXRpb246IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyxcblx0XHRcdFx0XHRcdFx0Y29udGV4dDogeyBkaXJlY3Rpb246IHBhbmVsLmlzT3BlbiA/ICdzaG93JyA6ICdoaWRlJywgZGltZW5zaW9uOiAnaGVpZ2h0JyB9LFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIENsYXNzZXMgbXVzdCBiZSBpbml0aWFsaXplZCBuZXh0IHRpbWUgaXQgd2lsbCBiZSBpbiB0aGUgZG9tXG5cdFx0XHRcdFx0cGFuZWwuaW5pdENsYXNzRG9uZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2NoYW5nZU9wZW5TdGF0ZShwYW5lbDogTmdiUGFuZWwgfCBudWxsLCBuZXh0U3RhdGU6IGJvb2xlYW4pIHtcblx0XHRpZiAocGFuZWwgIT0gbnVsbCAmJiAhcGFuZWwuZGlzYWJsZWQgJiYgcGFuZWwuaXNPcGVuICE9PSBuZXh0U3RhdGUpIHtcblx0XHRcdGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG5cblx0XHRcdHRoaXMucGFuZWxDaGFuZ2UuZW1pdCh7XG5cdFx0XHRcdHBhbmVsSWQ6IHBhbmVsLmlkLFxuXHRcdFx0XHRuZXh0U3RhdGU6IG5leHRTdGF0ZSxcblx0XHRcdFx0cHJldmVudERlZmF1bHQ6ICgpID0+IHtcblx0XHRcdFx0XHRkZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIWRlZmF1bHRQcmV2ZW50ZWQpIHtcblx0XHRcdFx0cGFuZWwuaXNPcGVuID0gbmV4dFN0YXRlO1xuXHRcdFx0XHRwYW5lbC50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG5cblx0XHRcdFx0aWYgKG5leHRTdGF0ZSAmJiB0aGlzLmNsb3NlT3RoZXJQYW5lbHMpIHtcblx0XHRcdFx0XHR0aGlzLl9jbG9zZU90aGVycyhwYW5lbC5pZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fdXBkYXRlQWN0aXZlSWRzKCk7XG5cdFx0XHRcdHRoaXMuX3J1blRyYW5zaXRpb25zKHRoaXMuYW5pbWF0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIF9jbG9zZU90aGVycyhwYW5lbElkOiBzdHJpbmcsIGVuYWJsZVRyYW5zaXRpb24gPSB0cnVlKSB7XG5cdFx0dGhpcy5wYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHtcblx0XHRcdGlmIChwYW5lbC5pZCAhPT0gcGFuZWxJZCAmJiBwYW5lbC5pc09wZW4pIHtcblx0XHRcdFx0cGFuZWwuaXNPcGVuID0gZmFsc2U7XG5cdFx0XHRcdHBhbmVsLnRyYW5zaXRpb25SdW5uaW5nID0gZW5hYmxlVHJhbnNpdGlvbjtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2ZpbmRQYW5lbEJ5SWQocGFuZWxJZDogc3RyaW5nKTogTmdiUGFuZWwgfCBudWxsIHtcblx0XHRyZXR1cm4gdGhpcy5wYW5lbHMuZmluZCgocCkgPT4gcC5pZCA9PT0gcGFuZWxJZCkgfHwgbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZUFjdGl2ZUlkcygpIHtcblx0XHR0aGlzLmFjdGl2ZUlkcyA9IHRoaXMucGFuZWxzLmZpbHRlcigocGFuZWwpID0+IHBhbmVsLmlzT3BlbiAmJiAhcGFuZWwuZGlzYWJsZWQpLm1hcCgocGFuZWwpID0+IHBhbmVsLmlkKTtcblx0fVxuXG5cdHByaXZhdGUgX3J1blRyYW5zaXRpb25zKGFuaW1hdGlvbjogYm9vbGVhbikge1xuXHRcdC8vIGRldGVjdENoYW5nZXMgaXMgcGVyZm9ybWVkIHRvIGVuc3VyZSB0aGF0IGFsbCBwYW5lbHMgYXJlIGluIHRoZSBkb20gKHZpYSB0cmFuc2l0aW9uUnVubmluZyA9IHRydWUpXG5cdFx0Ly8gYmVmb3JlIHN0YXJ0aW5nIHRoZSBhbmltYXRpb25cblx0XHR0aGlzLl9jaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XG5cblx0XHR0aGlzLnBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuXHRcdFx0Ly8gV2hlbiBwYW5lbC50cmFuc2l0aW9uUnVubmluZyBpcyB0cnVlLCB0aGUgdHJhbnNpdGlvbiBuZWVkcyB0byBiZSBzdGFydGVkIE9SIHJldmVyc2VkLFxuXHRcdFx0Ly8gVGhlIGRpcmVjdGlvbiAoc2hvdyBvciBoaWRlKSBpcyBjaG9vc2VuIGJ5IGVhY2ggcGFuZWwuaXNPcGVuIHN0YXRlXG5cdFx0XHRpZiAocGFuZWwudHJhbnNpdGlvblJ1bm5pbmcpIHtcblx0XHRcdFx0Y29uc3QgcGFuZWxFbGVtZW50ID0gcGFuZWwucGFuZWxEaXY7XG5cdFx0XHRcdG5nYlJ1blRyYW5zaXRpb24odGhpcy5fbmdab25lLCBwYW5lbEVsZW1lbnQhLCBuZ2JDb2xsYXBzaW5nVHJhbnNpdGlvbiwge1xuXHRcdFx0XHRcdGFuaW1hdGlvbixcblx0XHRcdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdFx0XHRcdGNvbnRleHQ6IHsgZGlyZWN0aW9uOiBwYW5lbC5pc09wZW4gPyAnc2hvdycgOiAnaGlkZScsIGRpbWVuc2lvbjogJ2hlaWdodCcgfSxcblx0XHRcdFx0fSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0XHRwYW5lbC50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXHRcdFx0XHRcdGNvbnN0IHsgaWQgfSA9IHBhbmVsO1xuXHRcdFx0XHRcdGlmIChwYW5lbC5pc09wZW4pIHtcblx0XHRcdFx0XHRcdHBhbmVsLnNob3duLmVtaXQoKTtcblx0XHRcdFx0XHRcdHRoaXMuc2hvd24uZW1pdChpZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHBhbmVsLmhpZGRlbi5lbWl0KCk7XG5cdFx0XHRcdFx0XHR0aGlzLmhpZGRlbi5lbWl0KGlkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG4iXX0=