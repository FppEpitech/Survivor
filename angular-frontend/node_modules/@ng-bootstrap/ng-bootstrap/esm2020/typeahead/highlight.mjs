import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { regExpEscape, toString, removeAccents } from '../util/util';
import { NgFor, NgIf } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * A component that helps with text highlighting.
 *
 * It splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
export class NgbHighlight {
    constructor() {
        /**
         * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
         */
        this.highlightClass = 'ngb-highlight';
        /**
         * Boolean option to determine if the highlighting should be sensitive to accents or not.
         *
         * This feature is only available for browsers that implement the `String.normalize` function
         * (typically not Internet Explorer).
         * If you want to use this feature in a browser that does not implement `String.normalize`,
         * you will have to include a polyfill in your application (`unorm` for example).
         *
         * @since 9.1.0
         */
        this.accentSensitive = true;
    }
    ngOnChanges(changes) {
        if (!this.accentSensitive && !String.prototype.normalize) {
            console.warn('The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser ' +
                'that does not implement the `String.normalize` function. ' +
                'You will have to include a polyfill in your application to use this feature in the current browser.');
            this.accentSensitive = true;
        }
        const result = toString(this.result);
        const terms = Array.isArray(this.term) ? this.term : [this.term];
        const prepareTerm = (term) => (this.accentSensitive ? term : removeAccents(term));
        const escapedTerms = terms.map((term) => regExpEscape(prepareTerm(toString(term)))).filter((term) => term);
        const toSplit = this.accentSensitive ? result : removeAccents(result);
        const parts = escapedTerms.length ? toSplit.split(new RegExp(`(${escapedTerms.join('|')})`, 'gmi')) : [result];
        if (this.accentSensitive) {
            this.parts = parts;
        }
        else {
            let offset = 0;
            this.parts = parts.map((part) => result.substring(offset, (offset += part.length)));
        }
    }
}
NgbHighlight.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbHighlight, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbHighlight.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbHighlight, isStandalone: true, selector: "ngb-highlight", inputs: { highlightClass: "highlightClass", result: "result", term: "term", accentSensitive: "accentSensitive" }, usesOnChanges: true, ngImport: i0, template: "<ng-template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\"><span *ngIf=\"isOdd; else even\" [class]=\"highlightClass\">{{part}}</span><ng-template #even>{{part}}</ng-template></ng-template>", isInline: true, styles: [".ngb-highlight{font-weight:700}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbHighlight, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-highlight', standalone: true, imports: [NgIf, NgFor], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                        `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                        `</ng-template>`, styles: [".ngb-highlight{font-weight:700}\n"] }]
        }], propDecorators: { highlightClass: [{
                type: Input
            }], result: [{
                type: Input
            }], term: [{
                type: Input
            }], accentSensitive: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC9oaWdobGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQWEsdUJBQXVCLEVBQWlCLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUU5Qzs7Ozs7OztHQU9HO0FBYUgsTUFBTSxPQUFPLFlBQVk7SUFaekI7UUFlQzs7V0FFRztRQUNNLG1CQUFjLEdBQUcsZUFBZSxDQUFDO1FBZ0IxQzs7Ozs7Ozs7O1dBU0c7UUFDTSxvQkFBZSxHQUFHLElBQUksQ0FBQztLQTJCaEM7SUF6QkEsV0FBVyxDQUFDLE9BQXNCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDekQsT0FBTyxDQUFDLElBQUksQ0FDWCx1RkFBdUY7Z0JBQ3RGLDJEQUEyRDtnQkFDM0QscUdBQXFHLENBQ3RHLENBQUM7WUFDRixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztTQUM1QjtRQUNELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEYsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0RSxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFL0csSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ25CO2FBQU07WUFDTixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEY7SUFDRixDQUFDOzt5R0ExRFcsWUFBWTs2RkFBWixZQUFZLGlnQkFUZCxJQUFJLDZGQUFFLEtBQUs7MkZBU1QsWUFBWTtrQkFaeEIsU0FBUzsrQkFDQyxlQUFlLGNBQ2IsSUFBSSxXQUNQLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxtQkFDTCx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFlBRXBDLGdFQUFnRTt3QkFDaEUsa0hBQWtIO3dCQUNsSCxnQkFBZ0I7OEJBU1IsY0FBYztzQkFBdEIsS0FBSztnQkFRRyxNQUFNO3NCQUFkLEtBQUs7Z0JBTUcsSUFBSTtzQkFBWixLQUFLO2dCQVlHLGVBQWU7c0JBQXZCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcmVnRXhwRXNjYXBlLCB0b1N0cmluZywgcmVtb3ZlQWNjZW50cyB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBOZ0ZvciwgTmdJZiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbi8qKlxuICogQSBjb21wb25lbnQgdGhhdCBoZWxwcyB3aXRoIHRleHQgaGlnaGxpZ2h0aW5nLlxuICpcbiAqIEl0IHNwbGl0cyB0aGUgYHJlc3VsdGAgdGV4dCBpbnRvIHBhcnRzIHRoYXQgY29udGFpbiB0aGUgc2VhcmNoZWQgYHRlcm1gIGFuZCBnZW5lcmF0ZXMgdGhlIEhUTUwgbWFya3VwIHRvIHNpbXBsaWZ5XG4gKiBoaWdobGlnaHRpbmc6XG4gKlxuICogRXguIGByZXN1bHQ9XCJBbGFza2FcImAgYW5kIGB0ZXJtPVwiYXNcImAgd2lsbCBwcm9kdWNlIGBBbDxzcGFuIGNsYXNzPVwibmdiLWhpZ2hsaWdodFwiPmFzPC9zcGFuPmthYC5cbiAqL1xuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLWhpZ2hsaWdodCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGltcG9ydHM6IFtOZ0lmLCBOZ0Zvcl0sXG5cdGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuXHR0ZW1wbGF0ZTpcblx0XHRgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cInBhcnRzXCIgbGV0LXBhcnQgbGV0LWlzT2RkPVwib2RkXCI+YCArXG5cdFx0YDxzcGFuICpuZ0lmPVwiaXNPZGQ7IGVsc2UgZXZlblwiIFtjbGFzc109XCJoaWdobGlnaHRDbGFzc1wiPnt7cGFydH19PC9zcGFuPjxuZy10ZW1wbGF0ZSAjZXZlbj57e3BhcnR9fTwvbmctdGVtcGxhdGU+YCArXG5cdFx0YDwvbmctdGVtcGxhdGU+YCwgLy8gdGVtcGxhdGUgbmVlZHMgdG8gYmUgZm9ybWF0dGVkIGluIGEgY2VydGFpbiB3YXkgc28gd2UgZG9uJ3QgYWRkIGVtcHR5IHRleHQgbm9kZXNcblx0c3R5bGVVcmxzOiBbJy4vaGlnaGxpZ2h0LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiSGlnaGxpZ2h0IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblx0cGFydHM6IHN0cmluZ1tdO1xuXG5cdC8qKlxuXHQgKiBUaGUgQ1NTIGNsYXNzIGZvciBgPHNwYW4+YCBlbGVtZW50cyB3cmFwcGluZyB0aGUgYHRlcm1gIGluc2lkZSB0aGUgYHJlc3VsdGAuXG5cdCAqL1xuXHRASW5wdXQoKSBoaWdobGlnaHRDbGFzcyA9ICduZ2ItaGlnaGxpZ2h0JztcblxuXHQvKipcblx0ICogVGhlIHRleHQgaGlnaGxpZ2h0aW5nIGlzIGFkZGVkIHRvLlxuXHQgKlxuXHQgKiBJZiB0aGUgYHRlcm1gIGlzIGZvdW5kIGluc2lkZSB0aGlzIHRleHQsIGl0IHdpbGwgYmUgaGlnaGxpZ2h0ZWQuXG5cdCAqIElmIHRoZSBgdGVybWAgY29udGFpbnMgYXJyYXkgdGhlbiBhbGwgdGhlIGl0ZW1zIGZyb20gaXQgd2lsbCBiZSBoaWdobGlnaHRlZCBpbnNpZGUgdGhlIHRleHQuXG5cdCAqL1xuXHRASW5wdXQoKSByZXN1bHQ/OiBzdHJpbmcgfCBudWxsO1xuXG5cdC8qKlxuXHQgKiBUaGUgdGVybSBvciBhcnJheSBvZiB0ZXJtcyB0byBiZSBoaWdobGlnaHRlZC5cblx0ICogU2luY2UgdmVyc2lvbiBgdjQuMi4wYCB0ZXJtIGNvdWxkIGJlIGEgYHN0cmluZ1tdYFxuXHQgKi9cblx0QElucHV0KCkgdGVybTogc3RyaW5nIHwgcmVhZG9ubHkgc3RyaW5nW107XG5cblx0LyoqXG5cdCAqIEJvb2xlYW4gb3B0aW9uIHRvIGRldGVybWluZSBpZiB0aGUgaGlnaGxpZ2h0aW5nIHNob3VsZCBiZSBzZW5zaXRpdmUgdG8gYWNjZW50cyBvciBub3QuXG5cdCAqXG5cdCAqIFRoaXMgZmVhdHVyZSBpcyBvbmx5IGF2YWlsYWJsZSBmb3IgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnQgdGhlIGBTdHJpbmcubm9ybWFsaXplYCBmdW5jdGlvblxuXHQgKiAodHlwaWNhbGx5IG5vdCBJbnRlcm5ldCBFeHBsb3JlcikuXG5cdCAqIElmIHlvdSB3YW50IHRvIHVzZSB0aGlzIGZlYXR1cmUgaW4gYSBicm93c2VyIHRoYXQgZG9lcyBub3QgaW1wbGVtZW50IGBTdHJpbmcubm9ybWFsaXplYCxcblx0ICogeW91IHdpbGwgaGF2ZSB0byBpbmNsdWRlIGEgcG9seWZpbGwgaW4geW91ciBhcHBsaWNhdGlvbiAoYHVub3JtYCBmb3IgZXhhbXBsZSkuXG5cdCAqXG5cdCAqIEBzaW5jZSA5LjEuMFxuXHQgKi9cblx0QElucHV0KCkgYWNjZW50U2Vuc2l0aXZlID0gdHJ1ZTtcblxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG5cdFx0aWYgKCF0aGlzLmFjY2VudFNlbnNpdGl2ZSAmJiAhU3RyaW5nLnByb3RvdHlwZS5ub3JtYWxpemUpIHtcblx0XHRcdGNvbnNvbGUud2Fybihcblx0XHRcdFx0J1RoZSBgYWNjZW50U2Vuc2l0aXZlYCBpbnB1dCBpbiBgbmdiLWhpZ2hsaWdodGAgY2Fubm90IGJlIHNldCB0byBgZmFsc2VgIGluIGEgYnJvd3NlciAnICtcblx0XHRcdFx0XHQndGhhdCBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIGBTdHJpbmcubm9ybWFsaXplYCBmdW5jdGlvbi4gJyArXG5cdFx0XHRcdFx0J1lvdSB3aWxsIGhhdmUgdG8gaW5jbHVkZSBhIHBvbHlmaWxsIGluIHlvdXIgYXBwbGljYXRpb24gdG8gdXNlIHRoaXMgZmVhdHVyZSBpbiB0aGUgY3VycmVudCBicm93c2VyLicsXG5cdFx0XHQpO1xuXHRcdFx0dGhpcy5hY2NlbnRTZW5zaXRpdmUgPSB0cnVlO1xuXHRcdH1cblx0XHRjb25zdCByZXN1bHQgPSB0b1N0cmluZyh0aGlzLnJlc3VsdCk7XG5cblx0XHRjb25zdCB0ZXJtcyA9IEFycmF5LmlzQXJyYXkodGhpcy50ZXJtKSA/IHRoaXMudGVybSA6IFt0aGlzLnRlcm1dO1xuXHRcdGNvbnN0IHByZXBhcmVUZXJtID0gKHRlcm0pID0+ICh0aGlzLmFjY2VudFNlbnNpdGl2ZSA/IHRlcm0gOiByZW1vdmVBY2NlbnRzKHRlcm0pKTtcblx0XHRjb25zdCBlc2NhcGVkVGVybXMgPSB0ZXJtcy5tYXAoKHRlcm0pID0+IHJlZ0V4cEVzY2FwZShwcmVwYXJlVGVybSh0b1N0cmluZyh0ZXJtKSkpKS5maWx0ZXIoKHRlcm0pID0+IHRlcm0pO1xuXHRcdGNvbnN0IHRvU3BsaXQgPSB0aGlzLmFjY2VudFNlbnNpdGl2ZSA/IHJlc3VsdCA6IHJlbW92ZUFjY2VudHMocmVzdWx0KTtcblxuXHRcdGNvbnN0IHBhcnRzID0gZXNjYXBlZFRlcm1zLmxlbmd0aCA/IHRvU3BsaXQuc3BsaXQobmV3IFJlZ0V4cChgKCR7ZXNjYXBlZFRlcm1zLmpvaW4oJ3wnKX0pYCwgJ2dtaScpKSA6IFtyZXN1bHRdO1xuXG5cdFx0aWYgKHRoaXMuYWNjZW50U2Vuc2l0aXZlKSB7XG5cdFx0XHR0aGlzLnBhcnRzID0gcGFydHM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBvZmZzZXQgPSAwO1xuXHRcdFx0dGhpcy5wYXJ0cyA9IHBhcnRzLm1hcCgocGFydCkgPT4gcmVzdWx0LnN1YnN0cmluZyhvZmZzZXQsIChvZmZzZXQgKz0gcGFydC5sZW5ndGgpKSk7XG5cdFx0fVxuXHR9XG59XG4iXX0=