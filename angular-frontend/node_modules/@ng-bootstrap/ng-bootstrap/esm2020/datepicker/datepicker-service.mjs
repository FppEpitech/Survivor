import { NgbDate } from './ngb-date';
import { Injectable } from '@angular/core';
import { isInteger, toInteger } from '../util/util';
import { Subject } from 'rxjs';
import { buildMonths, checkDateInRange, checkMinBeforeMax, generateSelectBoxMonths, generateSelectBoxYears, isChangedDate, isChangedMonth, isDateSelectable, nextMonthDisabled, prevMonthDisabled, } from './datepicker-tools';
import { filter } from 'rxjs/operators';
import { TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./ngb-calendar";
import * as i2 from "./datepicker-i18n";
export class NgbDatepickerService {
    constructor(_calendar, _i18n) {
        this._calendar = _calendar;
        this._i18n = _i18n;
        this._VALIDATORS = {
            dayTemplateData: (dayTemplateData) => {
                if (this._state.dayTemplateData !== dayTemplateData) {
                    return { dayTemplateData };
                }
            },
            displayMonths: (displayMonths) => {
                displayMonths = toInteger(displayMonths);
                if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
                    return { displayMonths };
                }
            },
            disabled: (disabled) => {
                if (this._state.disabled !== disabled) {
                    return { disabled };
                }
            },
            firstDayOfWeek: (firstDayOfWeek) => {
                firstDayOfWeek = toInteger(firstDayOfWeek);
                if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
                    return { firstDayOfWeek };
                }
            },
            focusVisible: (focusVisible) => {
                if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
                    return { focusVisible };
                }
            },
            markDisabled: (markDisabled) => {
                if (this._state.markDisabled !== markDisabled) {
                    return { markDisabled };
                }
            },
            maxDate: (date) => {
                const maxDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.maxDate, maxDate)) {
                    return { maxDate };
                }
            },
            minDate: (date) => {
                const minDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.minDate, minDate)) {
                    return { minDate };
                }
            },
            navigation: (navigation) => {
                if (this._state.navigation !== navigation) {
                    return { navigation };
                }
            },
            outsideDays: (outsideDays) => {
                if (this._state.outsideDays !== outsideDays) {
                    return { outsideDays };
                }
            },
            weekdays: (weekdays) => {
                const weekdayWidth = weekdays === true || weekdays === false ? TranslationWidth.Short : weekdays;
                const weekdaysVisible = weekdays === true || weekdays === false ? weekdays : true;
                if (this._state.weekdayWidth !== weekdayWidth || this._state.weekdaysVisible !== weekdaysVisible) {
                    return { weekdayWidth, weekdaysVisible };
                }
            },
        };
        this._model$ = new Subject();
        this._dateSelect$ = new Subject();
        this._state = {
            dayTemplateData: null,
            markDisabled: null,
            maxDate: null,
            minDate: null,
            disabled: false,
            displayMonths: 1,
            firstDate: null,
            firstDayOfWeek: 1,
            lastDate: null,
            focusDate: null,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectedDate: null,
            selectBoxes: { years: [], months: [] },
            weekdayWidth: TranslationWidth.Short,
            weekdaysVisible: true,
        };
    }
    get model$() {
        return this._model$.pipe(filter((model) => model.months.length > 0));
    }
    get dateSelect$() {
        return this._dateSelect$.pipe(filter((date) => date !== null));
    }
    set(options) {
        let patch = Object.keys(options)
            .map((key) => this._VALIDATORS[key](options[key]))
            .reduce((obj, part) => ({ ...obj, ...part }), {});
        if (Object.keys(patch).length > 0) {
            this._nextState(patch);
        }
    }
    focus(date) {
        const focusedDate = this.toValidDate(date, null);
        if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
            this._nextState({ focusDate: date });
        }
    }
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    open(date) {
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (firstDate != null &&
            !this._state.disabled &&
            (!this._state.firstDate || isChangedMonth(this._state.firstDate, firstDate))) {
            this._nextState({ firstDate });
        }
    }
    select(date, options = {}) {
        const selectedDate = this.toValidDate(date, null);
        if (selectedDate != null && !this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._dateSelect$.next(selectedDate);
            }
        }
    }
    toValidDate(date, defaultValue) {
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    getMonth(struct) {
        for (let month of this._state.months) {
            if (struct.month === month.number && struct.year === month.year) {
                return month;
            }
        }
        throw new Error(`month ${struct.month} of year ${struct.year} not found`);
    }
    _nextState(patch) {
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach((month) => {
            month.weeks.forEach((week) => {
                week.days.forEach((day) => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex =
                        !disabled && focusDate && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden =
                            outsideDays === 'hidden' ||
                                outsideDays === 'collapsed' ||
                                (displayMonths > 1 &&
                                    day.date.after(months[0].firstDate) &&
                                    day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    _updateState(patch) {
        // patching fields
        const state = Object.assign({}, this._state, patch);
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // terminate early if only focus visibility was changed
        if ('focusVisible' in patch) {
            return state;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 &&
                state.focusDate &&
                !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            const forceRebuild = 'dayTemplateData' in patch ||
                'firstDayOfWeek' in patch ||
                'markDisabled' in patch ||
                'minDate' in patch ||
                'maxDate' in patch ||
                'disabled' in patch ||
                'outsideDays' in patch ||
                'weekdaysVisible' in patch;
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months[0].firstDate;
            state.lastDate = months[months.length - 1].lastDate;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            // adjusting months/years for the select box navigation
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months = generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
}
NgbDatepickerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerService, deps: [{ token: i1.NgbCalendar }, { token: i2.NgbDatepickerI18n }], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbDatepickerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgbCalendar }, { type: i2.NgbDatepickerI18n }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFDTixXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLGFBQWEsRUFDYixjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsR0FDakIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFpQm5ELE1BQU0sT0FBTyxvQkFBb0I7SUFnSGhDLFlBQW9CLFNBQXNCLEVBQVUsS0FBd0I7UUFBeEQsY0FBUyxHQUFULFNBQVMsQ0FBYTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBL0dwRSxnQkFBVyxHQUVmO1lBQ0gsZUFBZSxFQUFFLENBQUMsZUFBbUMsRUFBRSxFQUFFO2dCQUN4RCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxLQUFLLGVBQWUsRUFBRTtvQkFDcEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDO2lCQUMzQjtZQUNGLENBQUM7WUFDRCxhQUFhLEVBQUUsQ0FBQyxhQUFxQixFQUFFLEVBQUU7Z0JBQ3hDLGFBQWEsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLENB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QUssUUFBUSxDQUFDO2dCQUNoRSxDQUFDLFlBQVksSUFBSSxXQUFXLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxTQUFTLElBQUksS0FBSyxJQUFJLFVBQVUsSUFBSSxLQUFLLENBQUMsRUFDL0Y7Z0JBQ0QsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pHLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hHO1NBQ0Q7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7O2lIQXhVVyxvQkFBb0I7cUhBQXBCLG9CQUFvQjsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdiQ2FsZW5kYXIgfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQgeyBOZ2JEYXRlIH0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQgeyBOZ2JEYXRlU3RydWN0IH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHsgRGF0ZXBpY2tlclZpZXdNb2RlbCwgTmdiRGF5VGVtcGxhdGVEYXRhLCBOZ2JNYXJrRGlzYWJsZWQgfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBpc0ludGVnZXIsIHRvSW50ZWdlciB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuXHRidWlsZE1vbnRocyxcblx0Y2hlY2tEYXRlSW5SYW5nZSxcblx0Y2hlY2tNaW5CZWZvcmVNYXgsXG5cdGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzLFxuXHRnZW5lcmF0ZVNlbGVjdEJveFllYXJzLFxuXHRpc0NoYW5nZWREYXRlLFxuXHRpc0NoYW5nZWRNb250aCxcblx0aXNEYXRlU2VsZWN0YWJsZSxcblx0bmV4dE1vbnRoRGlzYWJsZWQsXG5cdHByZXZNb250aERpc2FibGVkLFxufSBmcm9tICcuL2RhdGVwaWNrZXItdG9vbHMnO1xuXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOZ2JEYXRlcGlja2VySTE4biB9IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7IFRyYW5zbGF0aW9uV2lkdGggfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyU2VydmljZUlucHV0cyA9IFBhcnRpYWw8e1xuXHRkYXlUZW1wbGF0ZURhdGE6IE5nYkRheVRlbXBsYXRlRGF0YTtcblx0ZGlzcGxheU1vbnRoczogbnVtYmVyO1xuXHRkaXNhYmxlZDogYm9vbGVhbjtcblx0Zmlyc3REYXlPZldlZWs6IG51bWJlcjtcblx0Zm9jdXNWaXNpYmxlOiBib29sZWFuO1xuXHRtYXJrRGlzYWJsZWQ6IE5nYk1hcmtEaXNhYmxlZDtcblx0bWF4RGF0ZTogTmdiRGF0ZSB8IG51bGw7XG5cdG1pbkRhdGU6IE5nYkRhdGUgfCBudWxsO1xuXHRuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnO1xuXHRvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJztcblx0d2Vla2RheXM6IFRyYW5zbGF0aW9uV2lkdGggfCBib29sZWFuO1xufT47XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyU2VydmljZSB7XG5cdHByaXZhdGUgX1ZBTElEQVRPUlM6IHtcblx0XHRbSyBpbiBrZXlvZiBEYXRlcGlja2VyU2VydmljZUlucHV0c106ICh2OiBEYXRlcGlja2VyU2VydmljZUlucHV0c1tLXSkgPT4gUGFydGlhbDxEYXRlcGlja2VyVmlld01vZGVsPiB8IHZvaWQ7XG5cdH0gPSB7XG5cdFx0ZGF5VGVtcGxhdGVEYXRhOiAoZGF5VGVtcGxhdGVEYXRhOiBOZ2JEYXlUZW1wbGF0ZURhdGEpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5kYXlUZW1wbGF0ZURhdGEgIT09IGRheVRlbXBsYXRlRGF0YSkge1xuXHRcdFx0XHRyZXR1cm4geyBkYXlUZW1wbGF0ZURhdGEgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdGRpc3BsYXlNb250aHM6IChkaXNwbGF5TW9udGhzOiBudW1iZXIpID0+IHtcblx0XHRcdGRpc3BsYXlNb250aHMgPSB0b0ludGVnZXIoZGlzcGxheU1vbnRocyk7XG5cdFx0XHRpZiAoaXNJbnRlZ2VyKGRpc3BsYXlNb250aHMpICYmIGRpc3BsYXlNb250aHMgPiAwICYmIHRoaXMuX3N0YXRlLmRpc3BsYXlNb250aHMgIT09IGRpc3BsYXlNb250aHMpIHtcblx0XHRcdFx0cmV0dXJuIHsgZGlzcGxheU1vbnRocyB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0ZGlzYWJsZWQ6IChkaXNhYmxlZDogYm9vbGVhbikgPT4ge1xuXHRcdFx0aWYgKHRoaXMuX3N0YXRlLmRpc2FibGVkICE9PSBkaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4geyBkaXNhYmxlZCB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Zmlyc3REYXlPZldlZWs6IChmaXJzdERheU9mV2VlazogbnVtYmVyKSA9PiB7XG5cdFx0XHRmaXJzdERheU9mV2VlayA9IHRvSW50ZWdlcihmaXJzdERheU9mV2Vlayk7XG5cdFx0XHRpZiAoaXNJbnRlZ2VyKGZpcnN0RGF5T2ZXZWVrKSAmJiBmaXJzdERheU9mV2VlayA+PSAwICYmIHRoaXMuX3N0YXRlLmZpcnN0RGF5T2ZXZWVrICE9PSBmaXJzdERheU9mV2Vlaykge1xuXHRcdFx0XHRyZXR1cm4geyBmaXJzdERheU9mV2VlayB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Zm9jdXNWaXNpYmxlOiAoZm9jdXNWaXNpYmxlOiBib29sZWFuKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUuZm9jdXNWaXNpYmxlICE9PSBmb2N1c1Zpc2libGUgJiYgIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG5cdFx0XHRcdHJldHVybiB7IGZvY3VzVmlzaWJsZSB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWFya0Rpc2FibGVkOiAobWFya0Rpc2FibGVkOiBOZ2JNYXJrRGlzYWJsZWQpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5tYXJrRGlzYWJsZWQgIT09IG1hcmtEaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4geyBtYXJrRGlzYWJsZWQgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1heERhdGU6IChkYXRlOiBOZ2JEYXRlIHwgbnVsbCkgPT4ge1xuXHRcdFx0Y29uc3QgbWF4RGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG5cdFx0XHRpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5tYXhEYXRlLCBtYXhEYXRlKSkge1xuXHRcdFx0XHRyZXR1cm4geyBtYXhEYXRlIH07XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRtaW5EYXRlOiAoZGF0ZTogTmdiRGF0ZSB8IG51bGwpID0+IHtcblx0XHRcdGNvbnN0IG1pbkRhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuXHRcdFx0aWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUubWluRGF0ZSwgbWluRGF0ZSkpIHtcblx0XHRcdFx0cmV0dXJuIHsgbWluRGF0ZSB9O1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bmF2aWdhdGlvbjogKG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5uYXZpZ2F0aW9uICE9PSBuYXZpZ2F0aW9uKSB7XG5cdFx0XHRcdHJldHVybiB7IG5hdmlnYXRpb24gfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdG91dHNpZGVEYXlzOiAob3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbicpID0+IHtcblx0XHRcdGlmICh0aGlzLl9zdGF0ZS5vdXRzaWRlRGF5cyAhPT0gb3V0c2lkZURheXMpIHtcblx0XHRcdFx0cmV0dXJuIHsgb3V0c2lkZURheXMgfTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdlZWtkYXlzOiAod2Vla2RheXM6IGJvb2xlYW4gfCBUcmFuc2xhdGlvbldpZHRoKSA9PiB7XG5cdFx0XHRjb25zdCB3ZWVrZGF5V2lkdGggPSB3ZWVrZGF5cyA9PT0gdHJ1ZSB8fCB3ZWVrZGF5cyA9PT0gZmFsc2UgPyBUcmFuc2xhdGlvbldpZHRoLlNob3J0IDogd2Vla2RheXM7XG5cdFx0XHRjb25zdCB3ZWVrZGF5c1Zpc2libGUgPSB3ZWVrZGF5cyA9PT0gdHJ1ZSB8fCB3ZWVrZGF5cyA9PT0gZmFsc2UgPyB3ZWVrZGF5cyA6IHRydWU7XG5cdFx0XHRpZiAodGhpcy5fc3RhdGUud2Vla2RheVdpZHRoICE9PSB3ZWVrZGF5V2lkdGggfHwgdGhpcy5fc3RhdGUud2Vla2RheXNWaXNpYmxlICE9PSB3ZWVrZGF5c1Zpc2libGUpIHtcblx0XHRcdFx0cmV0dXJuIHsgd2Vla2RheVdpZHRoLCB3ZWVrZGF5c1Zpc2libGUgfTtcblx0XHRcdH1cblx0XHR9LFxuXHR9O1xuXG5cdHByaXZhdGUgX21vZGVsJCA9IG5ldyBTdWJqZWN0PERhdGVwaWNrZXJWaWV3TW9kZWw+KCk7XG5cblx0cHJpdmF0ZSBfZGF0ZVNlbGVjdCQgPSBuZXcgU3ViamVjdDxOZ2JEYXRlPigpO1xuXG5cdHByaXZhdGUgX3N0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsID0ge1xuXHRcdGRheVRlbXBsYXRlRGF0YTogbnVsbCxcblx0XHRtYXJrRGlzYWJsZWQ6IG51bGwsXG5cdFx0bWF4RGF0ZTogbnVsbCxcblx0XHRtaW5EYXRlOiBudWxsLFxuXHRcdGRpc2FibGVkOiBmYWxzZSxcblx0XHRkaXNwbGF5TW9udGhzOiAxLFxuXHRcdGZpcnN0RGF0ZTogbnVsbCxcblx0XHRmaXJzdERheU9mV2VlazogMSxcblx0XHRsYXN0RGF0ZTogbnVsbCxcblx0XHRmb2N1c0RhdGU6IG51bGwsXG5cdFx0Zm9jdXNWaXNpYmxlOiBmYWxzZSxcblx0XHRtb250aHM6IFtdLFxuXHRcdG5hdmlnYXRpb246ICdzZWxlY3QnLFxuXHRcdG91dHNpZGVEYXlzOiAndmlzaWJsZScsXG5cdFx0cHJldkRpc2FibGVkOiBmYWxzZSxcblx0XHRuZXh0RGlzYWJsZWQ6IGZhbHNlLFxuXHRcdHNlbGVjdGVkRGF0ZTogbnVsbCxcblx0XHRzZWxlY3RCb3hlczogeyB5ZWFyczogW10sIG1vbnRoczogW10gfSxcblx0XHR3ZWVrZGF5V2lkdGg6IFRyYW5zbGF0aW9uV2lkdGguU2hvcnQsXG5cdFx0d2Vla2RheXNWaXNpYmxlOiB0cnVlLFxuXHR9O1xuXG5cdGdldCBtb2RlbCQoKTogT2JzZXJ2YWJsZTxEYXRlcGlja2VyVmlld01vZGVsPiB7XG5cdFx0cmV0dXJuIHRoaXMuX21vZGVsJC5waXBlKGZpbHRlcigobW9kZWwpID0+IG1vZGVsLm1vbnRocy5sZW5ndGggPiAwKSk7XG5cdH1cblxuXHRnZXQgZGF0ZVNlbGVjdCQoKTogT2JzZXJ2YWJsZTxOZ2JEYXRlPiB7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGVTZWxlY3QkLnBpcGUoZmlsdGVyKChkYXRlKSA9PiBkYXRlICE9PSBudWxsKSk7XG5cdH1cblxuXHRzZXQob3B0aW9uczogRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMpIHtcblx0XHRsZXQgcGF0Y2ggPSBPYmplY3Qua2V5cyhvcHRpb25zKVxuXHRcdFx0Lm1hcCgoa2V5KSA9PiB0aGlzLl9WQUxJREFUT1JTW2tleV0ob3B0aW9uc1trZXldKSlcblx0XHRcdC5yZWR1Y2UoKG9iaiwgcGFydCkgPT4gKHsgLi4ub2JqLCAuLi5wYXJ0IH0pLCB7fSk7XG5cblx0XHRpZiAoT2JqZWN0LmtleXMocGF0Y2gpLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoaXMuX25leHRTdGF0ZShwYXRjaCk7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBwcml2YXRlIF9pMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cblxuXHRmb2N1cyhkYXRlPzogTmdiRGF0ZSB8IG51bGwpIHtcblx0XHRjb25zdCBmb2N1c2VkRGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG5cdFx0aWYgKGZvY3VzZWREYXRlICE9IG51bGwgJiYgIXRoaXMuX3N0YXRlLmRpc2FibGVkICYmIGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUuZm9jdXNEYXRlLCBmb2N1c2VkRGF0ZSkpIHtcblx0XHRcdHRoaXMuX25leHRTdGF0ZSh7IGZvY3VzRGF0ZTogZGF0ZSB9KTtcblx0XHR9XG5cdH1cblxuXHRmb2N1c1NlbGVjdCgpIHtcblx0XHRpZiAoaXNEYXRlU2VsZWN0YWJsZSh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIHRoaXMuX3N0YXRlKSkge1xuXHRcdFx0dGhpcy5zZWxlY3QodGhpcy5fc3RhdGUuZm9jdXNEYXRlLCB7IGVtaXRFdmVudDogdHJ1ZSB9KTtcblx0XHR9XG5cdH1cblxuXHRvcGVuKGRhdGU/OiBOZ2JEYXRlIHwgbnVsbCkge1xuXHRcdGNvbnN0IGZpcnN0RGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgdGhpcy5fY2FsZW5kYXIuZ2V0VG9kYXkoKSk7XG5cdFx0aWYgKFxuXHRcdFx0Zmlyc3REYXRlICE9IG51bGwgJiZcblx0XHRcdCF0aGlzLl9zdGF0ZS5kaXNhYmxlZCAmJlxuXHRcdFx0KCF0aGlzLl9zdGF0ZS5maXJzdERhdGUgfHwgaXNDaGFuZ2VkTW9udGgodGhpcy5fc3RhdGUuZmlyc3REYXRlLCBmaXJzdERhdGUpKVxuXHRcdCkge1xuXHRcdFx0dGhpcy5fbmV4dFN0YXRlKHsgZmlyc3REYXRlIH0pO1xuXHRcdH1cblx0fVxuXG5cdHNlbGVjdChkYXRlPzogTmdiRGF0ZSB8IG51bGwsIG9wdGlvbnM6IHsgZW1pdEV2ZW50PzogYm9vbGVhbiB9ID0ge30pIHtcblx0XHRjb25zdCBzZWxlY3RlZERhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuXHRcdGlmIChzZWxlY3RlZERhdGUgIT0gbnVsbCAmJiAhdGhpcy5fc3RhdGUuZGlzYWJsZWQpIHtcblx0XHRcdGlmIChpc0NoYW5nZWREYXRlKHRoaXMuX3N0YXRlLnNlbGVjdGVkRGF0ZSwgc2VsZWN0ZWREYXRlKSkge1xuXHRcdFx0XHR0aGlzLl9uZXh0U3RhdGUoeyBzZWxlY3RlZERhdGUgfSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRpb25zLmVtaXRFdmVudCAmJiBpc0RhdGVTZWxlY3RhYmxlKHNlbGVjdGVkRGF0ZSwgdGhpcy5fc3RhdGUpKSB7XG5cdFx0XHRcdHRoaXMuX2RhdGVTZWxlY3QkLm5leHQoc2VsZWN0ZWREYXRlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHR0b1ZhbGlkRGF0ZShkYXRlPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwsIGRlZmF1bHRWYWx1ZT86IE5nYkRhdGUgfCBudWxsKTogTmdiRGF0ZSB8IG51bGwge1xuXHRcdGNvbnN0IG5nYkRhdGUgPSBOZ2JEYXRlLmZyb20oZGF0ZSk7XG5cdFx0aWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRkZWZhdWx0VmFsdWUgPSB0aGlzLl9jYWxlbmRhci5nZXRUb2RheSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSA/IG5nYkRhdGUgOiBkZWZhdWx0VmFsdWU7XG5cdH1cblxuXHRnZXRNb250aChzdHJ1Y3Q6IE5nYkRhdGVTdHJ1Y3QpIHtcblx0XHRmb3IgKGxldCBtb250aCBvZiB0aGlzLl9zdGF0ZS5tb250aHMpIHtcblx0XHRcdGlmIChzdHJ1Y3QubW9udGggPT09IG1vbnRoLm51bWJlciAmJiBzdHJ1Y3QueWVhciA9PT0gbW9udGgueWVhcikge1xuXHRcdFx0XHRyZXR1cm4gbW9udGg7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRocm93IG5ldyBFcnJvcihgbW9udGggJHtzdHJ1Y3QubW9udGh9IG9mIHllYXIgJHtzdHJ1Y3QueWVhcn0gbm90IGZvdW5kYCk7XG5cdH1cblxuXHRwcml2YXRlIF9uZXh0U3RhdGUocGF0Y2g6IFBhcnRpYWw8RGF0ZXBpY2tlclZpZXdNb2RlbD4pIHtcblx0XHRjb25zdCBuZXdTdGF0ZSA9IHRoaXMuX3VwZGF0ZVN0YXRlKHBhdGNoKTtcblx0XHR0aGlzLl9wYXRjaENvbnRleHRzKG5ld1N0YXRlKTtcblx0XHR0aGlzLl9zdGF0ZSA9IG5ld1N0YXRlO1xuXHRcdHRoaXMuX21vZGVsJC5uZXh0KHRoaXMuX3N0YXRlKTtcblx0fVxuXG5cdHByaXZhdGUgX3BhdGNoQ29udGV4dHMoc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwpIHtcblx0XHRjb25zdCB7IG1vbnRocywgZGlzcGxheU1vbnRocywgc2VsZWN0ZWREYXRlLCBmb2N1c0RhdGUsIGZvY3VzVmlzaWJsZSwgZGlzYWJsZWQsIG91dHNpZGVEYXlzIH0gPSBzdGF0ZTtcblx0XHRzdGF0ZS5tb250aHMuZm9yRWFjaCgobW9udGgpID0+IHtcblx0XHRcdG1vbnRoLndlZWtzLmZvckVhY2goKHdlZWspID0+IHtcblx0XHRcdFx0d2Vlay5kYXlzLmZvckVhY2goKGRheSkgPT4ge1xuXHRcdFx0XHRcdC8vIHBhdGNoIGZvY3VzIGZsYWdcblx0XHRcdFx0XHRpZiAoZm9jdXNEYXRlKSB7XG5cdFx0XHRcdFx0XHRkYXkuY29udGV4dC5mb2N1c2VkID0gZm9jdXNEYXRlLmVxdWFscyhkYXkuZGF0ZSkgJiYgZm9jdXNWaXNpYmxlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIGNhbGN1bGF0aW5nIHRhYmluZGV4XG5cdFx0XHRcdFx0ZGF5LnRhYmluZGV4ID1cblx0XHRcdFx0XHRcdCFkaXNhYmxlZCAmJiBmb2N1c0RhdGUgJiYgZGF5LmRhdGUuZXF1YWxzKGZvY3VzRGF0ZSkgJiYgZm9jdXNEYXRlLm1vbnRoID09PSBtb250aC5udW1iZXIgPyAwIDogLTE7XG5cblx0XHRcdFx0XHQvLyBvdmVycmlkZSBjb250ZXh0IGRpc2FibGVkXG5cdFx0XHRcdFx0aWYgKGRpc2FibGVkID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRkYXkuY29udGV4dC5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gcGF0Y2ggc2VsZWN0aW9uIGZsYWdcblx0XHRcdFx0XHRpZiAoc2VsZWN0ZWREYXRlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGRheS5jb250ZXh0LnNlbGVjdGVkID0gc2VsZWN0ZWREYXRlICE9PSBudWxsICYmIHNlbGVjdGVkRGF0ZS5lcXVhbHMoZGF5LmRhdGUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIHZpc2liaWxpdHlcblx0XHRcdFx0XHRpZiAobW9udGgubnVtYmVyICE9PSBkYXkuZGF0ZS5tb250aCkge1xuXHRcdFx0XHRcdFx0ZGF5LmhpZGRlbiA9XG5cdFx0XHRcdFx0XHRcdG91dHNpZGVEYXlzID09PSAnaGlkZGVuJyB8fFxuXHRcdFx0XHRcdFx0XHRvdXRzaWRlRGF5cyA9PT0gJ2NvbGxhcHNlZCcgfHxcblx0XHRcdFx0XHRcdFx0KGRpc3BsYXlNb250aHMgPiAxICYmXG5cdFx0XHRcdFx0XHRcdFx0ZGF5LmRhdGUuYWZ0ZXIobW9udGhzWzBdLmZpcnN0RGF0ZSkgJiZcblx0XHRcdFx0XHRcdFx0XHRkYXkuZGF0ZS5iZWZvcmUobW9udGhzW2Rpc3BsYXlNb250aHMgLSAxXS5sYXN0RGF0ZSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX3VwZGF0ZVN0YXRlKHBhdGNoOiBQYXJ0aWFsPERhdGVwaWNrZXJWaWV3TW9kZWw+KTogRGF0ZXBpY2tlclZpZXdNb2RlbCB7XG5cdFx0Ly8gcGF0Y2hpbmcgZmllbGRzXG5cdFx0Y29uc3Qgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zdGF0ZSwgcGF0Y2gpO1xuXG5cdFx0bGV0IHN0YXJ0RGF0ZSA9IHN0YXRlLmZpcnN0RGF0ZTtcblxuXHRcdC8vIG1pbi9tYXggZGF0ZXMgY2hhbmdlZFxuXHRcdGlmICgnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoKSB7XG5cdFx0XHRjaGVja01pbkJlZm9yZU1heChzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdHN0YXRlLmZvY3VzRGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZm9jdXNEYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdHN0YXRlLmZpcnN0RGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdHN0YXJ0RGF0ZSA9IHN0YXRlLmZvY3VzRGF0ZTtcblx0XHR9XG5cblx0XHQvLyBkaXNhYmxlZFxuXHRcdGlmICgnZGlzYWJsZWQnIGluIHBhdGNoKSB7XG5cdFx0XHRzdGF0ZS5mb2N1c1Zpc2libGUgPSBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBpbml0aWFsIHJlYnVpbGQgdmlhICdzZWxlY3QoKSdcblx0XHRpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgdGhpcy5fc3RhdGUubW9udGhzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0c3RhcnREYXRlID0gc3RhdGUuc2VsZWN0ZWREYXRlO1xuXHRcdH1cblxuXHRcdC8vIHRlcm1pbmF0ZSBlYXJseSBpZiBvbmx5IGZvY3VzIHZpc2liaWxpdHkgd2FzIGNoYW5nZWRcblx0XHRpZiAoJ2ZvY3VzVmlzaWJsZScgaW4gcGF0Y2gpIHtcblx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHR9XG5cblx0XHQvLyBmb2N1cyBkYXRlIGNoYW5nZWRcblx0XHRpZiAoJ2ZvY3VzRGF0ZScgaW4gcGF0Y2gpIHtcblx0XHRcdHN0YXRlLmZvY3VzRGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZm9jdXNEYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdHN0YXJ0RGF0ZSA9IHN0YXRlLmZvY3VzRGF0ZTtcblxuXHRcdFx0Ly8gbm90aGluZyB0byByZWJ1aWxkIGlmIG9ubHkgZm9jdXMgY2hhbmdlZCBhbmQgaXQgaXMgc3RpbGwgdmlzaWJsZVxuXHRcdFx0aWYgKFxuXHRcdFx0XHRzdGF0ZS5tb250aHMubGVuZ3RoICE9PSAwICYmXG5cdFx0XHRcdHN0YXRlLmZvY3VzRGF0ZSAmJlxuXHRcdFx0XHQhc3RhdGUuZm9jdXNEYXRlLmJlZm9yZShzdGF0ZS5maXJzdERhdGUpICYmXG5cdFx0XHRcdCFzdGF0ZS5mb2N1c0RhdGUuYWZ0ZXIoc3RhdGUubGFzdERhdGUpXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuIHN0YXRlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGZpcnN0IGRhdGUgY2hhbmdlZFxuXHRcdGlmICgnZmlyc3REYXRlJyBpbiBwYXRjaCkge1xuXHRcdFx0c3RhdGUuZmlyc3REYXRlID0gY2hlY2tEYXRlSW5SYW5nZShzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuXHRcdFx0c3RhcnREYXRlID0gc3RhdGUuZmlyc3REYXRlO1xuXHRcdH1cblxuXHRcdC8vIHJlYnVpbGRpbmcgbW9udGhzXG5cdFx0aWYgKHN0YXJ0RGF0ZSkge1xuXHRcdFx0Y29uc3QgZm9yY2VSZWJ1aWxkID1cblx0XHRcdFx0J2RheVRlbXBsYXRlRGF0YScgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J2ZpcnN0RGF5T2ZXZWVrJyBpbiBwYXRjaCB8fFxuXHRcdFx0XHQnbWFya0Rpc2FibGVkJyBpbiBwYXRjaCB8fFxuXHRcdFx0XHQnbWluRGF0ZScgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J21heERhdGUnIGluIHBhdGNoIHx8XG5cdFx0XHRcdCdkaXNhYmxlZCcgaW4gcGF0Y2ggfHxcblx0XHRcdFx0J291dHNpZGVEYXlzJyBpbiBwYXRjaCB8fFxuXHRcdFx0XHQnd2Vla2RheXNWaXNpYmxlJyBpbiBwYXRjaDtcblxuXHRcdFx0Y29uc3QgbW9udGhzID0gYnVpbGRNb250aHModGhpcy5fY2FsZW5kYXIsIHN0YXJ0RGF0ZSwgc3RhdGUsIHRoaXMuX2kxOG4sIGZvcmNlUmVidWlsZCk7XG5cblx0XHRcdC8vIHVwZGF0aW5nIG1vbnRocyBhbmQgYm91bmRhcnkgZGF0ZXNcblx0XHRcdHN0YXRlLm1vbnRocyA9IG1vbnRocztcblx0XHRcdHN0YXRlLmZpcnN0RGF0ZSA9IG1vbnRoc1swXS5maXJzdERhdGU7XG5cdFx0XHRzdGF0ZS5sYXN0RGF0ZSA9IG1vbnRoc1ttb250aHMubGVuZ3RoIC0gMV0ubGFzdERhdGU7XG5cblx0XHRcdC8vIHJlc2V0IHNlbGVjdGVkIGRhdGUgaWYgJ21hcmtEaXNhYmxlZCcgcmV0dXJucyB0cnVlXG5cdFx0XHRpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgIWlzRGF0ZVNlbGVjdGFibGUoc3RhdGUuc2VsZWN0ZWREYXRlLCBzdGF0ZSkpIHtcblx0XHRcdFx0c3RhdGUuc2VsZWN0ZWREYXRlID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRqdXN0aW5nIGZvY3VzIGFmdGVyIG1vbnRocyB3ZXJlIGJ1aWx0XG5cdFx0XHRpZiAoJ2ZpcnN0RGF0ZScgaW4gcGF0Y2gpIHtcblx0XHRcdFx0aWYgKCFzdGF0ZS5mb2N1c0RhdGUgfHwgc3RhdGUuZm9jdXNEYXRlLmJlZm9yZShzdGF0ZS5maXJzdERhdGUpIHx8IHN0YXRlLmZvY3VzRGF0ZS5hZnRlcihzdGF0ZS5sYXN0RGF0ZSkpIHtcblx0XHRcdFx0XHRzdGF0ZS5mb2N1c0RhdGUgPSBzdGFydERhdGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYWRqdXN0aW5nIG1vbnRocy95ZWFycyBmb3IgdGhlIHNlbGVjdCBib3ggbmF2aWdhdGlvblxuXHRcdFx0Y29uc3QgeWVhckNoYW5nZWQgPSAhdGhpcy5fc3RhdGUuZmlyc3REYXRlIHx8IHRoaXMuX3N0YXRlLmZpcnN0RGF0ZS55ZWFyICE9PSBzdGF0ZS5maXJzdERhdGUueWVhcjtcblx0XHRcdGNvbnN0IG1vbnRoQ2hhbmdlZCA9ICF0aGlzLl9zdGF0ZS5maXJzdERhdGUgfHwgdGhpcy5fc3RhdGUuZmlyc3REYXRlLm1vbnRoICE9PSBzdGF0ZS5maXJzdERhdGUubW9udGg7XG5cdFx0XHRpZiAoc3RhdGUubmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpIHtcblx0XHRcdFx0Ly8geWVhcnMgLT4gIGJvdW5kYXJpZXMgKG1pbi9tYXggd2VyZSBjaGFuZ2VkKVxuXHRcdFx0XHRpZiAoJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCBzdGF0ZS5zZWxlY3RCb3hlcy55ZWFycy5sZW5ndGggPT09IDAgfHwgeWVhckNoYW5nZWQpIHtcblx0XHRcdFx0XHRzdGF0ZS5zZWxlY3RCb3hlcy55ZWFycyA9IGdlbmVyYXRlU2VsZWN0Qm94WWVhcnMoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG1vbnRocyAtPiB3aGVuIGN1cnJlbnQgeWVhciBvciBib3VuZGFyaWVzIGNoYW5nZVxuXHRcdFx0XHRpZiAoJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCBzdGF0ZS5zZWxlY3RCb3hlcy5tb250aHMubGVuZ3RoID09PSAwIHx8IHllYXJDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0c3RhdGUuc2VsZWN0Qm94ZXMubW9udGhzID0gZ2VuZXJhdGVTZWxlY3RCb3hNb250aHMoXG5cdFx0XHRcdFx0XHR0aGlzLl9jYWxlbmRhcixcblx0XHRcdFx0XHRcdHN0YXRlLmZpcnN0RGF0ZSxcblx0XHRcdFx0XHRcdHN0YXRlLm1pbkRhdGUsXG5cdFx0XHRcdFx0XHRzdGF0ZS5tYXhEYXRlLFxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN0YXRlLnNlbGVjdEJveGVzID0geyB5ZWFyczogW10sIG1vbnRoczogW10gfTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdXBkYXRpbmcgbmF2aWdhdGlvbiBhcnJvd3MgLT4gYm91bmRhcmllcyBjaGFuZ2UgKG1pbi9tYXgpIG9yIG1vbnRoL3llYXIgY2hhbmdlc1xuXHRcdFx0aWYgKFxuXHRcdFx0XHQoc3RhdGUubmF2aWdhdGlvbiA9PT0gJ2Fycm93cycgfHwgc3RhdGUubmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpICYmXG5cdFx0XHRcdChtb250aENoYW5nZWQgfHwgeWVhckNoYW5nZWQgfHwgJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCAnZGlzYWJsZWQnIGluIHBhdGNoKVxuXHRcdFx0KSB7XG5cdFx0XHRcdHN0YXRlLnByZXZEaXNhYmxlZCA9IHN0YXRlLmRpc2FibGVkIHx8IHByZXZNb250aERpc2FibGVkKHRoaXMuX2NhbGVuZGFyLCBzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUpO1xuXHRcdFx0XHRzdGF0ZS5uZXh0RGlzYWJsZWQgPSBzdGF0ZS5kaXNhYmxlZCB8fCBuZXh0TW9udGhEaXNhYmxlZCh0aGlzLl9jYWxlbmRhciwgc3RhdGUubGFzdERhdGUsIHN0YXRlLm1heERhdGUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBzdGF0ZTtcblx0fVxufVxuIl19