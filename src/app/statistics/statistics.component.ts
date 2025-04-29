import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AuthService } from '../auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChildren('chartCard') chartCards!: QueryList<ElementRef>; // Declaración correcta

  loading = true;
  stats: any = {};

  // Datos para los gráficos
  pregunta1Data: ChartData<'bar'> = { labels: [], datasets: [] };
  pregunta2Data: ChartData<'bar'> = { labels: [], datasets: [] };
  recomendacionData: ChartData<'bar'> = { labels: [], datasets: [] };
  facilidadData: ChartData<'bar'> = { labels: [], datasets: [] };
  plataformaData: ChartData<'bar'> = { labels: [], datasets: [] };
  combinacionData: ChartData<'bar'> = { labels: [], datasets: [] };
  tendenciasData: ChartData<'line'> = { labels: [], datasets: [] };

  // Configuraciones de gráficos
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e3a8a',
        bodyColor: '#4b5563',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1e3a8a',
          font: { size: 14 },
          padding: 20,
          boxWidth: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e3a8a',
        bodyColor: '#4b5563',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          color: '#64748b',
          callback: (value) => {
            const labels = ['', 'Muy Insatisfecho', 'Insatisfecho', 'Neutral', 'Satisfecho', 'Muy Satisfecho'];
            return labels[value as number];
          }
        },
        grid: { color: '#e2e8f0' }
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3
      },
      point: {
        radius: 5,
        hoverRadius: 8
      }
    }
  };

  comboChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            return `${label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }
  //metodo para cargar las estadisticas
  loadStatistics(): void {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true'); // Crea los headers
    this.http.get('https://4c88-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/statistics', { headers }).subscribe({ // Pasa los headers en las opciones
      next: (response: any) => {
        this.stats = response.data;
        this.prepareChartData(response.data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }
  //metodo para reinicjiar las estadisticas
  reiniciarEstadisticas(): void {
    console.log('Recargando las estadísticas...');
    alert('Las estadísticas serán recargadas.');
    this.loadStatistics(); // Simplemente llama a la función para cargar los datos nuevamente
  }
  //metodo para preparar los datos de las gráficas
  prepareChartData(data: any): void {
    // Colores para las gráficas
    const colors = {
      muySatisfecho: '#93C5FD',
      satisfecho: '#BFDBFE',
      neutral: '#FDE68A',
      insatisfecho: '#FECACA',
      muyInsatisfecho: '#FCA5A5',
      definitelyYes: '#6EE7B7',
      probablyYes: '#A7F3D0',
      notSure: '#FDE68A',
      probablyNo: '#FCA5A5',
      definitelyNo: '#F87171',
      muyFacil: '#86EFAC',
      facil: '#A7F3D0',
      dificil: '#FCA5A5',
      muyDificil: '#F87171',
      web: '#93C5FD',
      movil: '#C7D2FE',
      escritorio: '#A5B4FC',
      otros: '#D1D5DB'
    };

    // Datos para Pregunta 1 (Satisfacción)
    this.pregunta1Data = this.createBarChartData(
      data.satisfaccion.pregunta1,
      'satisfaccion',
      colors
    );

    // Datos para Pregunta 2 (Satisfacción)
    this.pregunta2Data = this.createBarChartData(
      data.satisfaccion.pregunta2,
      'satisfaccion',
      colors
    );

    // Datos para Recomendación
    this.recomendacionData = this.createBarChartData(
      data.recomendacion.respuestas,
      'recomendacion',
      colors
    );

    // Datos para Facilidad de Compra
    this.facilidadData = this.createBarChartData(
      data.facilidadCompra.facilidad,
      'facilidad',
      colors
    );

    // Datos para Plataformas
    this.plataformaData = this.createBarChartData(
      data.facilidadCompra.plataforma,
      'plataforma',
      colors
    );

    // Datos para combinación Facilidad/Plataforma
    this.combinacionData = this.createCombinationChartData(
      data.facilidadCompra.combinaciones,
      colors
    );

    // Datos para tendencias combinadas
    this.tendenciasData = {
      labels: data.satisfaccion.tendencias.map((item: any) => item.mes),
      datasets: [
        {
          data: data.satisfaccion.tendencias.map((item: any) => item.promedio_p1),
          label: 'Satisfacción con el servicio',
          borderColor: colors.muySatisfecho,
          backgroundColor: 'rgba(147, 197, 253, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          data: data.satisfaccion.tendencias.map((item: any) => item.promedio_p2),
          label: 'Satisfacción general',
          borderColor: '#5EEAD4',
          backgroundColor: 'rgba(94, 234, 212, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          data: data.recomendacion.tendencias.map((item: any) => item.promedio_recomendacion),
          label: 'Intención de recomendar',
          borderColor: '#6EE7B7',
          backgroundColor: 'rgba(110, 231, 183, 0.2)',
          tension: 0.3,
          fill: true
        },
        {
          data: data.facilidadCompra.tendencias.map((item: any) => item.promedio_facilidad),
          label: 'Facilidad de compra',
          borderColor: '#86EFAC',
          backgroundColor: 'rgba(134, 239, 172, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }

  createBarChartData(
    data: any[],
    type: 'satisfaccion' | 'recomendacion' | 'facilidad' | 'plataforma',
    colors: any
  ): ChartData<'bar'> {
    const getColor = (respuesta: string) => {
      if (type === 'satisfaccion') {
        switch (respuesta) {
          case 'muy-satisfecho': return colors.muySatisfecho;
          case 'satisfecho': return colors.satisfecho;
          case 'neutral': return colors.neutral;
          case 'insatisfecho': return colors.insatisfecho;
          case 'muy-insatisfecho': return colors.muyInsatisfecho;
          default: return '#D1D5DB';
        }
      } else if (type === 'recomendacion') {
        switch (respuesta) {
          case 'definitely-yes': return colors.definitelyYes;
          case 'probably-yes': return colors.probablyYes;
          case 'not-sure': return colors.notSure;
          case 'probably-no': return colors.probablyNo;
          case 'definitely-no': return colors.definitelyNo;
          default: return '#D1D5DB';
        }
      } else if (type === 'facilidad') {
        switch (respuesta) {
          case 'muy-facil': return colors.muyFacil;
          case 'facil': return colors.facil;
          case 'neutral': return colors.neutral;
          case 'dificil': return colors.dificil;
          case 'muy-dificil': return colors.muyDificil;
          default: return '#D1D5DB';
        }
      } else {
        switch (respuesta.toLowerCase()) {
          case 'web': return colors.web;
          case 'movil': return colors.movil;
          case 'escritorio': return colors.escritorio;
          default: return colors.otros;
        }
      }
    };

    return {
      labels: data.map(item => this.getResponseLabel(item.respuesta, type)),
      datasets: [{
        data: data.map(item => item.cantidad),
        backgroundColor: data.map(item => getColor(item.respuesta)),
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.8
      }]
    };
  }

  createCombinationChartData(data: any[], colors: any): ChartData<'bar'> {
    // Agrupar por facilidad
    const facilidades = [...new Set(data.map(item => item.Facilidad))];

    // Agrupar por plataforma
    const plataformas = [...new Set(data.map(item => item.Plataforma))];

    return {
      labels: plataformas.map(p => this.getResponseLabel(p, 'plataforma')),
      datasets: facilidades.map(f => ({
        label: this.getResponseLabel(f, 'facilidad'),
        data: plataformas.map(p => {
          const item = data.find(d => d.Facilidad === f && d.Plataforma === p);
          return item ? item.cantidad : 0;
        }),
        backgroundColor: this.getFacilidadColor(f, colors)
      }))
    };
  }

  getFacilidadColor(facilidad: string, colors: any): string {
    switch (facilidad) {
      case 'muy-facil': return colors.muyFacil;
      case 'facil': return colors.facil;
      case 'neutral': return colors.neutral;
      case 'dificil': return colors.dificil;
      case 'muy-dificil': return colors.muyDificil;
      default: return '#D1D5DB';
    }
  }
  //metodo para obtener la etiqueta de la respuesta
  getResponseLabel(
    respuesta: string,
    type: 'satisfaccion' | 'recomendacion' | 'facilidad' | 'plataforma' = 'satisfaccion'
  ): string {
    if (!respuesta) return 'No especificado';

    if (type === 'satisfaccion') {
      switch (respuesta.toLowerCase()) {
        case 'muy-satisfecho': return 'Muy satisfecho';
        case 'satisfecho': return 'Satisfecho';
        case 'neutral': return 'Neutral';
        case 'insatisfecho': return 'Insatisfecho';
        case 'muy-insatisfecho': return 'Muy insatisfecho';
        default: return respuesta;
      }
    } else if (type === 'recomendacion') {
      switch (respuesta.toLowerCase()) {
        case 'definitely-yes': return 'Definitivamente sí';
        case 'probably-yes': return 'Probablemente sí';
        case 'not-sure': return 'No estoy seguro';
        case 'probably-no': return 'Probablemente no';
        case 'definitely-no': return 'Definitivamente no';
        default: return respuesta;
      }
    } else if (type === 'facilidad') {
      switch (respuesta.toLowerCase()) {
        case 'muy-facil': return 'Muy fácil';
        case 'facil': return 'Fácil';
        case 'neutral': return 'Neutral';
        case 'dificil': return 'Difícil';
        case 'muy-dificil': return 'Muy difícil';
        default: return respuesta;
      }
    } else {
      switch (respuesta.toLowerCase()) {
        case 'web': return 'Sitio Web';
        case 'movil': return 'App Móvil';
        case 'escritorio': return 'Software Escritorio';
        default: return respuesta;
      }
    }
  }

  getTotalResponses(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;
    return chartData.datasets[0].data.reduce((sum: number, value: any) => sum + value, 0);
  }

  getAverageForChart(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const total = chartData.datasets[0].data.reduce((sum: number, value: any, index: number) => {
      const label = chartData.labels?.[index] as string;
      let valueScore = 0;

      if (label.includes('Muy satisfecho')) valueScore = 5;
      else if (label.includes('Satisfecho')) valueScore = 4;
      else if (label.includes('Neutral')) valueScore = 3;
      else if (label.includes('Insatisfecho')) valueScore = 2;
      else if (label.includes('Muy insatisfecho')) valueScore = 1;

      return sum + (valueScore * value);
    }, 0);

    const count = this.getTotalResponses(chartData);
    return count > 0 ? total / count : 0;
  }

  getAverageForFacilityChart(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const total = chartData.datasets[0].data.reduce((sum: number, value: any, index: number) => {
      const label = chartData.labels?.[index] as string;
      let valueScore = 0;

      if (label.includes('Muy fácil')) valueScore = 5;
      else if (label.includes('Fácil')) valueScore = 4;
      else if (label.includes('Neutral')) valueScore = 3;
      else if (label.includes('Difícil')) valueScore = 2;
      else if (label.includes('Muy difícil')) valueScore = 1;

      return sum + (valueScore * value);
    }, 0);

    const count = this.getTotalResponses(chartData);
    return count > 0 ? total / count : 0;
  }
  //metodo para calcular el NPS
  calculateNPS(data: any[]): number {
    if (!data || data.length === 0) {
      console.warn('No hay datos para calcular NPS');
      return 0;
    }

    try {
      // Promotores: definitely-yes + probably-yes
      const promoters =
        (data.find(item => item.respuesta === 'definitely-yes')?.cantidad || 0) +
        (data.find(item => item.respuesta === 'probably-yes')?.cantidad || 0);

      // Detractores: probably-no + definitely-no
      const detractors =
        (data.find(item => item.respuesta === 'probably-no')?.cantidad || 0) +
        (data.find(item => item.respuesta === 'definitely-no')?.cantidad || 0);

      // Total incluyendo not-sure para porcentaje real
      const totalResponses = data.reduce((sum, item) => sum + item.cantidad, 0);

      if (totalResponses === 0) return 0;

      const nps = ((promoters - detractors) / totalResponses) * 100;
      return Math.round(nps * 10) / 10;
    } catch (error) {
      console.error('Error calculando NPS:', error);
      return 0;
    }
  }
  //metodo para obtener la respuesta más votada
  getMostVotedResponse(data: any[]): string {
    if (!data || data.length === 0) return 'Sin datos';

    const mostVoted = data.reduce((prev, current) =>
      (prev.cantidad > current.cantidad) ? prev : current
    );

    // Determinar el tipo basado en la respuesta
    let type: any = 'satisfaccion';
    if (mostVoted.respuesta) {
      if (mostVoted.respuesta.includes('-yes') || mostVoted.respuesta.includes('-no')) {
        type = 'recomendacion';
      } else if (mostVoted.respuesta.includes('-facil') || mostVoted.respuesta.includes('-dificil')) {
        type = 'facilidad';
      } else if (['web', 'movil', 'escritorio'].includes(mostVoted.respuesta.toLowerCase())) {
        type = 'plataforma';
      }
    }

    return this.getResponseLabel(mostVoted.respuesta, type);
  }

  generarReportePDF(): void {
    const pdf = new jsPDF('l', 'mm', 'a4'); // Inicializar con la orientación, unidad y formato deseados
    let yPosition = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const chartWidth = 200; // Ancho deseado para cada gráfico en el PDF
    const chartHeight = 100; // Alto deseado para cada gráfico en el PDF
    const margin = 10;

    this.chartCards.forEach(chartCard => {
      const element = chartCard.nativeElement;
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        // Ajustar la posición para evitar superposición
        if (yPosition + chartHeight + margin > pdf.internal.pageSize.getHeight()) {
          pdf.addPage(); // Añadir una nueva página sin argumentos
          yPosition = 15;
        }

        const xPosition = (pageWidth - chartWidth) / 2; // Centrar el gráfico

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, chartWidth, chartHeight);
        yPosition += chartHeight + margin + 5; // Espacio entre gráficos

        // Guardar el PDF al final de la iteración (puede que necesites un mejor manejo asíncrono)
        if (this.chartCards.last === chartCard) {
          pdf.save('reporte_dashboard.pdf');
        }
      });
    });
  }
}
