import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
  providers: [DatePipe]
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  private readonly destroyNotifier$  = new Subject();
  @Input() max: any;
  currentDate = new Date();

  quotes$ = this.priceQuery.priceQueries$;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade,
    private _dateFormatPipe:DatePipe) {
    this.stockPickerForm = this.fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.currentDate.setDate(this.currentDate.getDate());
  }

  ngOnInit() {
    this.stockPickerForm.valueChanges
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(form =>{
      if(form.fromDate && form.toDate)
        if(form.fromDate > form.toDate)
          this.stockPickerForm.controls.toDate.setValue(form.fromDate);
    });
  }

  fetchQuote() {    
    if (this.stockPickerForm.valid) {     
      this.priceQuery.fetchQuote(this.stockPickerForm.controls.symbol.value, "max");
    }
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
