export default function pdfWorkerPlugin() {
    return {
      name: 'pdf-worker-plugin',
      resolveId(source) {
        if (source === 'pdfjs-dist/build/pdf.worker.entry') {
          return source;
        }
        return null;
      },
      load(id) {
        if (id === 'pdfjs-dist/build/pdf.worker.entry') {
          return `import * as pdfjsLib from 'pdfjs-dist/build/pdf';
                  import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
                  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;`;
        }
        return null;
      }
    };
  }