import { isInteger } from '../util/util';
/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `NgbDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `NgbDateStruct`, but return `NgbDate`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`NgbCalendar`](#/components/datepicker/api#NgbCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 *
 * @since 3.0.0
 */
export class NgbDate {
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * A **static method** that creates a new date object from the `NgbDateStruct`,
     *
     * ex. `NgbDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `NgbDate` type, the method will return the same object.
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    /**
     * Checks if the current date is equal to another date.
     */
    equals(other) {
        return other != null && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if the current date is before another date.
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if the current date is after another date.
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9uZ2ItZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxPQUFPLE9BQU87SUE4Qm5CLFlBQVksSUFBWSxFQUFFLEtBQWEsRUFBRSxHQUFXO1FBQ25ELElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLElBQUksQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxJQUFJLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sSUFBSSxDQUFDO0lBQzdDLENBQUM7SUFsQkQ7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUEyQjtRQUN0QyxJQUFJLElBQUksWUFBWSxPQUFPLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUNELE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDbkUsQ0FBQztJQVFEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLEtBQTRCO1FBQ2xDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUMxRyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsS0FBNEI7UUFDbEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNYLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRTtZQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDL0IsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO2FBQzdEO2lCQUFNO2dCQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2hDO1NBQ0Q7YUFBTTtZQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQzlCO0lBQ0YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLEtBQTRCO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDWCxPQUFPLEtBQUssQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQzthQUM3RDtpQkFBTTtnQkFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNoQztTQUNEO2FBQU07WUFDTixPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztTQUM5QjtJQUNGLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nYkRhdGVTdHJ1Y3QgfSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQgeyBpc0ludGVnZXIgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEEgc2ltcGxlIGNsYXNzIHRoYXQgcmVwcmVzZW50cyBhIGRhdGUgdGhhdCBkYXRlcGlja2VyIGFsc28gdXNlcyBpbnRlcm5hbGx5LlxuICpcbiAqIEl0IGlzIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYE5nYkRhdGVTdHJ1Y3RgIGludGVyZmFjZSB0aGF0IGFkZHMgc29tZSBjb252ZW5pZW5jZSBtZXRob2RzLFxuICogbGlrZSBgLmVxdWFscygpYCwgYC5iZWZvcmUoKWAsIGV0Yy5cbiAqXG4gKiBBbGwgZGF0ZXBpY2tlciBBUElzIGNvbnN1bWUgYE5nYkRhdGVTdHJ1Y3RgLCBidXQgcmV0dXJuIGBOZ2JEYXRlYC5cbiAqXG4gKiBJbiBtYW55IGNhc2VzIGl0IGlzIHNpbXBsZXIgdG8gbWFuaXB1bGF0ZSB0aGVzZSBvYmplY3RzIHRvZ2V0aGVyIHdpdGhcbiAqIFtgTmdiQ2FsZW5kYXJgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiQ2FsZW5kYXIpIHRoYW4gbmF0aXZlIEpTIERhdGVzLlxuICpcbiAqIFNlZSB0aGUgW2RhdGUgZm9ybWF0IG92ZXJ2aWV3XSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9vdmVydmlldyNkYXRlLW1vZGVsKSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzaW5jZSAzLjAuMFxuICovXG5leHBvcnQgY2xhc3MgTmdiRGF0ZSBpbXBsZW1lbnRzIE5nYkRhdGVTdHJ1Y3Qge1xuXHQvKipcblx0ICogVGhlIHllYXIsIGZvciBleGFtcGxlIDIwMTZcblx0ICovXG5cdHllYXI6IG51bWJlcjtcblxuXHQvKipcblx0ICogVGhlIG1vbnRoLCBmb3IgZXhhbXBsZSAxPUphbiAuLi4gMTI9RGVjIGFzIGluIElTTyA4NjAxXG5cdCAqL1xuXHRtb250aDogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBUaGUgZGF5IG9mIG1vbnRoLCBzdGFydGluZyB3aXRoIDFcblx0ICovXG5cdGRheTogbnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBBICoqc3RhdGljIG1ldGhvZCoqIHRoYXQgY3JlYXRlcyBhIG5ldyBkYXRlIG9iamVjdCBmcm9tIHRoZSBgTmdiRGF0ZVN0cnVjdGAsXG5cdCAqXG5cdCAqIGV4LiBgTmdiRGF0ZS5mcm9tKHt5ZWFyOiAyMDAwLCBtb250aDogNSwgZGF5OiAxfSlgLlxuXHQgKlxuXHQgKiBJZiB0aGUgYGRhdGVgIGlzIGFscmVhZHkgb2YgYE5nYkRhdGVgIHR5cGUsIHRoZSBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIHNhbWUgb2JqZWN0LlxuXHQgKi9cblx0c3RhdGljIGZyb20oZGF0ZT86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogTmdiRGF0ZSB8IG51bGwge1xuXHRcdGlmIChkYXRlIGluc3RhbmNlb2YgTmdiRGF0ZSkge1xuXHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0fVxuXHRcdHJldHVybiBkYXRlID8gbmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSkgOiBudWxsO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyLCBkYXk6IG51bWJlcikge1xuXHRcdHRoaXMueWVhciA9IGlzSW50ZWdlcih5ZWFyKSA/IHllYXIgOiA8YW55Pm51bGw7XG5cdFx0dGhpcy5tb250aCA9IGlzSW50ZWdlcihtb250aCkgPyBtb250aCA6IDxhbnk+bnVsbDtcblx0XHR0aGlzLmRheSA9IGlzSW50ZWdlcihkYXkpID8gZGF5IDogPGFueT5udWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBkYXRlIGlzIGVxdWFsIHRvIGFub3RoZXIgZGF0ZS5cblx0ICovXG5cdGVxdWFscyhvdGhlcj86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIG90aGVyICE9IG51bGwgJiYgdGhpcy55ZWFyID09PSBvdGhlci55ZWFyICYmIHRoaXMubW9udGggPT09IG90aGVyLm1vbnRoICYmIHRoaXMuZGF5ID09PSBvdGhlci5kYXk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IGRhdGUgaXMgYmVmb3JlIGFub3RoZXIgZGF0ZS5cblx0ICovXG5cdGJlZm9yZShvdGhlcj86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogYm9vbGVhbiB7XG5cdFx0aWYgKCFvdGhlcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnllYXIgPT09IG90aGVyLnllYXIpIHtcblx0XHRcdGlmICh0aGlzLm1vbnRoID09PSBvdGhlci5tb250aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXkgPT09IG90aGVyLmRheSA/IGZhbHNlIDogdGhpcy5kYXkgPCBvdGhlci5kYXk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tb250aCA8IG90aGVyLm1vbnRoO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy55ZWFyIDwgb3RoZXIueWVhcjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IGRhdGUgaXMgYWZ0ZXIgYW5vdGhlciBkYXRlLlxuXHQgKi9cblx0YWZ0ZXIob3RoZXI/OiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IGJvb2xlYW4ge1xuXHRcdGlmICghb3RoZXIpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0aWYgKHRoaXMueWVhciA9PT0gb3RoZXIueWVhcikge1xuXHRcdFx0aWYgKHRoaXMubW9udGggPT09IG90aGVyLm1vbnRoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmRheSA9PT0gb3RoZXIuZGF5ID8gZmFsc2UgOiB0aGlzLmRheSA+IG90aGVyLmRheTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLm1vbnRoID4gb3RoZXIubW9udGg7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLnllYXIgPiBvdGhlci55ZWFyO1xuXHRcdH1cblx0fVxufVxuIl19