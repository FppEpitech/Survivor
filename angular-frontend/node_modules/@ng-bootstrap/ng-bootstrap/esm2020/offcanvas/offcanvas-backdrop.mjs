import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import * as i0 from "@angular/core";
export class NgbOffcanvasBackdrop {
    constructor(_el, _zone) {
        this._el = _el;
        this._zone = _zone;
        this.dismissEvent = new EventEmitter();
    }
    ngOnInit() {
        this._zone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
            ngbRunTransition(this._zone, this._el.nativeElement, (element, animation) => {
                if (animation) {
                    reflow(element);
                }
                element.classList.add('show');
            }, { animation: this.animation, runningTransition: 'continue' });
        });
    }
    hide() {
        return ngbRunTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), {
            animation: this.animation,
            runningTransition: 'stop',
        });
    }
    dismiss() {
        if (!this.static) {
            this.dismissEvent.emit(OffcanvasDismissReasons.BACKDROP_CLICK);
        }
    }
}
NgbOffcanvasBackdrop.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasBackdrop, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbOffcanvasBackdrop.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: NgbOffcanvasBackdrop, isStandalone: true, selector: "ngb-offcanvas-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass", static: "static" }, outputs: { dismissEvent: "dismiss" }, host: { listeners: { "mousedown": "dismiss()" }, properties: { "class": "\"offcanvas-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" } }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: NgbOffcanvasBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-offcanvas-backdrop',
                    standalone: true,
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        '(mousedown)': 'dismiss()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }], static: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLWJhY2tkcm9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtYmFja2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFrQixNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHdEgsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDdEMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBY3RFLE1BQU0sT0FBTyxvQkFBb0I7SUFPaEMsWUFBb0IsR0FBNEIsRUFBVSxLQUFhO1FBQW5ELFFBQUcsR0FBSCxHQUFHLENBQXlCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUZwRCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFFcUIsQ0FBQztJQUUzRSxRQUFRO1FBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2FBQ2pCLFlBQVksRUFBRTthQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDYixTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2YsZ0JBQWdCLENBQ2YsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFDdEIsQ0FBQyxPQUFvQixFQUFFLFNBQWtCLEVBQUUsRUFBRTtnQkFDNUMsSUFBSSxTQUFTLEVBQUU7b0JBQ2QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNoQjtnQkFDRCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixDQUFDLEVBQ0QsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsQ0FDNUQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUk7UUFDSCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hHLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixpQkFBaUIsRUFBRSxNQUFNO1NBQ3pCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDL0Q7SUFDRixDQUFDOztpSEF2Q1csb0JBQW9CO3FHQUFwQixvQkFBb0IsNFpBUnRCLEVBQUU7MkZBUUEsb0JBQW9CO2tCQVpoQyxTQUFTO21CQUFDO29CQUNWLFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFVBQVUsRUFBRSxJQUFJO29CQUNoQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFO3dCQUNMLFNBQVMsRUFBRSxtRUFBbUU7d0JBQzlFLGNBQWMsRUFBRSxZQUFZO3dCQUM1QixjQUFjLEVBQUUsV0FBVzt3QkFDM0IsYUFBYSxFQUFFLFdBQVc7cUJBQzFCO2lCQUNEO3NIQUVTLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRWEsWUFBWTtzQkFBOUIsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBuZ2JSdW5UcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHsgcmVmbG93IH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9mZmNhbnZhc0Rpc21pc3NSZWFzb25zIH0gZnJvbSAnLi9vZmZjYW52YXMtZGlzbWlzcy1yZWFzb25zJztcblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAnbmdiLW9mZmNhbnZhcy1iYWNrZHJvcCcsXG5cdHN0YW5kYWxvbmU6IHRydWUsXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG5cdHRlbXBsYXRlOiAnJyxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3NdJzogJ1wib2ZmY2FudmFzLWJhY2tkcm9wXCIgKyAoYmFja2Ryb3BDbGFzcyA/IFwiIFwiICsgYmFja2Ryb3BDbGFzcyA6IFwiXCIpJyxcblx0XHQnW2NsYXNzLnNob3ddJzogJyFhbmltYXRpb24nLFxuXHRcdCdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcblx0XHQnKG1vdXNlZG93biknOiAnZGlzbWlzcygpJyxcblx0fSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiT2ZmY2FudmFzQmFja2Ryb3AgaW1wbGVtZW50cyBPbkluaXQge1xuXHRASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cdEBJbnB1dCgpIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcblx0QElucHV0KCkgc3RhdGljOiBib29sZWFuO1xuXG5cdEBPdXRwdXQoJ2Rpc21pc3MnKSBkaXNtaXNzRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cblx0Y29uc3RydWN0b3IocHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF96b25lOiBOZ1pvbmUpIHt9XG5cblx0bmdPbkluaXQoKSB7XG5cdFx0dGhpcy5fem9uZS5vblN0YWJsZVxuXHRcdFx0LmFzT2JzZXJ2YWJsZSgpXG5cdFx0XHQucGlwZSh0YWtlKDEpKVxuXHRcdFx0LnN1YnNjcmliZSgoKSA9PiB7XG5cdFx0XHRcdG5nYlJ1blRyYW5zaXRpb24oXG5cdFx0XHRcdFx0dGhpcy5fem9uZSxcblx0XHRcdFx0XHR0aGlzLl9lbC5uYXRpdmVFbGVtZW50LFxuXHRcdFx0XHRcdChlbGVtZW50OiBIVE1MRWxlbWVudCwgYW5pbWF0aW9uOiBib29sZWFuKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdHJlZmxvdyhlbGVtZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0eyBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyB9LFxuXHRcdFx0XHQpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHRoaWRlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuXHRcdHJldHVybiBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsICh7IGNsYXNzTGlzdCB9KSA9PiBjbGFzc0xpc3QucmVtb3ZlKCdzaG93JyksIHtcblx0XHRcdGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG5cdFx0XHRydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuXHRcdH0pO1xuXHR9XG5cblx0ZGlzbWlzcygpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGljKSB7XG5cdFx0XHR0aGlzLmRpc21pc3NFdmVudC5lbWl0KE9mZmNhbnZhc0Rpc21pc3NSZWFzb25zLkJBQ0tEUk9QX0NMSUNLKTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==