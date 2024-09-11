import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef, } from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '../util/util';
import { NgFor } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-i18n";
export class NgbDatepickerNavigationSelect {
    constructor(i18n, _renderer) {
        this.i18n = i18n;
        this._renderer = _renderer;
        this.select = new EventEmitter();
        this._month = -1;
        this._year = -1;
    }
    changeMonth(month) {
        this.select.emit(new NgbDate(this.date.year, toInteger(month), 1));
    }
    changeYear(year) {
        this.select.emit(new NgbDate(toInteger(year), this.date.month, 1));
    }
    ngAfterViewChecked() {
        if (this.date) {
            if (this.date.month !== this._month) {
                this._month = this.date.month;
                this._renderer.setProperty(this.monthSelect.nativeElement, 'value', this._month);
            }
            if (this.date.year !== this._year) {
                this._year = this.date.year;
                this._renderer.setProperty(this.yearSelect.nativeElement, 'value', this._year);
            }
        }
    }
}
NgbDatepickerNavigationSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerNavigationSelect, deps: [{ token: i1.NgbDatepickerI18n }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerNavigationSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbDatepickerNavigationSelect, isStandalone: true, selector: "ngb-datepicker-navigation-select", inputs: { date: "date", disabled: "disabled", months: "months", years: "years" }, outputs: { select: "select" }, viewQueries: [{ propertyName: "monthSelect", first: true, predicate: ["month"], descendants: true, read: ElementRef, static: true }, { propertyName: "yearSelect", first: true, predicate: ["year"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: `
		<select
			#month
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-month"
			aria-label="Select month"
			i18n-title="@@ngb.datepicker.select-month"
			title="Select month"
			(change)="changeMonth($any($event).target.value)"
		>
			<option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date.year)" [value]="m">{{
				i18n.getMonthShortName(m, date.year)
			}}</option> </select
		><select
			#year
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-year"
			aria-label="Select year"
			i18n-title="@@ngb.datepicker.select-year"
			title="Select year"
			(change)="changeYear($any($event).target.value)"
		>
			<option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
		</select>
	`, isInline: true, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"], dependencies: [{ kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerNavigationSelect, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-navigation-select', standalone: true, imports: [NgFor], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
		<select
			#month
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-month"
			aria-label="Select month"
			i18n-title="@@ngb.datepicker.select-month"
			title="Select month"
			(change)="changeMonth($any($event).target.value)"
		>
			<option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date.year)" [value]="m">{{
				i18n.getMonthShortName(m, date.year)
			}}</option> </select
		><select
			#year
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.datepicker.select-year"
			aria-label="Select year"
			i18n-title="@@ngb.datepicker.select-year"
			title="Select year"
			(change)="changeYear($any($event).target.value)"
		>
			<option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
		</select>
	`, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgbDatepickerI18n }, { type: i0.Renderer2 }]; }, propDecorators: { date: [{
                type: Input
            }], disabled: [{
                type: Input
            }], months: [{
                type: Input
            }], years: [{
                type: Input
            }], select: [{
                type: Output
            }], monthSelect: [{
                type: ViewChild,
                args: ['month', { static: true, read: ElementRef }]
            }], yearSelect: [{
                type: ViewChild,
                args: ['year', { static: true, read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNOLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBRWpCLFNBQVMsRUFDVCxVQUFVLEdBRVYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7O0FBcUN4QyxNQUFNLE9BQU8sNkJBQTZCO0lBY3pDLFlBQW1CLElBQXVCLEVBQVUsU0FBb0I7UUFBckQsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBUjlELFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBS3ZDLFdBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNaLFVBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV3RCxDQUFDO0lBRTVFLFdBQVcsQ0FBQyxLQUFhO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBWTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsa0JBQWtCO1FBQ2pCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNqRjtZQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMvRTtTQUNEO0lBQ0YsQ0FBQzs7MEhBbkNXLDZCQUE2Qjs4R0FBN0IsNkJBQTZCLDhSQVFDLFVBQVUsMkdBQ1gsVUFBVSwyQ0FyQ3pDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTBCVCx1VkE5QlMsS0FBSzsyRkFnQ0gsNkJBQTZCO2tCQW5DekMsU0FBUzsrQkFDQyxrQ0FBa0MsY0FDaEMsSUFBSSxXQUNQLENBQUMsS0FBSyxDQUFDLG1CQUNDLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUksWUFFM0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBMEJUO2dJQUdRLElBQUk7c0JBQVosS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUksTUFBTTtzQkFBZixNQUFNO2dCQUVpRCxXQUFXO3NCQUFsRSxTQUFTO3VCQUFDLE9BQU8sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtnQkFDQyxVQUFVO3NCQUFoRSxTQUFTO3VCQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdENvbXBvbmVudCxcblx0SW5wdXQsXG5cdE91dHB1dCxcblx0RXZlbnRFbWl0dGVyLFxuXHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcblx0Vmlld0VuY2Fwc3VsYXRpb24sXG5cdEFmdGVyVmlld0NoZWNrZWQsXG5cdFZpZXdDaGlsZCxcblx0RWxlbWVudFJlZixcblx0UmVuZGVyZXIyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYkRhdGUgfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7IHRvSW50ZWdlciB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VySTE4biB9IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7IE5nRm9yIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QnLFxuXHRzdGFuZGFsb25lOiB0cnVlLFxuXHRpbXBvcnRzOiBbTmdGb3JdLFxuXHRjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcblx0ZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcblx0c3R5bGVVcmxzOiBbJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdC5zY3NzJ10sXG5cdHRlbXBsYXRlOiBgXG5cdFx0PHNlbGVjdFxuXHRcdFx0I21vbnRoXG5cdFx0XHRbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuXHRcdFx0Y2xhc3M9XCJmb3JtLXNlbGVjdFwiXG5cdFx0XHRpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5kYXRlcGlja2VyLnNlbGVjdC1tb250aFwiXG5cdFx0XHRhcmlhLWxhYmVsPVwiU2VsZWN0IG1vbnRoXCJcblx0XHRcdGkxOG4tdGl0bGU9XCJAQG5nYi5kYXRlcGlja2VyLnNlbGVjdC1tb250aFwiXG5cdFx0XHR0aXRsZT1cIlNlbGVjdCBtb250aFwiXG5cdFx0XHQoY2hhbmdlKT1cImNoYW5nZU1vbnRoKCRhbnkoJGV2ZW50KS50YXJnZXQudmFsdWUpXCJcblx0XHQ+XG5cdFx0XHQ8b3B0aW9uICpuZ0Zvcj1cImxldCBtIG9mIG1vbnRoc1wiIFthdHRyLmFyaWEtbGFiZWxdPVwiaTE4bi5nZXRNb250aEZ1bGxOYW1lKG0sIGRhdGUueWVhcilcIiBbdmFsdWVdPVwibVwiPnt7XG5cdFx0XHRcdGkxOG4uZ2V0TW9udGhTaG9ydE5hbWUobSwgZGF0ZS55ZWFyKVxuXHRcdFx0fX08L29wdGlvbj4gPC9zZWxlY3Rcblx0XHQ+PHNlbGVjdFxuXHRcdFx0I3llYXJcblx0XHRcdFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG5cdFx0XHRjbGFzcz1cImZvcm0tc2VsZWN0XCJcblx0XHRcdGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIuc2VsZWN0LXllYXJcIlxuXHRcdFx0YXJpYS1sYWJlbD1cIlNlbGVjdCB5ZWFyXCJcblx0XHRcdGkxOG4tdGl0bGU9XCJAQG5nYi5kYXRlcGlja2VyLnNlbGVjdC15ZWFyXCJcblx0XHRcdHRpdGxlPVwiU2VsZWN0IHllYXJcIlxuXHRcdFx0KGNoYW5nZSk9XCJjaGFuZ2VZZWFyKCRhbnkoJGV2ZW50KS50YXJnZXQudmFsdWUpXCJcblx0XHQ+XG5cdFx0XHQ8b3B0aW9uICpuZ0Zvcj1cImxldCB5IG9mIHllYXJzXCIgW3ZhbHVlXT1cInlcIj57eyBpMThuLmdldFllYXJOdW1lcmFscyh5KSB9fTwvb3B0aW9uPlxuXHRcdDwvc2VsZWN0PlxuXHRgLFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvblNlbGVjdCBpbXBsZW1lbnRzIEFmdGVyVmlld0NoZWNrZWQge1xuXHRASW5wdXQoKSBkYXRlOiBOZ2JEYXRlO1xuXHRASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblx0QElucHV0KCkgbW9udGhzOiBudW1iZXJbXTtcblx0QElucHV0KCkgeWVhcnM6IG51bWJlcltdO1xuXG5cdEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cblx0QFZpZXdDaGlsZCgnbW9udGgnLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogRWxlbWVudFJlZiB9KSBtb250aFNlbGVjdDogRWxlbWVudFJlZjtcblx0QFZpZXdDaGlsZCgneWVhcicsIHsgc3RhdGljOiB0cnVlLCByZWFkOiBFbGVtZW50UmVmIH0pIHllYXJTZWxlY3Q6IEVsZW1lbnRSZWY7XG5cblx0cHJpdmF0ZSBfbW9udGggPSAtMTtcblx0cHJpdmF0ZSBfeWVhciA9IC0xO1xuXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4biwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuXHRjaGFuZ2VNb250aChtb250aDogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZWxlY3QuZW1pdChuZXcgTmdiRGF0ZSh0aGlzLmRhdGUueWVhciwgdG9JbnRlZ2VyKG1vbnRoKSwgMSkpO1xuXHR9XG5cblx0Y2hhbmdlWWVhcih5ZWFyOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNlbGVjdC5lbWl0KG5ldyBOZ2JEYXRlKHRvSW50ZWdlcih5ZWFyKSwgdGhpcy5kYXRlLm1vbnRoLCAxKSk7XG5cdH1cblxuXHRuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG5cdFx0aWYgKHRoaXMuZGF0ZSkge1xuXHRcdFx0aWYgKHRoaXMuZGF0ZS5tb250aCAhPT0gdGhpcy5fbW9udGgpIHtcblx0XHRcdFx0dGhpcy5fbW9udGggPSB0aGlzLmRhdGUubW9udGg7XG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMubW9udGhTZWxlY3QubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdGhpcy5fbW9udGgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuZGF0ZS55ZWFyICE9PSB0aGlzLl95ZWFyKSB7XG5cdFx0XHRcdHRoaXMuX3llYXIgPSB0aGlzLmRhdGUueWVhcjtcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy55ZWFyU2VsZWN0Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRoaXMuX3llYXIpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIl19