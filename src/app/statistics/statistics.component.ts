import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AuthService } from '../auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  @ViewChildren('chartCard') chartCards!: QueryList<ElementRef>;
  @ViewChildren('pieChartCard') pieChartCards!: QueryList<ElementRef>;

  loading = true;
  stats: any = {};
  expandedChart: string | null = null;
  // Datos para los gráficos de barras (originales)
  pregunta1Data: ChartData<'bar'> = { labels: [], datasets: [] };
  pregunta2Data: ChartData<'bar'> = { labels: [], datasets: [] };
  recomendacionData: ChartData<'bar'> = { labels: [], datasets: [] };
  facilidadData: ChartData<'bar'> = { labels: [], datasets: [] };
  plataformaData: ChartData<'bar'> = { labels: [], datasets: [] };
  combinacionData: ChartData<'bar'> = { labels: [], datasets: [] };
  tendenciasData: ChartData<'line'> = { labels: [], datasets: [] };

  // Datos para los nuevos gráficos de barras
  emailUtilidadData: ChartData<'bar'> = { labels: [], datasets: [] };
  websiteFacilidadData: ChartData<'bar'> = { labels: [], datasets: [] };
  websiteIntuitividadData: ChartData<'bar'> = { labels: [], datasets: [] };
  staffAmabilidadData: ChartData<'bar'> = { labels: [], datasets: [] };
  staffAtencionData: ChartData<'bar'> = { labels: [], datasets: [] };

  // Datos para los gráficos de pastel
  pregunta1PieData: ChartData<'pie'> = { labels: [], datasets: [] };
  pregunta2PieData: ChartData<'pie'> = { labels: [], datasets: [] };
  recomendacionPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  facilidadPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  plataformaPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  emailUtilidadPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  websiteFacilidadPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  websiteIntuitividadPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  staffAmabilidadPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  staffAtencionPieData: ChartData<'pie'> = { labels: [], datasets: [] };

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

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#4b5563',
          font: { size: 12 },
          padding: 20,
          boxWidth: 15,
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
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            // Asegurarnos de que raw es un número
            const rawValue = context.raw;
            const value = typeof rawValue === 'number' ? rawValue : 0;

            // Convertir los datos del dataset a números y sumarlos
            const datasetData = context.dataset.data;
            const numericData = datasetData.map(item => typeof item === 'number' ? item : 0);
            const total = numericData.reduce((a: number, b: number) => a + b, 0);

            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
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
  pieChartType: ChartType = 'pie';
  lineChartType: ChartType = 'line';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    const headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');
    this.http.get('https://7bd7-2806-10a6-24-8f9a-7d80-bdf4-8119-725c.ngrok-free.app/api/statistics', { headers }).subscribe({
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

  reiniciarEstadisticas(): void {
    console.log('Recargando las estadísticas...');
    Swal.fire({
      title: 'Actualizando estadísticas',
      text: 'Las estadísticas se están recargando...',
      icon: 'info',
      showConfirmButton: false,
      timer: 2000
    });
    this.loadStatistics();
  }

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

    // Datos para gráficos de barras
    this.pregunta1Data = this.createBarChartData(data.satisfaccion.pregunta1, 'satisfaccion', colors);
    this.pregunta2Data = this.createBarChartData(data.satisfaccion.pregunta2, 'satisfaccion', colors);
    this.recomendacionData = this.createBarChartData(data.recomendacion.respuestas, 'recomendacion', colors);
    this.facilidadData = this.createBarChartData(data.facilidadCompra.facilidad, 'facilidad', colors);
    this.plataformaData = this.createBarChartData(data.facilidadCompra.plataforma, 'plataforma', colors);
    this.combinacionData = this.createCombinationChartData(data.facilidadCompra.combinaciones, colors);
    this.emailUtilidadData = this.createBarChartData(data.emailFeedback.utilidadEmail, 'satisfaccion', colors);
    this.websiteFacilidadData = this.createBarChartData(data.websiteUsability.facilidadInfoWeb, 'facilidad', colors);
    this.websiteIntuitividadData = this.createBarChartData(data.websiteUsability.intuitividadNavegacion, 'intuitiva', colors);
    this.staffAmabilidadData = this.createBarChartData(data.staffCourtesy.amabilidad, 'calificacionStaff', colors);
    this.staffAtencionData = this.createBarChartData(data.staffCourtesy.atencion, 'calificacionStaff', colors);

    // Datos para gráficos de pastel
    this.pregunta1PieData = this.createPieChartData(data.satisfaccion.pregunta1, 'satisfaccion', colors);
    this.pregunta2PieData = this.createPieChartData(data.satisfaccion.pregunta2, 'satisfaccion', colors);
    this.recomendacionPieData = this.createPieChartData(data.recomendacion.respuestas, 'recomendacion', colors);
    this.facilidadPieData = this.createPieChartData(data.facilidadCompra.facilidad, 'facilidad', colors);
    this.plataformaPieData = this.createPieChartData(data.facilidadCompra.plataforma, 'plataforma', colors);
    this.emailUtilidadPieData = this.createPieChartData(data.emailFeedback.utilidadEmail, 'satisfaccion', colors);
    this.websiteFacilidadPieData = this.createPieChartData(data.websiteUsability.facilidadInfoWeb, 'facilidad', colors);
    this.websiteIntuitividadPieData = this.createPieChartData(data.websiteUsability.intuitividadNavegacion, 'intuitiva', colors);
    this.staffAmabilidadPieData = this.createPieChartData(data.staffCourtesy.amabilidad, 'calificacionStaff', colors);
    this.staffAtencionPieData = this.createPieChartData(data.staffCourtesy.atencion, 'calificacionStaff', colors);

    // Datos para tendencias (se mantiene como gráfico de líneas)
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
    type: 'satisfaccion' | 'recomendacion' | 'facilidad' | 'plataforma' | 'calificacionStaff' | 'intuitiva',
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
      } else if (type === 'plataforma') {
        switch (respuesta.toLowerCase()) {
          case 'web': return colors.web;
          case 'movil': return colors.movil;
          case 'escritorio': return colors.escritorio;
          default: return colors.otros;
        }
      } else if (type === 'calificacionStaff') {
        switch (respuesta.toLowerCase()) {
          case 'muy-mala': return colors.muyInsatisfecho;
          case 'mala': return colors.insatisfecho;
          case 'regular': return colors.neutral;
          case 'buena': return colors.satisfecho;
          case 'muy-buena': return colors.muySatisfecho;
          case 'nada-atento': return colors.muyInsatisfecho;
          case 'poco-atento': return colors.insatisfecho;
          case 'atento': return colors.satisfecho;
          case 'muy-atento': return colors.muySatisfecho;
          default: return '#D1D5DB';
        }
      } else if (type === 'intuitiva') {
        switch (respuesta) {
          case 'muy-facil': return colors.muyFacil;
          case 'muy-intuitiva': return colors.muyFacil;
          case 'facil': return colors.facil;
          case 'intuitiva': return colors.facil;
          case 'neutral': return colors.neutral;
          case 'dificil': return colors.dificil;
          case 'poco-intuitiva': return colors.dificil;
          case 'muy-dificil': return colors.muyDificil;
          case 'muy-poco-intuitiva': return colors.muyDificil;
          default: return '#D1D5DB';
        }
      }
      return '#D1D5DB';
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

  createPieChartData(
    data: any[],
    type: 'satisfaccion' | 'recomendacion' | 'facilidad' | 'plataforma' | 'calificacionStaff' | 'intuitiva',
    colors: any
  ): ChartData<'pie'> {
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
      } else if (type === 'plataforma') {
        switch (respuesta.toLowerCase()) {
          case 'web': return colors.web;
          case 'movil': return colors.movil;
          case 'escritorio': return colors.escritorio;
          default: return colors.otros;
        }
      } else if (type === 'calificacionStaff') {
        switch (respuesta.toLowerCase()) {
          case 'muy-mala': return colors.muyInsatisfecho;
          case 'mala': return colors.insatisfecho;
          case 'regular': return colors.neutral;
          case 'buena': return colors.satisfecho;
          case 'muy-buena': return colors.muySatisfecho;
          case 'nada-atento': return colors.muyInsatisfecho;
          case 'poco-atento': return colors.insatisfecho;
          case 'atento': return colors.satisfecho;
          case 'muy-atento': return colors.muySatisfecho;
          default: return '#D1D5DB';
        }
      } else if (type === 'intuitiva') {
        switch (respuesta) {
          case 'muy-facil': return colors.muyFacil;
          case 'muy-intuitiva': return colors.muyFacil;
          case 'facil': return colors.facil;
          case 'intuitiva': return colors.facil;
          case 'neutral': return colors.neutral;
          case 'dificil': return colors.dificil;
          case 'poco-intuitiva': return colors.dificil;
          case 'muy-dificil': return colors.muyDificil;
          case 'muy-poco-intuitiva': return colors.muyDificil;
          default: return '#D1D5DB';
        }
      }
      return '#D1D5DB';
    };

    return {
      labels: data.map(item => this.getResponseLabel(item.respuesta, type)),
      datasets: [{
        data: data.map(item => item.cantidad),
        backgroundColor: data.map(item => getColor(item.respuesta)),
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    };
  }

  createCombinationChartData(data: any[], colors: any): ChartData<'bar'> {
    const facilidades = [...new Set(data.map(item => item.Facilidad))];
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

  getResponseLabel(
    respuesta: string,
    type: 'satisfaccion' | 'recomendacion' | 'intuitiva' | 'facilidad' | 'plataforma' | 'calificacionStaff' = 'satisfaccion'
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
    } else if (type === 'plataforma') {
      switch (respuesta.toLowerCase()) {
        case 'web': return 'Sitio Web';
        case 'movil': return 'App Móvil';
        case 'escritorio': return 'Software Escritorio';
        default: return respuesta;
      }
    } else if (type === 'calificacionStaff') {
      switch (respuesta.toLowerCase()) {
        case 'muy-mala': return 'Muy mala';
        case 'mala': return 'Mala';
        case 'regular': return 'Regular';
        case 'buena': return 'Buena';
        case 'muy-buena': return 'Muy buena';
        case 'nada-atento': return 'Nada atento';
        case 'poco-atento': return 'Poco atento';
        case 'atento': return 'Atento';
        case 'muy-atento': return 'Muy atento';
        default: return respuesta;
      }
    }
    return respuesta;
  }

  getTotalResponses(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    // Asegurarnos de que los datos son números
    const dataset = chartData.datasets[0];
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    return data.reduce((sum: number, value: number) => sum + value, 0);
  }

  getAverageForChart(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];

    // Asegurarnos de que los datos son números
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    const total = data.reduce((sum: number, value: number, index: number) => {
      const label = labels[index] as string;
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
  getAmabilidad(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];

    // Asegurarnos de que los datos son números
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    const total = data.reduce((sum: number, value: number, index: number) => {
      const label = labels[index] as string;
      let valueScore = 0;

      if (label.includes('muy-buena')) valueScore = 5;
      else if (label.includes('buena')) valueScore = 4;
      else if (label.includes('regular')) valueScore = 3;
      else if (label.includes('mala')) valueScore = 2;
      else if (label.includes('muy-mala')) valueScore = 1;

      return sum + (valueScore * value);
    }, 0);

    const count = this.getTotalResponses(chartData);
    return count > 0 ? total / count : 0;
  }
  getAtencion(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];

    // Asegurarnos de que los datos son números
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    const total = data.reduce((sum: number, value: number, index: number) => {
      const label = labels[index] as string;
      let valueScore = 0;

      if (label.includes('muy-atento')) valueScore = 5;
      else if (label.includes('atento')) valueScore = 4;
      else if (label.includes('neutral')) valueScore = 3;
      else if (label.includes('poco-atento')) valueScore = 2;
      else if (label.includes('nada-atento')) valueScore = 1;

      return sum + (valueScore * value);
    }, 0);

    const count = this.getTotalResponses(chartData);
    return count > 0 ? total / count : 0;
  }
  getIntuitiva(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];

    // Asegurarnos de que los datos son números
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    const total = data.reduce((sum: number, value: number, index: number) => {
      const label = labels[index] as string;
      let valueScore = 0;

      if (label.includes('muy-intuitiva')) valueScore = 5;
      else if (label.includes('intuitiva')) valueScore = 4;
      else if (label.includes('Neutral')) valueScore = 3;
      else if (label.includes('poco-intuitiva')) valueScore = 2;
      else if (label.includes('muy-poco-intuitiva')) valueScore = 1;

      return sum + (valueScore * value);
    }, 0);

    const count = this.getTotalResponses(chartData);
    return count > 0 ? total / count : 0;
  }
  getAverageForFacilityChart(chartData: ChartData): number {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0;

    const dataset = chartData.datasets[0];
    const labels = chartData.labels || [];

    // Asegurarnos de que los datos son números
    const data = dataset.data.map(item => typeof item === 'number' ? item : 0);

    const total = data.reduce((sum: number, value: number, index: number) => {
      const label = labels[index] as string;
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

  calculateNPS(data: any[]): number {
    if (!data || data.length === 0) {
      console.warn('No hay datos para calcular NPS');
      return 0;
    }

    try {
      const promoters =
        (data.find(item => item.respuesta === 'definitely-yes')?.cantidad || 0) +
        (data.find(item => item.respuesta === 'probably-yes')?.cantidad || 0);

      const detractors =
        (data.find(item => item.respuesta === 'probably-no')?.cantidad || 0) +
        (data.find(item => item.respuesta === 'definitely-no')?.cantidad || 0);

      const totalResponses = data.reduce((sum, item) => sum + item.cantidad, 0);

      if (totalResponses === 0) return 0;

      const nps = ((promoters - detractors) / totalResponses) * 100;
      return Math.round(nps * 10) / 10;
    } catch (error) {
      console.error('Error calculando NPS:', error);
      return 0;
    }
  }

  getMostVotedResponse(data: any[]): string {
    if (!data || data.length === 0) return 'Sin datos';

    const mostVoted = data.reduce((prev, current) =>
      (prev.cantidad > current.cantidad) ? prev : current
    );

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

  generarReporteExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const createSheet = (data: any[], sheetName: string) => {
      if (sheetName === 'Recomendación' && Array.isArray(data)) {
        const mappedData = data.map(item => {
          let respuestaTraducida: string;
          switch (item.respuesta) {
            case 'definitely-yes':
              respuestaTraducida = 'Definitivamente Sí';
              break;
            case 'probably-yes':
              respuestaTraducida = 'Probablemente Sí';
              break;
            case 'definitely-no':
              respuestaTraducida = 'Definitivamente No';
              break;
            case 'probably-no':
              respuestaTraducida = 'Probablemente No';
              break;
            case 'not-sure':
              respuestaTraducida = 'No Estoy Seguro';
              break;
            default:
              respuestaTraducida = item.respuesta;
          }
          return {
            ...item,
            respuesta: respuestaTraducida,
          };
        });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      } else {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    };

    if (this.stats.satisfaccion) {
      createSheet(this.stats.satisfaccion.pregunta1, 'Satisfacción P1');
      createSheet(this.stats.satisfaccion.pregunta2, 'Satisfacción P2');
      createSheet(this.stats.satisfaccion.tendencias, 'Tendencias Satisfacción');
    }
    if (this.stats.recomendacion) {
      createSheet(this.stats.recomendacion.respuestas, 'Recomendación');
      createSheet(this.stats.recomendacion.tendencias, 'Tendencias Recomendación');
    }
    if (this.stats.facilidadCompra) {
      createSheet(this.stats.facilidadCompra.facilidad, 'Facilidad Compra');
      createSheet(this.stats.facilidadCompra.plataforma, 'Plataformas');
      createSheet(this.stats.facilidadCompra.combinaciones, 'Facilidad por Plataforma');
      createSheet(this.stats.facilidadCompra.tendencias, 'Tendencias Facilidad');
    }
    if (this.stats.emailFeedback) {
      createSheet(this.stats.emailFeedback.utilidadEmail, 'Email Utilidad');
      createSheet(this.stats.emailFeedback.frecuenciaUtilEmail, 'Email Frecuencia');
    }
    if (this.stats.websiteUsability) {
      createSheet(this.stats.websiteUsability.facilidadInfoWeb, 'Web Facilidad Info');
      createSheet(this.stats.websiteUsability.intuitividadNavegacion, 'Web Intuitividad');
    }
    if (this.stats.staffCourtesy) {
      createSheet(this.stats.staffCourtesy.amabilidad, 'Staff Amabilidad');
      createSheet(this.stats.staffCourtesy.atencion, 'Staff Atención');
    }

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([new Uint8Array(wbout)], { type: 'application/octet-stream' });

    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'reporte_encuesta.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generarReportePDF(): void {
    Swal.fire({
      title: 'Descargando reporte',
      text: 'La descarga del reporte ha comenzado.',
      icon: 'info',
      showConfirmButton: false,
      timer: 3000
    });

    const pdf = new jsPDF('l', 'mm', 'a4');
    let yPosition = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const chartWidth = 200;
    const chartHeight = 100;
    const pieChartWidth = 150;
    const pieChartHeight = 150;
    const margin = 10;

    // Promesas para gráficos de barras
    const barPromises: Promise<HTMLCanvasElement>[] = [];
    this.chartCards.forEach(chartCard => {
      barPromises.push(html2canvas(chartCard.nativeElement));
    });

    // Promesas para gráficos de pastel
    const piePromises: Promise<HTMLCanvasElement>[] = [];
    this.pieChartCards.forEach(pieChartCard => {
      piePromises.push(html2canvas(pieChartCard.nativeElement));
    });

    // Combinar todas las promesas
    const allPromises = [...barPromises, ...piePromises];

    Promise.all(allPromises).then((canvases) => {
      canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL('image/png');

        // Determinar si es un gráfico de pastel (los últimos)
        const isPieChart = index >= barPromises.length;

        const currentWidth = isPieChart ? pieChartWidth : chartWidth;
        const currentHeight = isPieChart ? pieChartHeight : chartHeight;

        if (yPosition + currentHeight + margin > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          yPosition = 15;
        }

        const xPosition = (pageWidth - currentWidth) / 2;

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, currentWidth, currentHeight);
        yPosition += currentHeight + margin + 5;
      });

      pdf.save('reporte_Encuesta_Satisfacion_con_Graficos.pdf');
      this.generarReporteExcel();
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
    });
  }

  // Método para expandir/contraer gráficas
toggleExpand(chartName: string): void {
  this.expandedChart = this.expandedChart === chartName ? null : chartName;
}

// Método para verificar si una gráfica está expandida
isExpanded(chartName: string): boolean {
  return this.expandedChart === chartName;
}
}
