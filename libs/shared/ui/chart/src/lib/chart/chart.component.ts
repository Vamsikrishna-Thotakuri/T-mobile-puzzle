import {  
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})

export class ChartComponent implements OnInit, OnDestroy {

  @Input() data$: Observable<any>;
  @Input() fromDate : Date;
  @Input() toDate : Date;

  chart: {
    title: string;
    type: string;    
    columnNames: string[];
    options: any;
  };

  private readonly destroyNotifier$  = new Subject();

  chartData : any;

  constructor() {}

  ngOnInit() {    

    this.data$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data : any[]) =>{
      this.chartData = data.filter(stockData => new Date(stockData[0]) >= this.fromDate && 
      new Date(stockData[0]) <= this.toDate);
    });

    this.chart = {
      title: '',
      type: 'LineChart',        
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };   
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}