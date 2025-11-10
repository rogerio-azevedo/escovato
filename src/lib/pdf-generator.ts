import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Vale } from '@/types/vale';
import { formatarCPF, formatarValor } from './vales';

export async function gerarPDFVale(vale: Vale): Promise<Blob> {
  // Formato 10x15cm (100x150mm) em landscape = 150x100mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [100, 150],
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  try {
    // Carregar imagem da modelo
    const modeloImg = await loadImage('/images/vales/modelo.png');
    
    // Fundo branco
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, width, height, 'F');

    // Barra marrom superior
    pdf.setFillColor(139, 84, 57);
    pdf.rect(0, 0, width, 12, 'F');

    // Barra bege no meio
    pdf.setFillColor(230, 220, 200);
    pdf.rect(0, 12, width, 8, 'F');

    // Lado esquerdo - Informações
    const leftWidth = width * 0.52;
    
    // Borda decorativa
    pdf.setDrawColor(166, 124, 82);
    pdf.setLineWidth(0.5);
    pdf.rect(8, 28, leftWidth - 16, height - 48, 'S');

    // Título "Vale Presente"
    pdf.setFont('times', 'italic');
    pdf.setFontSize(18);
    pdf.setTextColor(139, 84, 57);
    pdf.text('Vale', leftWidth / 2, 38, { align: 'center' });

    pdf.setFont('times', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(107, 66, 38);
    pdf.text('PRESENTE', leftWidth / 2, 48, { align: 'center' });

    // Subtítulo
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text('Seu momento de beleza no', leftWidth / 2, 56, { align: 'center' });
    pdf.text('salão ', leftWidth / 2 - 10, 61, { align: 'center' });
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(139, 84, 57);
    pdf.text('Escovato', leftWidth / 2 + 5, 61, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(' chegou!', leftWidth / 2 + 18, 61, { align: 'center' });

    // Mensagem
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(70, 70, 70);
    pdf.text('Parabéns, você ganhou um vale', leftWidth / 2, 68, { align: 'center' });
    pdf.text('presente.', leftWidth / 2, 73, { align: 'center' });

    // Box bege com informações
    pdf.setFillColor(250, 245, 230);
    pdf.roundedRect(12, 78, leftWidth - 24, 8, 1, 1, 'F');

    // Informações em box
    let yInfo = 83;
    const xLabel = 16;
    const xValue = 45;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text('De:', xLabel, yInfo);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(60, 60, 60);
    const deText = pdf.splitTextToSize(vale.de, leftWidth - 50);
    pdf.text(deText[0].substring(0, 25), xValue, yInfo);

    yInfo = 88;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Para:', xLabel, yInfo);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(60, 60, 60);
    pdf.text(vale.para, xValue, yInfo);

    yInfo = 93;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Valor:', xLabel, yInfo);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(220, 38, 38);
    pdf.text(formatarValor(vale.valor), xValue, yInfo);

    // Descrição do serviço
    yInfo = 100;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 66, 38);
    const descLines = pdf.splitTextToSize(vale.descricao, leftWidth - 28);
    pdf.text(descLines, leftWidth / 2, yInfo, { align: 'center' });

    // Mensagem personalizada
    if (vale.mensagem) {
      yInfo += descLines.length * 4 + 3;
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      const msgLines = pdf.splitTextToSize(`"${vale.mensagem}"`, leftWidth - 24);
      pdf.text(msgLines, leftWidth / 2, yInfo, { align: 'center' });
    }

    // QR Code e código
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://escovato.com.br'}/vales/status?code=${vale.codigo_hash}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      width: 200,
      margin: 1,
    });

    pdf.addImage(qrCodeDataUrl, 'PNG', leftWidth / 2 - 10, height - 32, 20, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(5);
    pdf.setTextColor(100, 100, 100);
    pdf.text(vale.codigo_hash, leftWidth / 2, height - 10, { align: 'center' });

    // Lado direito - Imagem da modelo
    if (modeloImg) {
      const imgX = leftWidth;
      const imgWidth = width - leftWidth;
      const imgHeight = height - 20;
      
      pdf.addImage(modeloImg, 'PNG', imgX, 20, imgWidth, imgHeight);
    }

    // Barra marrom inferior
    pdf.setFillColor(139, 84, 57);
    pdf.rect(leftWidth, height - 12, width - leftWidth, 12, 'F');

    // Logo Escovato (texto)
    pdf.setFont('times', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(139, 84, 57);
    pdf.text('ESCOVATO', 14, height - 18);

    // Rodapé
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    
    const validadeFormatada = new Date(vale.validade).toLocaleDateString('pt-BR');
    pdf.text(`Validade: ${validadeFormatada}`, 14, height - 14);
    pdf.text(`CPF: ${formatarCPF(vale.cpf)}`, 14, height - 10);

    // Website
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.text('www.escovato.com.br', width / 2 + leftWidth / 4, height - 6, { align: 'center' });

    // Estrelas decorativas
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('✨', leftWidth / 2 + 25, 35);

    return pdf.output('blob');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

// Função auxiliar para carregar imagem
async function loadImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    return null;
  }
}

// Gerar imagem para WhatsApp (formato mobile)
export async function gerarImagemWhatsApp(vale: Vale): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Tamanho: proporção similar ao seu exemplo (1200x1600)
    canvas.width = 1200;
    canvas.height = 1600;

    // Fundo cinza/marrom (como no exemplo)
    ctx.fillStyle = '#8B7968';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barra marrom superior
    ctx.fillStyle = '#8B5A3C';
    ctx.fillRect(0, 0, canvas.width, 150);

    // Barra bege
    ctx.fillStyle = '#D4C5B0';
    ctx.fillRect(0, 150, canvas.width, 120);

    try {
      // Carregar laço e modelo
      const lacoImg = new Image();
      const modeloImg = new Image();
      
      lacoImg.crossOrigin = 'anonymous';
      modeloImg.crossOrigin = 'anonymous';

      let lacoCarregado = false;
      let modeloCarregado = false;

      const verificarCarregamento = async () => {
        if (lacoCarregado && modeloCarregado) {
          // Desenhar laço no canto superior esquerdo
          ctx.drawImage(lacoImg, -50, -50, 700, 700);

          // Borda decorativa no lado esquerdo
          ctx.strokeStyle = '#A67C52';
          ctx.lineWidth = 3;
          ctx.strokeRect(180, 380, 500, 850);

          // Título "Vale PRESENTE"
          ctx.textAlign = 'center';
          ctx.font = 'italic 70px Georgia';
          ctx.fillStyle = '#A67C52';
          ctx.fillText('Vale', 430, 470);

          ctx.font = 'bold 90px Arial';
          ctx.fillStyle = '#6B4226';
          ctx.fillText('PRESENTE', 430, 570);

          // Subtítulo
          ctx.font = '32px Arial';
          ctx.fillStyle = '#4A4A4A';
          ctx.fillText('Seu momento de beleza no', 430, 650);
          
          ctx.font = 'bold 32px Arial';
          ctx.fillStyle = '#8B5A3C';
          ctx.fillText('salão Escovato chegou!', 430, 690);

          // Box bege com informações
          ctx.fillStyle = '#F5F0E6';
          ctx.fillRect(200, 750, 460, 360);

          // Linhas para escrever
          ctx.strokeStyle = '#8B5A3C';
          ctx.lineWidth = 2;
          
          // De:
          ctx.font = 'italic 38px Georgia';
          ctx.fillStyle = '#8B5A3C';
          ctx.textAlign = 'left';
          ctx.fillText('De:', 230, 820);
          ctx.beginPath();
          ctx.moveTo(310, 825);
          ctx.lineTo(640, 825);
          ctx.stroke();
          
          ctx.font = 'bold 28px Arial';
          ctx.fillStyle = '#6B4226';
          const deText = vale.de.substring(0, 18);
          ctx.fillText(deText, 315, 820);

          // Para:
          ctx.font = 'italic 38px Georgia';
          ctx.fillStyle = '#8B5A3C';
          ctx.fillText('Para:', 230, 910);
          ctx.beginPath();
          ctx.moveTo(340, 915);
          ctx.lineTo(640, 915);
          ctx.stroke();
          
          ctx.font = 'bold 28px Arial';
          ctx.fillStyle = '#6B4226';
          ctx.fillText(vale.para, 345, 910);

          // Valor:
          ctx.font = 'italic 38px Georgia';
          ctx.fillStyle = '#8B5A3C';
          ctx.fillText('Valor:', 230, 1000);
          ctx.beginPath();
          ctx.moveTo(360, 1005);
          ctx.lineTo(640, 1005);
          ctx.stroke();
          
          ctx.font = 'bold 36px Arial';
          ctx.fillStyle = '#DC2626';
          ctx.fillText(formatarValor(vale.valor), 365, 1000);

          // Descrição do serviço
          ctx.font = 'bold 26px Arial';
          ctx.fillStyle = '#6B4226';
          ctx.textAlign = 'center';
          const descLines = wrapText(ctx, vale.descricao, 420);
          descLines.forEach((line, i) => {
            ctx.fillText(line, 430, 1140 + (i * 32));
          });

          // Imagem da modelo no lado direito
          ctx.drawImage(modeloImg, 770, 270, 430, 830);

          // Barra marrom inferior direita
          ctx.fillStyle = '#8B5A3C';
          ctx.fillRect(770, 1100, 430, 200);

          // QR Code
          const qrCodeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://escovato.com.br'}/vales/status?code=${vale.codigo_hash}`;
          const qrDataUrl = await QRCode.toDataURL(qrCodeUrl, {
            width: 400,
            margin: 1,
          });

          const qrImg = new Image();
          qrImg.onload = () => {
            ctx.drawImage(qrImg, 250, 1300, 200, 200);

            // Código
            ctx.font = '18px monospace';
            ctx.fillStyle = '#666666';
            ctx.textAlign = 'center';
            ctx.fillText(vale.codigo_hash, 350, 1520);

            // Logo ESCOVATO
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = '#6B4226';
            ctx.textAlign = 'left';
            ctx.fillText('ESCOVATO', 220, 1570);

            // Website
            ctx.font = 'bold 36px Arial';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText('www.escovato.com.br', 985, 1230);

            resolve(canvas.toDataURL('image/png'));
          };
          qrImg.onerror = () => reject(new Error('Erro ao carregar QR Code'));
          qrImg.src = qrDataUrl;
        }
      };

      lacoImg.onload = () => {
        lacoCarregado = true;
        verificarCarregamento();
      };

      modeloImg.onload = () => {
        modeloCarregado = true;
        verificarCarregamento();
      };

      lacoImg.onerror = () => reject(new Error('Erro ao carregar laço'));
      modeloImg.onerror = () => reject(new Error('Erro ao carregar modelo'));

      lacoImg.src = '/images/vales/laco.png';
      modeloImg.src = '/images/vales/modelo.png';

    } catch (error) {
      reject(error);
    }
  });
}

// Função auxiliar para quebrar texto em linhas
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export function downloadPDF(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadImage(dataUrl: string, nomeArquivo: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

