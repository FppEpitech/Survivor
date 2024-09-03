import { Component, Input, OnInit, ElementRef } from '@angular/core';
import * as echarts from "echarts";
import * as $ from 'jquery';

interface DataPoint {
  legend: string;
  dataPoints: number[];
}

interface SeriesItem {
  name: string;
  type: string;
  stack: string;
  areaStyle: {
    normal: {};
  };
  data: number[];
  label: {
    show: boolean;
    position: string;
    formatter: string;
  };
}


@Component({
  standalone: true,
  selector: 'stack-chart',
  template: `<div class="mGraph-wrapper">
    <div class="mGraph" id="mGraph_sale"></div>
  </div>`,
  styles: [`
    .mGraph-wrapper{
      width: 100%;
      height: 239px;
      background: #fff;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mGraph-wrapper .mGraph{
      width: 100%;
      height: 100%;
      overflow: hidden;
    }`]
})
export class Charts implements OnInit {
  // Définir les types appropriés
  data: DataPoint[] = [
    { legend: "Nombre de RDV", dataPoints: [10, 15, 8, 22] },
  ];

  series: SeriesItem[] = [];
  legends: string[] = [];

  constructor(private elm: ElementRef) {}

  ngOnInit() {
    let stackchart = echarts.init($(this.elm.nativeElement).find('#mGraph_sale')[0]);

    this.data.forEach(x => {
      this.series.push({
        name: x.legend,
        type: 'bar',
        stack: 'Total Amount',
        areaStyle: { normal: {} },
        data: x.dataPoints,
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}'
        }
      });

      this.legends.push(x.legend);
    });

    stackchart.setOption({
      tooltip: {
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: ['Daniel Dupont', 'Daniel Dupont', 'Daniel Dupont', 'Daniel Dupont']
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: { show: false},
          axisLabel: { show: false }
        }
      ],
      series: this.series
    });
  }
}
