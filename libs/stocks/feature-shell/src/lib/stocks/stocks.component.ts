import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import {FormControl} from '@angular/forms';

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
   
  // timePeriods = [
  //   { viewValue: 'All available data', value: 'max' },
  //   { viewValue: 'Five years', value: '5y' },
  //   { viewValue: 'Two years', value: '2y' },
  //   { viewValue: 'One year', value: '1y' },
  //   { viewValue: 'Year-to-date', value: 'ytd' },
  //   { viewValue: 'Six months', value: '6m' },
  //   { viewValue: 'Three months', value: '3m' },
  //   { viewValue: 'One month', value: '1m' }
  // ];

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
    // this.stockPickerForm.valueChanges.pipe(
    //   distinctUntilChanged(),
    //   debounceTime(500),
    //   takeUntil(this.destroyNotifier$)
    // ).subscribe(form => {
    //     this.fetchQuote();
    // }, err =>{
    //   console.log(err); 
    // }, ()=>{
    //   console.log('Data fetch complted');
    // });
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
      //let period : string;
      // const dateDiff = this.date_diff_indays(this.stockPickerForm.controls.fromDate.value, this.stockPickerForm.controls.toDate.value)
      // console.log(dateDiff);
      
      // if(dateDiff < 8)
      //   period = '5d'
      // else if(dateDiff < 32)
      //   period = '1m'
      // else 
      //   period = '6m'

      // const obj = {
      //   symbol : this.stockPickerForm.controls.symbol.value,
      //   period : period
      //   // fromDate : this._dateFormatPipe.transform(this.stockPickerForm.controls.fromDate.value, "yyyy-MM-dd"),
      //   // toDate : this._dateFormatPipe.transform(this.stockPickerForm.controls.toDate.value, "yyyy-MM-dd")
      // }
      //this.priceQuery.fetchQuote(obj.symbol, obj.fromDate, obj.toDate);
      this.priceQuery.fetchQuote(this.stockPickerForm.controls.symbol.value, "max");
    }
  }

  // date_diff_indays(date1, date2) {
  //   const dt1 = new Date(date1);
  //   const dt2 = new Date(date2);
  //   return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
  // }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
