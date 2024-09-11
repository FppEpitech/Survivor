import { of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDefined } from '../util/util';
import { isPromise } from '../util/util';
/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.update()`, `.close()` or `.dismiss()` the modal window from your component.
 */
export class NgbActiveModal {
    /**
     * Updates options of an opened modal.
     *
     * @since 14.2.0
     */
    update(options) { }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbModalRef.result` promise will be resolved with the provided value.
     */
    close(result) { }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) { }
}
const WINDOW_ATTRIBUTES = [
    'animation',
    'ariaLabelledBy',
    'ariaDescribedBy',
    'backdrop',
    'centered',
    'fullscreen',
    'keyboard',
    'scrollable',
    'size',
    'windowClass',
    'modalDialogClass',
];
const BACKDROP_ATTRIBUTES = ['animation', 'backdropClass'];
/**
 * A reference to the newly opened modal returned by the `NgbModal.open()` method.
 */
export class NgbModalRef {
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        this._closed = new Subject();
        this._dismissed = new Subject();
        this._hidden = new Subject();
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => {
            this.dismiss(reason);
        });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    _applyWindowOptions(windowInstance, options) {
        WINDOW_ATTRIBUTES.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        BACKDROP_ATTRIBUTES.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * Updates options of an opened modal.
     *
     * @since 14.2.0
     */
    update(options) {
        this._applyWindowOptions(this._windowCmptRef.instance, options);
        if (this._backdropCmptRef && this._backdropCmptRef.instance) {
            this._applyBackdropOptions(this._backdropCmptRef.instance, options);
        }
    }
    /**
     * The instance of a component used for the modal content.
     *
     * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
     */
    get componentInstance() {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * The observable that emits when the modal is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     *
     * @since 8.0.0
     */
    get closed() {
        return this._closed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when the modal is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     *
     * @since 8.0.0
     */
    get dismissed() {
        return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
    }
    /**
     * The observable that emits when both modal window and backdrop are closed and animations were finished.
     * At this point modal and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     *
     * @since 8.0.0
     */
    get hidden() {
        return this._hidden.asObservable();
    }
    /**
     * The observable that emits when modal is fully visible and animation was finished.
     * Modal DOM element is always available synchronously after calling 'modal.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if modal is closed before open animation is finished.
     *
     * @since 8.0.0
     */
    get shown() {
        return this._windowCmptRef.instance.shown.asObservable();
    }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result) {
        if (this._windowCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeModalElements();
        }
    }
    _dismiss(reason) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                const dismiss = this._beforeDismiss();
                if (isPromise(dismiss)) {
                    dismiss.then((result) => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    _removeModalElements() {
        const windowTransition$ = this._windowCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);
        // hiding window
        windowTransition$.subscribe(() => {
            const { nativeElement } = this._windowCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._windowCmptRef.destroy();
            if (this._contentRef && this._contentRef.viewRef) {
                this._contentRef.viewRef.destroy();
            }
            this._windowCmptRef = null;
            this._contentRef = null;
        });
        // hiding backdrop
        backdropTransition$.subscribe(() => {
            if (this._backdropCmptRef) {
                const { nativeElement } = this._backdropCmptRef.location;
                nativeElement.parentNode.removeChild(nativeElement);
                this._backdropCmptRef.destroy();
                this._backdropCmptRef = null;
            }
        });
        // all done
        zip(windowTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFHekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6Qzs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyxjQUFjO0lBQzFCOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsT0FBaUMsSUFBUyxDQUFDO0lBQ2xEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsTUFBWSxJQUFTLENBQUM7SUFFNUI7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxNQUFZLElBQVMsQ0FBQztDQUM5QjtBQUVELE1BQU0saUJBQWlCLEdBQWE7SUFDbkMsV0FBVztJQUNYLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsVUFBVTtJQUNWLFVBQVU7SUFDVixZQUFZO0lBQ1osVUFBVTtJQUNWLFlBQVk7SUFDWixNQUFNO0lBQ04sYUFBYTtJQUNiLGtCQUFrQjtDQUNsQixDQUFDO0FBQ0YsTUFBTSxtQkFBbUIsR0FBYSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVyRTs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBbUd2QixZQUNTLGNBQTRDLEVBQzVDLFdBQXVCLEVBQ3ZCLGdCQUFpRCxFQUNqRCxjQUFpRDtRQUhqRCxtQkFBYyxHQUFkLGNBQWMsQ0FBOEI7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQztRQUNqRCxtQkFBYyxHQUFkLGNBQWMsQ0FBbUM7UUF0R2xELFlBQU8s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QUFRLElBQUksQ0FBQzthQUNsQztRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsV0FBVztRQUNYLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9ic2VydmFibGUsIG9mLCBTdWJqZWN0LCB6aXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTmdiTW9kYWxCYWNrZHJvcCB9IGZyb20gJy4vbW9kYWwtYmFja2Ryb3AnO1xuaW1wb3J0IHsgTmdiTW9kYWxXaW5kb3cgfSBmcm9tICcuL21vZGFsLXdpbmRvdyc7XG5pbXBvcnQgeyBOZ2JNb2RhbE9wdGlvbnMsIE5nYk1vZGFsVXBkYXRhYmxlT3B0aW9ucyB9IGZyb20gJy4vbW9kYWwtY29uZmlnJztcbmltcG9ydCB7IGlzRGVmaW5lZCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7IENvbnRlbnRSZWYgfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnRseSBvcGVuZWQgKGFjdGl2ZSkgbW9kYWwuXG4gKlxuICogSW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgY2FuIGJlIGluamVjdGVkIGludG8geW91ciBjb21wb25lbnQgcGFzc2VkIGFzIG1vZGFsIGNvbnRlbnQuXG4gKiBTbyB5b3UgY2FuIGAudXBkYXRlKClgLCBgLmNsb3NlKClgIG9yIGAuZGlzbWlzcygpYCB0aGUgbW9kYWwgd2luZG93IGZyb20geW91ciBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JBY3RpdmVNb2RhbCB7XG5cdC8qKlxuXHQgKiBVcGRhdGVzIG9wdGlvbnMgb2YgYW4gb3BlbmVkIG1vZGFsLlxuXHQgKlxuXHQgKiBAc2luY2UgMTQuMi4wXG5cdCAqL1xuXHR1cGRhdGUob3B0aW9uczogTmdiTW9kYWxVcGRhdGFibGVPcHRpb25zKTogdm9pZCB7fVxuXHQvKipcblx0ICogQ2xvc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZXN1bHRgIHZhbHVlLlxuXHQgKlxuXHQgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgKi9cblx0Y2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7fVxuXG5cdC8qKlxuXHQgKiBEaXNtaXNzZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgYHJlYXNvbmAgdmFsdWUuXG5cdCAqXG5cdCAqIFRoZSBgTmdiTW9kYWxSZWYucmVzdWx0YCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG5cdCAqL1xuXHRkaXNtaXNzKHJlYXNvbj86IGFueSk6IHZvaWQge31cbn1cblxuY29uc3QgV0lORE9XX0FUVFJJQlVURVM6IHN0cmluZ1tdID0gW1xuXHQnYW5pbWF0aW9uJyxcblx0J2FyaWFMYWJlbGxlZEJ5Jyxcblx0J2FyaWFEZXNjcmliZWRCeScsXG5cdCdiYWNrZHJvcCcsXG5cdCdjZW50ZXJlZCcsXG5cdCdmdWxsc2NyZWVuJyxcblx0J2tleWJvYXJkJyxcblx0J3Njcm9sbGFibGUnLFxuXHQnc2l6ZScsXG5cdCd3aW5kb3dDbGFzcycsXG5cdCdtb2RhbERpYWxvZ0NsYXNzJyxcbl07XG5jb25zdCBCQUNLRFJPUF9BVFRSSUJVVEVTOiBzdHJpbmdbXSA9IFsnYW5pbWF0aW9uJywgJ2JhY2tkcm9wQ2xhc3MnXTtcblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byB0aGUgbmV3bHkgb3BlbmVkIG1vZGFsIHJldHVybmVkIGJ5IHRoZSBgTmdiTW9kYWwub3BlbigpYCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFJlZiB7XG5cdHByaXZhdGUgX2Nsb3NlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblx0cHJpdmF0ZSBfZGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXHRwcml2YXRlIF9oaWRkZW4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXHRwcml2YXRlIF9yZXNvbHZlOiAocmVzdWx0PzogYW55KSA9PiB2b2lkO1xuXHRwcml2YXRlIF9yZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XG5cblx0cHJpdmF0ZSBfYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0luc3RhbmNlOiBOZ2JNb2RhbFdpbmRvdywgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogdm9pZCB7XG5cdFx0V0lORE9XX0FUVFJJQlVURVMuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoaXNEZWZpbmVkKG9wdGlvbnNbb3B0aW9uTmFtZV0pKSB7XG5cdFx0XHRcdHdpbmRvd0luc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgX2FwcGx5QmFja2Ryb3BPcHRpb25zKGJhY2tkcm9wSW5zdGFuY2U6IE5nYk1vZGFsQmFja2Ryb3AsIG9wdGlvbnM6IE5nYk1vZGFsT3B0aW9ucyk6IHZvaWQge1xuXHRcdEJBQ0tEUk9QX0FUVFJJQlVURVMuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRpZiAoaXNEZWZpbmVkKG9wdGlvbnNbb3B0aW9uTmFtZV0pKSB7XG5cdFx0XHRcdGJhY2tkcm9wSW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgb3B0aW9ucyBvZiBhbiBvcGVuZWQgbW9kYWwuXG5cdCAqXG5cdCAqIEBzaW5jZSAxNC4yLjBcblx0ICovXG5cdHVwZGF0ZShvcHRpb25zOiBOZ2JNb2RhbFVwZGF0YWJsZU9wdGlvbnMpOiB2b2lkIHtcblx0XHR0aGlzLl9hcHBseVdpbmRvd09wdGlvbnModGhpcy5fd2luZG93Q21wdFJlZi5pbnN0YW5jZSwgb3B0aW9ucyk7XG5cdFx0aWYgKHRoaXMuX2JhY2tkcm9wQ21wdFJlZiAmJiB0aGlzLl9iYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UpIHtcblx0XHRcdHRoaXMuX2FwcGx5QmFja2Ryb3BPcHRpb25zKHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5pbnN0YW5jZSwgb3B0aW9ucyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudCB1c2VkIGZvciB0aGUgbW9kYWwgY29udGVudC5cblx0ICpcblx0ICogV2hlbiBhIGBUZW1wbGF0ZVJlZmAgaXMgdXNlZCBhcyB0aGUgY29udGVudCBvciB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQsIHdpbGwgcmV0dXJuIGB1bmRlZmluZWRgLlxuXHQgKi9cblx0Z2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7XG5cdFx0aWYgKHRoaXMuX2NvbnRlbnRSZWYgJiYgdGhpcy5fY29udGVudFJlZi5jb21wb25lbnRSZWYpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jb250ZW50UmVmLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVGhlIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQgYW5kIHJlamVjdGVkIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZC5cblx0ICovXG5cdHJlc3VsdDogUHJvbWlzZTxhbnk+O1xuXG5cdC8qKlxuXHQgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1vZGFsIGlzIGNsb3NlZCB2aWEgdGhlIGAuY2xvc2UoKWAgbWV0aG9kLlxuXHQgKlxuXHQgKiBJdCB3aWxsIGVtaXQgdGhlIHJlc3VsdCBwYXNzZWQgdG8gdGhlIGAuY2xvc2UoKWAgbWV0aG9kLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGdldCBjbG9zZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcblx0XHRyZXR1cm4gdGhpcy5fY2xvc2VkLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZVVudGlsKHRoaXMuX2hpZGRlbikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiB0aGUgbW9kYWwgaXMgZGlzbWlzc2VkIHZpYSB0aGUgYC5kaXNtaXNzKClgIG1ldGhvZC5cblx0ICpcblx0ICogSXQgd2lsbCBlbWl0IHRoZSByZWFzb24gcGFzc2VkIHRvIHRoZSBgLmRpc21pc3NlZCgpYCBtZXRob2QgYnkgdGhlIHVzZXIsIG9yIG9uZSBvZiB0aGUgaW50ZXJuYWxcblx0ICogcmVhc29ucyBsaWtlIGJhY2tkcm9wIGNsaWNrIG9yIEVTQyBrZXkgcHJlc3MuXG5cdCAqXG5cdCAqIEBzaW5jZSA4LjAuMFxuXHQgKi9cblx0Z2V0IGRpc21pc3NlZCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuXHRcdHJldHVybiB0aGlzLl9kaXNtaXNzZWQuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwodGhpcy5faGlkZGVuKSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGJvdGggbW9kYWwgd2luZG93IGFuZCBiYWNrZHJvcCBhcmUgY2xvc2VkIGFuZCBhbmltYXRpb25zIHdlcmUgZmluaXNoZWQuXG5cdCAqIEF0IHRoaXMgcG9pbnQgbW9kYWwgYW5kIGJhY2tkcm9wIGVsZW1lbnRzIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBET00gdHJlZS5cblx0ICpcblx0ICogVGhpcyBvYnNlcnZhYmxlIHdpbGwgYmUgY29tcGxldGVkIGFmdGVyIGVtaXR0aW5nLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGdldCBoaWRkZW4oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG5cdFx0cmV0dXJuIHRoaXMuX2hpZGRlbi5hc09ic2VydmFibGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gbW9kYWwgaXMgZnVsbHkgdmlzaWJsZSBhbmQgYW5pbWF0aW9uIHdhcyBmaW5pc2hlZC5cblx0ICogTW9kYWwgRE9NIGVsZW1lbnQgaXMgYWx3YXlzIGF2YWlsYWJsZSBzeW5jaHJvbm91c2x5IGFmdGVyIGNhbGxpbmcgJ21vZGFsLm9wZW4oKScgc2VydmljZS5cblx0ICpcblx0ICogVGhpcyBvYnNlcnZhYmxlIHdpbGwgYmUgY29tcGxldGVkIGFmdGVyIGVtaXR0aW5nLlxuXHQgKiBJdCB3aWxsIG5vdCBlbWl0LCBpZiBtb2RhbCBpcyBjbG9zZWQgYmVmb3JlIG9wZW4gYW5pbWF0aW9uIGlzIGZpbmlzaGVkLlxuXHQgKlxuXHQgKiBAc2luY2UgOC4wLjBcblx0ICovXG5cdGdldCBzaG93bigpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcblx0XHRyZXR1cm4gdGhpcy5fd2luZG93Q21wdFJlZi5pbnN0YW5jZS5zaG93bi5hc09ic2VydmFibGUoKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgX3dpbmRvd0NtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4sXG5cdFx0cHJpdmF0ZSBfY29udGVudFJlZjogQ29udGVudFJlZixcblx0XHRwcml2YXRlIF9iYWNrZHJvcENtcHRSZWY/OiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4sXG5cdFx0cHJpdmF0ZSBfYmVmb3JlRGlzbWlzcz86ICgpID0+IGJvb2xlYW4gfCBQcm9taXNlPGJvb2xlYW4+LFxuXHQpIHtcblx0XHRfd2luZG93Q21wdFJlZi5pbnN0YW5jZS5kaXNtaXNzRXZlbnQuc3Vic2NyaWJlKChyZWFzb246IGFueSkgPT4ge1xuXHRcdFx0dGhpcy5kaXNtaXNzKHJlYXNvbik7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHRcdHRoaXMucmVzdWx0LnRoZW4obnVsbCwgKCkgPT4ge30pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVzdWx0YCB2YWx1ZS5cblx0ICpcblx0ICogVGhlIGBOZ2JNb2JhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cblx0ICovXG5cdGNsb3NlKHJlc3VsdD86IGFueSk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl93aW5kb3dDbXB0UmVmKSB7XG5cdFx0XHR0aGlzLl9jbG9zZWQubmV4dChyZXN1bHQpO1xuXHRcdFx0dGhpcy5fcmVzb2x2ZShyZXN1bHQpO1xuXHRcdFx0dGhpcy5fcmVtb3ZlTW9kYWxFbGVtZW50cygpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX2Rpc21pc3MocmVhc29uPzogYW55KSB7XG5cdFx0dGhpcy5fZGlzbWlzc2VkLm5leHQocmVhc29uKTtcblx0XHR0aGlzLl9yZWplY3QocmVhc29uKTtcblx0XHR0aGlzLl9yZW1vdmVNb2RhbEVsZW1lbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogRGlzbWlzc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZWFzb25gIHZhbHVlLlxuXHQgKlxuXHQgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuXHQgKi9cblx0ZGlzbWlzcyhyZWFzb24/OiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd2luZG93Q21wdFJlZikge1xuXHRcdFx0aWYgKCF0aGlzLl9iZWZvcmVEaXNtaXNzKSB7XG5cdFx0XHRcdHRoaXMuX2Rpc21pc3MocmVhc29uKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGRpc21pc3MgPSB0aGlzLl9iZWZvcmVEaXNtaXNzKCk7XG5cdFx0XHRcdGlmIChpc1Byb21pc2UoZGlzbWlzcykpIHtcblx0XHRcdFx0XHRkaXNtaXNzLnRoZW4oXG5cdFx0XHRcdFx0XHQocmVzdWx0KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXN1bHQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fZGlzbWlzcyhyZWFzb24pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0KCkgPT4ge30sXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIGlmIChkaXNtaXNzICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdHRoaXMuX2Rpc21pc3MocmVhc29uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgX3JlbW92ZU1vZGFsRWxlbWVudHMoKSB7XG5cdFx0Y29uc3Qgd2luZG93VHJhbnNpdGlvbiQgPSB0aGlzLl93aW5kb3dDbXB0UmVmLmluc3RhbmNlLmhpZGUoKTtcblx0XHRjb25zdCBiYWNrZHJvcFRyYW5zaXRpb24kID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmID8gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlLmhpZGUoKSA6IG9mKHVuZGVmaW5lZCk7XG5cblx0XHQvLyBoaWRpbmcgd2luZG93XG5cdFx0d2luZG93VHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHtcblx0XHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gdGhpcy5fd2luZG93Q21wdFJlZi5sb2NhdGlvbjtcblx0XHRcdG5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuYXRpdmVFbGVtZW50KTtcblx0XHRcdHRoaXMuX3dpbmRvd0NtcHRSZWYuZGVzdHJveSgpO1xuXG5cdFx0XHRpZiAodGhpcy5fY29udGVudFJlZiAmJiB0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYpIHtcblx0XHRcdFx0dGhpcy5fY29udGVudFJlZi52aWV3UmVmLmRlc3Ryb3koKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fd2luZG93Q21wdFJlZiA9IDxhbnk+bnVsbDtcblx0XHRcdHRoaXMuX2NvbnRlbnRSZWYgPSA8YW55Pm51bGw7XG5cdFx0fSk7XG5cblx0XHQvLyBoaWRpbmcgYmFja2Ryb3Bcblx0XHRiYWNrZHJvcFRyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5fYmFja2Ryb3BDbXB0UmVmKSB7XG5cdFx0XHRcdGNvbnN0IHsgbmF0aXZlRWxlbWVudCB9ID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uO1xuXHRcdFx0XHRuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG5cdFx0XHRcdHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5kZXN0cm95KCk7XG5cdFx0XHRcdHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA9IDxhbnk+bnVsbDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIGFsbCBkb25lXG5cdFx0emlwKHdpbmRvd1RyYW5zaXRpb24kLCBiYWNrZHJvcFRyYW5zaXRpb24kKS5zdWJzY3JpYmUoKCkgPT4ge1xuXHRcdFx0dGhpcy5faGlkZGVuLm5leHQoKTtcblx0XHRcdHRoaXMuX2hpZGRlbi5jb21wbGV0ZSgpO1xuXHRcdH0pO1xuXHR9XG59XG4iXX0=