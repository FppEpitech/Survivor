import { Component } from '@angular/core';
import { Customer, CustomersService } from 'src/app/service/customers/customers.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent {

    customers: Customer[] = [];
    customer?: Customer;
    indexCustomer = 0; // TODO : change the index based on the customer to display

    constructor (private customerService: CustomersService) {}

    ngOnInit(): void {
        this.customerService.getCustomers().subscribe(
            (data) => { this.customers = data;
                console.log(this.customers);
                this.customer = this.customers[this.indexCustomer];
            },
            (error) => { console.error("Failed to load Customer list", error); }
        );
    }
}
