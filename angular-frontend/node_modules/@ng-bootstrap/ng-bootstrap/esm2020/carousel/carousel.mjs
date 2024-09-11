import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation, } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { BehaviorSubject, combineLatest, NEVER, Subject, timer, zip } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ngbCompleteTransition, ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCarouselTransitionIn, ngbCarouselTransitionOut, NgbSlideEventDirection, } from './carousel-transition';
import * as i0 from "@angular/core";
import * as i1 from "./carousel-config";
let nextId = 0;
/**
 * A directive that wraps the individual carousel slide.
 */
export class NgbSlide {
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Slide id that must be unique for the entire document.
         *
         * If not provided, will be generated in the `ngb-slide-xx` format.
         */
        this.id = `ngb-slide-${nextId++}`;
        /**
         * An event emitted when the slide transition is finished
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
    }
}
NgbSlide.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbSlide, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbSlide.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: NgbSlide, isStandalone: true, selector: "ng-template[ngbSlide]", inputs: { id: "id" }, outputs: { slid: "slid" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbSlide, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbSlide]', standalone: true }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { id: [{
                type: Input
            }], slid: [{
                type: Output
            }] } });
/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
export class NgbCarousel {
    constructor(config, _platformId, _ngZone, _cd, _container) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._container = _container;
        this.NgbSlideEventSource = NgbSlideEventSource;
        this._destroy$ = new Subject();
        this._interval$ = new BehaviorSubject(0);
        this._mouseHover$ = new BehaviorSubject(false);
        this._focused$ = new BehaviorSubject(false);
        this._pauseOnHover$ = new BehaviorSubject(false);
        this._pauseOnFocus$ = new BehaviorSubject(false);
        this._pause$ = new BehaviorSubject(false);
        this._wrap$ = new BehaviorSubject(false);
        /**
         * An event emitted just before the slide transition starts.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         */
        this.slide = new EventEmitter();
        /**
         * An event emitted right after the slide transition is completed.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
        /*
         * Keep the ids of the panels currently transitionning
         * in order to allow only the transition revertion
         */
        this._transitionIds = null;
        this.animation = config.animation;
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.pauseOnFocus = config.pauseOnFocus;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * Time in milliseconds before the next slide is shown.
     */
    set interval(value) {
        this._interval$.next(value);
    }
    get interval() {
        return this._interval$.value;
    }
    /**
     * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
     */
    set wrap(value) {
        this._wrap$.next(value);
    }
    get wrap() {
        return this._wrap$.value;
    }
    /**
     * If `true`, will pause slide switching when mouse cursor hovers the slide.
     *
     * @since 2.2.0
     */
    set pauseOnHover(value) {
        this._pauseOnHover$.next(value);
    }
    get pauseOnHover() {
        return this._pauseOnHover$.value;
    }
    /**
     * If `true`, will pause slide switching when the focus is inside the carousel.
     */
    set pauseOnFocus(value) {
        this._pauseOnFocus$.next(value);
    }
    get pauseOnFocus() {
        return this._pauseOnFocus$.value;
    }
    set mouseHover(value) {
        this._mouseHover$.next(value);
    }
    get mouseHover() {
        return this._mouseHover$.value;
    }
    set focused(value) {
        this._focused$.next(value);
    }
    get focused() {
        return this._focused$.value;
    }
    arrowLeft() {
        this.focus();
        this.prev(NgbSlideEventSource.ARROW_LEFT);
    }
    arrowRight() {
        this.focus();
        this.next(NgbSlideEventSource.ARROW_RIGHT);
    }
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                const hasNextSlide$ = combineLatest([
                    this.slide.pipe(map((slideEvent) => slideEvent.current), startWith(this.activeId)),
                    this._wrap$,
                    this.slides.changes.pipe(startWith(null)),
                ]).pipe(map(([currentSlideId, wrap]) => {
                    const slideArr = this.slides.toArray();
                    const currentSlideIdx = this._getSlideIdxById(currentSlideId);
                    return wrap ? slideArr.length > 1 : currentSlideIdx < slideArr.length - 1;
                }), distinctUntilChanged());
                combineLatest([
                    this._pause$,
                    this._pauseOnHover$,
                    this._mouseHover$,
                    this._pauseOnFocus$,
                    this._focused$,
                    this._interval$,
                    hasNextSlide$,
                ])
                    .pipe(map(([pause, pauseOnHover, mouseHover, pauseOnFocus, focused, interval, hasNextSlide]) => pause || (pauseOnHover && mouseHover) || (pauseOnFocus && focused) || !hasNextSlide ? 0 : interval), distinctUntilChanged(), switchMap((interval) => (interval > 0 ? timer(interval, interval) : NEVER)), takeUntil(this._destroy$))
                    .subscribe(() => this._ngZone.run(() => this.next(NgbSlideEventSource.TIMER)));
            });
        }
        this.slides.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this._transitionIds?.forEach((id) => ngbCompleteTransition(this._getSlideElement(id)));
            this._transitionIds = null;
            this._cd.markForCheck();
            // The following code need to be done asynchronously, after the dom becomes stable,
            // otherwise all changes will be undone.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                for (const { id } of this.slides) {
                    const element = this._getSlideElement(id);
                    if (id === this.activeId) {
                        element.classList.add('active');
                    }
                    else {
                        element.classList.remove('active');
                    }
                }
            });
        });
    }
    ngAfterContentChecked() {
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : this.slides.length ? this.slides.first.id : '';
    }
    ngAfterViewInit() {
        // Initialize the 'active' class (not managed by the template)
        if (this.activeId) {
            const element = this._getSlideElement(this.activeId);
            if (element) {
                element.classList.add('active');
            }
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
    }
    /**
     * Navigates to a slide with the specified identifier.
     */
    select(slideId, source) {
        this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId), source);
    }
    /**
     * Navigates to the previous slide.
     */
    prev(source) {
        this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.END, source);
    }
    /**
     * Navigates to the next slide.
     */
    next(source) {
        this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.START, source);
    }
    /**
     * Pauses cycling through the slides.
     */
    pause() {
        this._pause$.next(true);
    }
    /**
     * Restarts cycling through the slides from start to end.
     */
    cycle() {
        this._pause$.next(false);
    }
    /**
     * Set the focus on the carousel.
     */
    focus() {
        this._container.nativeElement.focus();
    }
    _cycleToSelected(slideIdx, direction, source) {
        const transitionIds = this._transitionIds;
        if (transitionIds && (transitionIds[0] !== slideIdx || transitionIds[1] !== this.activeId)) {
            // Revert prevented
            return;
        }
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this._transitionIds = [this.activeId, slideIdx];
            this.slide.emit({
                prev: this.activeId,
                current: selectedSlide.id,
                direction: direction,
                paused: this._pause$.value,
                source,
            });
            const options = {
                animation: this.animation,
                runningTransition: 'stop',
                context: { direction },
            };
            const transitions = [];
            const activeSlide = this._getSlideById(this.activeId);
            if (activeSlide) {
                const activeSlideTransition = ngbRunTransition(this._ngZone, this._getSlideElement(activeSlide.id), ngbCarouselTransitionOut, options);
                activeSlideTransition.subscribe(() => {
                    activeSlide.slid.emit({ isShown: false, direction, source });
                });
                transitions.push(activeSlideTransition);
            }
            const previousId = this.activeId;
            this.activeId = selectedSlide.id;
            const nextSlide = this._getSlideById(this.activeId);
            const transition = ngbRunTransition(this._ngZone, this._getSlideElement(selectedSlide.id), ngbCarouselTransitionIn, options);
            transition.subscribe(() => {
                nextSlide?.slid.emit({ isShown: true, direction, source });
            });
            transitions.push(transition);
            zip(...transitions)
                .pipe(take(1))
                .subscribe(() => {
                this._transitionIds = null;
                this.slid.emit({
                    prev: previousId,
                    current: selectedSlide.id,
                    direction: direction,
                    paused: this._pause$.value,
                    source,
                });
            });
        }
        // we get here after the interval fires or any external API call like next(), prev() or select()
        this._cd.markForCheck();
    }
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.END : NgbSlideEventDirection.START;
    }
    _getSlideById(slideId) {
        return this.slides.find((slide) => slide.id === slideId) || null;
    }
    _getSlideIdxById(slideId) {
        const slide = this._getSlideById(slideId);
        return slide != null ? this.slides.toArray().indexOf(slide) : -1;
    }
    _getNextSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide
            ? this.wrap
                ? slideArr[0].id
                : slideArr[slideArr.length - 1].id
            : slideArr[currentSlideIdx + 1].id;
    }
    _getPrevSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide
            ? this.wrap
                ? slideArr[slideArr.length - 1].id
                : slideArr[0].id
            : slideArr[currentSlideIdx - 1].id;
    }
    _getSlideElement(slideId) {
        return this._container.nativeElement.querySelector(`#slide-${slideId}`);
    }
}
NgbCarousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbCarousel, deps: [{ token: i1.NgbCarouselConfig }, { token: PLATFORM_ID }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgbCarousel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbCarousel, isStandalone: true, selector: "ngb-carousel", inputs: { animation: "animation", activeId: "activeId", interval: "interval", wrap: "wrap", keyboard: "keyboard", pauseOnHover: "pauseOnHover", pauseOnFocus: "pauseOnFocus", showNavigationArrows: "showNavigationArrows", showNavigationIndicators: "showNavigationIndicators" }, outputs: { slide: "slide", slid: "slid" }, host: { attributes: { "tabIndex": "0" }, listeners: { "keydown.arrowLeft": "keyboard && arrowLeft()", "keydown.arrowRight": "keyboard && arrowRight()", "mouseenter": "mouseHover = true", "mouseleave": "mouseHover = false", "focusin": "focused = true", "focusout": "focused = false" }, properties: { "style.display": "\"block\"", "attr.aria-activedescendant": "'slide-' + activeId" }, classAttribute: "carousel slide" }, queries: [{ propertyName: "slides", predicate: NgbSlide }], exportAs: ["ngbCarousel"], ngImport: i0, template: `
		<div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
			<button
				type="button"
				data-bs-target
				*ngFor="let slide of slides"
				[class.active]="slide.id === activeId"
				role="tab"
				[attr.aria-labelledby]="'slide-' + slide.id"
				[attr.aria-controls]="'slide-' + slide.id"
				[attr.aria-selected]="slide.id === activeId"
				(click)="focus(); select(slide.id, NgbSlideEventSource.INDICATOR)"
			></button>
		</div>
		<div class="carousel-inner">
			<div
				*ngFor="let slide of slides; index as i; count as c"
				class="carousel-item"
				[id]="'slide-' + slide.id"
				role="tabpanel"
			>
				<span
					class="visually-hidden"
					i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number"
				>
					Slide {{ i + 1 }} of {{ c }}
				</span>
				<ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
			</div>
		</div>
		<button class="carousel-control-prev" type="button" (click)="arrowLeft()" *ngIf="showNavigationArrows">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden" i18n="@@ngb.carousel.previous">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" (click)="arrowRight()" *ngIf="showNavigationArrows">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden" i18n="@@ngb.carousel.next">Next</span>
		</button>
	`, isInline: true, dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbCarousel, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-carousel',
                    exportAs: 'ngbCarousel',
                    standalone: true,
                    imports: [NgFor, NgTemplateOutlet, NgIf],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'carousel slide',
                        '[style.display]': '"block"',
                        tabIndex: '0',
                        '(keydown.arrowLeft)': 'keyboard && arrowLeft()',
                        '(keydown.arrowRight)': 'keyboard && arrowRight()',
                        '(mouseenter)': 'mouseHover = true',
                        '(mouseleave)': 'mouseHover = false',
                        '(focusin)': 'focused = true',
                        '(focusout)': 'focused = false',
                        '[attr.aria-activedescendant]': `'slide-' + activeId`,
                    },
                    template: `
		<div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
			<button
				type="button"
				data-bs-target
				*ngFor="let slide of slides"
				[class.active]="slide.id === activeId"
				role="tab"
				[attr.aria-labelledby]="'slide-' + slide.id"
				[attr.aria-controls]="'slide-' + slide.id"
				[attr.aria-selected]="slide.id === activeId"
				(click)="focus(); select(slide.id, NgbSlideEventSource.INDICATOR)"
			></button>
		</div>
		<div class="carousel-inner">
			<div
				*ngFor="let slide of slides; index as i; count as c"
				class="carousel-item"
				[id]="'slide-' + slide.id"
				role="tabpanel"
			>
				<span
					class="visually-hidden"
					i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number"
				>
					Slide {{ i + 1 }} of {{ c }}
				</span>
				<ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
			</div>
		</div>
		<button class="carousel-control-prev" type="button" (click)="arrowLeft()" *ngIf="showNavigationArrows">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden" i18n="@@ngb.carousel.previous">Previous</span>
		</button>
		<button class="carousel-control-next" type="button" (click)="arrowRight()" *ngIf="showNavigationArrows">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden" i18n="@@ngb.carousel.next">Next</span>
		</button>
	`,
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbCarouselConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { slides: [{
                type: ContentChildren,
                args: [NgbSlide]
            }], animation: [{
                type: Input
            }], activeId: [{
                type: Input
            }], interval: [{
                type: Input
            }], wrap: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], pauseOnHover: [{
                type: Input
            }], pauseOnFocus: [{
                type: Input
            }], showNavigationArrows: [{
                type: Input
            }], showNavigationIndicators: [{
                type: Input
            }], slide: [{
                type: Output
            }], slid: [{
                type: Output
            }] } });
export var NgbSlideEventSource;
(function (NgbSlideEventSource) {
    NgbSlideEventSource["TIMER"] = "timer";
    NgbSlideEventSource["ARROW_LEFT"] = "arrowLeft";
    NgbSlideEventSource["ARROW_RIGHT"] = "arrowRight";
    NgbSlideEventSource["INDICATOR"] = "indicator";
})(NgbSlideEventSource || (NgbSlideEventSource = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdOLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUdYLGlCQUFpQixHQUVqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSW5GLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBYyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xHLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBd0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqSCxPQUFPLEVBQ04sdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUN4QixzQkFBc0IsR0FFdEIsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRS9CLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmOztHQUVHO0FBRUgsTUFBTSxPQUFPLFFBQVE7SUFlcEIsWUFBbUIsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFkM0M7Ozs7V0FJRztRQUNNLE9BQUUsR0FBRyxhQUFhLE1BQU0sRUFBRSxFQUFFLENBQUM7UUFFdEM7Ozs7V0FJRztRQUNPLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBdUIsQ0FBQztJQUVYLENBQUM7O3FHQWZuQyxRQUFRO3lGQUFSLFFBQVE7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aUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNMLEtBQUssRUFBRSxnQkFBZ0I7d0JBQ3ZCLGlCQUFpQixFQUFFLFNBQVM7d0JBQzVCLFFBQVEsRUFBRSxHQUFHO3dCQUNiLHFCQUFxQixFQUFFLHlCQUF5Qjt3QkFDaEQsc0JBQXNCLEVBQUUsMEJBQTBCO3dCQUNsRCxjQUFjLEVBQUUsbUJBQW1CO3dCQUNuQyxjQUFjLEVBQUUsb0JBQW9CO3dCQUNwQyxXQUFXLEVBQUUsZ0JBQWdCO3dCQUM3QixZQUFZLEVBQUUsaUJBQWlCO3dCQUMvQiw4QkFBOEIsRUFBRSxxQkFBcUI7cUJBQ3JEO29CQUNELFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFzQ1Q7aUJBQ0Q7OzBCQTBJRSxNQUFNOzJCQUFDLFdBQVc7MEhBeElPLE1BQU07c0JBQWhDLGVBQWU7dUJBQUMsUUFBUTtnQkFrQmhCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBT0csUUFBUTtzQkFBaEIsS0FBSztnQkFNRixRQUFRO3NCQURYLEtBQUs7Z0JBYUYsSUFBSTtzQkFEUCxLQUFLO2dCQVlHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBUUYsWUFBWTtzQkFEZixLQUFLO2dCQWFGLFlBQVk7c0JBRGYsS0FBSztnQkFjRyxvQkFBb0I7c0JBQTVCLEtBQUs7Z0JBT0csd0JBQXdCO3NCQUFoQyxLQUFLO2dCQU9JLEtBQUs7c0JBQWQsTUFBTTtnQkFTRyxJQUFJO3NCQUFiLE1BQU07O0FBaVhSLE1BQU0sQ0FBTixJQUFZLG1CQUtYO0FBTEQsV0FBWSxtQkFBbUI7SUFDOUIsc0NBQWUsQ0FBQTtJQUNmLCtDQUF3QixDQUFBO0lBQ3hCLGlEQUEwQixDQUFBO0lBQzFCLDhDQUF1QixDQUFBO0FBQ3hCLENBQUMsRUFMVyxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSzlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0QWZ0ZXJDb250ZW50Q2hlY2tlZCxcblx0QWZ0ZXJDb250ZW50SW5pdCxcblx0Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG5cdENoYW5nZURldGVjdG9yUmVmLFxuXHRDb21wb25lbnQsXG5cdENvbnRlbnRDaGlsZHJlbixcblx0RGlyZWN0aXZlLFxuXHRFbGVtZW50UmVmLFxuXHRFdmVudEVtaXR0ZXIsXG5cdEluamVjdCxcblx0SW5wdXQsXG5cdE5nWm9uZSxcblx0T25EZXN0cm95LFxuXHRPdXRwdXQsXG5cdFBMQVRGT1JNX0lELFxuXHRRdWVyeUxpc3QsXG5cdFRlbXBsYXRlUmVmLFxuXHRWaWV3RW5jYXBzdWxhdGlvbixcblx0QWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciwgTmdGb3IsIE5nSWYsIE5nVGVtcGxhdGVPdXRsZXQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBOZ2JDYXJvdXNlbENvbmZpZyB9IGZyb20gJy4vY2Fyb3VzZWwtY29uZmlnJztcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBORVZFUiwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGltZXIsIHppcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IG5nYkNvbXBsZXRlVHJhbnNpdGlvbiwgbmdiUnVuVHJhbnNpdGlvbiwgTmdiVHJhbnNpdGlvbk9wdGlvbnMgfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge1xuXHRuZ2JDYXJvdXNlbFRyYW5zaXRpb25Jbixcblx0bmdiQ2Fyb3VzZWxUcmFuc2l0aW9uT3V0LFxuXHROZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLFxuXHROZ2JDYXJvdXNlbEN0eCxcbn0gZnJvbSAnLi9jYXJvdXNlbC10cmFuc2l0aW9uJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyB0aGUgaW5kaXZpZHVhbCBjYXJvdXNlbCBzbGlkZS5cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiU2xpZGVdJywgc3RhbmRhbG9uZTogdHJ1ZSB9KVxuZXhwb3J0IGNsYXNzIE5nYlNsaWRlIHtcblx0LyoqXG5cdCAqIFNsaWRlIGlkIHRoYXQgbXVzdCBiZSB1bmlxdWUgZm9yIHRoZSBlbnRpcmUgZG9jdW1lbnQuXG5cdCAqXG5cdCAqIElmIG5vdCBwcm92aWRlZCwgd2lsbCBiZSBnZW5lcmF0ZWQgaW4gdGhlIGBuZ2Itc2xpZGUteHhgIGZvcm1hdC5cblx0ICovXG5cdEBJbnB1dCgpIGlkID0gYG5nYi1zbGlkZS0ke25leHRJZCsrfWA7XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2xpZGUgdHJhbnNpdGlvbiBpcyBmaW5pc2hlZFxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdEBPdXRwdXQoKSBzbGlkID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTaW5nbGVTbGlkZUV2ZW50PigpO1xuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB0cGxSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogQ2Fyb3VzZWwgaXMgYSBjb21wb25lbnQgdG8gZWFzaWx5IGNyZWF0ZSBhbmQgY29udHJvbCBzbGlkZXNob3dzLlxuICpcbiAqIEFsbG93cyB0byBzZXQgaW50ZXJ2YWxzLCBjaGFuZ2UgdGhlIHdheSB1c2VyIGludGVyYWN0cyB3aXRoIHRoZSBzbGlkZXMgYW5kIHByb3ZpZGVzIGEgcHJvZ3JhbW1hdGljIEFQSS5cbiAqL1xuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLWNhcm91c2VsJyxcblx0ZXhwb3J0QXM6ICduZ2JDYXJvdXNlbCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ0ZvciwgTmdUZW1wbGF0ZU91dGxldCwgTmdJZl0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHRob3N0OiB7XG5cdFx0Y2xhc3M6ICdjYXJvdXNlbCBzbGlkZScsXG5cdFx0J1tzdHlsZS5kaXNwbGF5XSc6ICdcImJsb2NrXCInLFxuXHRcdHRhYkluZGV4OiAnMCcsXG5cdFx0JyhrZXlkb3duLmFycm93TGVmdCknOiAna2V5Ym9hcmQgJiYgYXJyb3dMZWZ0KCknLFxuXHRcdCcoa2V5ZG93bi5hcnJvd1JpZ2h0KSc6ICdrZXlib2FyZCAmJiBhcnJvd1JpZ2h0KCknLFxuXHRcdCcobW91c2VlbnRlciknOiAnbW91c2VIb3ZlciA9IHRydWUnLFxuXHRcdCcobW91c2VsZWF2ZSknOiAnbW91c2VIb3ZlciA9IGZhbHNlJyxcblx0XHQnKGZvY3VzaW4pJzogJ2ZvY3VzZWQgPSB0cnVlJyxcblx0XHQnKGZvY3Vzb3V0KSc6ICdmb2N1c2VkID0gZmFsc2UnLFxuXHRcdCdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogYCdzbGlkZS0nICsgYWN0aXZlSWRgLFxuXHR9LFxuXHR0ZW1wbGF0ZTogYFxuXHRcdDxkaXYgY2xhc3M9XCJjYXJvdXNlbC1pbmRpY2F0b3JzXCIgW2NsYXNzLnZpc3VhbGx5LWhpZGRlbl09XCIhc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzXCIgcm9sZT1cInRhYmxpc3RcIj5cblx0XHRcdDxidXR0b25cblx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdGRhdGEtYnMtdGFyZ2V0XG5cdFx0XHRcdCpuZ0Zvcj1cImxldCBzbGlkZSBvZiBzbGlkZXNcIlxuXHRcdFx0XHRbY2xhc3MuYWN0aXZlXT1cInNsaWRlLmlkID09PSBhY3RpdmVJZFwiXG5cdFx0XHRcdHJvbGU9XCJ0YWJcIlxuXHRcdFx0XHRbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiJ3NsaWRlLScgKyBzbGlkZS5pZFwiXG5cdFx0XHRcdFthdHRyLmFyaWEtY29udHJvbHNdPVwiJ3NsaWRlLScgKyBzbGlkZS5pZFwiXG5cdFx0XHRcdFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwic2xpZGUuaWQgPT09IGFjdGl2ZUlkXCJcblx0XHRcdFx0KGNsaWNrKT1cImZvY3VzKCk7IHNlbGVjdChzbGlkZS5pZCwgTmdiU2xpZGVFdmVudFNvdXJjZS5JTkRJQ0FUT1IpXCJcblx0XHRcdD48L2J1dHRvbj5cblx0XHQ8L2Rpdj5cblx0XHQ8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaW5uZXJcIj5cblx0XHRcdDxkaXZcblx0XHRcdFx0Km5nRm9yPVwibGV0IHNsaWRlIG9mIHNsaWRlczsgaW5kZXggYXMgaTsgY291bnQgYXMgY1wiXG5cdFx0XHRcdGNsYXNzPVwiY2Fyb3VzZWwtaXRlbVwiXG5cdFx0XHRcdFtpZF09XCInc2xpZGUtJyArIHNsaWRlLmlkXCJcblx0XHRcdFx0cm9sZT1cInRhYnBhbmVsXCJcblx0XHRcdD5cblx0XHRcdFx0PHNwYW5cblx0XHRcdFx0XHRjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG5cdFx0XHRcdFx0aTE4bj1cIkN1cnJlbnRseSBzZWxlY3RlZCBzbGlkZSBudW1iZXIgcmVhZCBieSBzY3JlZW4gcmVhZGVyQEBuZ2IuY2Fyb3VzZWwuc2xpZGUtbnVtYmVyXCJcblx0XHRcdFx0PlxuXHRcdFx0XHRcdFNsaWRlIHt7IGkgKyAxIH19IG9mIHt7IGMgfX1cblx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHQ8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudHBsUmVmXCI+PC9uZy10ZW1wbGF0ZT5cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdDxidXR0b24gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImFycm93TGVmdCgpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuXHRcdFx0PHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXYtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cblx0XHRcdDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLnByZXZpb3VzXCI+UHJldmlvdXM8L3NwYW4+XG5cdFx0PC9idXR0b24+XG5cdFx0PGJ1dHRvbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtbmV4dFwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYXJyb3dSaWdodCgpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuXHRcdFx0PHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLW5leHQtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cblx0XHRcdDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLm5leHRcIj5OZXh0PC9zcGFuPlxuXHRcdDwvYnV0dG9uPlxuXHRgLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JDYXJvdXNlbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cdEBDb250ZW50Q2hpbGRyZW4oTmdiU2xpZGUpIHNsaWRlczogUXVlcnlMaXN0PE5nYlNsaWRlPjtcblxuXHRwdWJsaWMgTmdiU2xpZGVFdmVudFNvdXJjZSA9IE5nYlNsaWRlRXZlbnRTb3VyY2U7XG5cblx0cHJpdmF0ZSBfZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF9pbnRlcnZhbCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KDApO1xuXHRwcml2YXRlIF9tb3VzZUhvdmVyJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXHRwcml2YXRlIF9mb2N1c2VkJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXHRwcml2YXRlIF9wYXVzZU9uSG92ZXIkID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG5cdHByaXZhdGUgX3BhdXNlT25Gb2N1cyQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcblx0cHJpdmF0ZSBfcGF1c2UkID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG5cdHByaXZhdGUgX3dyYXAkID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG5cblx0LyoqXG5cdCAqIEEgZmxhZyB0byBlbmFibGUvZGlzYWJsZSB0aGUgYW5pbWF0aW9ucy5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBzbGlkZSBpZCB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWQgKippbml0aWFsbHkqKi5cblx0ICpcblx0ICogRm9yIHN1YnNlcXVlbnQgaW50ZXJhY3Rpb25zIHVzZSBtZXRob2RzIGBzZWxlY3QoKWAsIGBuZXh0KClgLCBldGMuIGFuZCB0aGUgYChzbGlkZSlgIG91dHB1dC5cblx0ICovXG5cdEBJbnB1dCgpIGFjdGl2ZUlkOiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRpbWUgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSB0aGUgbmV4dCBzbGlkZSBpcyBzaG93bi5cblx0ICovXG5cdEBJbnB1dCgpXG5cdHNldCBpbnRlcnZhbCh2YWx1ZTogbnVtYmVyKSB7XG5cdFx0dGhpcy5faW50ZXJ2YWwkLm5leHQodmFsdWUpO1xuXHR9XG5cblx0Z2V0IGludGVydmFsKCkge1xuXHRcdHJldHVybiB0aGlzLl9pbnRlcnZhbCQudmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsICd3cmFwJyB0aGUgY2Fyb3VzZWwgYnkgc3dpdGNoaW5nIGZyb20gdGhlIGxhc3Qgc2xpZGUgYmFjayB0byB0aGUgZmlyc3QuXG5cdCAqL1xuXHRASW5wdXQoKVxuXHRzZXQgd3JhcCh2YWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuX3dyYXAkLm5leHQodmFsdWUpO1xuXHR9XG5cblx0Z2V0IHdyYXAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3dyYXAkLnZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgYWxsb3dzIHRvIGludGVyYWN0IHdpdGggY2Fyb3VzZWwgdXNpbmcga2V5Ym9hcmQgJ2Fycm93IGxlZnQnIGFuZCAnYXJyb3cgcmlnaHQnLlxuXHQgKi9cblx0QElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgd2lsbCBwYXVzZSBzbGlkZSBzd2l0Y2hpbmcgd2hlbiBtb3VzZSBjdXJzb3IgaG92ZXJzIHRoZSBzbGlkZS5cblx0ICpcblx0ICogQHNpbmNlIDIuMi4wXG5cdCAqL1xuXHRASW5wdXQoKVxuXHRzZXQgcGF1c2VPbkhvdmVyKHZhbHVlOiBib29sZWFuKSB7XG5cdFx0dGhpcy5fcGF1c2VPbkhvdmVyJC5uZXh0KHZhbHVlKTtcblx0fVxuXG5cdGdldCBwYXVzZU9uSG92ZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhdXNlT25Ib3ZlciQudmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSWYgYHRydWVgLCB3aWxsIHBhdXNlIHNsaWRlIHN3aXRjaGluZyB3aGVuIHRoZSBmb2N1cyBpcyBpbnNpZGUgdGhlIGNhcm91c2VsLlxuXHQgKi9cblx0QElucHV0KClcblx0c2V0IHBhdXNlT25Gb2N1cyh2YWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuX3BhdXNlT25Gb2N1cyQubmV4dCh2YWx1ZSk7XG5cdH1cblxuXHRnZXQgcGF1c2VPbkZvY3VzKCkge1xuXHRcdHJldHVybiB0aGlzLl9wYXVzZU9uRm9jdXMkLnZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgJ3ByZXZpb3VzJyBhbmQgJ25leHQnIG5hdmlnYXRpb24gYXJyb3dzIHdpbGwgYmUgdmlzaWJsZSBvbiB0aGUgc2xpZGUuXG5cdCAqXG5cdCAqIEBzaW5jZSAyLjIuMFxuXHQgKi9cblx0QElucHV0KCkgc2hvd05hdmlnYXRpb25BcnJvd3M6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIElmIGB0cnVlYCwgbmF2aWdhdGlvbiBpbmRpY2F0b3JzIGF0IHRoZSBib3R0b20gb2YgdGhlIHNsaWRlIHdpbGwgYmUgdmlzaWJsZS5cblx0ICpcblx0ICogQHNpbmNlIDIuMi4wXG5cdCAqL1xuXHRASW5wdXQoKSBzaG93TmF2aWdhdGlvbkluZGljYXRvcnM6IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEFuIGV2ZW50IGVtaXR0ZWQganVzdCBiZWZvcmUgdGhlIHNsaWRlIHRyYW5zaXRpb24gc3RhcnRzLlxuXHQgKlxuXHQgKiBTZWUgW2BOZ2JTbGlkZUV2ZW50YF0oIy9jb21wb25lbnRzL2Nhcm91c2VsL2FwaSNOZ2JTbGlkZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuXHQgKi9cblx0QE91dHB1dCgpIHNsaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG5cdC8qKlxuXHQgKiBBbiBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cblx0ICpcblx0ICogU2VlIFtgTmdiU2xpZGVFdmVudGBdKCMvY29tcG9uZW50cy9jYXJvdXNlbC9hcGkjTmdiU2xpZGVFdmVudCkgZm9yIHBheWxvYWQgZGV0YWlscy5cblx0ICpcblx0ICogQHNpbmNlIDguMC4wXG5cdCAqL1xuXHRAT3V0cHV0KCkgc2xpZCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiU2xpZGVFdmVudD4oKTtcblxuXHQvKlxuXHQgKiBLZWVwIHRoZSBpZHMgb2YgdGhlIHBhbmVscyBjdXJyZW50bHkgdHJhbnNpdGlvbm5pbmdcblx0ICogaW4gb3JkZXIgdG8gYWxsb3cgb25seSB0aGUgdHJhbnNpdGlvbiByZXZlcnRpb25cblx0ICovXG5cdHByaXZhdGUgX3RyYW5zaXRpb25JZHM6IFtzdHJpbmcsIHN0cmluZ10gfCBudWxsID0gbnVsbDtcblxuXHRzZXQgbW91c2VIb3Zlcih2YWx1ZTogYm9vbGVhbikge1xuXHRcdHRoaXMuX21vdXNlSG92ZXIkLm5leHQodmFsdWUpO1xuXHR9XG5cblx0Z2V0IG1vdXNlSG92ZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX21vdXNlSG92ZXIkLnZhbHVlO1xuXHR9XG5cblx0c2V0IGZvY3VzZWQodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9mb2N1c2VkJC5uZXh0KHZhbHVlKTtcblx0fVxuXG5cdGdldCBmb2N1c2VkKCkge1xuXHRcdHJldHVybiB0aGlzLl9mb2N1c2VkJC52YWx1ZTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdGNvbmZpZzogTmdiQ2Fyb3VzZWxDb25maWcsXG5cdFx0QEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZCxcblx0XHRwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcblx0XHRwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG5cdFx0cHJpdmF0ZSBfY29udGFpbmVyOiBFbGVtZW50UmVmLFxuXHQpIHtcblx0XHR0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG5cdFx0dGhpcy5pbnRlcnZhbCA9IGNvbmZpZy5pbnRlcnZhbDtcblx0XHR0aGlzLndyYXAgPSBjb25maWcud3JhcDtcblx0XHR0aGlzLmtleWJvYXJkID0gY29uZmlnLmtleWJvYXJkO1xuXHRcdHRoaXMucGF1c2VPbkhvdmVyID0gY29uZmlnLnBhdXNlT25Ib3Zlcjtcblx0XHR0aGlzLnBhdXNlT25Gb2N1cyA9IGNvbmZpZy5wYXVzZU9uRm9jdXM7XG5cdFx0dGhpcy5zaG93TmF2aWdhdGlvbkFycm93cyA9IGNvbmZpZy5zaG93TmF2aWdhdGlvbkFycm93cztcblx0XHR0aGlzLnNob3dOYXZpZ2F0aW9uSW5kaWNhdG9ycyA9IGNvbmZpZy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnM7XG5cdH1cblxuXHRhcnJvd0xlZnQoKSB7XG5cdFx0dGhpcy5mb2N1cygpO1xuXHRcdHRoaXMucHJldihOZ2JTbGlkZUV2ZW50U291cmNlLkFSUk9XX0xFRlQpO1xuXHR9XG5cblx0YXJyb3dSaWdodCgpIHtcblx0XHR0aGlzLmZvY3VzKCk7XG5cdFx0dGhpcy5uZXh0KE5nYlNsaWRlRXZlbnRTb3VyY2UuQVJST1dfUklHSFQpO1xuXHR9XG5cblx0bmdBZnRlckNvbnRlbnRJbml0KCkge1xuXHRcdC8vIHNldEludGVydmFsKCkgZG9lc24ndCBwbGF5IHdlbGwgd2l0aCBTU1IgYW5kIHByb3RyYWN0b3IsXG5cdFx0Ly8gc28gd2Ugc2hvdWxkIHJ1biBpdCBpbiB0aGUgYnJvd3NlciBhbmQgb3V0c2lkZSBBbmd1bGFyXG5cdFx0aWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG5cdFx0XHR0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBoYXNOZXh0U2xpZGUkID0gY29tYmluZUxhdGVzdChbXG5cdFx0XHRcdFx0dGhpcy5zbGlkZS5waXBlKFxuXHRcdFx0XHRcdFx0bWFwKChzbGlkZUV2ZW50KSA9PiBzbGlkZUV2ZW50LmN1cnJlbnQpLFxuXHRcdFx0XHRcdFx0c3RhcnRXaXRoKHRoaXMuYWN0aXZlSWQpLFxuXHRcdFx0XHRcdCksXG5cdFx0XHRcdFx0dGhpcy5fd3JhcCQsXG5cdFx0XHRcdFx0dGhpcy5zbGlkZXMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSksXG5cdFx0XHRcdF0pLnBpcGUoXG5cdFx0XHRcdFx0bWFwKChbY3VycmVudFNsaWRlSWQsIHdyYXBdKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcblx0XHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gd3JhcCA/IHNsaWRlQXJyLmxlbmd0aCA+IDEgOiBjdXJyZW50U2xpZGVJZHggPCBzbGlkZUFyci5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGNvbWJpbmVMYXRlc3QoW1xuXHRcdFx0XHRcdHRoaXMuX3BhdXNlJCxcblx0XHRcdFx0XHR0aGlzLl9wYXVzZU9uSG92ZXIkLFxuXHRcdFx0XHRcdHRoaXMuX21vdXNlSG92ZXIkLFxuXHRcdFx0XHRcdHRoaXMuX3BhdXNlT25Gb2N1cyQsXG5cdFx0XHRcdFx0dGhpcy5fZm9jdXNlZCQsXG5cdFx0XHRcdFx0dGhpcy5faW50ZXJ2YWwkLFxuXHRcdFx0XHRcdGhhc05leHRTbGlkZSQsXG5cdFx0XHRcdF0pXG5cdFx0XHRcdFx0LnBpcGUoXG5cdFx0XHRcdFx0XHRtYXAoXG5cdFx0XHRcdFx0XHRcdChbcGF1c2UsIHBhdXNlT25Ib3ZlciwgbW91c2VIb3ZlciwgcGF1c2VPbkZvY3VzLCBmb2N1c2VkLCBpbnRlcnZhbCwgaGFzTmV4dFNsaWRlXTogW1xuXHRcdFx0XHRcdFx0XHRcdGJvb2xlYW4sXG5cdFx0XHRcdFx0XHRcdFx0Ym9vbGVhbixcblx0XHRcdFx0XHRcdFx0XHRib29sZWFuLFxuXHRcdFx0XHRcdFx0XHRcdGJvb2xlYW4sXG5cdFx0XHRcdFx0XHRcdFx0Ym9vbGVhbixcblx0XHRcdFx0XHRcdFx0XHRudW1iZXIsXG5cdFx0XHRcdFx0XHRcdFx0Ym9vbGVhbixcblx0XHRcdFx0XHRcdFx0XSkgPT5cblx0XHRcdFx0XHRcdFx0XHRwYXVzZSB8fCAocGF1c2VPbkhvdmVyICYmIG1vdXNlSG92ZXIpIHx8IChwYXVzZU9uRm9jdXMgJiYgZm9jdXNlZCkgfHwgIWhhc05leHRTbGlkZSA/IDAgOiBpbnRlcnZhbCxcblx0XHRcdFx0XHRcdCksXG5cblx0XHRcdFx0XHRcdGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG5cdFx0XHRcdFx0XHRzd2l0Y2hNYXAoKGludGVydmFsKSA9PiAoaW50ZXJ2YWwgPiAwID8gdGltZXIoaW50ZXJ2YWwsIGludGVydmFsKSA6IE5FVkVSKSksXG5cdFx0XHRcdFx0XHR0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpLFxuXHRcdFx0XHRcdClcblx0XHRcdFx0XHQuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5uZXh0KE5nYlNsaWRlRXZlbnRTb3VyY2UuVElNRVIpKSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnNsaWRlcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdHRoaXMuX3RyYW5zaXRpb25JZHM/LmZvckVhY2goKGlkKSA9PiBuZ2JDb21wbGV0ZVRyYW5zaXRpb24odGhpcy5fZ2V0U2xpZGVFbGVtZW50KGlkKSkpO1xuXHRcdFx0dGhpcy5fdHJhbnNpdGlvbklkcyA9IG51bGw7XG5cblx0XHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG5cdFx0XHQvLyBUaGUgZm9sbG93aW5nIGNvZGUgbmVlZCB0byBiZSBkb25lIGFzeW5jaHJvbm91c2x5LCBhZnRlciB0aGUgZG9tIGJlY29tZXMgc3RhYmxlLFxuXHRcdFx0Ly8gb3RoZXJ3aXNlIGFsbCBjaGFuZ2VzIHdpbGwgYmUgdW5kb25lLlxuXHRcdFx0dGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdFx0Zm9yIChjb25zdCB7IGlkIH0gb2YgdGhpcy5zbGlkZXMpIHtcblx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID0gdGhpcy5fZ2V0U2xpZGVFbGVtZW50KGlkKTtcblx0XHRcdFx0XHRpZiAoaWQgPT09IHRoaXMuYWN0aXZlSWQpIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcblx0XHRsZXQgYWN0aXZlU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG5cdFx0dGhpcy5hY3RpdmVJZCA9IGFjdGl2ZVNsaWRlID8gYWN0aXZlU2xpZGUuaWQgOiB0aGlzLnNsaWRlcy5sZW5ndGggPyB0aGlzLnNsaWRlcy5maXJzdC5pZCA6ICcnO1xuXHR9XG5cblx0bmdBZnRlclZpZXdJbml0KCkge1xuXHRcdC8vIEluaXRpYWxpemUgdGhlICdhY3RpdmUnIGNsYXNzIChub3QgbWFuYWdlZCBieSB0aGUgdGVtcGxhdGUpXG5cdFx0aWYgKHRoaXMuYWN0aXZlSWQpIHtcblx0XHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9nZXRTbGlkZUVsZW1lbnQodGhpcy5hY3RpdmVJZCk7XG5cdFx0XHRpZiAoZWxlbWVudCkge1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG5nT25EZXN0cm95KCkge1xuXHRcdHRoaXMuX2Rlc3Ryb3kkLm5leHQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gYSBzbGlkZSB3aXRoIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci5cblx0ICovXG5cdHNlbGVjdChzbGlkZUlkOiBzdHJpbmcsIHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2UpIHtcblx0XHR0aGlzLl9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZCwgdGhpcy5fZ2V0U2xpZGVFdmVudERpcmVjdGlvbih0aGlzLmFjdGl2ZUlkLCBzbGlkZUlkKSwgc291cmNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgdG8gdGhlIHByZXZpb3VzIHNsaWRlLlxuXHQgKi9cblx0cHJldihzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG5cdFx0dGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldFByZXZTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5FTkQsIHNvdXJjZSk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIHRvIHRoZSBuZXh0IHNsaWRlLlxuXHQgKi9cblx0bmV4dChzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG5cdFx0dGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldE5leHRTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5TVEFSVCwgc291cmNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXVzZXMgY3ljbGluZyB0aHJvdWdoIHRoZSBzbGlkZXMuXG5cdCAqL1xuXHRwYXVzZSgpIHtcblx0XHR0aGlzLl9wYXVzZSQubmV4dCh0cnVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXN0YXJ0cyBjeWNsaW5nIHRocm91Z2ggdGhlIHNsaWRlcyBmcm9tIHN0YXJ0IHRvIGVuZC5cblx0ICovXG5cdGN5Y2xlKCkge1xuXHRcdHRoaXMuX3BhdXNlJC5uZXh0KGZhbHNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIGZvY3VzIG9uIHRoZSBjYXJvdXNlbC5cblx0ICovXG5cdGZvY3VzKCkge1xuXHRcdHRoaXMuX2NvbnRhaW5lci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG5cdH1cblxuXHRwcml2YXRlIF9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZHg6IHN0cmluZywgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLCBzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG5cdFx0Y29uc3QgdHJhbnNpdGlvbklkcyA9IHRoaXMuX3RyYW5zaXRpb25JZHM7XG5cdFx0aWYgKHRyYW5zaXRpb25JZHMgJiYgKHRyYW5zaXRpb25JZHNbMF0gIT09IHNsaWRlSWR4IHx8IHRyYW5zaXRpb25JZHNbMV0gIT09IHRoaXMuYWN0aXZlSWQpKSB7XG5cdFx0XHQvLyBSZXZlcnQgcHJldmVudGVkXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bGV0IHNlbGVjdGVkU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZHgpO1xuXHRcdGlmIChzZWxlY3RlZFNsaWRlICYmIHNlbGVjdGVkU2xpZGUuaWQgIT09IHRoaXMuYWN0aXZlSWQpIHtcblx0XHRcdHRoaXMuX3RyYW5zaXRpb25JZHMgPSBbdGhpcy5hY3RpdmVJZCwgc2xpZGVJZHhdO1xuXHRcdFx0dGhpcy5zbGlkZS5lbWl0KHtcblx0XHRcdFx0cHJldjogdGhpcy5hY3RpdmVJZCxcblx0XHRcdFx0Y3VycmVudDogc2VsZWN0ZWRTbGlkZS5pZCxcblx0XHRcdFx0ZGlyZWN0aW9uOiBkaXJlY3Rpb24sXG5cdFx0XHRcdHBhdXNlZDogdGhpcy5fcGF1c2UkLnZhbHVlLFxuXHRcdFx0XHRzb3VyY2UsXG5cdFx0XHR9KTtcblxuXHRcdFx0Y29uc3Qgb3B0aW9uczogTmdiVHJhbnNpdGlvbk9wdGlvbnM8TmdiQ2Fyb3VzZWxDdHg+ID0ge1xuXHRcdFx0XHRhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLFxuXHRcdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdFx0XHRjb250ZXh0OiB7IGRpcmVjdGlvbiB9LFxuXHRcdFx0fTtcblxuXHRcdFx0Y29uc3QgdHJhbnNpdGlvbnM6IEFycmF5PE9ic2VydmFibGU8YW55Pj4gPSBbXTtcblx0XHRcdGNvbnN0IGFjdGl2ZVNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHRoaXMuYWN0aXZlSWQpO1xuXHRcdFx0aWYgKGFjdGl2ZVNsaWRlKSB7XG5cdFx0XHRcdGNvbnN0IGFjdGl2ZVNsaWRlVHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHRcdFx0dGhpcy5fbmdab25lLFxuXHRcdFx0XHRcdHRoaXMuX2dldFNsaWRlRWxlbWVudChhY3RpdmVTbGlkZS5pZCksXG5cdFx0XHRcdFx0bmdiQ2Fyb3VzZWxUcmFuc2l0aW9uT3V0LFxuXHRcdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHRcdCk7XG5cdFx0XHRcdGFjdGl2ZVNsaWRlVHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHRcdGFjdGl2ZVNsaWRlLnNsaWQuZW1pdCh7IGlzU2hvd246IGZhbHNlLCBkaXJlY3Rpb24sIHNvdXJjZSB9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRyYW5zaXRpb25zLnB1c2goYWN0aXZlU2xpZGVUcmFuc2l0aW9uKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgcHJldmlvdXNJZCA9IHRoaXMuYWN0aXZlSWQ7XG5cdFx0XHR0aGlzLmFjdGl2ZUlkID0gc2VsZWN0ZWRTbGlkZS5pZDtcblx0XHRcdGNvbnN0IG5leHRTbGlkZSA9IHRoaXMuX2dldFNsaWRlQnlJZCh0aGlzLmFjdGl2ZUlkKTtcblx0XHRcdGNvbnN0IHRyYW5zaXRpb24gPSBuZ2JSdW5UcmFuc2l0aW9uKFxuXHRcdFx0XHR0aGlzLl9uZ1pvbmUsXG5cdFx0XHRcdHRoaXMuX2dldFNsaWRlRWxlbWVudChzZWxlY3RlZFNsaWRlLmlkKSxcblx0XHRcdFx0bmdiQ2Fyb3VzZWxUcmFuc2l0aW9uSW4sXG5cdFx0XHRcdG9wdGlvbnMsXG5cdFx0XHQpO1xuXHRcdFx0dHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHRuZXh0U2xpZGU/LnNsaWQuZW1pdCh7IGlzU2hvd246IHRydWUsIGRpcmVjdGlvbiwgc291cmNlIH0pO1xuXHRcdFx0fSk7XG5cdFx0XHR0cmFuc2l0aW9ucy5wdXNoKHRyYW5zaXRpb24pO1xuXG5cdFx0XHR6aXAoLi4udHJhbnNpdGlvbnMpXG5cdFx0XHRcdC5waXBlKHRha2UoMSkpXG5cdFx0XHRcdC5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0XHRcdHRoaXMuX3RyYW5zaXRpb25JZHMgPSBudWxsO1xuXHRcdFx0XHRcdHRoaXMuc2xpZC5lbWl0KHtcblx0XHRcdFx0XHRcdHByZXY6IHByZXZpb3VzSWQsXG5cdFx0XHRcdFx0XHRjdXJyZW50OiBzZWxlY3RlZFNsaWRlIS5pZCxcblx0XHRcdFx0XHRcdGRpcmVjdGlvbjogZGlyZWN0aW9uLFxuXHRcdFx0XHRcdFx0cGF1c2VkOiB0aGlzLl9wYXVzZSQudmFsdWUsXG5cdFx0XHRcdFx0XHRzb3VyY2UsXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdC8vIHdlIGdldCBoZXJlIGFmdGVyIHRoZSBpbnRlcnZhbCBmaXJlcyBvciBhbnkgZXh0ZXJuYWwgQVBJIGNhbGwgbGlrZSBuZXh0KCksIHByZXYoKSBvciBzZWxlY3QoKVxuXHRcdHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0U2xpZGVFdmVudERpcmVjdGlvbihjdXJyZW50QWN0aXZlU2xpZGVJZDogc3RyaW5nLCBuZXh0QWN0aXZlU2xpZGVJZDogc3RyaW5nKTogTmdiU2xpZGVFdmVudERpcmVjdGlvbiB7XG5cdFx0Y29uc3QgY3VycmVudEFjdGl2ZVNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRBY3RpdmVTbGlkZUlkKTtcblx0XHRjb25zdCBuZXh0QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQobmV4dEFjdGl2ZVNsaWRlSWQpO1xuXG5cdFx0cmV0dXJuIGN1cnJlbnRBY3RpdmVTbGlkZUlkeCA+IG5leHRBY3RpdmVTbGlkZUlkeCA/IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uRU5EIDogTmdiU2xpZGVFdmVudERpcmVjdGlvbi5TVEFSVDtcblx0fVxuXG5cdHByaXZhdGUgX2dldFNsaWRlQnlJZChzbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZSB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLnNsaWRlcy5maW5kKChzbGlkZSkgPT4gc2xpZGUuaWQgPT09IHNsaWRlSWQpIHx8IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIF9nZXRTbGlkZUlkeEJ5SWQoc2xpZGVJZDogc3RyaW5nKTogbnVtYmVyIHtcblx0XHRjb25zdCBzbGlkZSA9IHRoaXMuX2dldFNsaWRlQnlJZChzbGlkZUlkKTtcblx0XHRyZXR1cm4gc2xpZGUgIT0gbnVsbCA/IHRoaXMuc2xpZGVzLnRvQXJyYXkoKS5pbmRleE9mKHNsaWRlKSA6IC0xO1xuXHR9XG5cblx0cHJpdmF0ZSBfZ2V0TmV4dFNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuXHRcdGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuXHRcdGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG5cdFx0Y29uc3QgaXNMYXN0U2xpZGUgPSBjdXJyZW50U2xpZGVJZHggPT09IHNsaWRlQXJyLmxlbmd0aCAtIDE7XG5cblx0XHRyZXR1cm4gaXNMYXN0U2xpZGVcblx0XHRcdD8gdGhpcy53cmFwXG5cdFx0XHRcdD8gc2xpZGVBcnJbMF0uaWRcblx0XHRcdFx0OiBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZFxuXHRcdFx0OiBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggKyAxXS5pZDtcblx0fVxuXG5cdHByaXZhdGUgX2dldFByZXZTbGlkZShjdXJyZW50U2xpZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcblx0XHRjb25zdCBjdXJyZW50U2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudFNsaWRlSWQpO1xuXHRcdGNvbnN0IGlzRmlyc3RTbGlkZSA9IGN1cnJlbnRTbGlkZUlkeCA9PT0gMDtcblxuXHRcdHJldHVybiBpc0ZpcnN0U2xpZGVcblx0XHRcdD8gdGhpcy53cmFwXG5cdFx0XHRcdD8gc2xpZGVBcnJbc2xpZGVBcnIubGVuZ3RoIC0gMV0uaWRcblx0XHRcdFx0OiBzbGlkZUFyclswXS5pZFxuXHRcdFx0OiBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggLSAxXS5pZDtcblx0fVxuXG5cdHByaXZhdGUgX2dldFNsaWRlRWxlbWVudChzbGlkZUlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG5cdFx0cmV0dXJuIHRoaXMuX2NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzbGlkZS0ke3NsaWRlSWR9YCk7XG5cdH1cbn1cblxuLyoqXG4gKiBBIHNsaWRlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JTbGlkZUV2ZW50IHtcblx0LyoqXG5cdCAqIFRoZSBwcmV2aW91cyBzbGlkZSBpZC5cblx0ICovXG5cdHByZXY6IHN0cmluZztcblxuXHQvKipcblx0ICogVGhlIGN1cnJlbnQgc2xpZGUgaWQuXG5cdCAqL1xuXHRjdXJyZW50OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIFRoZSBzbGlkZSBldmVudCBkaXJlY3Rpb24uXG5cdCAqXG5cdCAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctaW5mbyB0ZXh0LWRhcmtcIj5zaW5jZSAxMi4wLjA8L3NwYW4+IFBvc3NpYmxlIHZhbHVlcyBhcmUgYCdzdGFydCcgfCAnZW5kJ2AuXG5cdCAqXG5cdCAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctc2Vjb25kYXJ5XCI+YmVmb3JlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIHdlcmUgYCdsZWZ0JyB8ICdyaWdodCdgLlxuXHQgKi9cblx0ZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xuXG5cdC8qKlxuXHQgKiBXaGV0aGVyIHRoZSBwYXVzZSgpIG1ldGhvZCB3YXMgY2FsbGVkIChhbmQgbm8gY3ljbGUoKSBjYWxsIHdhcyBkb25lIGFmdGVyd2FyZHMpLlxuXHQgKlxuXHQgKiBAc2luY2UgNS4xLjBcblx0ICovXG5cdHBhdXNlZDogYm9vbGVhbjtcblxuXHQvKipcblx0ICogU291cmNlIHRyaWdnZXJpbmcgdGhlIHNsaWRlIGNoYW5nZSBldmVudC5cblx0ICpcblx0ICogUG9zc2libGUgdmFsdWVzIGFyZSBgJ3RpbWVyJyB8ICdhcnJvd0xlZnQnIHwgJ2Fycm93UmlnaHQnIHwgJ2luZGljYXRvcidgXG5cdCAqXG5cdCAqIEBzaW5jZSA1LjEuMFxuXHQgKi9cblx0c291cmNlPzogTmdiU2xpZGVFdmVudFNvdXJjZTtcbn1cblxuLyoqXG4gKiBBIHNsaWRlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAqXG4gKiBAc2luY2UgOC4wLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JTaW5nbGVTbGlkZUV2ZW50IHtcblx0LyoqXG5cdCAqIHRydWUgaWYgdGhlIHNsaWRlIGlzIHNob3duLCBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdGlzU2hvd246IGJvb2xlYW47XG5cblx0LyoqXG5cdCAqIFRoZSBzbGlkZSBldmVudCBkaXJlY3Rpb24uXG5cdCAqXG5cdCAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctaW5mbyB0ZXh0LWRhcmtcIj5zaW5jZSAxMi4wLjA8L3NwYW4+IFBvc3NpYmxlIHZhbHVlcyBhcmUgYCdzdGFydCcgfCAnZW5kJ2AuXG5cdCAqXG5cdCAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctc2Vjb25kYXJ5XCI+YmVmb3JlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIHdlcmUgYCdsZWZ0JyB8ICdyaWdodCdgLlxuXHQgKi9cblx0ZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xuXG5cdC8qKlxuXHQgKiBTb3VyY2UgdHJpZ2dlcmluZyB0aGUgc2xpZGUgY2hhbmdlIGV2ZW50LlxuXHQgKlxuXHQgKiBQb3NzaWJsZSB2YWx1ZXMgYXJlIGAndGltZXInIHwgJ2Fycm93TGVmdCcgfCAnYXJyb3dSaWdodCcgfCAnaW5kaWNhdG9yJ2Bcblx0ICpcblx0ICovXG5cdHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2U7XG59XG5cbmV4cG9ydCBlbnVtIE5nYlNsaWRlRXZlbnRTb3VyY2Uge1xuXHRUSU1FUiA9ICd0aW1lcicsXG5cdEFSUk9XX0xFRlQgPSAnYXJyb3dMZWZ0Jyxcblx0QVJST1dfUklHSFQgPSAnYXJyb3dSaWdodCcsXG5cdElORElDQVRPUiA9ICdpbmRpY2F0b3InLFxufVxuIl19